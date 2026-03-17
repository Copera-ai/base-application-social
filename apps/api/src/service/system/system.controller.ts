import { yup } from "common/api-utils";
import { Controller, POST } from "fastify-decorators";

import { isPublic } from "~/utils/decorators/isPublic.decorator.js";
import type { Req } from "~/utils/types/index.js";

import { SystemService } from "./system.service.js";

@Controller("/system")
export default class SystemController {
  @POST("/sign-in")
  @isPublic()
  async signIn(req: Req) {
    const { email, password } = await yup
      .object({
        email: yup.string().email().required(),
        password: yup.string().required(),
      })
      .validate(req.body);

    return SystemService.loginUser({ email, password });
  }
}
