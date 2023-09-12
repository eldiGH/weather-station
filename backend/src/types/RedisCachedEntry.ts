export interface RedisCachedEntry<T = unknown> {
  timestamp: string;
  data: T;
}
