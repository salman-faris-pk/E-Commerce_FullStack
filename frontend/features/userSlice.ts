import { backendUrl } from '@/app/page';
import { createSlice, PayloadAction , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  name: string;
  email: string;
  password: string;
  currentState: 'Login' | 'Sign Up';
  token:string
}

const initialState: AuthState = {
  name: '',
  email: '',
  password: '',
  currentState: 'Login',
  token:''
};



const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
      setCurrentState(state) {
      state.currentState = state.currentState === 'Login' ? 'Sign Up' : 'Login';
    },
    setToken(state, action: PayloadAction<string>){
      state.token = action.payload
    }
  },
  
});

export const {
  setName,
  setEmail,
  setPassword,
  setCurrentState,
  setToken
} = authSlice.actions;

export default authSlice.reducer;
