use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LLMProvider {
    Ollama,
    LMStudio,
    OpenAI,
}

impl fmt::Display for LLMProvider {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            LLMProvider::Ollama => write!(f, "Ollama"),
            LLMProvider::LMStudio => write!(f, "LM Studio"),
            LLMProvider::OpenAI => write!(f, "OpenAI"),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModelStatus {
    Loaded,
    NotLoaded,
    Downloading,
    Error(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub size: Option<u64>,
    pub provider: LLMProvider,
    pub status: ModelStatus,
    pub performance: Option<PerformanceMetrics>,
    pub context_length: Option<u32>,
    pub quantization: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceMetrics {
    pub tokens_per_second: f64,
    pub time_to_first_token: Option<f64>,
    pub memory_usage: Option<u64>,
    pub last_updated: String, // Using String for simplicity, convert from DateTime
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerateRequest {
    pub model: String,
    pub prompt: String,
    pub temperature: Option<f32>,
    pub max_tokens: Option<i32>,
    pub top_p: Option<f32>,
    pub stream: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerateResponse {
    pub text: String,
    pub model: String,
    pub tokens_generated: u32,
    pub generation_time_ms: u64,
    pub tokens_per_second: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub role: String,
    pub content: String,
}

impl Message {
    pub fn system(content: &str) -> Self {
        Self {
            role: "system".to_string(),
            content: content.to_string(),
        }
    }

    pub fn user(content: &str) -> Self {
        Self {
            role: "user".to_string(),
            content: content.to_string(),
        }
    }

    pub fn assistant(content: &str) -> Self {
        Self {
            role: "assistant".to_string(),
            content: content.to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatRequest {
    pub model: String,
    pub messages: Vec<Message>,
    pub temperature: Option<f32>,
    pub max_tokens: Option<i32>,
    pub top_p: Option<f32>,
    pub stream: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatResponse {
    pub message: Message,
    pub model: String,
    pub tokens_generated: u32,
    pub generation_time_ms: u64,
    pub tokens_per_second: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerStatus {
    pub ollama: ServerConnectionStatus,
    pub lmstudio: ServerConnectionStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConnectionStatus {
    pub connected: bool,
    pub version: Option<String>,
    pub models_loaded: Vec<String>,
    pub error: Option<String>,
}

// Trait for unified LLM interface
#[async_trait::async_trait]
pub trait LLMClient: Send + Sync {
    async fn list_models(&self) -> anyhow::Result<Vec<ModelInfo>>;
    async fn generate(&self, request: GenerateRequest) -> anyhow::Result<GenerateResponse>;
    async fn chat(&self, request: ChatRequest) -> anyhow::Result<ChatResponse>;
    async fn health_check(&self) -> anyhow::Result<bool>;
    async fn get_model_info(&self, model_id: &str) -> anyhow::Result<ModelInfo>;
}
