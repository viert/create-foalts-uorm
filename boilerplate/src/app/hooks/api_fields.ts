import { Hook, Context } from "@foal/core";

export function ApiFields(defaultFields: string[] | null = null) {
  return Hook(async (ctx: Context) => {
    if (!ctx.request.query._fields) {
      ctx["_fields"] = defaultFields;
    } else {
      const fields = ctx.request.query._fields.split(",");
      ctx["_fields"] = fields;
    }
  });
}
