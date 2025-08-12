mod hardware;
mod llm;

use hardware::HardwareInfo;
use llm::{LLMRouter, ServerStatus, ModelInfo, GenerateRequest, GenerateResponse, ChatRequest, ChatResponse, Message};
use std::sync::Arc;
use tokio::sync::Mutex;

// Create a shared router instance
struct AppState {
    llm_router: Arc<Mutex<LLMRouter>>,
}

// Hardware detection command
#[tauri::command]
async fn get_hardware_info() -> Result<HardwareInfo, String> {
    Ok(hardware::detect_hardware())
}

// Detect all LLM servers
#[tauri::command]
async fn detect_llm_servers(state: tauri::State<'_, AppState>) -> Result<ServerStatus, String> {
    let router = state.llm_router.lock().await;
    router.detect_servers().await
        .map_err(|e| e.to_string())
}

// List all available models from all providers
#[tauri::command]
async fn list_available_models(state: tauri::State<'_, AppState>) -> Result<Vec<ModelInfo>, String> {
    let router = state.llm_router.lock().await;
    router.list_all_models().await
        .map_err(|e| e.to_string())
}

// Generate code with a specific model
#[tauri::command]
async fn generate_code(
    state: tauri::State<'_, AppState>,
    provider: String,
    model: String,
    prompt: String,
    temperature: Option<f32>,
) -> Result<GenerateResponse, String> {
    let router = state.llm_router.lock().await;
    let request = GenerateRequest {
        model,
        prompt,
        temperature,
        max_tokens: Some(2048),
        top_p: Some(0.9),
        stream: false,
    };
    
    router.generate_with_fallback(&provider, request).await
        .map_err(|e| e.to_string())
}

// Chat with a model
#[tauri::command]
async fn chat_with_model(
    state: tauri::State<'_, AppState>,
    provider: String,
    model: String,
    messages: Vec<Message>,
    temperature: Option<f32>,
) -> Result<ChatResponse, String> {
    let router = state.llm_router.lock().await;
    let request = ChatRequest {
        model,
        messages,
        temperature,
        max_tokens: Some(2048),
        top_p: Some(0.9),
        stream: false,
    };
    
    router.chat_with_fallback(&provider, request).await
        .map_err(|e| e.to_string())
}

// Get optimal model for hardware
#[tauri::command]
fn get_optimal_model(hardware: HardwareInfo) -> String {
    hardware::get_optimal_model_for_hardware(&hardware)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState {
        llm_router: Arc::new(Mutex::new(LLMRouter::new())),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            get_hardware_info,
            detect_llm_servers,
            list_available_models,
            generate_code,
            chat_with_model,
            get_optimal_model
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
