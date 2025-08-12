use super::types::*;
use super::ollama::OllamaClient;
use super::lmstudio::LMStudioClient;
use anyhow::Result;
use std::sync::Arc;

pub struct LLMRouter {
    ollama_client: Arc<OllamaClient>,
    lmstudio_client: Arc<LMStudioClient>,
}

impl LLMRouter {
    pub fn new() -> Self {
        Self {
            ollama_client: Arc::new(OllamaClient::new("http://localhost:11434".to_string())),
            lmstudio_client: Arc::new(LMStudioClient::new("http://localhost:1234".to_string())),
        }
    }

    pub async fn detect_servers(&self) -> Result<ServerStatus> {
        let ollama_connected = self.ollama_client.health_check().await.unwrap_or(false);
        let lmstudio_connected = self.lmstudio_client.health_check().await.unwrap_or(false);

        let ollama_models = if ollama_connected {
            self.ollama_client.list_models().await
                .map(|models| models.iter().map(|m| m.id.clone()).collect())
                .unwrap_or_default()
        } else {
            vec![]
        };

        let lmstudio_models = if lmstudio_connected {
            self.lmstudio_client.list_models().await
                .map(|models| models.iter().map(|m| m.id.clone()).collect())
                .unwrap_or_default()
        } else {
            vec![]
        };

        Ok(ServerStatus {
            ollama: ServerConnectionStatus {
                connected: ollama_connected,
                version: None,
                models_loaded: ollama_models,
                error: if !ollama_connected { 
                    Some("Ollama server not running. Start with: ollama serve".to_string()) 
                } else { 
                    None 
                },
            },
            lmstudio: ServerConnectionStatus {
                connected: lmstudio_connected,
                version: None,
                models_loaded: lmstudio_models,
                error: if !lmstudio_connected { 
                    Some("LM Studio server not running. Start LM Studio and enable server mode.".to_string()) 
                } else { 
                    None 
                },
            },
        })
    }

    pub async fn list_all_models(&self) -> Result<Vec<ModelInfo>> {
        let mut all_models = vec![];

        // Get Ollama models
        if let Ok(models) = self.ollama_client.list_models().await {
            all_models.extend(models);
        }

        // Get LM Studio models
        if let Ok(models) = self.lmstudio_client.list_models().await {
            all_models.extend(models);
        }

        Ok(all_models)
    }

    pub async fn generate_with_fallback(
        &self,
        provider: &str,
        request: GenerateRequest,
    ) -> Result<GenerateResponse> {
        match provider.to_lowercase().as_str() {
            "ollama" => {
                match self.ollama_client.generate(request.clone()).await {
                    Ok(response) => Ok(response),
                    Err(e) => {
                        // Try LM Studio as fallback
                        tracing::warn!("Ollama failed, trying LM Studio: {}", e);
                        self.lmstudio_client.generate(request).await
                    }
                }
            },
            "lmstudio" | "lm studio" => {
                match self.lmstudio_client.generate(request.clone()).await {
                    Ok(response) => Ok(response),
                    Err(e) => {
                        // Try Ollama as fallback
                        tracing::warn!("LM Studio failed, trying Ollama: {}", e);
                        self.ollama_client.generate(request).await
                    }
                }
            },
            _ => {
                // Try both, prefer Ollama
                match self.ollama_client.generate(request.clone()).await {
                    Ok(response) => Ok(response),
                    Err(_) => self.lmstudio_client.generate(request).await,
                }
            }
        }
    }

    pub async fn chat_with_fallback(
        &self,
        provider: &str,
        request: ChatRequest,
    ) -> Result<ChatResponse> {
        match provider.to_lowercase().as_str() {
            "ollama" => {
                match self.ollama_client.chat(request.clone()).await {
                    Ok(response) => Ok(response),
                    Err(e) => {
                        tracing::warn!("Ollama chat failed, trying LM Studio: {}", e);
                        self.lmstudio_client.chat(request).await
                    }
                }
            },
            "lmstudio" | "lm studio" => {
                match self.lmstudio_client.chat(request.clone()).await {
                    Ok(response) => Ok(response),
                    Err(e) => {
                        tracing::warn!("LM Studio chat failed, trying Ollama: {}", e);
                        self.ollama_client.chat(request).await
                    }
                }
            },
            _ => {
                // Try both, prefer Ollama
                match self.ollama_client.chat(request.clone()).await {
                    Ok(response) => Ok(response),
                    Err(_) => self.lmstudio_client.chat(request).await,
                }
            }
        }
    }
}
