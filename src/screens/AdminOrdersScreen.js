import React, { useState, useCallback, useContext } from "react";
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

// 🔥 THEME
import { ThemeContext } from "../context/ThemeContext";

import {
  obtenerPedidos,
  actualizarEstadoPedido,
  obtenerConteoPedidos
} from "../services/pedidoService";

export default function AdminOrdersScreen() {

  const { showAlert } = useAlert();
  const { theme } = useContext(ThemeContext);

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
      <View style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}>

        <View style={styles.rowBetween}>
          <Text style={[styles.title, { color: theme.text }]}>
            Pedido #{shortId}
          </Text>

          <View style={[styles.badge, { backgroundColor: estadoStyle.backgroundColor }]}>
            <Text style={{ color: estadoStyle.color }}>
              {item.estado.replace("_", " ")}
            </Text>
          </View>
        </View>

        <Text style={[styles.cliente, { color: theme.text }]}>
          Usuario: {item.username || "Sin nombre"}
        </Text>

        <Text style={[styles.fecha, { color: theme.subtitle }]}>
          {new Date(item.fecha).toLocaleString()}
        </Text>

        <View style={[styles.line, { backgroundColor: theme.border }]} />

        {item.detalles?.map((d, index) => (
          <Text key={index} style={{ color: theme.text }}>
            {d.cantidad}x {d.nombreProducto}
          </Text>
        ))}

        <View style={styles.rowBetween}>
          <Text style={{ color: theme.text }}>Total</Text>
          <Text style={[styles.total, { color: theme.primary }]}>
            ${item.total}
          </Text>
        </View>

        {item.estado === "PENDIENTE" && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
            onPress={() => cambiarEstado(item.id, "EN_PROCESO")}
          >
            <Text style={styles.btnText}>Aceptar</Text>
          </TouchableOpacity>
        )}

        {item.estado === "EN_PROCESO" && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
            onPress={() => cambiarEstado(item.id, "EN_CAMINO")}
          >
            <Text style={styles.btnText}>En camino</Text>
          </TouchableOpacity>
        )}

        {item.estado === "EN_CAMINO" && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
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
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>

      <Text style={[styles.header, { color: theme.text }]}>
        Panel Administrador
      </Text>

      <Text style={[styles.subheader, { color: theme.subtitle }]}>
        {pedidos.length} pedidos
      </Text>

      {/* 🔥 TABS CORREGIDOS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: filtro === "PENDIENTE" ? "#FFF3CD" : theme.card
            }
          ]}
          onPress={() => setFiltro("PENDIENTE")}
        >
          <Text style={styles.tabText}>Pendientes</Text>
          <Text style={styles.tabNumber}>{conteo.PENDIENTE || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: filtro === "EN_PROCESO" ? "#D6E4FF" : theme.card
            }
          ]}
          onPress={() => setFiltro("EN_PROCESO")}
        >
          <Text style={styles.tabText}>En proceso</Text>
          <Text style={styles.tabNumber}>{conteo.EN_PROCESO || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: filtro === "COMPLETADO" ? "#D1FAE5" : theme.card
            }
          ]}
          onPress={() => setFiltro("COMPLETADO")}
        >
          <Text style={styles.tabText}>Completados</Text>
          <Text style={styles.tabNumber}>{conteo.ENTREGADO || 0}</Text>
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
    padding: 15
  },

  header: {
    fontSize: 22,
    fontWeight: "bold"
  },

  subheader: {
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
    marginHorizontal: 3
  },

  // 🔥 NUEVOS ESTILOS
  tabText: {
    color: "#000",
    fontWeight: "bold"
  },

  tabNumber: {
    color: "#000"
  },

  card: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1
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
    fontSize: 12
  },

  line: {
    height: 1,
    marginVertical: 8
  },

  total: {
    fontWeight: "bold"
  },

  btnPrimary: {
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
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