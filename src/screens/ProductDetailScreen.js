import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { deleteProducto } from "../services/productService";
import { getUserRole } from "../utils/auth";
import { useAlert } from "../context/AlertContext"; // ✅ NUEVO

import { CartContext } from "../context/cartContext";

export default function ProductDetailScreen({ route, navigation }) {

    const { producto } = route.params;

    const { showAlert, showConfirm } = useAlert(); // ✅ ALERT GLOBAL

    const [cantidad, setCantidad] = useState(1);
    const [role, setRole] = useState(null);

    const { agregarAlCarrito } = useContext(CartContext);

    useEffect(() => {
        cargarRol();
    }, []);

    const cargarRol = async () => {
        const userRole = await getUserRole();
        setRole(userRole);
    };

    const aumentar = () => {
        if (cantidad < producto.stock) {
            setCantidad(cantidad + 1);
        }
    };

    const disminuir = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    };

    const subtotal = producto.precio * cantidad;

    // 🔥 AGREGAR AL CARRITO
    const handleAgregar = () => {

        if (!producto.id) {
            console.log("❌ Producto sin ID:", producto);
            return showAlert("Error", "El producto no tiene ID", "error");
        }

        agregarAlCarrito(producto, cantidad);

        showAlert("Listo", "Producto agregado al carrito 🛒", "success");

        navigation.goBack();
    };

    // 🔥 ELIMINAR PRODUCTO (YA CON CONFIRM GLOBAL)
    const eliminarProductoHandler = () => {

        showConfirm(
            "Eliminar producto",
            "¿Estás seguro de eliminar este producto?",
            async () => {
                try {
                    await deleteProducto(producto.id);

                    showAlert("Éxito", "Producto eliminado", "success");

                    navigation.navigate("Main", { refresh: true });

                } catch (error) {
                    console.log(error);
                    showAlert("Error", "No se pudo eliminar", "error");
                }
            },
            "warning"
        );
    };

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {role === "ADMIN" && (
                <TouchableOpacity style={styles.deleteButton} onPress={eliminarProductoHandler}>
                    <Ionicons name="trash" size={22} color="#fff" />
                </TouchableOpacity>
            )}

            <Image
                source={{ uri: producto.imagen }}
                style={styles.image}
            />

            <View style={styles.detailContainer}>

                <View style={styles.headerRow}>
                    <Text style={styles.title}>{producto.nombre}</Text>
                    <Text style={styles.price}>${producto.precio}</Text>
                </View>

                <Text style={styles.subtitle}>Descripción</Text>
                <Text style={styles.description}>
                    {producto.descripcion || "Sin descripción"}
                </Text>

                <Text style={styles.subtitle}>Cantidad</Text>

                <View style={styles.cantidadContainer}>

                    <TouchableOpacity
                        onPress={disminuir}
                        disabled={cantidad <= 1}
                    >
                        <Text style={[
                            styles.cantidadBtn,
                            cantidad <= 1 && styles.disabledBtn
                        ]}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.cantidadText}>{cantidad}</Text>

                    <TouchableOpacity
                        onPress={aumentar}
                        disabled={cantidad >= producto.stock}
                    >
                        <Text style={[
                            styles.cantidadBtn,
                            cantidad >= producto.stock && styles.disabledBtn
                        ]}>+</Text>
                    </TouchableOpacity>

                </View>

                <Text style={styles.stock}>
                    Stock disponible: {producto.stock}
                </Text>

                <Text style={styles.subtotal}>
                    Subtotal: ${subtotal.toFixed(2)}
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleAgregar}>
                    <Text style={styles.buttonText}>Agregar al carrito</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F6F7"
    },

    image: {
        width: "100%",
        height: 300
    },

    detailContainer: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        flex: 1
    },

    price: {
        fontSize: 18,
        color: "#E89AB0",
        fontWeight: "bold"
    },

    subtitle: {
        marginTop: 15,
        fontWeight: "bold"
    },

    description: {
        marginTop: 5,
        color: "#666"
    },

    cantidadContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#F3E3E8",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignSelf: "flex-start"
    },

    cantidadBtn: {
        fontSize: 22,
        paddingHorizontal: 10
    },

    cantidadText: {
        fontSize: 16,
        marginHorizontal: 10
    },

    disabledBtn: {
        opacity: 0.3
    },

    stock: {
        marginTop: 5,
        color: "#999",
        fontSize: 12
    },

    subtotal: {
        marginTop: 15,
        fontWeight: "bold",
        color: "#E89AB0"
    },

    button: {
        marginTop: 20,
        backgroundColor: "#E89AB0",
        padding: 15,
        borderRadius: 15,
        alignItems: "center"
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold"
    },

    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 50,
        elevation: 6
    },

    deleteButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: "#FF4D4D",
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6
    }
});