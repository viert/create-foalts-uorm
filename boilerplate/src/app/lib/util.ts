import { Nullable } from "uorm/dist/util";

export function genderify(male: string, female: string, sex: Nullable<string>) {
  if (sex === "female") return female;
  return male;
}
