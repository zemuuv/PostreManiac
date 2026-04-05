import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { obtenerMisPedidos } from "../services/pedidoService";
import { useFocusEffect } from "@react-navigation/native";

export default function UserOrdersScreen() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPedidos = async () => {
    try {
      setLoading(true);

      const res = await obtenerMisPedidos();
      setPedidos(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SE EJECUTA CADA VEZ QUE ENTRAS AL TAB
  useFocusEffect(
    useCallback(() => {
      cargarPedidos();
    }, [])
  );

  // 🎨 COLOR DEL ESTADO
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return { color: "#D39E00" };
      case "EN_PROCESO":
        return { color: "#1D4ED8" };
      case "EN_CAMINO":
        return { color: "#7C3AED" };
      case "ENTREGADO":
        return { color: "#059669" };
      default:
        return { color: "#999" };
    }
  };

  const renderPedido = ({ item }) => {

    const estadoStyle = getEstadoStyle(item.estado);

    return (
      <View style={styles.card}>

        {/* 🔥 ESTADO */}
        <Text style={[styles.estado, estadoStyle]}>
          {item.estado.replace("_", " ")}
        </Text>

        {/* 📅 FECHA */}
        <Text style={styles.fecha}>
          {new Date(item.fecha).toLocaleString()}
        </Text>

        <View style={styles.line} />

        {/* 📦 DETALLES */}
        {item.detalles?.map((d) => (
          <Text key={d.id} style={styles.item}>
            {d.cantidad}x {d.nombreProducto}
          </Text>
        ))}

        <View style={styles.line} />

        {/* 💰 TOTAL */}
        <View style={styles.rowBetween}>
          <Text>Total</Text>
          <Text style={styles.total}>${item.total}</Text>
        </View>

      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E89AB0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Mis Pedidos</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={renderPedido}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No tienes pedidos aún 😢
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F7",
    padding: 15
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12
  },

  estado: {
    fontWeight: "bold",
    fontSize: 14
  },

  fecha: {
    color: "#999",
    fontSize: 12,
    marginTop: 3
  },

  line: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8
  },

  item: {
    color: "#666",
    marginBottom: 2
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  total: {
    color: "#E89AB0",
    fontWeight: "bold"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});