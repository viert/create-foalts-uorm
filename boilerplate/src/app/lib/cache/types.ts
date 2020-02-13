export interface CacheAdapter {
  init(options: { [key: string]: any }): Promise<boolean>;
  has(key: string): Promise<boolean>;
  get(key: string): Promise<any>;
  set(key: string, value: any, ttlSec: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
}
