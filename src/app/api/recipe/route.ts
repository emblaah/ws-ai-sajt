import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are a helpful and precise recipe assistant. 
Always respond with a JSON array of recipes. Each recipe must include:
- "title": the name of the recipe
- "ingredients": an array of ingredients
- "instructions": step-by-step cooking instructions
- "time": total preparation and cooking time in minutes

Return exactly the number of recipes requested by the user. 
Use short and clear instructions. 
Do not include any extra text outside the JSON.`,
});

// Add this POST handler for the API route
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    return new Response(JSON.stringify({ response: true, output }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ response: false, error: error?.toString() }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
