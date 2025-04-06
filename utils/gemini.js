import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Ensure this is set in your environment variables

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getEmissionAdvice(emissions) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      apiVersion: "v1beta", // Specify the API version if required
    });

    const prompt = `
      I want advice for reducing carbon emissions for this company. 
      Here is the data:
      ${JSON.stringify(emissions, null, 2)}

      Give me suggestions on reducing emissions per source. 
      Be specific and practical.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Unable to fetch suggestions at the moment.";
  }
}
