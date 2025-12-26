
import { GenerationParams, ModelDefinition } from './types';

export const API_ENDPOINT = "https://modelslab.com/api/v6/images/text2img";
export const API_ENDPOINT_V7 = "https://modelslab.com/api/v7/images/text-to-image";

export const SCHEDULERS = [
  "DPMSolverMultistepScheduler",
  "K_EULER_ANCESTRAL",
  "K_EULER",
  "UniPCMultistepScheduler",
  "EulerDiscreteScheduler",
  "DDIMScheduler",
  "DDPMScheduler",
  "HeunDiscreteScheduler"
];

export const DEFAULT_PARAMS: GenerationParams = {
  prompt: "Close-up view of the fallen dark elf kingdom dungeon, adult female dark elf Chloe...",
  negative_prompt: "(worst quality:2), (low quality:2), (normal quality:2), (jpeg artifacts), (blurry), (duplicate), (morbid), (mutilated), (out of frame), (extra limbs), (bad anatomy), (disfigured), (deformed), (cross-eye), (glitch), (oversaturated), (overexposed), (underexposed), (bad proportions), (bad hands), (bad feet), (cloned face), (long neck), (missing arms), (missing legs), (extra fingers), (fused fingers), (poorly drawn hands), (poorly drawn face), (mutation), (deformed eyes), watermark, text, logo, signature, grainy, tiling, ugly, blurry eyes, noisy image, bad lighting, unnatural skin, asymmetry, (multiple people:1.2), (two people:1.2), (fused bodies:1.2), (conjoined:1.2), (multiple views:1.2), (split view:1.2)",
  width: 1024,
  height: 1024,
  samples: 1,
  num_inference_steps: 31,
  guidance_scale: 7.5,
  seed: null,
  model_id: "z-image-turbo",
  lora_model: "big-dick-pov-xl-v1",
  scheduler: "DPMSolverMultistepScheduler",
  enhance_prompt: false,
  style_modifier: "None",
};

export const AVAILABLE_MODELS: ModelDefinition[] = [
  {
    id: "z-image-turbo",
    name: "Z Image Turbo",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: true,
      scheduler: true
    }
  },
  { 
    id: "boziorealvisxlv4", 
    name: "Big Dick POV XL - V1",
    lora_model: "big-dick-pov-xl-v1",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: true,
      scheduler: true
    }
  },
  { 
    id: "ballbusting-v1",
    api_model_id: "epicrealism-v4",
    name: "Ballbusting, Rupture And Splatter - V1.1",
    lora_model: "ballbusting-rupture-and-splatter-v1-0",
    trigger_word: "ballbusting",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: false,
      scheduler: true
    }
  },
  { 
    id: "bukkake-v0-4",
    api_model_id: "epicrealism-v4",
    name: "Bukkake / Excessive Cum - V0.4",
    lora_model: "bukkake-excessive-cum-v0-4",
    trigger_word: "bukkake, excessive cum",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: false,
      scheduler: true
    }
  },
  {
    id: "mystic-xxx-v7",
    api_model_id: "fluxdev",
    name: "[NSFW Flux] Mystic XXX - v7.0",
    lora_model: "nsfw-flux-mystic-xxx-v7-0",
    trigger_word: "mystic xxx",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: false,
      scheduler: false // Flux usually handles its own scheduling
    }
  },
  {
    id: "airi-akizuki-v1",
    api_model_id: "epicrealism-v4",
    name: "Airi Akizuki - Demon Father - v1.0",
    lora_model: "airi-akizuki-n-father-oni-chichi-v1-0",
    trigger_word: "airi akizuki",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: false,
      scheduler: true
    }
  },
  {
    id: "cattleya-peralim-sdxl",
    api_model_id: "boziorealvisxlv4",
    name: "Cattleya Peralim - Pure Princess [SD XL]",
    lora_model: "cattleya-peralim-pure-pure-pero-pero-princess-sd-xl-sd-xl",
    trigger_word: "cattleya peralim",
    capabilities: {
      negativePrompt: true,
      aspectRatio: true,
      steps: true,
      guidance: true,
      enhancePrompt: true,
      seed: false,
      scheduler: true
    }
  }
];

export const ASPECT_RATIOS = [
  { label: "Square (1:1)", width: 1024, height: 1024, ratio: "1:1" },
  { label: "Portrait (2:3)", width: 768, height: 1152, ratio: "2:3" },
  { label: "Landscape (3:2)", width: 1152, height: 768, ratio: "3:2" },
  { label: "Widescreen (16:9)", width: 1344, height: 768, ratio: "16:9" },
  { label: "Mobile (9:16)", width: 768, height: 1344, ratio: "9:16" },
];

export const STYLE_MODIFIERS = {
  "realistic": [
    ", photorealistic, soft golden hour window light, warm skin glow, intimate serene mood",
    ", hyper-realistic, dramatic low-key lighting, deep velvet shadows, intense sensual atmosphere",
    ", photorealistic, cool overcast dawn light, delicate pastel tones, quiet tender mood",
    ", cinematic realism, warm flickering candlelight, rich chiaroscuro, romantic tension",
    ", ultra-realistic, moonlight through rain-streaked glass, melancholic blue palette",
    ", photorealistic, harsh noon sunlight, high contrast, raw unfiltered energy",
    ", hyper-realistic, soft morning light through sheer curtains, dreamy peaceful atmosphere",
    ", cinematic, warm fireplace glow in darkness, cozy amber intimacy",
    ", photorealistic, wet neon night city reflections, cyber-noir mood",
    ", ultra-realistic, volumetric sunset god rays, warm hazy ethereal sensuality"
  ],
  "hentai": [
    ", beautiful anime style, soft sunset golden rim light, tender romantic mood",
    ", clean hentai aesthetic, moonlight silver glow, delicate pastel shading, dreamy intimacy",
    ", anime masterpiece, gentle morning window light, soft peach tones, loving atmosphere",
    ", high-detail anime, dramatic rim lighting, emotional blush, passionate softness",
    ", anime style, cherry-blossom breeze, warm spring palette, pure romance vibe",
    ", clean hentai illustration, cozy lamplight, warm orange glow, wholesome sensuality",
    ", anime aesthetic, cool blue moonlight, sparkling highlights, serene emotion",
    ", beautiful anime style, candlelit warmth with soft shadows, intimate gentle mood",
    ", hentai masterpiece, twilight purple sky, soft lens flare, melancholic romance",
    ", clean anime style, rainy window light, cool gray with warm skin highlights, quiet passion"
  ],
  "sci_fi": [
    ", cyberpunk neon nights, magenta and cyan light blades, wet reflections, moody futuristic intimacy",
    ", sleek spaceship interior, cool blue holographic glow, soft rim light, weightless sensual atmosphere",
    ", alien planet twilight, twin moons casting teal and violet light, ethereal sci-fi mood",
    ", high-tech bedroom with floating holograms, purple ambient lighting, seductive futuristic vibe",
    ", dystopian rain-soaked rooftop, electric blue neon signs, dramatic cyber-noir energy",
    ", zero-gravity scene, soft volumetric starlight through viewport, dreamy cosmic intimacy",
    ", biomechanical chamber, glowing green and amber bioluminescence, otherworldly sensual mood",
    ", android awakening scene, cool white LED strips with warm skin contrast, mysterious sci-fi allure",
    ", orbital station at sunrise, golden solar flare through window, breathtaking space romance",
    ", dark sci-fi corridor, crimson emergency lighting, tense and dangerously seductive atmosphere"
  ],
  "fantasy": [
    ", moonlit enchanted forest, silver bioluminescent glow, soft teal mist, magical intimate mood",
    ", ancient temple ruins, warm torchlight and drifting embers, sacred sensual atmosphere",
    ", floating sky palace at twilight, golden clouds and rose light, dreamy ethereal fantasy",
    ", dark sorceress throne room, crimson runes glowing, deep shadows, powerful seductive mood",
    ", crystal cavern with prismatic light dancing across skin, soft rainbow caustics, mystical serenity",
    ", elven glade under starlight, delicate silver highlights, pure romantic fantasy vibe",
    ", volcanic dragon lair, warm orange lava glow against cool night, primal passionate energy",
    ", celestial realm with floating islands, soft pastel nebula colors, divine dreamy intimacy",
    ", abandoned castle ballroom, moonlight through broken stained glass, melancholic romantic fantasy",
    ", fae ritual circle at midnight, glowing mushrooms and violet fireflies, whimsical sensual mood"
  ],
  "hentai_mashou": [
    ", beautiful blonde pirate queen bound on deck at sunset, golden lantern rim light, wet hair clinging to skin, torn white blouse, dramatic crimson sky, mashou no nie 3 style, ultra-detailed skin texture, sensual ahegao",
    ", red-haired captive pressed against ship mast, warm torchlight flickering across bare back, misty sea fog, wind-blown hair, high-contrast shadows, murakami teruaki direction, voluptuous curves, erotic tension",
    ", elegant noblewoman kneeling in captain’s cabin, soft golden lantern glow, translucent silk slipping off shoulders, detailed lace textures, passionate expression, mashou no nie 3 masterpiece",
    ", group scene on moonlit deck, silver bioluminescent waves, multiple women in various states of undress, dynamic poses, fluid motion blur, intense emotional eyes, teruaki murakami lighting",
    ", close-up of sweat-glistened breasts under flickering candlelight, wet skin highlights, deep shadows, sensual parted lips, mashou no nie 3 hyper-realistic shading",
    ", stormy night on ship, electric blue lightning illuminating nude figure clinging to rigging, dramatic chiaroscuro, raw erotic energy, wind and rain effects",
    ", soft dawn light through porthole, gentle pastel glow on sleeping captive, peaceful yet sensual mood, delicate skin details, mashou no nie 3 morning-after scene",
    ", pirate queen standing defiant on bow, golden hour backlight, flowing hair and torn cape, heroic yet erotic pose, cinematic depth of field",
    ", cabin interior with warm amber lantern light, voluptuous woman straddling chair, intense gaze, detailed wood grain and fabric textures, murakami sensual realism",
    ", misty harbor at twilight, cool blue fog with warm ship lanterns, multiple women in ropes dramatic silhouettes, mashou no nie 3 atmospheric masterpiece"
  ],
  "hentai_kuroinu": [
    ", proud dark elf queen Olga Discordia kneeling in throne room, crimson rune glow on purple skin, torn royal dress, silver hair flowing, kuroinu style, high-contrast shadows, villainous sensual mood",
    ", holy priestess Celestine bound in dungeon, warm torchlight flickering on golden hair and tattered white robes, intricate chain details, submissive yet defiant expression, kuroinu masterpiece",
    ", fallen knight commander on battlefield at night, moonlight silver rim light, broken armor plates, blood and sweat, dramatic low angle, dark fantasy eroticism",
    ", elf archer captured in forest ruins, cool blue moonlight through trees, torn leather armor, detailed bow and quiver, intense emotional eyes, kuroinu atmosphere",
    ", group conquest scene in grand hall, multiple heroines in various states of surrender, crimson and gold lighting from chandeliers, opulent medieval setting, majin label quality",
    ", dark sorceress with glowing red runes on skin, volcanic lair warm orange lava glow, flowing black hair, powerful dominant pose, kuroinu dark fantasy style",
    ", princess in chains against stone wall, single dramatic torch casting long shadows, detailed jewelry and torn gown, melancholic yet aroused expression",
    ", battlefield aftermath at dawn, soft rose light, defeated warriors in mud and blood, broken swords, epic scale, kuroinu cinematic mood",
    ", throne room orgy with floating magical particles, purple ambient lighting, detailed textures on skin and fabric, overwhelming sensual atmosphere",
    ", close-up of elf ears and tear-streaked face under crimson emergency lighting, intense emotional breakdown, hyper-detailed skin pores and sweat, kuroinu signature style"
  ]
};

const COMMON_NEGATIVES = ", lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature";

export const NEGATIVE_PROMPT_PRESETS = {
  "realistic": [
    `cartoon, anime, painting, drawing, illustration, lowres, blurry, bad anatomy, watermark, text, logo, overexposed${COMMON_NEGATIVES}`,
    `cartoon, anime, 3d render, blurry, grainy, deformed, extra limbs, low quality, artifacts${COMMON_NEGATIVES}`,
    `anime, cartoon, render, blurry, oversaturated, text, logo, watermark, bad hands${COMMON_NEGATIVES}`,
    `anime, cartoon, illustration, lowres, deformed face, extra fingers, text error${COMMON_NEGATIVES}`,
    `cartoon, anime, render, low quality, jpeg artifacts, bad hands, extra limbs${COMMON_NEGATIVES}`,
    `cartoon, anime, painting, lowres, bad anatomy, text, watermark, overexposed${COMMON_NEGATIVES}`,
    `anime, cartoon, render, blurry, low quality, bad proportions, text${COMMON_NEGATIVES}`,
    `anime, cartoon, painting, lowres, text, logo, watermark, bad anatomy${COMMON_NEGATIVES}`,
    `anime, cartoon, 3d render, lowres, text, watermark, jpeg artifacts, overexposed${COMMON_NEGATIVES}`,
    `cartoon, anime, illustration, lowres, bad anatomy, watermark, text${COMMON_NEGATIVES}`
  ],
  "hentai": [
    `realistic photo, 3d render, western cartoon, lowres, bad anatomy, extra limbs, text, watermark, logo${COMMON_NEGATIVES}`,
    `realistic, photorealistic, 3d, western cartoon, blurry, deformed, text, logo${COMMON_NEGATIVES}`,
    `photorealistic, 3d render, western cartoon, low quality, bad hands, text, watermark${COMMON_NEGATIVES}`,
    `realistic photo, 3d, western cartoon, blurry, bad proportions, text error${COMMON_NEGATIVES}`,
    `photorealistic, 3d render, western cartoon, lowres, bad anatomy, watermark${COMMON_NEGATIVES}`,
    `realistic, photorealistic, western cartoon, lowres, text, logo, bad hands${COMMON_NEGATIVES}`,
    `photorealistic, 3d, western cartoon, blurry, deformed face, text${COMMON_NEGATIVES}`,
    `realistic photo, 3d render, western cartoon, lowres, watermark, bad anatomy${COMMON_NEGATIVES}`,
    `photorealistic, 3d, western cartoon, low quality, text, logo, artifacts${COMMON_NEGATIVES}`,
    `realistic photo, 3d render, western cartoon, blurry, bad hands, text${COMMON_NEGATIVES}`
  ],
  "sci_fi": [
    `lowres, blurry, bad anatomy, cartoon, anime, painting, text, watermark, overexposed, jpeg artifacts${COMMON_NEGATIVES}`,
    `low quality, blurry, deformed, extra limbs, text, logo, cartoonish, anime style${COMMON_NEGATIVES}`,
    `cartoon, anime, painting, lowres, bad hands, text, watermark, bad proportions${COMMON_NEGATIVES}`,
    `lowres, blurry, deformed face, extra fingers, text error, cartoon, painting${COMMON_NEGATIVES}`,
    `low quality, jpeg artifacts, bad anatomy, text, logo, overexposed, cartoon${COMMON_NEGATIVES}`,
    `blurry, lowres, bad hands, extra limbs, text, watermark, cartoonish${COMMON_NEGATIVES}`,
    `lowres, painting, cartoon, bad anatomy, text, logo, deformed${COMMON_NEGATIVES}`,
    `blurry, low quality, bad proportions, text, watermark, cartoon${COMMON_NEGATIVES}`,
    `lowres, jpeg artifacts, bad hands, text, logo, overexposed${COMMON_NEGATIVES}`,
    `cartoon, painting, lowres, text, watermark, bad anatomy${COMMON_NEGATIVES}`
  ],
  "fantasy": [
    `lowres, blurry, modern clothing, text, watermark, logo, realistic photo, 3d render${COMMON_NEGATIVES}`,
    `low quality, deformed, extra limbs, text, logo, photorealistic, urban background${COMMON_NEGATIVES}`,
    `blurry, lowres, bad hands, text, watermark, realistic photo, modern${COMMON_NEGATIVES}`,
    `lowres, jpeg artifacts, bad anatomy, text, logo, photorealistic${COMMON_NEGATIVES}`,
    `blurry, deformed face, extra fingers, text, modern objects, realistic${COMMON_NEGATIVES}`,
    `low quality, bad proportions, text, watermark, photorealistic, sci-fi${COMMON_NEGATIVES}`,
    `lowres, painting, realistic photo, text, logo, deformed${COMMON_NEGATIVES}`,
    `blurry, lowres, bad hands, extra limbs, text, modern clothing${COMMON_NEGATIVES}`,
    `lowres, jpeg artifacts, bad anatomy, text, logo, realistic${COMMON_NEGATIVES}`,
    `blurry, low quality, text, watermark, modern, photorealistic${COMMON_NEGATIVES}`
  ]
};
