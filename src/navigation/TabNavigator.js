import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CatalogScreen from "../screens/CatalogScreen";
import CartScreen from "../screens/CartScreen";
import AdminOrdersScreen from "../screens/AdminOrdersScreen";
import UserOrdersScreen from "../screens/UserOrdersScreen"; // 🔥 NUEVO

import { getUserRole } from "../utils/auth";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const [role, setRole] = useState(null);

  useEffect(() => {
    cargarRol();
  }, []);

  const cargarRol = async () => {
    const userRole = await getUserRole();
    setRole(userRole);
  };

  if (role === null) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10
        },

        tabBarActiveTintColor: "#E89AB0",
        tabBarInactiveTintColor: "#999",

        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Catalogo") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Carrito") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Pedidos") {
            iconName = focused ? "receipt" : "receipt-outline"; // 🔥 NUEVO ICONO
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >

      {/* 🏠 CATÁLOGO */}
      <Tab.Screen
        name="Catalogo"
        component={CatalogScreen}
        options={{ tabBarLabel: "Inicio" }}
      />

      {/* 🛒 CARRITO */}
      <Tab.Screen
        name="Carrito"
        component={CartScreen}
        options={{ tabBarLabel: "Carrito" }}
      />

      {/* 👑 ADMIN */}
      {role === "ADMIN" && (
        <Tab.Screen
          name="Pedidos"
          component={AdminOrdersScreen}
          options={{ tabBarLabel: "Pedidos" }}
        />
      )}

      {/* 👤 USUARIO */}
      {role !== "ADMIN" && (
        <Tab.Screen
          name="Pedidos"
          component={UserOrdersScreen}
          options={{ tabBarLabel: "Mis pedidos" }}
        />
      )}

    </Tab.Navigator>
  );
}