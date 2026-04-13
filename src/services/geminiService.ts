import { GoogleGenAI, Type } from "@google/genai";
import { Product, PCBuild } from "../types";

// Initialize Gemini API
// Note: process.env.GEMINI_API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface BuildGenerationResult {
  cpu?: string;
  motherboard?: string;
  ram?: string;
  gpu?: string;
  storage: (string | null)[];
  psu?: string;
  case?: string;
  cooler: (string | null)[];
  monitor?: string;
  os?: string;
  peripherals: (string | null)[];
}

export const generateAiResponse = async (prompt: string, history: any[]): Promise<string> => {
  try {
    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
    
    // Add the current prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: "You are Beep Bot, a helpful and friendly PC building assistant for Beep PC. You help users with technical questions, build advice, and store information. Keep your responses concise and formatted with markdown."
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having some trouble connecting right now. Please try again later!";
  }
};

export const generateBuild = async (
  currentBuild: PCBuild,
  userPrompt: string,
  availableProducts: Product[]
): Promise<BuildGenerationResult> => {
  // Filter out unlisted products
  const catalog = availableProducts.filter(p => !p.is_unlisted);

  // Prepare the prompt
  const systemInstruction = `
    You are an expert PC Builder. Your task is to complete a PC build based on the user's current selections and their specific constraints.
    
    RULES:
    1. DO NOT overwrite any parts the user has already manually selected.
    2. Ensure all parts are compatible (e.g., CPU socket matches Motherboard, PSU has enough wattage).
    3. Respect the user's budget and aesthetic preferences mentioned in the prompt.
    4. Use ONLY the products provided in the catalog.
    5. Return a structured JSON response matching the BuildGenerationResult interface.
    6. For multi-item categories (storage, cooler, peripherals), return an array of Product IDs.
    7. If a part is already selected, keep its ID in the response.
    8. If you cannot find a compatible part in the catalog, leave it as null or undefined.
  `;

  const prompt = `
    USER PROMPT: ${userPrompt}
    
    CURRENT BUILD:
    ${JSON.stringify(currentBuild, null, 2)}
    
    CATALOG:
    ${JSON.stringify(catalog.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      specs: p.specs
    })), null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cpu: { type: Type.STRING, description: "Product ID for CPU" },
            motherboard: { type: Type.STRING, description: "Product ID for Motherboard" },
            ram: { type: Type.STRING, description: "Product ID for RAM" },
            gpu: { type: Type.STRING, description: "Product ID for GPU" },
            storage: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING, nullable: true },
              description: "Array of Product IDs for Storage"
            },
            psu: { type: Type.STRING, description: "Product ID for PSU" },
            case: { type: Type.STRING, description: "Product ID for Case" },
            cooler: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING, nullable: true },
              description: "Array of Product IDs for Cooling"
            },
            monitor: { type: Type.STRING, description: "Product ID for Monitor" },
            os: { type: Type.STRING, description: "Product ID for Operating System" },
            peripherals: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING, nullable: true },
              description: "Array of Product IDs for Peripherals"
            },
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Error generating build with Gemini:", error);
    throw error;
  }
};
