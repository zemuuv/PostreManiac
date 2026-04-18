import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [themeMode, setThemeMode] = useState("light");

  // 🎨 TEMAS
  const themes = {
    light: {
      background: "#F8F6F7",
      card: "#FFFFFF",
      text: "#333",
      subtitle: "#777",
      border: "#EADBC8",
      primary: "#E89AB0"
    },

    darkBlue: {
      background: "#1E2A38",
      card: "#2A3A4D",
      text: "#EAF4FF",
      subtitle: "#AFC4D6",
      border: "#3E5C76",
      primary: "#7FB3D5"
    },

    pink: {
      background: "#FFF0F5",
      card: "#FFE4EC",
      text: "#5A3E36",
      subtitle: "#A67C7C",
      border: "#F5C6D6",
      primary: "#E89AB0"
    },

    green: {
      background: "#F0FFF4",
      card: "#DFF5E1",
      text: "#2F4F4F",
      subtitle: "#6B8E6B",
      border: "#BDE5C8",
      primary: "#66BB6A"
    }
  };

  // 🔥 Cargar tema guardado
  useEffect(() => {
    cargarTema();
  }, []);

  const cargarTema = async () => {
    const savedTheme = await AsyncStorage.getItem("theme");
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  };

  // 🔥 Guardar tema
  const cambiarTema = async (mode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem("theme", mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeMode],
        themeMode,
        setThemeMode: cambiarTema // 🔥 ESTA ES LA CLAVE
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};