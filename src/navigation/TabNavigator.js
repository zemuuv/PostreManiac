import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CatalogScreen from "../screens/CatalogScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // 🎨 Estilo de la barra
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10
        },

        // 🎨 Colores
        tabBarActiveTintColor: "#E89AB0",
        tabBarInactiveTintColor: "#999",

        // 🔥 Iconos dinámicos
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Catalogo") {
            iconName = focused ? "home" : "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen
        name="Catalogo"
        component={CatalogScreen}
        options={{
          tabBarLabel: "Inicio"
        }}
      />
    </Tab.Navigator>
  );
}