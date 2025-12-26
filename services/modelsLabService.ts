
import { API_ENDPOINT, API_ENDPOINT_V7, AVAILABLE_MODELS, STYLE_MODIFIERS } from '../constants';
import { GenerationParams, ModelsLabResponse } from '../types';

export const verifyApiKey = async (apiKey: string, modelId?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const endpoint = API_ENDPOINT;
    
    // Determine which model config to use for verification
    const targetModel = AVAILABLE_MODELS.find(m => m.id === modelId) || AVAILABLE_MODELS[0];
    
    // Use the explicit API model ID if defined, otherwise fallback to the internal ID
    const apiModelId = targetModel.api_model_id || targetModel.id;

    // Construct a payload that matches the specific requirements of the model (LoRA, scheduler, etc.)
    const payload = {
      key: apiKey,
      prompt: "A simple geometric cube, high quality, 4k", // Slightly longer prompt to avoid 'too short' errors
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "20",
      safety_checker: "no",
      enhance_prompt: "no",
      seed: null,
      guidance_scale: 7.5,
      model_id: apiModelId, 
      lora_model: targetModel?.lora_model || null,
      scheduler: "DPMSolverMultistepScheduler", 
      webhook: null,
      track_id: null
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      if (!response.ok) {
        return { success: false, error: `HTTP Error: ${response.status} ${response.statusText}` };
      }
      return { success: false, error: "Invalid API response (not JSON)" };
    }

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `API Request Failed (${response.status})`;
      return { success: false, error: errorMsg };
    }
    
    if (data.status === 'error') {
       const msg = data.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data));
       return { success: false, error: msg };
    }
    
    const isValid = data.status === 'success' || data.status === 'processing' || !!data.output || !!data.future_links || !!data.id;
    
    if (isValid) {
      return { success: true };
    }

    return { success: false, error: "Unexpected API response format: " + JSON.stringify(data).substring(0, 100) };

  } catch (error: any) {
    console.error("Verification failed:", error);
    return { success: false, error: error.message || "Network connection failed" };
  }
};

const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  let cleanUrl = url.replace(/\\/g, '/');
  if (cleanUrl.startsWith('http:')) {
    cleanUrl = cleanUrl.replace('http:', 'https:');
  }
  return cleanUrl;
};

export const generateImage = async (
  apiKey: string, 
  params: GenerationParams
): Promise<{ images: string[], seed: number, meta?: any }> => {
  let endpoint = API_ENDPOINT;
  
  const modelDef = AVAILABLE_MODELS.find(m => m.id === params.model_id);
  const loraModel = modelDef?.lora_model || params.lora_model || null;
  // Use the explicit API model ID if defined, otherwise fallback to the internal ID
  const apiModelId = modelDef?.api_model_id || params.model_id;

  // Generate a random seed if one isn't provided or if it's explicitly null
  const effectiveSeed = (params.seed === null || params.seed === undefined) 
    ? Math.floor(Math.random() * 2147483647) 
    : params.seed;

  let finalPrompt = params.prompt;

  // 1. Inject Trigger Word if the model requires it and it's not present
  if (modelDef?.trigger_word) {
    const trigger = modelDef.trigger_word;
    const firstTrigger = trigger.split(',')[0].trim();
    if (!finalPrompt.toLowerCase().includes(firstTrigger.toLowerCase())) {
      finalPrompt = `${trigger}, ${finalPrompt}`;
    }
  }

  // 2. Apply Style Modifier
  if (params.style_modifier && params.style_modifier !== 'None') {
    const modifiers = STYLE_MODIFIERS[params.style_modifier as keyof typeof STYLE_MODIFIERS];
    if (modifiers && modifiers.length > 0) {
      // Deterministically select a modifier based on the seed
      const index = Math.abs(effectiveSeed) % modifiers.length;
      finalPrompt += modifiers[index];
    }
  }

  const payload = {
    key: apiKey,
    prompt: finalPrompt,
    negative_prompt: params.negative_prompt,
    width: params.width.toString(),
    height: params.height.toString(),
    samples: params.samples.toString(),
    num_inference_steps: params.num_inference_steps.toString(),
    guidance_scale: params.guidance_scale,
    safety_checker: "no", 
    enhance_prompt: params.enhance_prompt ? "yes" : "no",
    seed: effectiveSeed,
    model_id: apiModelId,
    lora_model: loraModel,
    scheduler: params.scheduler || "DPMSolverMultistepScheduler",
    webhook: null,
    track_id: null
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson.error && errJson.error.message) {
        errorMsg = errJson.error.message;
      } else if (errJson.message) {
        errorMsg = errJson.message;
      }
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(`API Error: ${errorMsg}`);
  }

  const data: ModelsLabResponse = await response.json();

  let rawLinks: string[] = [];

  if (data.status === 'success' && data.output) {
    rawLinks = data.output;
  } else if (data.output && Array.isArray(data.output) && data.output.length > 0) {
    rawLinks = data.output;
  } else if (data.future_links && data.future_links.length > 0) {
    rawLinks = data.future_links;
  } else if (data.status === 'processing') {
     throw new Error("Request accepted but processing timed out. Please check 'Recent' later or try again.");
  } else if (data.status === 'error') {
     if (data.message) throw new Error(data.message);
     throw new Error("Image generation failed.");
  } else {
    // Sometimes API returns success but empty array if filters caught it
    throw new Error("API returned no images. Check prompt for restricted content.");
  }

  const validLinks = rawLinks
    .filter(link => typeof link === 'string' && link.length > 0)
    .map(sanitizeUrl);

  if (validLinks.length === 0) {
    throw new Error("No valid image URLs returned from API.");
  }

  return {
    images: validLinks,
    seed: effectiveSeed,
    meta: data.meta
  };
};
