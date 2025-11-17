type CacheEntry<T> = {
  data: T;
  timestamp: number;
  tags?: string[];
};

export const CACHE_TAGS = {
  CHAPTERS: 'chapters',
  LESSONS: 'lessons',
  TESTS: 'tests',
  RESOURCES: 'resources',
  USER: 'user',
  RESULTS: 'results',
} as const;

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private ttl: number;
  private tags: Map<string, Set<string>> = new Map();

  constructor(ttl: number = 300000) { // 5 minutes default
    this.ttl = ttl;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return (Date.now() - entry.timestamp) > this.ttl;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.invalidateKey(key);
      return null;
    }
    return entry.data;
  }

  set<T>(key: string, data: T, tags: string[] = []): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      tags
    };

    this.cache.set(key, entry);
    
    tags.forEach(tag => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)?.add(key);
    });
  }

  private invalidateKey(key: string): void {
    const entry = this.cache.get(key);
    if (entry?.tags) {
      entry.tags.forEach(tag => {
        const tagSet = this.tags.get(tag);
        if (tagSet) {
          tagSet.delete(key);
          if (tagSet.size === 0) {
            this.tags.delete(tag);
          }
        }
      });
    }
    this.cache.delete(key);
  }

  invalidateByTag(tag: string): void {
    const keys = this.tags.get(tag);
    if (keys) {
      keys.forEach(key => this.invalidateKey(key));
      this.tags.delete(tag);
    }
  }

  invalidateByTags(tags: string[]): void {
    tags.forEach(tag => this.invalidateByTag(tag));
  }

  clear(): void {
    this.cache.clear();
    this.tags.clear();
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats(): { size: number; tagCount: number } {
    return {
      size: this.cache.size,
      tagCount: this.tags.size
    };
  }
}

export const cacheService = new CacheService();