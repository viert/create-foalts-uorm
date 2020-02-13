import { db } from "uorm";
import { logger } from "../logger";

export async function initRandomDatabases() {
  function randomString() {
    return (
      Math.random()
        .toString(36)
        .substr(2, 15) +
      Math.random()
        .toString(36)
        .substr(2, 15)
    );
  }

  const uri = "mongodb://localhost";
  const options = { useUnifiedTopology: true };
  await db.init({
    meta: {
      uri,
      options,
      dbname: randomString()
    },
    shards: {
      s1: {
        uri,
        options,
        dbname: randomString()
      },
      s2: {
        uri,
        options,
        dbname: randomString()
      },
      s3: {
        uri,
        options,
        dbname: randomString()
      },
      s4: {
        uri,
        options,
        dbname: randomString()
      }
    }
  });
  logger.debug(`initialized database ${db.meta().db().databaseName} as meta`);

  for (const shardId of ["s1", "s2", "s3", "s4"]) {
    logger.debug(
      `initialized database ${
        db.getShard(shardId).db().databaseName
      } as ${shardId}`
    );
  }
}

export async function dangerouslyDropDatabases() {
  logger.debug(`dropping database ${db.meta().db().databaseName}`);
  await db
    .meta()
    .db()
    .dropDatabase();
  for (const shardId of ["s1", "s2", "s3", "s4"]) {
    const shard = db.getShard(shardId);
    logger.debug(`dropping database ${shard.db().databaseName}`);
    await shard.db().dropDatabase();
  }
}
