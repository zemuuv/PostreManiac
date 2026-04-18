import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import TabNavigator from "./TabNavigator";
import AddProductScreen from "../screens/AddProductScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import EditProductScreen from "../screens/EditProductScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login" // 🔥 siempre inicia en login
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right"
      }}
    >

      {/* 🔐 AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* 🔥 APP PRINCIPAL */}
      <Stack.Screen name="Main" component={TabNavigator} />

      {/* 📦 DETALLE PRODUCTO */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ animation: "fade" }}
      />

      {/* ➕ AGREGAR PRODUCTO */}
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ presentation: "modal" }}
      />

      {/* ✏️ EDITAR PRODUCTO */}
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ presentation: "modal" }}
      />

    </Stack.Navigator>
  );
}