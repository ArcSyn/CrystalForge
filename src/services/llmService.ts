import { invoke } from "@tauri-apps/api/core";

// Types matching Rust backend
export interface ServerStatus {
  ollama: ServerConnectionStatus;
  lmstudio: ServerConnectionStatus;
}

export interface ServerConnectionStatus {
  connected: boolean;
  version: string | null;
  models_loaded: string[];
  error: string | null;
}

export interface ModelInfo {
  id: string;
  name: string;
  size: number | null;
  provider: "Ollama" | "LMStudio" | "OpenAI";
  status: "Loaded" | "NotLoaded" | "Downloading" | { Error: string };
  performance: PerformanceMetrics | null;
  context_length: number | null;
  quantization: string | null;
}

export interface PerformanceMetrics {
  tokens_per_second: number;
  time_to_first_token: number | null;
  memory_usage: number | null;
  last_updated: string;
}

export interface GenerateResponse {
  text: string;
  model: string;
  tokens_generated: number;
  generation_time_ms: number;
  tokens_per_second: number;
}

export interface ChatResponse {
  message: Message;
  model: string;
  tokens_generated: number;
  generation_time_ms: number;
  tokens_per_second: number;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

class LLMService {
  // Detect all LLM servers
  async detectServers(): Promise<ServerStatus> {
    try {
      return await invoke<ServerStatus>("detect_llm_servers");
    } catch (error) {
      console.error("Failed to detect LLM servers:", error);
      return {
        ollama: {
          connected: false,
          version: null,
          models_loaded: [],
          error: "Failed to connect to Ollama"
        },
        lmstudio: {
          connected: false,
          version: null,
          models_loaded: [],
          error: "Failed to connect to LM Studio"
        }
      };
    }
  }

  // List all available models
  async listModels(): Promise<ModelInfo[]> {
    try {
      return await invoke<ModelInfo[]>("list_available_models");
    } catch (error) {
      console.error("Failed to list models:", error);
      return [];
    }
  }

  // Generate text with a model
  async generate(
    provider: string,
    model: string,
    prompt: string,
    temperature?: number
  ): Promise<GenerateResponse> {
    return await invoke<GenerateResponse>("generate_code", {
      provider,
      model,
      prompt,
      temperature
    });
  }

  // Chat with a model
  async chat(
    provider: string,
    model: string,
    messages: Message[],
    temperature?: number
  ): Promise<ChatResponse> {
    return await invoke<ChatResponse>("chat_with_model", {
      provider,
      model,
      messages,
      temperature
    });
  }

  // Create a React component using the model
  async generateReactComponent(
    model: string,
    description: string,
    provider: string = "ollama"
  ): Promise<string> {
    const messages: Message[] = [
      {
        role: "system",
        content: "You are a React specialist. Generate modern React components using TypeScript and Tailwind CSS. Return only the code, no explanations."
      },
      {
        role: "user",
        content: `Create a React component: ${description}`
      }
    ];

    const response = await this.chat(provider, model, messages, 0.1);
    return response.message.content;
  }

  // Get optimal model for hardware
  async getOptimalModel(hardware: any): Promise<string> {
    return await invoke<string>("get_optimal_model", { hardware });
  }
}

export const llmService = new LLMService();
