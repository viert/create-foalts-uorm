import "module-alias/register";
import { User } from "./user.model";
import * as assert from "assert";
import {
  initRandomDatabases,
  dangerouslyDropDatabases
} from "app/lib/testing/testdb";

describe("User", () => {
  before(async () => {
    await initRandomDatabases();
  });

  after(async () => {
    await dangerouslyDropDatabases();
  });

  beforeEach(async () => {
    await User.destroyAll();
  });

  describe(".make()", () => {
    it("should not create without username and ext_id", () => {
      const user = User.make({});
      assert.strictEqual(user.isValid(), false);
      user.username = "test_user";
      assert.strictEqual(user.isValid(), false);
      user.ext_id = "test_ext_id";
      assert.strictEqual(user.isValid(), true);
    });
  });
});
