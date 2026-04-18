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
import { useAlert } from "../context/AlertContext";
import { CartContext } from "../context/cartContext";
import { ThemeContext } from "../context/ThemeContext";
import { eliminarImagenFirebase } from "../services/imageService";

export default function ProductDetailScreen({ route, navigation }) {

    const { producto } = route.params;

    const { showAlert, showConfirm } = useAlert();
    const { agregarAlCarrito } = useContext(CartContext);
    const { theme } = useContext(ThemeContext); // 🔥 NUEVO

    const [cantidad, setCantidad] = useState(1);
    const [role, setRole] = useState(null);

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

    const handleAgregar = () => {

        if (!producto.id) {
            console.log("❌ Producto sin ID:", producto);
            return showAlert("Error", "El producto no tiene ID");
        }

        agregarAlCarrito(producto, cantidad);

        showAlert("Listo", "Producto agregado al carrito 🛒");

        navigation.goBack();
    };

   const eliminarProductoHandler = () => {

    showConfirm(
        "Eliminar producto",
        "¿Estás seguro de eliminar este producto?",
        async () => {
            try {

                // 🔥 1. eliminar imagen primero
                if (producto.imagen) {
                    await eliminarImagenFirebase(producto.imagen);
                }

                // 🔥 2. eliminar en backend
                await deleteProducto(producto.id);

                showAlert("Éxito", "Producto eliminado");

                navigation.navigate("Main", { refresh: true });

            } catch (error) {
                console.log(error);
                showAlert("Error", "No se pudo eliminar");
            }
        }
    );
};

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.background }
        ]}>

            <TouchableOpacity
                style={[
                    styles.backButton,
                    { backgroundColor: theme.card }
                ]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            {role === "ADMIN" && (
                <>
                    {/* 🗑 ELIMINAR */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={eliminarProductoHandler}
                    >
                        <Ionicons name="trash" size={22} color="#fff" />
                    </TouchableOpacity>

                    {/* ✏️ EDITAR */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate("EditProduct", { producto })}
                    >
                        <Ionicons name="create" size={22} color="#fff" />
                    </TouchableOpacity>
                </>
            )}

            <Image
                source={{ uri: producto.imagen }}
                style={styles.image}
            />

            <View style={[
                styles.detailContainer,
                { backgroundColor: theme.card }
            ]}>

                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {producto.nombre}
                    </Text>
                    <Text style={[styles.price, { color: theme.primary }]}>
                        ${producto.precio}
                    </Text>
                </View>

                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                    Descripción
                </Text>
                <Text style={[styles.description, { color: theme.text }]}>
                    {producto.descripcion || "Sin descripción"}
                </Text>

                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                    Cantidad
                </Text>

                <View style={[
                    styles.cantidadContainer,
                    { backgroundColor: theme.border }
                ]}>

                    <TouchableOpacity onPress={disminuir} disabled={cantidad <= 1}>
                        <Text style={[
                            styles.cantidadBtn,
                            { color: theme.text },
                            cantidad <= 1 && styles.disabledBtn
                        ]}>-</Text>
                    </TouchableOpacity>

                    <Text style={[styles.cantidadText, { color: theme.text }]}>
                        {cantidad}
                    </Text>

                    <TouchableOpacity onPress={aumentar} disabled={cantidad >= producto.stock}>
                        <Text style={[
                            styles.cantidadBtn,
                            { color: theme.text },
                            cantidad >= producto.stock && styles.disabledBtn
                        ]}>+</Text>
                    </TouchableOpacity>

                </View>

                <Text style={[styles.stock, { color: theme.subtitle }]}>
                    Stock disponible: {producto.stock}
                </Text>

                <Text style={[styles.subtotal, { color: theme.primary }]}>
                    Subtotal: ${subtotal.toFixed(2)}
                </Text>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.primary }
                    ]}
                    onPress={handleAgregar}
                >
                    <Text style={styles.buttonText}>
                        Agregar al carrito
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    image: {
        width: "100%",
        height: 300
    },

    editButton: {
        position: "absolute",
        top: 40,
        right: 80, // 🔥 separado del botón eliminar
        zIndex: 10,
        backgroundColor: "#4CAF50",
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6
    },

    detailContainer: {
        flex: 1,
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
        fontWeight: "bold"
    },

    subtitle: {
        marginTop: 15,
        fontWeight: "bold"
    },

    description: {
        marginTop: 5
    },

    cantidadContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
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
        fontSize: 12
    },

    subtotal: {
        marginTop: 15,
        fontWeight: "bold"
    },

    button: {
        marginTop: 20,
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