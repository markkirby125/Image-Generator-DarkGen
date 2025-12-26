
export interface GenerationParams {
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  samples: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number | null;
  model_id: string;
  enhance_prompt: boolean;
  lora_model?: string;
  scheduler?: string;
  style_modifier?: string;
}

export interface GenerationResult {
  id: string;
  url: string;
  params: GenerationParams;
  meta?: any;
  timestamp: number;
}

export interface ModelsLabResponse {
  status: 'success' | 'error' | 'processing';
  output: string[]; // Array of image URLs
  meta?: any;
  message?: string;
  id?: number;
  future_links?: string[];
}

export interface ApiError {
  message: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ModelCapabilities {
  negativePrompt?: boolean;
  aspectRatio?: boolean;
  steps?: boolean;
  guidance?: boolean;
  enhancePrompt?: boolean;
  seed?: boolean;
  scheduler?: boolean;
}

export interface ModelDefinition {
  id: string;
  api_model_id?: string; // Optional: used if the API needs a different ID than the UI
  name: string;
  lora_model?: string;
  trigger_word?: string; // New: Automatically injected into prompt
  capabilities?: ModelCapabilities;
}
