import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../src/assets/scss/style.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import { compose, createStore } from "redux";
import reducers from "./redux/reducers/index";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const composeEnhancers =
    process.env.NODE_ENV === "development"
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : null || compose;

const store = createStore(reducers, composeEnhancers());

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
