// 3p
import { Config, createApp, ExpressApplication } from "@foal/core";
import * as request from "supertest";

// App
import { AppController } from "../app/app.controller";

describe("The server", () => {
  let app: ExpressApplication;

  before(() => {
    const uri = Config.get<string>("mongodb.uri");
    app = createApp(AppController);
  });

  it("should return a 200 status on GET / requests.", () => {
    return request(app)
      .get("/")
      .expect(200);
  });
});
