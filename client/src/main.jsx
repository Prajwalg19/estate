import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.js";
ReactDOM.createRoot(document.getElementById("root")).render(
    <PersistGate persistor={persistor} loading={null}>
        <Provider store={store}>
            <App />
        </Provider>
    </PersistGate>
);
