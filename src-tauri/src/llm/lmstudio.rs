use super::types::*;
use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

pub struct LMStudioClient {
    client: Client,
    base_url: String,
}

// LM Studio API types (OpenAI compatible)
#[derive(Debug, Deserialize)]
struct LMStudioModelsResponse {
    data: Vec<LMStudioModel>,
}

#[derive(Debug, Deserialize)]
struct LMStudioModel {
    id: String,
    object: String,
    created: Option<i64>,
    owned_by: Option<String>,
}

#[derive(Debug, Serialize)]
struct LMStudioChatRequest {
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    max_tokens: i32,
    top_p: f32,
    stream: bool,
}

#[derive(Debug, Deserialize)]
struct LMStudioChatResponse {
    id: String,
    model: String,
    choices: Vec<Choice>,
    usage: Usage,
}

#[derive(Debug, Deserialize)]
struct Choice {
    index: i32,
    message: Message,
    finish_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
struct Usage {
    prompt_tokens: u32,
    completion_tokens: u32,
    total_tokens: u32,
}

#[derive(Debug, Serialize)]
struct LMStudioCompletionRequest {
    model: String,
    prompt: String,
    temperature: f32,
    max_tokens: i32,
    top_p: f32,
    stream: bool,
}

#[derive(Debug, Deserialize)]
struct LMStudioCompletionResponse {
    id: String,
    model: String,
    choices: Vec<CompletionChoice>,
    usage: Usage,
}

#[derive(Debug, Deserialize)]
struct CompletionChoice {
    text: String,
    index: i32,
    finish_reason: Option<String>,
}

impl LMStudioClient {
    pub fn new(base_url: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(120))
            .build()
            .expect("Failed to create HTTP client");

        Self { client, base_url }
    }
}

#[async_trait::async_trait]
impl LLMClient for LMStudioClient {
    async fn list_models(&self) -> Result<Vec<ModelInfo>> {
        let url = format!("{}/v1/models", self.base_url);
        let response = self.client.get(&url).send().await?;
        
        if !response.status().is_success() {
            anyhow::bail!("Failed to list models: {}", response.status());
        }

        let models_response: LMStudioModelsResponse = response.json().await?;
        
        let models = models_response.data.into_iter().map(|m| {
            let (name, quantization) = parse_lmstudio_model_name(&m.id);
            ModelInfo {
                id: m.id.clone(),
                name,
                size: None, // LM Studio doesn't provide size in OpenAI format
                provider: LLMProvider::LMStudio,
                status: ModelStatus::Loaded,
                performance: None,
                context_length: Some(4096), // Default, depends on model
                quantization,
            }
        }).collect();

        Ok(models)
    }

    async fn generate(&self, request: GenerateRequest) -> Result<GenerateResponse> {
        let url = format!("{}/v1/completions", self.base_url);
        
        let lms_request = LMStudioCompletionRequest {
            model: request.model.clone(),
            prompt: request.prompt,
            temperature: request.temperature.unwrap_or(0.7),
            max_tokens: request.max_tokens.unwrap_or(2048),
            top_p: request.top_p.unwrap_or(0.9),
            stream: false,
        };

        let start_time = Instant::now();
        let response = self.client
            .post(&url)
            .json(&lms_request)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            anyhow::bail!("Generation failed: {}", error_text);
        }

        let lms_response: LMStudioCompletionResponse = response.json().await?;
        let generation_time_ms = start_time.elapsed().as_millis() as u64;
        
        let text = lms_response.choices.first()
            .map(|c| c.text.clone())
            .unwrap_or_default();
        
        let tokens_generated = lms_response.usage.completion_tokens;
        let tokens_per_second = if generation_time_ms > 0 {
            (tokens_generated as f64 * 1000.0) / generation_time_ms as f64
        } else {
            0.0
        };

        Ok(GenerateResponse {
            text,
            model: lms_response.model,
            tokens_generated,
            generation_time_ms,
            tokens_per_second,
        })
    }

    async fn chat(&self, request: ChatRequest) -> Result<ChatResponse> {
        let url = format!("{}/v1/chat/completions", self.base_url);
        
        let lms_request = LMStudioChatRequest {
            model: request.model.clone(),
            messages: request.messages,
            temperature: request.temperature.unwrap_or(0.7),
            max_tokens: request.max_tokens.unwrap_or(2048),
            top_p: request.top_p.unwrap_or(0.9),
            stream: false,
        };

        let start_time = Instant::now();
        let response = self.client
            .post(&url)
            .json(&lms_request)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            anyhow::bail!("Chat failed: {}", error_text);
        }

        let lms_response: LMStudioChatResponse = response.json().await?;
        let generation_time_ms = start_time.elapsed().as_millis() as u64;
        
        let message = lms_response.choices.first()
            .map(|c| c.message.clone())
            .unwrap_or_else(|| Message::assistant(""));
        
        let tokens_generated = lms_response.usage.completion_tokens;
        let tokens_per_second = if generation_time_ms > 0 {
            (tokens_generated as f64 * 1000.0) / generation_time_ms as f64
        } else {
            0.0
        };

        Ok(ChatResponse {
            message,
            model: lms_response.model,
            tokens_generated,
            generation_time_ms,
            tokens_per_second,
        })
    }

    async fn health_check(&self) -> Result<bool> {
        let url = format!("{}/v1/models", self.base_url);
        
        match self.client.get(&url).send().await {
            Ok(response) => Ok(response.status().is_success()),
            Err(_) => Ok(false),
        }
    }

    async fn get_model_info(&self, model_id: &str) -> Result<ModelInfo> {
        let models = self.list_models().await?;
        models.into_iter()
            .find(|m| m.id == model_id)
            .ok_or_else(|| anyhow::anyhow!("Model {} not found", model_id))
    }
}

// Helper function to parse LM Studio model names
fn parse_lmstudio_model_name(model_id: &str) -> (String, Option<String>) {
    // LM Studio often uses paths like "TheBloke/CodeLlama-13B-Instruct-GGUF/codellama-13b-instruct.Q4_K_M.gguf"
    let parts: Vec<&str> = model_id.split('/').collect();
    let file_name = parts.last().unwrap_or(&model_id);
    
    // Extract quantization from filename
    let quantization = if file_name.contains(".Q") || file_name.contains(".q") {
        file_name.split('.').find(|p| p.starts_with('Q') || p.starts_with('q'))
            .map(|q| q.to_string())
    } else {
        None
    };
    
    // Clean up the name
    let name = file_name
        .replace(".gguf", "")
        .replace(".bin", "")
        .replace(".Q4_K_M", "")
        .replace(".Q5_K_M", "")
        .replace(".Q8_0", "");
    
    (name, quantization)
}
