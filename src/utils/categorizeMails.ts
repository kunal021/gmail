import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

async function classifyMail(mail: any, retries: number, APIKEY: string) {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    maxOutputTokens: 2048,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
    apiKey: APIKEY!,
  });

  const taggingPrompt = ChatPromptTemplate.fromTemplate(
    `Extract the desired information from the following passage.

Provide the sentiment in one of the following categories exactly as mentioned: "Important", "Promotions", "Social", "Marketing", "Spam", "General".

Do not use any other category. If you are unsure, use "General".

Passage:
{input}
`
  );

  const classificationSchema = z.object({
    sentiment: z
      .enum([
        "Important",
        "Promotions",
        "Social",
        "Marketing",
        "Spam",
        "General",
      ])
      .describe("The sentiment of the text"),
  });

  const llmWihStructuredOutput = model.withStructuredOutput(
    classificationSchema,
    {
      name: "extractor",
    }
  );

  const chain = taggingPrompt.pipe(llmWihStructuredOutput);
  const input = `
    Subject: ${
      mail.payload.headers.find((header: any) => header.name === "Subject")
        ?.value
    }
    Body: ${mail.snippet}
  `;

  try {
    const result = await chain.invoke({ input });
    console.log(result.sentiment);
    return result.sentiment;
  } catch (error: any) {
    if (retries > 0 && error.response && error.response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (4 - retries)));
      return classifyMail(mail, retries - 1, APIKEY);
    }
    throw error;
  }
}

export { classifyMail };
