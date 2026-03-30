import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import { createHashRouter, RouterProvider } from "react-router-dom";
import getRoutes from "./routes/index.jsx";

import { store } from "./store/store.js";
import { Provider } from "react-redux";

const router = createHashRouter(getRoutes());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
