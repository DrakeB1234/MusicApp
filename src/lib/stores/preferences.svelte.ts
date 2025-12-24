import { PersistedState } from '$lib/stores/persistedState.svelte';

export interface UserPrefs {
  theme: 'dark' | 'light';
  volume: number;
}

class PreferencesStore extends PersistedState<UserPrefs> {
  constructor() {
    // Call extended class constructor, pass in defaults in no data is in localstorage
    super('user_prefs', { theme: 'dark', volume: 50 });
  }

  toggleTheme() {
    this.value.theme = this.value.theme === 'dark' ? 'light' : 'dark';
  }
}

export const preferences = new PreferencesStore();