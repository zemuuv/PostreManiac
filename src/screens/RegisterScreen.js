import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { register } from "../services/authService";
import { useAlert } from "../context/AlertContext";
import { ThemeContext } from "../context/ThemeContext"; // 🔥 NUEVO

export default function RegisterScreen({ navigation }) {

  const { showAlert } = useAlert();
  const { theme } = useContext(ThemeContext); // 🔥 NUEVO

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {

    if (!username.trim()) {
      return showAlert("Campo requerido", "Ingresa tu nombre");
    }

    if (!email.trim()) {
      return showAlert("Campo requerido", "Ingresa tu correo");
    }

    if (!password.trim()) {
      return showAlert("Campo requerido", "Ingresa tu contraseña");
    }

    if (password !== confirmPassword) {
      return showAlert("Error", "Las contraseñas no coinciden");
    }

    try {

      await register({
        username,
        email,
        password,
        confirmPassword
      });

      showAlert("Éxito", "Usuario registrado correctamente 🎉");

      navigation.navigate("Login");

    } catch (error) {
      showAlert(
        "Error",
        error.response?.data || "Error al registrar"
      );
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
        Crear Cuenta
      </Text>

      <Text style={[
        styles.subtitle,
        { color: theme.subtitle }
      ]}>
        Únete a nuestra comunidad dulce
      </Text>

      <Text style={{ color: theme.text }}>Nombre</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
        placeholder="Ingresa tu nombre"
        placeholderTextColor={theme.subtitle}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={{ color: theme.text }}>Correo</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
        placeholder="Ingresa tu correo"
        placeholderTextColor={theme.subtitle}
        value={email}
        onChangeText={setEmail}
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

      <Text style={{ color: theme.text }}>Confirmar contraseña</Text>
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
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.primary }
        ]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[
          styles.link,
          { color: theme.primary }
        ]}>
          ¿Ya tienes cuenta? Inicia sesión
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