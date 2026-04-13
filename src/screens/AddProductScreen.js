import React, { useState } from "react";
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
import { createProducto } from "../services/productService";
import { subirImagenFirebase } from "../services/imageService";
import { useAlert } from "../context/AlertContext"; // ✅ NUEVO

export default function AddProductScreen({ navigation }) {

  const { showAlert } = useAlert(); // ✅ HOOK GLOBAL

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [estado, setEstado] = useState("DISPONIBLE");
  const [loading, setLoading] = useState(false);

  // 📸 Seleccionar imagen
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
      console.log("Error seleccionando imagen:", error);
      showAlert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const soloNumeros = (text, setter) => {
    const limpio = text.replace(/[^0-9]/g, "");
    setter(limpio);
  };

  // 💾 Guardar producto
  const handleGuardar = async () => {

    if (loading) return;

    if (!nombre.trim()) {
      return showAlert("Campo requerido", "Debes ingresar el nombre del producto");
    }

    if (!descripcion.trim()) {
      return showAlert("Campo requerido", "Debes ingresar la descripción");
    }

    if (!precio || parseFloat(precio) <= 0) {
      return showAlert("Error", "El precio debe ser mayor a 0");
    }

    if (!stock || parseInt(stock) < 0) {
      return showAlert("Error", "El stock no puede ser negativo");
    }

    if (!imagen) {
      return showAlert("Campo requerido", "Debes seleccionar una imagen");
    }

    try {
      setLoading(true);

      const urlImagen = await subirImagenFirebase(imagen);

      if (!urlImagen) {
        throw new Error("No se obtuvo URL de la imagen");
      }

      await createProducto({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen: urlImagen,
        estado: estado
      });

      showAlert("Éxito", "Producto creado correctamente");

      navigation.navigate("Main", { refresh: true });

    } catch (error) {
      console.log("ERROR:", error);
      showAlert("Error", "No se pudo crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Agregar Postre</Text>

      <Text style={styles.label}>Imagen del Producto</Text>

      <TouchableOpacity style={styles.imageBox} onPress={seleccionarImagen}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: "#999" }}>Toca para subir imagen</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Cheesecake de Fresa"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholder="Describe el postre..."
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precio}
        onChangeText={(text) => soloNumeros(text, setPrecio)}
        placeholder="Ej: 12000"
      />

      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={stock}
        onChangeText={(text) => soloNumeros(text, setStock)}
        placeholder="Ej: 10"
      />

      <Text style={styles.label}>Estado</Text>

      <View style={styles.estadoContainer}>
        <TouchableOpacity
          style={[
            styles.estadoBtn,
            estado === "DISPONIBLE" && styles.estadoActivo
          ]}
          onPress={() => setEstado("DISPONIBLE")}
        >
          <Text style={[
            styles.estadoText,
            estado === "DISPONIBLE" && styles.estadoActivoText
          ]}>
            Disponible
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.estadoBtn,
            estado === "AGOTADO" && styles.estadoActivo
          ]}
          onPress={() => setEstado("AGOTADO")}
        >
          <Text style={[
            styles.estadoText,
            estado === "AGOTADO" && styles.estadoActivoText
          ]}>
            Agotado
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleGuardar}
        disabled={loading}
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
    padding: 20,
    backgroundColor: "#F8F6F7"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },

  label: {
    marginBottom: 5,
    fontWeight: "500"
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15
  },

  imageBox: {
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd"
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
    backgroundColor: "#eee",
    alignItems: "center",
    marginHorizontal: 5
  },

  estadoActivo: {
    backgroundColor: "#E89AB0"
  },

  estadoText: {
    fontWeight: "bold",
    color: "#333"
  },

  estadoActivoText: {
    color: "#fff"
  },

  button: {
    backgroundColor: "#E89AB0",
    padding: 15,
    borderRadius: 15,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});