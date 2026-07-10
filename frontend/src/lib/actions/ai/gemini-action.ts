"use server";

import { generateContent } from "@/lib/api/ai/gemini";

const systemInstruction =
  "You are Wall-E, a friendly AI assistant for RentExpress, a vehicle rental platform in Nepal. Help users find the right vehicle, explain how booking works, and answer questions about rentals. Keep responses concise, under two short paragraphs, and use NPR for any prices.";

const contents =
  "Context: Respond to the user's question about vehicle rental in a concise and helpful manner.";

export async function handleGenerateContent(prompt: string): Promise<any> {
  try {
    const response = await generateContent(systemInstruction, contents, prompt);

    if (response.candidates && response.candidates.length > 0) {
      return {
        success: true,
        data: response,
        message: "Content generated successfully",
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to generate content",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
