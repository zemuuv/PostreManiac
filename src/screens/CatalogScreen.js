import React, { useEffect, useState, useContext } from "react";
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

// 🔥 IMPORTAR THEME
import { ThemeContext } from "../context/ThemeContext";

export default function CatalogScreen({ navigation }) {

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [role, setRole] = useState(null);

  const { theme } = useContext(ThemeContext);

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

  // 🔥 FILTRO PRINCIPAL (ROL + BÚSQUEDA)
  const productosFiltrados = productos
    .filter(p => {
      // 👉 SI ES USER → SOLO DISPONIBLES
      if (role !== "ADMIN") {
        return p.estado === "DISPONIBLE";
      }
      return true;
    })
    .filter(p =>
      (p.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
    );

  const renderItem = ({ item }) => {

    const imagenFinal = item.imagen && item.imagen !== ""
      ? item.imagen
      : "https://via.placeholder.com/150";

    const agotado = item.estado === "AGOTADO";

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,

            // 🔥 EFECTO VISUAL SI ESTÁ AGOTADO
            opacity: agotado ? 0.6 : 1
          }
        ]}
        onPress={() => navigation.navigate("ProductDetail", { producto: item })}
      >

        <Image
          source={{ uri: imagenFinal }}
          style={styles.image}
        />

        {/* 🔥 ETIQUETA AGOTADO SOLO PARA ADMIN */}
        {agotado && role === "ADMIN" && (
          <View style={styles.badgeAgotado}>
            <Text style={styles.badgeText}>AGOTADO</Text>
          </View>
        )}

        <Text style={[styles.name, { color: theme.text }]}>
          {item.nombre}
        </Text>

        <Text style={[styles.price, { color: theme.primary }]}>
          ${item.precio}
        </Text>

      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      <Text style={[styles.title, { color: theme.text }]}>
        Catálogo
      </Text>

      <TextInput
        placeholder="Buscar postres..."
        placeholderTextColor={theme.subtitle}
        style={[
          styles.search,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
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
          style={[
            styles.fab,
            { backgroundColor: theme.primary }
          ]}
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
    padding: 10
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10
  },

  search: {
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },

  card: {
    flex: 1,
    margin: 6,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,

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

  // 🔥 NUEVO BADGE
  badgeAgotado: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 10
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold"
  },

  name: {
    marginTop: 5,
    fontWeight: "bold"
  },

  price: {
    marginTop: 2
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
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
  }
});