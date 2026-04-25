import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";
import { useAlert } from "../context/AlertContext";
import { ThemeContext } from "../context/ThemeContext";
import { CartContext } from "../context/cartContext"; // ✅ IMPORT NUEVO

export default function LoginScreen({ navigation, setIsLogged }) {

  const { showAlert } = useAlert();
  const { theme } = useContext(ThemeContext);
  const { limpiarCarrito } = useContext(CartContext); // ✅ CONTEXTO DEL CARRITO

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (loading) return;

    if (!username.trim()) {
      return showAlert("Campo requerido", "Ingresa tu usuario");
    }

    if (!password.trim()) {
      return showAlert("Campo requerido", "Ingresa tu contraseña");
    }

    try {
      setLoading(true);

      const response = await login({ username, password });

      const { token, email, rol, username: userFromBackend } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("username", userFromBackend || username);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("rol", rol);

      // 🧹 LIMPIAR CARRITO AL CAMBIAR DE USUARIO
      limpiarCarrito();

      showAlert("Éxito", "Login correcto 🎉");

      navigation.replace("Main");

    } catch (error) {

      showAlert(
        "Error",
        error.response?.data || "Usuario o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      <Text style={[
        styles.title,
        { color: theme.text }
      ]}>
        PostreManiac
      </Text>

      <Text style={[
        styles.subtitle,
        { color: theme.subtitle }
      ]}>
        Tus postres favoritos en un solo lugar
      </Text>

      <Text style={{ color: theme.text }}>Usuario</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
        placeholder="Ingresa tu usuario"
        placeholderTextColor={theme.subtitle}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={{ color: theme.text }}>Contraseña</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
        placeholder="********"
        placeholderTextColor={theme.subtitle}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.primary },
          loading && { opacity: 0.6 }
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[
          styles.link,
          { color: theme.primary }
        ]}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold"
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15
  },

  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  link: {
    textAlign: "center",
    marginTop: 15
  }
});