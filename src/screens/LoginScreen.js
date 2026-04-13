import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";
import { useAlert } from "../context/AlertContext"; // ✅ NUEVO

export default function LoginScreen({ navigation }) {

  const { showAlert } = useAlert(); // ✅ ALERT GLOBAL

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

      const token = response.data;

      // 🔥 GUARDAR TOKEN
      await AsyncStorage.setItem("token", token);

      // 🔥 GUARDAR USERNAME
      await AsyncStorage.setItem("username", username);

      showAlert("Éxito", "Login correcto");

      navigation.replace("Main");

    } catch (error) {
      console.log("ERROR LOGIN:", error);

      showAlert(
        "Error",
        error.response?.data || "Usuario o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>PostreManiac</Text>
      <Text style={styles.subtitle}>
        Tus postres favoritos en un solo lugar
      </Text>

      <Text>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu usuario"
        value={username}
        onChangeText={setUsername}
      />

      <Text>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", fontWeight: "bold" },
  subtitle: { textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#E89AB0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 15, color: "pink" }
});