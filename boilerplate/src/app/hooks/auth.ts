import { Hook, Context, ServiceManager } from "@foal/core";
import { Session } from "app/services";
import { User } from "app/models";
import { AuthenticationError } from "app/lib/errors";

export function Auth(userRequired: boolean = true) {
  return Hook(async (ctx: Context, services: ServiceManager) => {
    let user: User | null = null;
    const session: Session = ctx["s"];

    if ("user_id" in session.data) {
      user = await User.findOne({ _id: session.data["user_id"] });
    }

    if (!user && userRequired) {
      throw new AuthenticationError();
    }

    ctx["u"] = user;
  });
}
