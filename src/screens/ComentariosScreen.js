import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

import { useAlert } from "../context/AlertContext"; // ✅ ALERT GLOBAL

import {
    crearComentario,
    obtenerComentarios,
    eliminarComentario
} from "../services/comentarioService";

import { getProductos } from "../services/productService";

export default function ComentariosScreen() {

    const { showAlert, showConfirm } = useAlert(); // ✅ USAR AMBOS

    const [comentarios, setComentarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [contenido, setContenido] = useState("");
    const [loading, setLoading] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await cargarUsuario();
        await cargarTodo();
    };

    const formatearFecha = (fechaString) => {
        if (!fechaString) return "";

        const fecha = new Date(fechaString);

        return fecha.toLocaleString("es-CO", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const cargarUsuario = async () => {
        const username = await AsyncStorage.getItem("username");
        setCurrentUser(username);
    };

    const cargarTodo = async () => {
        try {
            setLoading(true);

            const comentariosData = await obtenerComentarios();
            const productosResponse = await getProductos();

            setComentarios(comentariosData);
            setProductos(productosResponse.data);

            const mappedItems = productosResponse.data.map(p => ({
                label: p.nombre,
                value: p.id
            }));

            setItems(mappedItems);

        } catch (error) {
            console.log("Error cargando datos:", error);
            showAlert("Error", "No se pudieron cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    const enviarComentario = async () => {
        if (!contenido || !value) {
            return showAlert(
                "Campos requeridos",
                "Debes seleccionar un producto y escribir un comentario"
            );
        }

        try {
            setLoading(true);

            await crearComentario(value, contenido);

            await cargarTodo();

            setContenido("");
            setValue(null);

            showAlert("Éxito", "Comentario publicado 🎉");

        } catch (error) {
            console.log("Error enviando comentario:", error);
            showAlert("Error", "No se pudo enviar el comentario");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 ELIMINAR CON CONFIRMACIÓN
    const handleEliminar = (id) => {

        if (!id) {
            return showAlert("Error", "ID de comentario inválido");
        }

        showConfirm(
            "Eliminar comentario",
            "¿Seguro que quieres eliminar este comentario?",
            async () => {
                try {

                    console.log("ID a eliminar:", id); // 🔥 DEBUG

                    await eliminarComentario(id); // ❌ NO uses Number()

                    await cargarTodo();

                    showAlert("Éxito", "Comentario eliminado");

                } catch (error) {
                    console.log("Error eliminando:", error);
                    showAlert("Error", error.message);
                }
            }
        );
    };

    const renderItem = ({ item }) => {
        const producto = productos.find(p => p.id === item.productoId);

        const esMio =
            item.username?.trim().toLowerCase() ===
            currentUser?.trim().toLowerCase();

        return (
            <View style={styles.card}>

                {esMio && (
                    <TouchableOpacity
                        style={styles.botonEliminar}
                        onPress={() => handleEliminar(item.id)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 🔥 mejora toque
                    >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                )}

                <Text style={styles.nombre}>{item.username}</Text>

                <Text style={styles.postre}>
                    🍰 {producto ? producto.nombre : "Postre"}
                </Text>

                <Text style={styles.comentario}>{item.contenido}</Text>

                <Text style={styles.fecha}>
                    {formatearFecha(item.fecha)}
                </Text>

            </View>
        );
    };

    return (
        <View style={styles.container}>

            <Text style={styles.titulo}>💬 Comentarios</Text>

            <Text style={styles.subtitulo}>
                Comparte tu experiencia con nuestros postres ✨
            </Text>

            <View style={styles.formContainer}>

                <Text style={styles.label}>Selecciona un postre 🍰</Text>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Selecciona..."
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />

                <View style={styles.comentarioBox}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Escribe tu comentario..."
                        value={contenido}
                        onChangeText={setContenido}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.botonEnviar}
                        onPress={enviarComentario}
                    >
                        <Text style={styles.iconoEnviar}>➤</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#E89AB0" />
            ) : comentarios.length === 0 ? (
                <Text style={styles.empty}>
                    No hay comentarios aún 🍰{"\n"}¡Sé el primero!
                </Text>
            ) : (
                <FlatList
                    data={comentarios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#F5EDE6"
    },

    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#5A3E36"
    },

    subtitulo: {
        marginBottom: 15,
        color: "#A67C7C"
    },

    formContainer: {
        backgroundColor: "#FFFDF9",
        padding: 15,
        borderRadius: 25,
        marginBottom: 20,
        elevation: 4,
        zIndex: 1000
    },

    label: {
        marginBottom: 5,
        color: "#6B4F4F",
        fontWeight: "600"
    },

    dropdown: {
        borderRadius: 20,
        borderColor: "#E8CFC0",
        marginBottom: 10
    },

    dropdownContainer: {
        borderRadius: 20,
        borderColor: "#E8CFC0"
    },

    comentarioBox: {
        backgroundColor: "#fff",
        borderRadius: 25,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F1D6D6"
    },

    textArea: {
        flex: 1,
        minHeight: 40
    },

    botonEnviar: {
        backgroundColor: "#E89AB0",
        padding: 12,
        borderRadius: 50,
        elevation: 5
    },

    iconoEnviar: {
        color: "white",
        fontSize: 16
    },

    card: {
        backgroundColor: "#FFFDF9",
        padding: 15,
        borderRadius: 25,
        marginBottom: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#EADBC8",
        position: "relative"
    },

    botonEliminar: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#FF4D4D",
        borderRadius: 50,
        width: 34,
        height: 34,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        zIndex: 999 // 🔥 FIX CLAVE
    },

    nombre: {
        fontWeight: "bold",
        color: "#6B4F4F"
    },

    postre: {
        color: "#D88C9A",
        marginBottom: 5,
        fontWeight: "600"
    },

    comentario: {
        marginBottom: 5,
        color: "#333"
    },

    fecha: {
        fontSize: 11,
        color: "#999"
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#A67C7C"
    }

});