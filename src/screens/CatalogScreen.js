import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getProductos } from "../services/productService";
import { getUserRole } from "../utils/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function CatalogScreen({ navigation }) {

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [role, setRole] = useState(null);

  useFocusEffect(
    useCallback(() => {
      cargarProductos();
      cargarRol();
    }, [])
  );

  const cargarProductos = async () => {
    try {
      const res = await getProductos();

      setProductos(res.data);
    } catch (error) {
      console.log("Error cargando productos", error);
    }
  };

  const cargarRol = async () => {
    const userRole = await getUserRole();
    setRole(userRole);
  };

  const productosFiltrados = productos.filter(p =>
    (p.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderItem = ({ item }) => {

    const imagenFinal = item.imagen && item.imagen !== ""
      ? item.imagen
      : "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetail", { producto: item })}
      >

        <Image
          source={{ uri: imagenFinal }}
          style={styles.image}
        />

        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={styles.price}>${item.precio}</Text>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Catálogo</Text>

      <TextInput
        placeholder="Buscar postres..."
        style={styles.search}
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />

      {/* 🔥 SOLO ADMIN */}
      {role === "ADMIN" && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F7",
    padding: 10
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10
  },

  // 🔥 SEARCH MEJORADO
  search: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0", // gris suave
  },

  // 🔥 CARD CON CONTORNO
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 20,
    padding: 10,

    // 🔥 borde
    borderWidth: 1,
    borderColor: "#EAEAEA",

    // 🔥 sombra (Android + iOS)
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 15
  },

  name: {
    marginTop: 5,
    fontWeight: "bold"
  },

  price: {
    color: "#E89AB0",
    marginTop: 2
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#E89AB0",
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },

  fabText: {
    color: "#fff",
    fontSize: 24
  }
});