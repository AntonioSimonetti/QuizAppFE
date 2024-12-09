import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavigationState } from '../interfaces/navigation';

const initialState: NavigationState = {
  activeComponent: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveComponent: (state, action: PayloadAction<string | null>) => {
      state.activeComponent = action.payload;
    },
  },
});

export const { setActiveComponent } = navigationSlice.actions;

export default navigationSlice.reducer;
