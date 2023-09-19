import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = { key: "root", storage: AsyncStorage };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
