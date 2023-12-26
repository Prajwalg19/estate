import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducers = combineReducers({ user: userReducer });
const persistConfig = {
  key: "current_user",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
