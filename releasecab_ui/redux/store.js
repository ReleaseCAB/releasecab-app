import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null,
};

const persistConfig = {
  key: "releaseCABRoot",
  storage,
};

const resetReducer = (state, action) => {
  if (action.type === "RESET") {
    return initialState;
  }
  return state;
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    default:
      return state;
  }
};

const persistedReducer = persistReducer(
  persistConfig,
  userReducer,
  resetReducer,
);

let store;

// If we are in development mode and add the redux devtools.
// When we create reducers we need to add to both cases.
if (
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
} else {
  store = createStore(persistedReducer);
}

const persistor = persistStore(store);

export { store, persistor };
