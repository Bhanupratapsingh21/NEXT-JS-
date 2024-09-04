import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        // Extracting the prompt from the request body
        const prompt = ""
        const { messages } = await req.json();

        // Create the model with the updated token limit and prompt
        const model = openai.completion('gpt-3.5-turbo-instruct', {
            echo: true, // Optional, echo the prompt in addition to the completion
            logitBias: {
                // Optional likelihood for specific tokens
                '50256': -100,
            },
            suffix: 'some text', // Optional suffix that comes after a completion of inserted text
            user: 'test-user', // Optional unique user identifier
        });

        // Stream the response
        const result = await streamText({
            model: model,
            prompt: prompt,
            maxTokens: 400,
            messages: convertToCoreMessages(messages),
        });

        return result.toDataStreamResponse();

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.log("Error In Open AI");
            const { name, status, headers, message } = error;
            return NextResponse.json({
                name, status, headers, message
            }, { status });
        } else {
            console.log("An Unexpected Error Occurred", error);
            throw error;
        }
    }
}
