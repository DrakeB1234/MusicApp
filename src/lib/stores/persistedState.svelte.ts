import { browser } from '$app/environment';

export class PersistedState<T> {
  value = $state<T>() as T;
  key: string;

  constructor(key: string, initialValue: T) {
    this.key = key;
    this.value = initialValue;

    if (browser) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          this.value = JSON.parse(item);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
          this.value = initialValue;
        }
      }

      $effect.root(() => {
        $effect(() => {
          localStorage.setItem(this.key, JSON.stringify(this.value));
        });
      });
    }
  }

  // If data were to be reset, set to default data.
  reset(defaultValue?: T) {
    if (defaultValue !== undefined) {
      this.value = defaultValue;
    }
  }
}