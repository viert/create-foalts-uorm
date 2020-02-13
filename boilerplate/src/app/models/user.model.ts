import {
  StorableModel,
  StringField,
  ObjectIdField,
  ArrayField,
  NumberField,
  DatetimeField,
  BooleanField,
  AsyncComputed
} from "uorm";
import { ObjectID } from "bson";
import { Token } from "./token.model";
import { ApiError, NotFound } from "app/lib/errors";
import { Config } from "@foal/core";

export class User extends StorableModel {
  @StringField({ required: true }) ext_id: string;
  @StringField({ required: true }) username: string;
  @StringField() email: string;
  @StringField() first_name: string;
  @StringField() last_name: string;
  @DatetimeField({ defaultValue: () => new Date() }) created_at: Date;
  @DatetimeField({ defaultValue: () => new Date() }) updated_at: Date;
  @BooleanField({ defaultValue: false }) supervisor: boolean;

  static __key_field__ = "username";
  static __collection__ = "user";

  async getAuthToken(): Promise<string> {
    let token = await Token.findOne({ user_id: this._id });
    if (!token) {
      token = Token.make({
        user_id: this._id
      });
      await token.save();
    }
    return token.token;
  }

  get full_name() {
    let fn = `${this.first_name} ${this.last_name}`.trim();
    if (fn === "") fn = this.username;
    return fn;
  }

  touch() {
    this.updated_at = new Date();
  }

  async _before_save() {
    this.touch();
  }
}
