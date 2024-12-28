import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./Slices/counterSlice";
import themeSlice from "./Slices/themeSlice";

const store = configureStore({
    reducer: {
        counter: counterSlice,
        theme: themeSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;