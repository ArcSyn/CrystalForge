use super::types::*;
use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::{Duration, Instant};

pub struct OllamaClient {
    client: Client,
    base_url: String,
}

// Ollama API response types
#[derive(Debug, Deserialize)]
struct OllamaTagsResponse {
    models: Vec<OllamaModel>,
}

#[derive(Debug, Deserialize)]
struct OllamaModel {
    name: String,
    size: Option<u64>,
    digest: Option<String>,
    modified_at: Option<String>,
}

#[derive(Debug, Deserialize)]
struct OllamaGenerateResponse {
    model: String,
    response: String,
    done: bool,
    context: Option<Vec<i32>>,
    total_duration: Option<u64>,
    eval_count: Option<u32>,
    eval_duration: Option<u64>,
}

#[derive(Debug, Serialize)]
struct OllamaGenerateRequest {
    model: String,
    prompt: String,
    stream: bool,
    options: OllamaOptions,
}

#[derive(Debug, Serialize)]
struct OllamaOptions {
    temperature: f32,
    top_p: f32,
    num_predict: i32,
}

#[derive(Debug, Serialize)]
struct OllamaChatRequest {
    model: String,
    messages: Vec<Message>,
    stream: bool,
    options: OllamaOptions,
}

#[derive(Debug, Deserialize)]
struct OllamaChatResponse {
    model: String,
    message: Message,
    done: bool,
    total_duration: Option<u64>,
    eval_count: Option<u32>,
    eval_duration: Option<u64>,
}

impl OllamaClient {
    pub fn new(base_url: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(120))
            .build()
            .expect("Failed to create HTTP client");

        Self { client, base_url }
    }
}

#[async_trait::async_trait]
impl LLMClient for OllamaClient {
    async fn list_models(&self) -> Result<Vec<ModelInfo>> {
        let url = format!("{}/api/tags", self.base_url);
        let response = self.client.get(&url).send().await?;
        
        if !response.status().is_success() {
            anyhow::bail!("Failed to list models: {}", response.status());
        }

        let tags_response: OllamaTagsResponse = response.json().await?;
        
        let models = tags_response.models.into_iter().map(|m| {
            let (name, quantization) = parse_model_name(&m.name);
            ModelInfo {
                id: m.name.clone(),
                name,
                size: m.size,
                provider: LLMProvider::Ollama,
                status: ModelStatus::Loaded, // Ollama only shows loaded models
                performance: None,
                context_length: Some(4096), // Default, could be parsed from model
                quantization,
            }
        }).collect();

        Ok(models)
    }

    async fn generate(&self, request: GenerateRequest) -> Result<GenerateResponse> {
        let url = format!("{}/api/generate", self.base_url);
        
        let ollama_request = OllamaGenerateRequest {
            model: request.model.clone(),
            prompt: request.prompt,
            stream: false,
            options: OllamaOptions {
                temperature: request.temperature.unwrap_or(0.7),
                top_p: request.top_p.unwrap_or(0.9),
                num_predict: request.max_tokens.unwrap_or(2048),
            },
        };

        let start_time = Instant::now();
        let response = self.client
            .post(&url)
            .json(&ollama_request)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            anyhow::bail!("Generation failed: {}", error_text);
        }

        let ollama_response: OllamaGenerateResponse = response.json().await?;
        let generation_time_ms = start_time.elapsed().as_millis() as u64;
        
        let tokens_generated = ollama_response.eval_count.unwrap_or(0);
        let tokens_per_second = if generation_time_ms > 0 {
            (tokens_generated as f64 * 1000.0) / generation_time_ms as f64
        } else {
            0.0
        };

        Ok(GenerateResponse {
            text: ollama_response.response,
            model: ollama_response.model,
            tokens_generated,
            generation_time_ms,
            tokens_per_second,
        })
    }

    async fn chat(&self, request: ChatRequest) -> Result<ChatResponse> {
        let url = format!("{}/api/chat", self.base_url);
        
        let ollama_request = OllamaChatRequest {
            model: request.model.clone(),
            messages: request.messages,
            stream: false,
            options: OllamaOptions {
                temperature: request.temperature.unwrap_or(0.7),
                top_p: request.top_p.unwrap_or(0.9),
                num_predict: request.max_tokens.unwrap_or(2048),
            },
        };

        let start_time = Instant::now();
        let response = self.client
            .post(&url)
            .json(&ollama_request)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            anyhow::bail!("Chat failed: {}", error_text);
        }

        let ollama_response: OllamaChatResponse = response.json().await?;
        let generation_time_ms = start_time.elapsed().as_millis() as u64;
        
        let tokens_generated = ollama_response.eval_count.unwrap_or(0);
        let tokens_per_second = if generation_time_ms > 0 {
            (tokens_generated as f64 * 1000.0) / generation_time_ms as f64
        } else {
            0.0
        };

        Ok(ChatResponse {
            message: ollama_response.message,
            model: ollama_response.model,
            tokens_generated,
            generation_time_ms,
            tokens_per_second,
        })
    }

    async fn health_check(&self) -> Result<bool> {
        let url = format!("{}/api/tags", self.base_url);
        
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

// Helper function to parse model names
fn parse_model_name(full_name: &str) -> (String, Option<String>) {
    // Example: "codellama:13b-instruct-q4_0" -> ("codellama-13b-instruct", "q4_0")
    let parts: Vec<&str> = full_name.split(':').collect();
    if parts.len() > 1 {
        let name = parts[0].to_string();
        let tag_parts: Vec<&str> = parts[1].split('-').collect();
        let quantization = tag_parts.iter()
            .find(|p| p.starts_with('q') || p.starts_with('Q'))
            .map(|q| q.to_string());
        (format!("{}-{}", name, parts[1]), quantization)
    } else {
        (full_name.to_string(), None)
    }
}
