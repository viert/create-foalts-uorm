import "source-map-support/register";
import "module-alias/register";
import * as http from "http";
import { Config, createAndInitApp } from "@foal/core";

// App
import { AppController } from "app/app.controller";
import { logger } from "app/lib/logger";

async function main() {
  const app = await createAndInitApp(AppController, {
    methods: {
      handleError: true
    }
  });
  const httpServer = http.createServer(app);
  const port = Config.get("port", 5000);
  httpServer.listen(port, () => {
    logger.info(`Listening on port ${port}...`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
