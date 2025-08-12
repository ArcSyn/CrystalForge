use serde::{Deserialize, Serialize};
use sysinfo::System;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HardwareInfo {
    pub cpu: String,
    pub ram: u64, // in GB
    pub gpu: Option<String>,
    pub vram: u64, // in GB
    pub os: String,
    pub cores: usize,
    pub threads: usize,
}

pub fn detect_hardware() -> HardwareInfo {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let cpu_info = sys.cpus().first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());
    
    let total_memory = sys.total_memory() / (1024 * 1024 * 1024); // Convert to GB
    
    // GPU detection is platform-specific and complex
    // For now, we'll use placeholder data
    let gpu_info = detect_gpu();
    
    HardwareInfo {
        cpu: cpu_info,
        ram: total_memory,
        gpu: gpu_info.0,
        vram: gpu_info.1,
        os: std::env::consts::OS.to_string(),
        cores: sys.cpus().len(),
        threads: sys.cpus().len(),
    }
}

fn detect_gpu() -> (Option<String>, u64) {
    // Platform-specific GPU detection would go here
    // For Windows, we'd use WMI or DirectX
    // For now, returning mock data
    #[cfg(target_os = "windows")]
    {
        // In a real implementation, we'd query WMI or use DirectX
        (Some("NVIDIA RTX 4070".to_string()), 16)
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        (None, 0)
    }
}

pub fn get_optimal_model_for_hardware(hardware: &HardwareInfo) -> String {
    // Determine optimal model based on hardware
    if hardware.vram >= 16 {
        "deepseek-coder-33b-instruct.Q4_K_M.gguf".to_string()
    } else if hardware.vram >= 8 {
        "codellama-13b-instruct.Q4_K_M.gguf".to_string()
    } else if hardware.ram >= 16 {
        "codellama-7b-instruct.Q4_K_M.gguf".to_string()
    } else {
        "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf".to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_hardware_detection() {
        let hardware = detect_hardware();
        assert!(!hardware.cpu.is_empty());
        assert!(hardware.cores > 0);
        assert!(hardware.ram > 0);
    }
    
    #[test]
    fn test_model_recommendation() {
        let high_end = HardwareInfo {
            cpu: "AMD Ryzen 7 7700X".to_string(),
            ram: 32,
            gpu: Some("NVIDIA RTX 4070".to_string()),
            vram: 16,
            os: "windows".to_string(),
            cores: 8,
            threads: 16,
        };
        
        let recommended = get_optimal_model_for_hardware(&high_end);
        assert_eq!(recommended, "deepseek-coder-33b-instruct.Q4_K_M.gguf");
    }
}
