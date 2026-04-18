import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAlert } from "../context/AlertContext";
import { ThemeContext } from "../context/ThemeContext";
import { getUserRole, logout } from "../utils/auth";

export default function PerfilScreen({ navigation, setIsLogged }) {

  const { showAlert } = useAlert();
  const { theme, themeMode, setThemeMode } = useContext(ThemeContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const user = await AsyncStorage.getItem("username");
      const userEmail = await AsyncStorage.getItem("email");
      const userRole = await getUserRole();

      setUsername(user || "No disponible");
      setEmail(userEmail || "No disponible");
      setRol(userRole || "USER");

    } catch (error) {
      console.log(error);
      showAlert("Error", "No se pudieron cargar los datos");
    }
  };

  // 🔥 LOGOUT REAL
  const cerrarSesion = () => {
    showAlert(
      "Cerrar sesión",
      "¿Estás seguro?",
      "warning",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          onPress: async () => {
            await logout();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  const ThemeButton = ({ mode, label, color }) => (
    <TouchableOpacity
      style={[
        styles.themeButton,
        {
          backgroundColor: color,
          borderWidth: 2,
          borderColor: themeMode === mode ? "#000000a2" : "#000000a2"
        }
      ]}
      onPress={() => setThemeMode(mode)}
    >
      <Text style={styles.themeText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      <Text style={[
        styles.title,
        { color: theme.text }
      ]}>
        Mi Perfil
      </Text>

      <View style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}>

        <Text style={[styles.label, { color: theme.subtitle }]}>
          Username
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {username}
        </Text>

        <Text style={[styles.label, { color: theme.subtitle }]}>
          Email
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {email}
        </Text>

        <Text style={[styles.label, { color: theme.subtitle }]}>
          Rol
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {rol}
        </Text>

      </View>

      <View style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}>

        <Text style={[styles.label, { color: theme.subtitle }]}>
          Tema de la aplicación
        </Text>

        <View style={styles.themeContainer}>
          <ThemeButton mode="light" color="#F8F6F7" />
          <ThemeButton mode="darkBlue" color="#1E2A38" />
          <ThemeButton mode="pink" color="#E89AB0" />
          <ThemeButton mode="green" color="#A8E6CF" />
        </View>

      </View>

      <TouchableOpacity
        style={[
          styles.logout,
          { backgroundColor: theme.primary }
        ]}
        onPress={cerrarSesion}
      >
        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
    borderWidth: 1
  },

  label: {
    fontWeight: "bold",
    marginTop: 10
  },

  value: {
    marginBottom: 5
  },

  themeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },

  themeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: "center"
  },

  themeText: {
    color: "#fff",
    fontWeight: "bold",

    // 🔥 BORDE NEGRO SIMULADO
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  logout: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center"
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold"
  }
});