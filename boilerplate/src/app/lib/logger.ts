import { Config } from "@foal/core";
import { createLogger, format, transports } from "winston";

const appLogFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const loglevel = Config.get<string>("log.level", "info");
const logfile = Config.get<string>("log.file");
const logconsole = Config.get<boolean>("log.console", true);

let tr: any[] = [];
if (logconsole) {
  tr.push(new transports.Console());
}
if (logfile) {
  tr.push(new transports.File({ filename: logfile }));
}

export const logger = createLogger({
  format: format.combine(format.timestamp(), appLogFormat),
  transports: tr,
  level: loglevel
});
