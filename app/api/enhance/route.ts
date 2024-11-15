import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: `Act as a helpful AI assistant improving the user prompt for another AI model to understand. Your goal is not to respond to the user prompt but rather improve the prompt itself, making it complete and easy for an AI to understand. You can improve the prompt by adding more information, clarifying the intent, or adding examples. You should not add any explanations or comments. IMPORTANT: only output the updated prompt itself without quotation marks and other formatting. The user prompt is: ${prompt}`,
        },
      ],
    })

    const enhancedPrompt = response.content
      ?.filter((content) => content.type === 'text')
      .map((content) => content.text)
      .join('')
      .replace(/["']/g, '') 
      .replace(/[,;:]$/, '.') 

    if (!enhancedPrompt) {
      throw new Error('No response from Claude model')
    }

    return NextResponse.json({ enhancedPrompt })
  } catch (error) {
    console.error('Error:', error)
    const statusCode = error instanceof Anthropic.APIError ? error.status || 500 : 500
    const errorMessage = error instanceof Anthropic.APIError
      ? `Anthropic API error: ${error.message}`
      : 'Failed to enhance prompt'

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
