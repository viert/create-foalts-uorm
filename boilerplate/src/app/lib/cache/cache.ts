import crypto from "crypto";
import { Config } from "@foal/core";
import { CacheAdapter } from "./types";
import { SimpleCacheAdapter } from "./simple_adapter";
import { MemcachedCacheAdapter } from "./memcached_adapter";

const cacheTypeMap = {
  simple: SimpleCacheAdapter,
  memcached: MemcachedCacheAdapter
};

const local: {
  cache: CacheAdapter | null;
} = { cache: null };

export function getCache(): CacheAdapter {
  const { cache } = local;
  if (!cache) {
    throw new Error("cache is not initialized");
  }
  return cache;
}

export async function initCache() {
  const cacheType = Config.get<string>("cache.type", "simple");
  const cacheOptions = Config.get<{ [key: string]: any }>("cache.options", {});
  if (!(cacheType in cacheTypeMap)) {
    throw new Error(
      `Configuration error, cache type "${cacheType}" does not exist`
    );
  }
  const Adapter = cacheTypeMap[cacheType];
  const cache = new Adapter();
  await cache.init(cacheOptions);
  local.cache = cache;
}

export function createKey(
  prefix: string,
  funcName: string,
  args: any[]
): string {
  let argsHash = "";
  if (args.length) {
    let hash = crypto.createHash("md5");
    args.forEach(arg => {
      hash.update(arg.toString());
    });
    argsHash = hash.digest("hex");
  }
  return `${prefix}.${funcName}(${argsHash})`;
}
