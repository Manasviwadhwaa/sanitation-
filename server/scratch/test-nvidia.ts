import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
});

async function test() {
  console.log('Testing NVIDIA API...');
  try {
    const response = await openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct", 
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 5,
    });
    console.log('✅ NVIDIA API success:', response.choices[0].message.content);
    process.exit(0);
  } catch (err) {
    console.error('❌ NVIDIA API failed:', err.message);
    process.exit(1);
  }
}

test();
