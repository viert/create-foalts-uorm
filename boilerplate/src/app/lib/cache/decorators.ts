import { getCache, createKey } from "./cache";
import { logger } from "../logger";
import { DEFAULT_CACHE_PREFIX, DEFAULT_CACHE_TTL_SEC } from "app/const";

export function CachedFunction(
  prefix: string = DEFAULT_CACHE_PREFIX,
  ttlSec: number = DEFAULT_CACHE_TTL_SEC
) {
  return function __decorate(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const targetName =
      target.constructor.name === "Function"
        ? `${target.name}#static`
        : target.constructor.name;
    if (
      descriptor.value &&
      descriptor.value.constructor.name === "AsyncFunction"
    ) {
      const origFunc = descriptor.value;
      descriptor.value = async function __decorated(
        ...args: any[]
      ): Promise<any> {
        const dt = Date.now();
        const cache = getCache();
        const cacheKey = createKey(
          prefix,
          `${targetName}.${propertyName}`,
          args
        );

        const cachedResult = await cache.get(cacheKey);
        if (cachedResult) {
          const dt2 = Date.now();
          logger.debug(`HIT ${cacheKey} ${dt2 - dt}ms`);
          return cachedResult;
        }
        const result = await origFunc(...args);
        await cache.set(cacheKey, result, ttlSec);
        const dt2 = Date.now();
        logger.debug(`MISS ${cacheKey} ${dt2 - dt}ms`);
        return result;
      };
    } else {
      throw new Error(
        "CachedFunction can only decorate async functions and methods"
      );
    }
  };
}
