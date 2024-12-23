import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavigationState } from '../interfaces/navigation';

export const initialNavigationState: NavigationState = {
  activeComponent: null,
  activeSubComponent: null
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialNavigationState,
  reducers: {
    setActiveComponent: (state, action: PayloadAction<string | null>) => {
      state.activeComponent = action.payload;
    },
    setActiveSubComponent: (state, action) => {
      state.activeSubComponent = action.payload;
    }
  },
});

export const { setActiveComponent, setActiveSubComponent } = navigationSlice.actions;

export default navigationSlice.reducer;
