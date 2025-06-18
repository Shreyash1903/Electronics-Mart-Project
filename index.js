import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext"; // NEW
import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace this with your actual client ID
const GOOGLE_CLIENT_ID = "505211776659-b0lhausckinpi9jfdd1i908bdm2h9idj.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <CartProvider>
      <WishlistProvider> {/* Wrap App with WishlistProvider */}
        <App />
      </WishlistProvider>
    </CartProvider>
  </GoogleOAuthProvider>
);
