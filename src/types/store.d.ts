declare module 'store' {
    interface Store {
      get<T = unknown>(key: string): T | undefined;
      set<T = unknown>(key: string, value: T): void;
      remove(key: string): void;
      clearAll(): void;
    }
  
    const store: Store;
    export default store;
  }
  