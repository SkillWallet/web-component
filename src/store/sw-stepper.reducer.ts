import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ActionPayload } from './action-payload';

export interface SwStepperState {
  currentStep: {
    activeStep: number;
    title: string;
    description: string;
    toPrevBtnPath: string;
    stepperText: string;
    descriptionTooltip: string;
  };
}

const initialState: SwStepperState = {
  currentStep: {} as any,
};

export const swStepperSlice = createSlice({
  name: 'swStepper',
  initialState,
  reducers: {
    setCurrentStep(state, action: ActionPayload<any>) {
      state.currentStep = action.payload;
    },
  },
});

export const { setCurrentStep } = swStepperSlice.actions;

export default swStepperSlice.reducer;
