import React, { useState, useContext, useEffect } from "react";
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

import { updateProducto } from "../services/productService";
import { subirImagenFirebase } from "../services/imageService";
import { useAlert } from "../context/AlertContext";
import { ThemeContext } from "../context/ThemeContext";

export default function EditProductScreen({ route, navigation }) {

  const { producto } = route.params;

  const { showAlert, showConfirm } = useAlert();
  const { theme } = useContext(ThemeContext);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [estado, setEstado] = useState("DISPONIBLE");
  const [loading, setLoading] = useState(false);

  // 🔥 CARGAR DATOS DEL PRODUCTO
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || "");
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio?.toString() || "");
      setStock(producto.stock?.toString() || "");
      setImagen(producto.imagen || null);
      setEstado(producto.estado || "DISPONIBLE");
    }
  }, []);

  // 🔥 DETECTAR CAMBIOS
  const hayCambios = () => {
    return (
      nombre !== producto.nombre ||
      descripcion !== producto.descripcion ||
      precio !== producto.precio?.toString() ||
      stock !== producto.stock?.toString() ||
      imagen !== producto.imagen ||
      estado !== producto.estado
    );
  };

  // 🔙 VOLVER CON CONFIRMACIÓN
  const handleBack = () => {
    if (hayCambios()) {
      return showConfirm(
        "Salir",
        "Tienes cambios sin guardar, ¿deseas salir?",
        () => navigation.goBack()
      );
    }
    navigation.goBack();
  };

  // 📸 SELECCIONAR IMAGEN
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

  // 💾 ACTUALIZAR PRODUCTO
  const handleActualizar = async () => {

    if (loading) return;

    if (!nombre.trim()) {
      return showAlert("Campo requerido", "Ingresa el nombre");
    }

    if (!descripcion.trim()) {
      return showAlert("Campo requerido", "Ingresa la descripción");
    }

    if (!precio || parseFloat(precio) <= 0) {
      return showAlert("Error", "Precio inválido");
    }

    if (!stock || parseInt(stock) < 0) {
      return showAlert("Error", "Stock inválido");
    }

    try {
      setLoading(true);

      let urlImagen = producto.imagen;

      // 🔥 SOLO SUBE SI CAMBIÓ
      if (imagen !== producto.imagen) {
        urlImagen = await subirImagenFirebase(imagen);
      }

      await updateProducto(producto.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen: urlImagen,
        estado: estado
      });

      showAlert("Éxito", "Producto actualizado");

      navigation.navigate("Main", { refresh: true });

    } catch (error) {
      showAlert("Error", "No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      {/* 🔥 HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          Editar Producto
        </Text>

      </View>

      <Text style={[styles.label, { color: theme.subtitle }]}>
        Imagen
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
            Toca para cambiar imagen
          </Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.label, { color: theme.subtitle }]}>Nombre</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100, backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Precio</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        keyboardType="numeric"
        value={precio}
        onChangeText={(t) => soloNumeros(t, setPrecio)}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Stock</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        keyboardType="numeric"
        value={stock}
        onChangeText={(t) => soloNumeros(t, setStock)}
      />

      <Text style={[styles.label, { color: theme.subtitle }]}>Estado</Text>

      <View style={styles.estadoContainer}>
        {["DISPONIBLE", "AGOTADO"].map((e) => (
          <TouchableOpacity
            key={e}
            style={[
              styles.estadoBtn,
              {
                backgroundColor: estado === e ? theme.primary : theme.card,
                borderColor: theme.border
              }
            ]}
            onPress={() => setEstado(e)}
          >
            <Text style={{
              color: estado === e ? "#fff" : theme.text,
              fontWeight: "bold"
            }}>
              {e}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.primary },
          loading && { opacity: 0.6 }
        ]}
        onPress={handleActualizar}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Actualizando..." : "Actualizar"}
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
    marginBottom: 20
  },

  backButton: {
    padding: 10,
    borderRadius: 50,
    marginRight: 10
  },

  title: {
    fontSize: 22,
    fontWeight: "bold"
  },

  label: {
    marginBottom: 5
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