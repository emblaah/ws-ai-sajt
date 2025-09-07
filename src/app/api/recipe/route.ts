import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are a helpful and precise recipe assistant that knows about all the kinds of food even the special ones. 
Always respond with a JSON array of a recipe. Each recipe must include:
- "title": the name of the recipe
- "ingredients": an array of ingredients
- "instructions": an array of step-by-step cooking instructions
- "time": total preparation and cooking time in minutes
- "difficulty": a string that describes how hard the recipe is (Easy, Medium, or Hard)
- "rating": simulate 10 home cooks rating this recipe from 1–5 stars. Analyze their individual scores and comments, then provide the average rating (1-5 stars with one point). Some cooks should be picky, so not all scores should be high.

Return exactly the number of recipes requested by the user. 
If the user writes something that is not a food, or an ingredient dont provide a recipe.
Use short and clear instructions. 
Do not include any extra text outside the JSON. and when you send the result back remove the any symbol or letter outside of the {}`,
});

// Add this POST handler for the API route
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const result = await model.generateContent(prompt);
    const output = result.response.text();
    // Clean and parse the output and send to the frontend :)
    console.log(output);
    let cleanedOutPut = output.replaceAll("`", "").replace("json", "");
    let parsedOutPut = JSON.parse(cleanedOutPut);
    console.log(parsedOutPut);

    return new Response(JSON.stringify({ response: true, parsedOutPut }), {
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
