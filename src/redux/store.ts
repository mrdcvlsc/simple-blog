import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import type { AuthState } from './authslice';

const LOCAL_STORAGE_AUTH_KEY = 'redux_auth';

function loadAuthFromStorage(): AuthState | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (!raw) {
      return undefined;
    }

    return JSON.parse(raw) as AuthState;
  } catch (err) {
    console.error('Could not load auth from storage', err);
    return undefined;
  }
}

const persisted = loadAuthFromStorage();

function saveAuthToStorage(value: AuthState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(value));
  } catch (err) {
    console.error('Could not save auth to storage', err);
  }
}

export const store = configureStore({
  reducer: {
    authReducer,
  },
  preloadedState: persisted ? { authReducer: { value: persisted } } : undefined,
});

let prev_auth_json = '';

store.subscribe(() => {
  try {
    const state = store.getState();
    const auth = state.authReducer.value as AuthState;
    const asJson = JSON.stringify(auth);
    if (asJson !== prev_auth_json) {
      saveAuthToStorage(auth);
      prev_auth_json = asJson;
    }
  } catch (err) {
    // do nothing for now
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;