import { ObjectID } from "bson";
import uuid4 from "uuid/v4";
import {
  StorableModel,
  StringField,
  AsyncComputed,
  ObjectIdField,
  DatetimeField
} from "uorm";
import { User } from "./user.model";

export class Token extends StorableModel {
  @StringField({ required: true, defaultValue: "auth" }) type: string;
  @StringField({ required: true, defaultValue: uuid4 }) token: string;
  @ObjectIdField({ required: true }) user_id: ObjectID;
  @DatetimeField({ defaultValue: Date }) created_at: Date;
  @DatetimeField({ defaultValue: Date }) updated_at: Date;

  static __collection__ = "token";
  static __key_field__ = "token";

  touch() {
    this.created_at = new Date();
  }

  async _before_save() {
    this.touch();
    this.invalidate();
  }

  async _before_delete() {
    this.invalidate();
  }

  @AsyncComputed()
  async user(): Promise<User | null> {
    return await User.findOne({ _id: this.user_id });
  }
}
