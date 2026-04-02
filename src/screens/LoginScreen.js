import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const response = await login({ username, password });

    const token = response.data;

    await AsyncStorage.setItem("token", token);

    Alert.alert("Éxito", "Login correcto");

    // ✅ REDIRECCIÓN
    navigation.replace("Main");

  } catch (error) {
    Alert.alert("Error", error.response?.data || "Error al iniciar sesión");
  }
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>PostreManiac</Text>
      <Text style={styles.subtitle}>Tus postres favoritos en un solo lugar</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
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