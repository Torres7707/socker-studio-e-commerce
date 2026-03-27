import { SYSTEM_PROMPT, buildUserPrompt } from './readmePrompt';
import { type GenerateResult } from '@/schemas';

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export async function generateReadme(code: string): Promise<GenerateResult> {
	const apiKey = import.meta.env.VITE_ZHIPU_API_KEY;
	if (!apiKey) {
		throw new Error(
			'API key not configured. Add VITE_ZHIPU_API_KEY to your .env file.'
		);
	}

	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			model: 'glm-4.5-air',
			max_tokens: 2048,
			messages: [
				{
					role: 'system',
					content: SYSTEM_PROMPT,
				},
				{
					role: 'user',
					content: buildUserPrompt(code),
				},
			],
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		if (response.status === 429) {
			throw new Error('Rate limited. Please wait a moment and try again.');
		}
		if (response.status === 401) {
			throw new Error('Invalid API key. Check your VITE_ZHIPU_API_KEY in .env');
		}
		throw new Error(`API error ${response.status}: ${error}`);
	}

	const data = await response.json();
	const markdown = data.choices?.[0]?.message?.content;

	if (!markdown) {
		throw new Error('Empty response from AI. Please try again.');
	}

	return { markdown };
}
