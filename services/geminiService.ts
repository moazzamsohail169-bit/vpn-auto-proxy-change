import { GoogleGenAI, Type } from "@google/genai";
import { ProxyServer, SecurityReport } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    return new GoogleGenAI({ apiKey });
}

export const analyzeProxySecurity = async (proxy: ProxyServer): Promise<SecurityReport> => {
  try {
    const ai = getClient();
    
    // We will use Gemini to simulate a security audit of the location and protocol
    const prompt = `
      Act as a cybersecurity expert. Analyze a VPN/Proxy server with these details:
      Location: ${proxy.city}, ${proxy.country}
      Protocol: ${proxy.protocol}
      Encryption: ${proxy.encryption}
      Latency: ${proxy.latency}ms

      Provide a JSON response with:
      1. riskLevel: 'Low', 'Medium', or 'High' based on general internet freedom in that country and the protocol used (HTTP is high risk, SOCKS5/HTTPS is lower).
      2. summary: A 1-sentence summary of privacy laws in ${proxy.country}.
      3. encryptionAnalysis: A short comment on the strength of ${proxy.encryption} or lack thereof.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            encryptionAnalysis: { type: Type.STRING },
          },
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SecurityReport;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback mock response if API fails or key is missing
    return {
      riskLevel: 'Medium',
      summary: `Unable to verify real-time data for ${proxy.country}. Standard privacy laws apply.`,
      encryptionAnalysis: `Protocol ${proxy.protocol} is standard.`
    };
  }
};
