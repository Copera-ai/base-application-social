import { CoperaAI } from "@copera.ai/sdk";

import { Env } from "~/utils/Env.js";

export const copera = CoperaAI({
  apiKey: Env.copera.apiKey,
});
