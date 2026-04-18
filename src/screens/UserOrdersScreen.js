import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { obtenerMisPedidos } from "../services/pedidoService";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext"; // 🔥 NUEVO

export default function UserOrdersScreen() {

  const { theme } = useContext(ThemeContext); // 🔥 NUEVO

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

  useFocusEffect(
    useCallback(() => {
      cargarPedidos();
    }, [])
  );

  // 🎨 COLORES MÁS SUAVES (compatibles con tu tema)
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return { color: "#E6A700" };
      case "EN_PROCESO":
        return { color: "#5B8DEF" };
      case "EN_CAMINO":
        return { color: "#9B6DFF" };
      case "ENTREGADO":
        return { color: "#4CAF50" };
      default:
        return { color: theme.subtitle };
    }
  };

  const renderPedido = ({ item }) => {

    const estadoStyle = getEstadoStyle(item.estado);

    return (
      <View style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}>

        <Text style={[styles.estado, estadoStyle]}>
          {item.estado.replace("_", " ")}
        </Text>

        <Text style={[styles.fecha, { color: theme.subtitle }]}>
          {new Date(item.fecha).toLocaleString()}
        </Text>

        <View style={[styles.line, { backgroundColor: theme.border }]} />

        {item.detalles?.map((d) => (
          <Text key={d.id} style={[styles.item, { color: theme.text }]}>
            {d.cantidad}x {d.nombreProducto}
          </Text>
        ))}

        <View style={[styles.line, { backgroundColor: theme.border }]} />

        <View style={styles.rowBetween}>
          <Text style={{ color: theme.text }}>Total</Text>
          <Text style={[styles.total, { color: theme.primary }]}>
            ${item.total}
          </Text>
        </View>

      </View>
    );
  };

  if (loading) {
    return (
      <View style={[
        styles.center,
        { backgroundColor: theme.background }
      ]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      <Text style={[
        styles.header,
        { color: theme.text }
      ]}>
        Mis Pedidos
      </Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={renderPedido}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: theme.subtitle }}>
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
    padding: 15
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },

  card: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1
  },

  estado: {
    fontWeight: "bold",
    fontSize: 14
  },

  fecha: {
    fontSize: 12,
    marginTop: 3
  },

  line: {
    height: 1,
    marginVertical: 8
  },

  item: {
    marginBottom: 2
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  total: {
    fontWeight: "bold"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});