import { CacheAdapter } from "./types";
import { logger } from "../logger";

class ExpirableValue<T> {
  private expiresAt: number;
  constructor(public value: T, ttlSec: number) {
    this.expiresAt = Date.now() + ttlSec * 1000;
  }
  get expired(): boolean {
    return Date.now() > this.expiresAt;
  }
}

export class SimpleCacheAdapter implements CacheAdapter {
  private static _store: { [key: string]: ExpirableValue<any> } = {};
  private options: { [key: string]: any };

  async init(options: { [key: string]: any }): Promise<boolean> {
    this.options = options;
    return true;
  }

  async has(key: string): Promise<boolean> {
    return (
      key in SimpleCacheAdapter._store &&
      !SimpleCacheAdapter._store[key].expired
    );
  }

  async get(key: string): Promise<any> {
    const item = SimpleCacheAdapter._store[key];
    if (!item) {
      return null;
    }
    if (item.expired) {
      delete SimpleCacheAdapter._store[key];
      return null;
    }
    return item.value;
  }

  async set(key: string, value: any, ttlSec: number = 600): Promise<boolean> {
    const item = new ExpirableValue(value, ttlSec);
    SimpleCacheAdapter._store[key] = item;
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const dt = Date.now();
    if (!(await this.has(key))) return false;
    const item = SimpleCacheAdapter._store[key];
    delete SimpleCacheAdapter._store[key];
    const dt2 = Date.now();
    logger.debug(`DELETE ${key} ${dt2 - dt}ms`);
    return !item.expired;
  }
}
