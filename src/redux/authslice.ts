import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

type InitialState = {
  value: AuthState;
}

type AuthState = {
  user: User | null;
  isAuth: boolean;
}

const initialState = {
  value: {
    user: null,
    isAuth: false,
  } as AuthState
} as InitialState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (_, action: PayloadAction<User>) => {
      return {
        value: {
          user: action.payload,
          isAuth: true,
        }
      }
    }
  }
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;