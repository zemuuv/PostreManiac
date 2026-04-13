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
import { useAlert } from "../context/AlertContext"; // ✅ NUEVO

export default function CartScreen({ navigation }) {

  const context = useContext(CartContext);
  const { showAlert } = useAlert(); // ✅ GLOBAL

  if (!context) {
    return (
      <View style={styles.container}>
        <Text>Error: Contexto no cargado</Text>
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
      console.log(error);
      showAlert("Error", "No se pudo crear el pedido");
    }
  };

  return (
    <View style={styles.container}>

      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Mi Carrito</Text>
          <Text style={styles.subtitle}>{carrito.length} productos</Text>
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
          <View style={styles.card}>

            <Image source={{ uri: item.imagen }} style={styles.image} />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.nombre}>{item.nombre}</Text>

                <TouchableOpacity
                  onPress={() => eliminarProducto(item.id || item._id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#E89AB0" />
                </TouchableOpacity>
              </View>

              <Text style={styles.precio}>${item.precio}</Text>

              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() =>
                    actualizarCantidad(
                      item.id || item._id,
                      Math.max(1, item.cantidad - 1)
                    )
                  }
                >
                  <Text style={styles.btnCantidad}>-</Text>
                </TouchableOpacity>

                <Text style={styles.cantidad}>{item.cantidad}</Text>

                <TouchableOpacity
                  onPress={() =>
                    actualizarCantidad(
                      item.id || item._id,
                      item.cantidad + 1
                    )
                  }
                >
                  <Text style={styles.btnCantidad}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.totalItem}>
              ${(item.precio * item.cantidad).toFixed(2)}
            </Text>

          </View>
        )}
      />

      {/* 💰 RESUMEN */}
      <View style={styles.resumen}>
        <Text style={styles.resumenTitle}>Resumen de Compra</Text>

        <View style={styles.rowBetween}>
          <Text>Subtotal</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text>Envío</Text>
          <Text>${envio.toFixed(2)}</Text>
        </View>

        <View style={styles.line} />

        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* 🛒 BOTÓN */}
      <TouchableOpacity style={styles.btn} onPress={handlePedido}>
        <Text style={styles.btnText}>Realizar Pedido</Text>
      </TouchableOpacity>

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
    color: "#999",
    fontSize: 12
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
    alignItems: "center"
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
    color: "#E89AB0",
    marginTop: 2
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#F3E3E8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 10
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
    backgroundColor: "#eee",
    marginVertical: 8
  },

  totalLabel: {
    fontWeight: "bold"
  },

  total: {
    fontWeight: "bold",
    color: "#E89AB0"
  },

  btn: {
    backgroundColor: "#E89AB0",
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