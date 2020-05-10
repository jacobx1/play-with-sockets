import React from "react";
import ReactDOM from "react-dom";
import { AppProvider } from "./hooks/appContext";
import App from "./containers/App";

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById("app")
);
