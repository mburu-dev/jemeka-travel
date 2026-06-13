import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return NextResponse.json(
      { error: "AI service not configured. Please add a GEMINI_API_KEY to your .env.local file." },
      { status: 503 }
    );
  }

  try {
    const { budget, duration, interests, travelers } = await req.json();

    if (!budget || !duration || !interests) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert Kenyan travel consultant at Jemeka Tours & Travel, a luxury safari and travel company based in Kenya.

Generate a detailed, exciting, and realistic day-by-day travel itinerary for the following request:

- **Budget:** $${budget} USD (total)
- **Duration:** ${duration} days
- **Primary Interest:** ${interests}
- **Travelers:** ${travelers || "2 adults"}

**Instructions:**
1. Recommend specific, real Kenyan destinations that match the interest and budget.
2. Structure the output EXACTLY in this JSON format with no extra text:
{
  "title": "Short catchy trip title",
  "summary": "2-sentence overview of the trip",
  "estimatedCost": "Price range e.g. $1,200 - $1,500",
  "bestSeason": "Best time of year to do this trip",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "location": "Location name",
      "description": "Detailed description of activities",
      "accommodation": "Suggested accommodation type"
    }
  ],
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the JSON from the model's response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response.");
    }

    const itinerary = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ itinerary });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}
