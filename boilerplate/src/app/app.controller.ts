import { db } from "uorm";
import {
  controller,
  Config,
  Context,
  HttpResponse,
  HttpResponseBadRequest
} from "@foal/core";
import { ApiHttpResponse } from "app/lib/http_response";
import { ApiError } from "app/lib/errors";
import { initCache } from "./lib/cache";

export class AppController {
  subControllers = [];

  async init() {
    const storeConfig = Config.get("store");
    await db.init(storeConfig);
    await initCache();
  }

  handleError(
    error: Error,
    _ctx: Context
  ): HttpResponse | Promise<HttpResponse> {
    if (error instanceof ApiError) {
      const resp = new ApiHttpResponse(error.toObject(), error.code);
      resp.statusCode = error.code;
      return resp;
    }
    return new HttpResponseBadRequest({ error: error.message });
  }
}
