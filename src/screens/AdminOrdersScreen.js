import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useAlert } from "../context/AlertContext"; 

import {
  obtenerPedidos,
  actualizarEstadoPedido,
  obtenerConteoPedidos
} from "../services/pedidoService";

export default function AdminOrdersScreen() {

  const { showAlert } = useAlert(); 

  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("PENDIENTE");
  const [loading, setLoading] = useState(true);

  const [conteo, setConteo] = useState({
    PENDIENTE: 0,
    EN_PROCESO: 0,
    ENTREGADO: 0
  });

  const cargarPedidos = async () => {
    try {
      setLoading(true);

      const res = await obtenerPedidos();
      setPedidos(res.data);

    } catch (error) {
      console.log(error);
      showAlert("Error", "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const cargarConteo = async () => {
    try {
      const res = await obtenerConteoPedidos();
      setConteo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPedidos();
      cargarConteo();
    }, [])
  );

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);

      await cargarPedidos();
      await cargarConteo();

      showAlert("Éxito", "Estado actualizado");
    } catch (error) {
      console.log(error);
      showAlert("Error", "No se pudo actualizar");
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === "PENDIENTE") return p.estado === "PENDIENTE";
    if (filtro === "EN_PROCESO") return ["EN_PROCESO", "EN_CAMINO"].includes(p.estado);
    if (filtro === "COMPLETADO") return p.estado === "ENTREGADO";
  });

  const getEstadoStyle = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return { backgroundColor: "#FFF3CD", color: "#D39E00" };
      case "EN_PROCESO":
        return { backgroundColor: "#D6E4FF", color: "#1D4ED8" };
      case "EN_CAMINO":
        return { backgroundColor: "#E9D5FF", color: "#7C3AED" };
      case "ENTREGADO":
        return { backgroundColor: "#D1FAE5", color: "#059669" };
      default:
        return {};
    }
  };

  const renderPedido = ({ item }) => {

    const estadoStyle = getEstadoStyle(item.estado);
    const shortId = item.id?.slice(-5);

    return (
      <View style={styles.card}>

        <View style={styles.rowBetween}>
          <Text style={styles.title}>Pedido #{shortId}</Text>

          <View style={[styles.badge, { backgroundColor: estadoStyle.backgroundColor }]}>
            <Text style={{ color: estadoStyle.color }}>
              {item.estado.replace("_", " ")}
            </Text>
          </View>
        </View>

        <Text style={styles.cliente}>
          Usuario: {item.username || "Sin nombre"}
        </Text>

        <Text style={styles.fecha}>
          {new Date(item.fecha).toLocaleString()}
        </Text>

        <View style={styles.line} />

        {item.detalles?.map((d, index) => (
          <Text key={index} style={styles.item}>
            {d.cantidad}x {d.nombreProducto}
          </Text>
        ))}

        <View style={styles.rowBetween}>
          <Text>Total</Text>
          <Text style={styles.total}>${item.total}</Text>
        </View>

        {item.estado === "PENDIENTE" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => cambiarEstado(item.id, "EN_PROCESO")}
            >
              <Text style={styles.btnText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.estado === "EN_PROCESO" && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => cambiarEstado(item.id, "EN_CAMINO")}
          >
            <Text style={styles.btnText}>En camino</Text>
          </TouchableOpacity>
        )}

        {item.estado === "EN_CAMINO" && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => cambiarEstado(item.id, "ENTREGADO")}
          >
            <Text style={styles.btnText}>Entregado</Text>
          </TouchableOpacity>
        )}

        {item.estado === "ENTREGADO" && (
          <Text style={styles.completado}>✔ Pedido Completado</Text>
        )}

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

      <Text style={styles.header}>Panel Administrador</Text>
      <Text style={styles.subheader}>{pedidos.length} pedidos</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, filtro === "PENDIENTE" && styles.tabActive]}
          onPress={() => setFiltro("PENDIENTE")}
        >
          <Text>Pendientes</Text>
          <Text>{conteo.PENDIENTE || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filtro === "EN_PROCESO" && styles.tabActiveBlue]}
          onPress={() => setFiltro("EN_PROCESO")}
        >
          <Text>En proceso</Text>
          <Text>{conteo.EN_PROCESO || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filtro === "COMPLETADO" && styles.tabActiveGreen]}
          onPress={() => setFiltro("COMPLETADO")}
        >
          <Text>Completados</Text>
          <Text>{conteo.ENTREGADO || 0}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderPedido}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8F6F7"
  },

  header: {
    fontSize: 22,
    fontWeight: "bold"
  },

  subheader: {
    color: "#999",
    marginBottom: 10
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },

  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#eee",
    marginHorizontal: 3
  },

  tabActive: {
    backgroundColor: "#FFF3CD"
  },

  tabActiveBlue: {
    backgroundColor: "#D6E4FF"
  },

  tabActiveGreen: {
    backgroundColor: "#D1FAE5"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  title: {
    fontWeight: "bold"
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },

  cliente: {
    marginTop: 5
  },

  fecha: {
    color: "#999",
    fontSize: 12
  },

  line: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8
  },

  item: {
    color: "#666"
  },

  total: {
    color: "#E89AB0",
    fontWeight: "bold"
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10
  },

  btnPrimary: {
    backgroundColor: "#E89AB0",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginTop: 10
  },

  btnSecondary: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  completado: {
    color: "green",
    marginTop: 10,
    fontWeight: "bold"
  }
});