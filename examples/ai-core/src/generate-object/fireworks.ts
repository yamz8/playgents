import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import 'dotenv/config';
import { z } from 'zod';

const fireworks = createOpenAI({
  name: 'fireworks',
  apiKey: process.env.FIREWORKS_API_KEY ?? '',
  baseURL: 'https://api.fireworks.ai/inference/v1',
});

async function main() {
  const result = await generateObject({
    model: fireworks('accounts/fireworks/models/firefunction-v1'),
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
        ),
        steps: z.array(z.string()),
      }),
    }),
    prompt: 'Generate a lasagna recipe.',
  });

  console.log(JSON.stringify(result.object.recipe, null, 2));
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
}

main().catch(console.error);
