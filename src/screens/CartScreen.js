import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/cartContext";
import { crearPedido } from "../services/pedidoService";
import { useAlert } from "../context/AlertContext";
import { ThemeContext } from "../context/ThemeContext"; // 🔥 NUEVO

export default function CartScreen({ navigation }) {

  const context = useContext(CartContext);
  const { showAlert } = useAlert();
  const { theme } = useContext(ThemeContext); // 🔥 NUEVO

  if (!context) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Error: Contexto no cargado</Text>
      </View>
    );
  }

  const {
    carrito = [],
    eliminarProducto,
    actualizarCantidad,
    limpiarCarrito
  } = context;

  const subtotal = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const envio = carrito.length > 0 ? 5000 : 0;
  const total = subtotal + envio;

  const handlePedido = async () => {
    try {
      if (carrito.length === 0) {
        return showAlert("Carrito vacío", "Agrega productos primero");
      }

      const pedido = {
        total,
        detalles: carrito.map(p => ({
          productoId: p.id || p._id,
          nombreProducto: p.nombre,
          cantidad: p.cantidad,
          precioUnitario: p.precio
        }))
      };

      await crearPedido(pedido);

      limpiarCarrito();

      showAlert("Éxito", "Pedido realizado 🚀");

    } catch (error) {
      showAlert("Error", "No se pudo crear el pedido");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <View>
          <Text style={[styles.title, { color: theme.text }]}>Mi Carrito</Text>
          <Text style={[styles.subtitle, { color: theme.subtitle }]}>
            {carrito.length} productos
          </Text>
        </View>
      </View>

      {/* 🛒 LISTA */}
      <FlatList
        data={carrito}
        keyExtractor={(item, index) =>
          (item.id || item._id)?.toString() || index.toString()
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border
            }
          ]}>

            <Image source={{ uri: item.imagen }} style={styles.image} />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.nombre, { color: theme.text }]}>
                  {item.nombre}
                </Text>

                <TouchableOpacity
                  onPress={() => eliminarProducto(item.id || item._id)}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.primary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.precio, { color: theme.primary }]}>
                ${item.precio}
              </Text>

              <View style={[
                styles.controls,
                { backgroundColor: theme.secondary }
              ]}>
                <TouchableOpacity
                  onPress={() =>
                    actualizarCantidad(
                      item.id || item._id,
                      Math.max(1, item.cantidad - 1)
                    )
                  }
                >
                  <Text style={[styles.btnCantidad, { color: theme.text }]}>-</Text>
                </TouchableOpacity>

                <Text style={[styles.cantidad, { color: theme.text }]}>
                  {item.cantidad}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    actualizarCantidad(
                      item.id || item._id,
                      item.cantidad + 1
                    )
                  }
                >
                  <Text style={[styles.btnCantidad, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.totalItem, { color: theme.text }]}>
              ${(item.precio * item.cantidad).toFixed(2)}
            </Text>

          </View>
        )}
      />

      {/* 💰 RESUMEN */}
      <View style={[
        styles.resumen,
        {
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}>
        <Text style={[styles.resumenTitle, { color: theme.text }]}>
          Resumen de Compra
        </Text>

        <View style={styles.rowBetween}>
          <Text style={{ color: theme.text }}>Subtotal</Text>
          <Text style={{ color: theme.text }}>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={{ color: theme.text }}>Envío</Text>
          <Text style={{ color: theme.text }}>${envio.toFixed(2)}</Text>
        </View>

        <View style={[styles.line, { backgroundColor: theme.border }]} />

        <View style={styles.rowBetween}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[styles.total, { color: theme.primary }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 🛒 BOTÓN */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.primary }]}
        onPress={handlePedido}
      >
        <Text style={styles.btnText}>Realizar Pedido</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10
  },

  title: {
    fontSize: 20,
    fontWeight: "bold"
  },

  subtitle: {
    fontSize: 12
  },

  card: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 15
  },

  nombre: {
    fontWeight: "bold"
  },

  precio: {
    marginTop: 2
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
    alignSelf: "flex-start"
  },

  btnCantidad: {
    fontSize: 18,
    paddingHorizontal: 10
  },

  cantidad: {
    marginHorizontal: 10
  },

  totalItem: {
    fontWeight: "bold"
  },

  resumen: {
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    borderWidth: 1
  },

  resumenTitle: {
    fontWeight: "bold",
    marginBottom: 10
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2
  },

  line: {
    height: 1,
    marginVertical: 8
  },

  totalLabel: {
    fontWeight: "bold"
  },

  total: {
    fontWeight: "bold"
  },

  btn: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  }
});