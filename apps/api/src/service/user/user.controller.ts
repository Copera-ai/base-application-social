import { Controller, GET } from "fastify-decorators";

import type { Req } from "~/utils/types/index.js";

import { UserService } from "./user.service.js";

@Controller("/user")
export default class UserController {
  @GET("/info")
  async getUserInfo(req: Req) {
    const { userId } = req.user;

    return UserService.getUserInfo({ userId });
  }
}
