import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import 'dotenv/config';
import { z } from 'zod';

const fireworks = createOpenAI({
  name: 'fireworks',
  apiKey: process.env.FIREWORKS_API_KEY ?? '',
  baseURL: 'https://api.fireworks.ai/inference/v1',
});

async function main() {
  const result = streamObject({
    model: fireworks('accounts/fireworks/models/firefunction-v1'),
    maxTokens: 2000,
    schema: z.object({
      characters: z.array(
        z.object({
          name: z.string(),
          class: z
            .string()
            .describe('Character class, e.g. warrior, mage, or thief.'),
          description: z.string(),
        }),
      ),
    }),
    prompt:
      'Generate 3 character descriptions for a fantasy role playing game.',
  });

  for await (const partialObject of result.partialObjectStream) {
    console.clear();
    console.log(partialObject);
  }
}

main().catch(console.error);
