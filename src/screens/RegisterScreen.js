import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { register } from "../services/authService";
import { useAlert } from "../context/AlertContext"; // ✅ NUEVO

export default function RegisterScreen({ navigation }) {

  const { showAlert } = useAlert(); // ✅ ALERT GLOBAL

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {

    // 🔥 VALIDACIONES
    if (!username.trim()) {
      return showAlert("Campo requerido", "Ingresa tu nombre", "warning");
    }

    if (!email.trim()) {
      return showAlert("Campo requerido", "Ingresa tu correo", "warning");
    }

    if (!password.trim()) {
      return showAlert("Campo requerido", "Ingresa tu contraseña", "warning");
    }

    if (password !== confirmPassword) {
      return showAlert("Error", "Las contraseñas no coinciden", "error");
    }

    try {

      await register({
        username,
        email,
        password,
        confirmPassword
      });

      showAlert("Éxito", "Usuario registrado correctamente", "success");

      navigation.navigate("Login");

    } catch (error) {
      showAlert(
        "Error",
        error.response?.data || "Error al registrar",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Únete a nuestra comunidad dulce</Text>

      <Text>Nombre</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text>Correo</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

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
        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
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