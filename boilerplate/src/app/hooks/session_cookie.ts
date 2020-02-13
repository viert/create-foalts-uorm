import uuid4 from "uuid/v4";
import {
  Hook,
  ServiceManager,
  Context,
  Config,
  HttpResponse
} from "@foal/core";
import { SessionService, Session } from "app/services";
import { logger } from "app/lib/logger";

const sessionCookie = Config.get<string>("session_cookie_name");
const sessionExpiration =
  Config.get<number>("session_expiration_days", 14) * 86400000;

logger.info(
  `Session cookie name set to ${sessionCookie}, expired in ${sessionExpiration /
    1000 /
    86400} days`
);

export const SessionCookie = Hook(
  async (ctx: Context, services: ServiceManager) => {
    const sessionsService = services.get(SessionService);
    let sid = ctx.request.cookies[sessionCookie];
    let session: Session | null = null;

    if (sid) {
      let dbSession = await sessionsService.getSession(sid);
      if (dbSession) {
        session = {
          sid: sid,
          data: dbSession.data,
          modified: false,
          expiration: dbSession.expiration
        };
      }
    }

    if (!session) {
      session = {
        sid: uuid4(),
        data: {},
        modified: true,
        expiration: new Date(Date.now() + sessionExpiration)
      };
    }

    ctx["s"] = session;

    return async (response: HttpResponse) => {
      session = ctx["s"];
      if (session) {
        if (session.modified) {
          await sessionsService.saveSession(session);
        }
        response.setCookie(sessionCookie, session.sid);
      }
    };
  }
);
