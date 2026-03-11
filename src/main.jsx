import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./redux/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <BrowserRouter>
                    <Toaster position="top-right" reverseOrder={false} />
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </StrictMode>
);
