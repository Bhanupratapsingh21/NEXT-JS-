import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: NextRequest) {
    const prompt = `Create a friendly anonymous name and a message for an anonymous social messaging platform. The name should be fun but not overly personal. always try to give diff quastion. The message should be an open-ended question designed to encourage engagement and friendly interaction. For example, the name could be "spidy123" and the message could be "What is your favorite hobby?". Format your response as follows:
    {
        "anonymesname": "generated name",
        "msg": "generated message"
    }`;

    const API_KEY = process.env.GIMINI_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({ error: 'API key is not defined' }, { status: 500 });
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // console.log('Raw response:', responseText);
        
        // Function to extract JSON from Markdown code blocks
        const extractJsonFromMarkdown = (text: string) => {
            const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
            const match = text.match(jsonRegex);
            return match ? match[1] : text;
        };

        // Extract JSON from the response
        const jsonContent = extractJsonFromMarkdown(responseText);
        // console.log('Extracted JSON content:', jsonContent);

        try {
            const parsedResponse = JSON.parse(jsonContent);
            // console.log('Parsed response:', parsedResponse);
            
            if (parsedResponse.anonymesname && parsedResponse.msg) {
                return NextResponse.json(parsedResponse);
            } else {
                throw new Error('Parsed response does not have the expected structure');
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return NextResponse.json({ error: 'Invalid JSON response from AI' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error calling Gemini AI API:', error);
        return NextResponse.json({ error: 'Error calling Gemini AI API' }, { status: 500 });
    }
}