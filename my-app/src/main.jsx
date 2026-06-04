import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WishlistProvider } from "./Pages/user/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </AuthProvider>
  </React.StrictMode>
);