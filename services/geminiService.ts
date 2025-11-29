import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedResult, GenerationConfig } from "../types";

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    caption: {
      type: Type.STRING,
      description: "The final optimized LinkedIn post caption, including formatting and hooks.",
    },
    seoScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating how well optimized the post is for the LinkedIn algorithm.",
    },
    critique: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of bullet points explaining the score and why this caption works.",
    },
    suggestedHashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-10 optimized hashtags.",
    },
  },
  required: ["caption", "seoScore", "critique", "suggestedHashtags"],
};

export const generateCaption = async (
  inputType: 'create' | 'refine',
  config: GenerationConfig,
  textInput: string,
  file: File | null
): Promise<GeneratedResult> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct the prompt
  const parts: any[] = [];

  if (file) {
    const filePart = await fileToGenerativePart(file);
    parts.push(filePart);
  }

  const prompt = `
    You are Veer, a World-Class LinkedIn SEO Copywriter and Algorithm Expert.
    
    YOUR TASK:
    ${inputType === 'create' 
      ? "Create a highly engaging LinkedIn post based on the provided inputs (and optional image/PDF)." 
      : "Refine and optimize the user's existing draft for maximum reach and engagement."}

    INPUT DATA:
    - User Draft/Context: ${textInput || "None provided, purely visual analysis required."}
    - Brand Guidelines: ${config.brandGuidelines || "None provided."}
    - Target Audience: ${config.targetAudience}
    - Niche/Industry: ${config.niche}
    - Purpose/Category: ${config.purpose}
    - Tone: ${config.tone}
    - Geo/Demographics: ${config.geoDemographics}
    - Language: ${config.language}
    - Desired Formatting: ${config.formatStyles.join(', ')}

    REQUIREMENTS:
    1. Hook: Start with a powerful, scroll-stopping hook (controversial statement, question, or strong data point).
    2. Structure: Use line breaks for readability (mobile-first).
    3. Formatting: Apply the requested formatting styles (bolding key phrases if requested, using bullet points for lists).
    4. Algorithm Optimization: Focus on "Dwell Time" and "Comment generation". Encourage engagement.
    5. SEO: Integrate keywords naturally relevant to the Niche.
    6. Length: Optimized for high engagement (usually 150-300 words, but adaptable to context).

    OUTPUT JSON:
    Return a JSON object with:
    - 'caption': The full post text.
    - 'seoScore': An integer (0-100) rating this post's potential performance.
    - 'critique': An array of strings explaining what was done effectively (e.g., "Strong hook used", "Keywords integrated").
    - 'suggestedHashtags': A list of relevant hashtags.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Creativity balanced with structure
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
