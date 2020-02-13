import { Collection } from "mongodb";
import { db } from "uorm";
import { Nullable } from "uorm/dist/util";

export interface Session {
  sid: string;
  data: { [key: string]: any };
  modified: boolean;
  expiration: Date;
}

export class SessionService {
  private _coll: Collection;
  private get coll(): Collection {
    if (!this._coll) {
      this._coll = db
        .meta()
        .db()
        .collection("sessions");
    }
    return this._coll;
  }

  async getSession(sid: string): Promise<Nullable<Session>> {
    const record = await this.coll.findOne({ sid: sid });
    if (!record) return null;
    if (record.expiration.getTime() > Date.now()) {
      return {
        sid: record.sid,
        data: record.data,
        modified: false,
        expiration: record.expiration
      };
    }
    await this.coll.deleteOne({ _id: record["_id"] });
    return null;
  }

  async saveSession(session: Session) {
    await this.coll.replaceOne(
      { sid: session.sid },
      { sid: session.sid, data: session.data, expiration: session.expiration },
      { upsert: true }
    );
  }
}
