import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  max_tokens,
  model,
  openai,
  temperature,
} from "../scripts/openAIConfig";
import { generateAnalyzeMessagesPrompt } from "../scripts/prompts";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Analyze Messages HTTP trigger function processed a request.");

  const messages: string[] =
    req.query.messages || (req.body && req.body.messages);

  // todo: get user interests
  const userInterests = [];

  const prompt = generateAnalyzeMessagesPrompt(messages, userInterests);
  if (prompt.length > max_tokens - 200) {
    context.res = {
      status: 400,
      body: "Messages are too long",
    };
    return;
  }

  try {
    const response = await openai.createCompletion({
      model: model,
      prompt: prompt,
      max_tokens: max_tokens,
      temperature: temperature,
    });

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: response.data.choices[0].text,
    };
  } catch {
    context.res = {
      status: 400,
      body: "Messages are too long",
    };
  }
};

export default httpTrigger;
