import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { register } from "../services/authService";

export default function RegisterScreen({ navigation }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    try {

      await register({
        username,
        email,
        password,
        confirmPassword
      });

      Alert.alert("Éxito", "Usuario registrado");

      navigation.navigate("Login");

    } catch (error) {
      Alert.alert("Error", error.response?.data || "Error al registrar");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Únete a nuestra comunidad dulce</Text>

      <Text>Nombre</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text>Correo</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text>Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text>Confirmar contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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