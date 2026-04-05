import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import TabNavigator from "./TabNavigator";
import AddProductScreen from "../screens/AddProductScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
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
        options={{
          animation: "fade" // 🔥 más elegante
        }}
      />

      {/* ➕ AGREGAR PRODUCTO */}
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          presentation: "modal" // 🔥 se abre como modal tipo app moderna
        }}
      />

    </Stack.Navigator>
  );
}