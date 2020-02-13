import { CacheAdapter } from "./types";
import Memcached from "memcached";

export class MemcachedCacheAdapter implements CacheAdapter {
  private memcached: Memcached;
  async init(options: { [key: string]: any }): Promise<boolean> {
    let { servers } = options;
    if (!servers) {
      throw new Error(
        "Configuration error, option 'servers' is mandatory for memcached-based cache"
      );
    }
    delete options["servers"];
    this.memcached = new Memcached(servers, options);
    return true;
  }

  async get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.memcached.get(key, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  async set(key: string, value: any, ttlSec: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.memcached.set(key, value, ttlSec, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  async delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.memcached.del(key, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}
