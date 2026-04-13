import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { CartProvider } from "./src/context/cartContext";
import { AlertProvider } from "./src/context/AlertContext"; // 🔥 IMPORTANTE

export default function App() {
  return (
    <AlertProvider> {/* 🔥 ALERT GLOBAL */}
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </AlertProvider>
  );
}