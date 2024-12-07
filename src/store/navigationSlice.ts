import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  activeComponent: string | null; // Può essere "Homepage", "YourQuizzes", ecc.
}

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
