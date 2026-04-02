import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// 🔥 NUEVO
import TabNavigator from "./TabNavigator";
import AddProductScreen from "../screens/AddProductScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">

      {/* 🔐 AUTENTICACIÓN */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />

      {/* 🔥 APP PRINCIPAL (tabs abajo) */}
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* ➕ Pantalla secundaria */}
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: "Agregar Postre" }}
      />

    </Stack.Navigator>
  );
}