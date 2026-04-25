import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { createProducto } from "../services/productService";
import { subirImagenFirebase } from "../services/imageService";
import { useAlert } from "../context/AlertContext";
import { ThemeContext } from "../context/ThemeContext";

export default function AddProductScreen({ navigation }) {

  const { showAlert, showConfirm } = useAlert();
  const { theme } = useContext(ThemeContext);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [estado, setEstado] = useState("DISPONIBLE");
  const [loading, setLoading] = useState(false);

  const hayCambios = () => {
    return (
      nombre.trim() ||
      descripcion.trim() ||
      precio ||
      stock ||
      imagen
    );
  };

  const handleBack = () => {
    if (hayCambios()) {
      return showConfirm(
        "Salir",
        "Tienes datos sin guardar, ¿deseas salir?",
        () => navigation.goBack()
      );
    }
    navigation.goBack();
  };

  const seleccionarImagen = async () => {
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permiso.granted) {
        showAlert("Permiso requerido", "Necesitamos acceso a tus fotos");
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7
      });

      if (!resultado.canceled && resultado.assets?.length > 0) {
        setImagen(resultado.assets[0].uri);
      }

    } catch (error) {
      showAlert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const soloNumeros = (text, setter) => {
    const limpio = text.replace(/[^0-9]/g, "");
    setter(limpio);
  };

  const handleGuardar = async () => {

    if (loading) return;

    if (!nombre.trim()) {
      return showAlert("Campo requerido", "Debes ingresar el nombre");
    }

    if (!descripcion.trim()) {
      return showAlert("Campo requerido", "Debes ingresar la descripción");
    }

    if (!precio || parseFloat(precio) <= 0) {
      return showAlert("Error", "El precio debe ser mayor a 0");
    }

    if (!stock || parseInt(stock) < 0) {
      return showAlert("Error", "Stock inválido");
    }

    if (!imagen) {
      return showAlert("Campo requerido", "Debes seleccionar una imagen");
    }

    try {
      setLoading(true);

      const urlImagen = await subirImagenFirebase(imagen);

      await createProducto({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen: urlImagen,
        estado
      });

      showAlert("Éxito", "Producto creado correctamente");
      navigation.navigate("Main", { refresh: true });

    } catch (error) {
      showAlert("Error", "No se pudo crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      {/* 🔥 HEADER LIMPIO */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={handleBack}
          style={[
            styles.backButton,
            { backgroundColor: theme.card }
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          Agregar Postre
        </Text>

      </View>

      <Text style={[styles.label, { color: theme.subtitle }]}>
        Imagen del Producto
      </Text>

      <TouchableOpacity
        style={[
          styles.imageBox,
          {
            backgroundColor: theme.card,
            borderColor: theme.border
          }
        ]}
        onPress={seleccionarImagen}
      >
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: theme.subtitle }}>
            Toca para subir imagen
          </Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.label, { color: theme.subtitle }]}>Nombre</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }
        ]}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Cheesecake"
        placeholderTextColor={theme.subtitle}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Descripción</Text>
      <TextInput
        style={[
          styles.input,
          {
            height: 100,
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }
        ]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholder="Describe el postre..."
        placeholderTextColor={theme.subtitle}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Precio</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }
        ]}
        keyboardType="numeric"
        value={precio}
        onChangeText={(text) => soloNumeros(text, setPrecio)}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Stock</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }
        ]}
        keyboardType="numeric"
        value={stock}
        onChangeText={(text) => soloNumeros(text, setStock)}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Estado</Text>

      <View style={styles.estadoContainer}>
        <TouchableOpacity
          style={[
            styles.estadoBtn,
            {
              backgroundColor:
                estado === "DISPONIBLE" ? theme.primary : theme.card,
              borderColor: theme.border
            }
          ]}
          onPress={() => setEstado("DISPONIBLE")}
        >
          <Text style={{
            color: estado === "DISPONIBLE" ? "#fff" : theme.text,
            fontWeight: "bold"
          }}>
            Disponible
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.estadoBtn,
            {
              backgroundColor:
                estado === "AGOTADO" ? theme.primary : theme.card,
              borderColor: theme.border
            }
          ]}
          onPress={() => setEstado("AGOTADO")}
        >
          <Text style={{
            color: estado === "AGOTADO" ? "#fff" : theme.text,
            fontWeight: "bold"
          }}>
            Agotado
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.primary }
        ]}
        onPress={handleGuardar}
      >
        <Text style={styles.buttonText}>
          {loading ? "Guardando..." : "Guardar"}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10
  },

  backButton: {
    padding: 10,
    borderRadius: 50
  },

  title: {
    fontSize: 24,
    fontWeight: "bold"
  },

  label: {
    marginBottom: 5,
    fontWeight: "500"
  },

  input: {
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1
  },

  imageBox: {
    height: 150,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1
  },

  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 15
  },

  estadoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15
  },

  estadoBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1
  },

  button: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});