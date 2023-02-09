import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  max_tokens,
  openai,
  model,
  temperature,
} from "../scripts/openAIConfig";
import { generateTasksDetectionPromps } from "../scripts/prompts";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Identify Tasks HTTP trigger function processed a request.");

  const messages: string[] =
    req.query.messages || (req.body && req.body.messages);

  const prompt = generateTasksDetectionPromps(messages);
  if (prompt.length > max_tokens - 300) {
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
