import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { CartProvider } from "./src/context/cartContext";
import { AlertProvider } from "./src/context/AlertContext"; 
import { ThemeProvider } from "./src/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AlertProvider> 
        <CartProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}