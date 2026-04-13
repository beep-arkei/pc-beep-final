import { GoogleGenAI } from "@google/genai";

async function generateLogo() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "A professional high-resolution tech logo for 'PC BEEP'. The logo features a stylized letter 'P' integrated with circuit board traces and nodes in Navy Blue (#002B49). On the right side, there are curved signal waves in Cyan (#00E5FF) representing a 'beep'. A subtle wrench motif is integrated at the bottom. The text 'PC BEEP' is bold, modern, and high-tech. Clean white background. Professional corporate branding style.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      console.log("IMAGE_DATA:" + part.inlineData.data);
    }
  }
}

generateLogo();
