import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './state/index';

export default configureStore({
  reducer: {
    data: dataSlice,
  },
});