import React, { useEffect, useState, useContext } from "react";
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

import { useAlert } from "../context/AlertContext";

// 🔥 THEME
import { ThemeContext } from "../context/ThemeContext";

import {
    crearComentario,
    obtenerComentarios,
    eliminarComentario
} from "../services/comentarioService";

import { getProductos } from "../services/productService";

export default function ComentariosScreen() {

    const { showAlert, showConfirm } = useAlert();
    const { theme } = useContext(ThemeContext); // 🔥 NUEVO

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
            showAlert("Error", "No se pudo enviar el comentario");
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = (id) => {

        if (!id) {
            return showAlert("Error", "ID de comentario inválido");
        }

        showConfirm(
            "Eliminar comentario",
            "¿Seguro que quieres eliminar este comentario?",
            async () => {
                try {
                    await eliminarComentario(id);
                    await cargarTodo();
                    showAlert("Éxito", "Comentario eliminado");
                } catch (error) {
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
            <View style={[
                styles.card,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.border
                }
            ]}>

                {esMio && (
                    <TouchableOpacity
                        style={styles.botonEliminar}
                        onPress={() => handleEliminar(item.id)}
                    >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                )}

                <Text style={[styles.nombre, { color: theme.text }]}>
                    {item.username}
                </Text>

                <Text style={[styles.postre, { color: theme.primary }]}>
                    🍰 {producto ? producto.nombre : "Postre"}
                </Text>

                <Text style={[styles.comentario, { color: theme.text }]}>
                    {item.contenido}
                </Text>

                <Text style={[styles.fecha, { color: theme.subtitle }]}>
                    {formatearFecha(item.fecha)}
                </Text>

            </View>
        );
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.background }
        ]}>

            <Text style={[styles.titulo, { color: theme.text }]}>
                💬 Comentarios
            </Text>

            <Text style={[styles.subtitulo, { color: theme.subtitle }]}>
                Comparte tu experiencia con nuestros postres ✨
            </Text>

            <View style={[
                styles.formContainer,
                { backgroundColor: theme.card }
            ]}>

                <Text style={[styles.label, { color: theme.text }]}>
                    Selecciona un postre 🍰
                </Text>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Selecciona..."
                    style={[
                        styles.dropdown,
                        { borderColor: theme.border, backgroundColor: theme.background }
                    ]}
                    dropDownContainerStyle={{
                        borderColor: theme.border,
                        backgroundColor: theme.card
                    }}
                    textStyle={{ color: theme.text }}
                />

                <View style={[
                    styles.comentarioBox,
                    {
                        backgroundColor: theme.background,
                        borderColor: theme.border
                    }
                ]}>
                    <TextInput
                        style={[styles.textArea, { color: theme.text }]}
                        placeholder="Escribe tu comentario..."
                        placeholderTextColor={theme.subtitle}
                        value={contenido}
                        onChangeText={setContenido}
                        multiline
                    />

                    <TouchableOpacity
                        style={[styles.botonEnviar, { backgroundColor: theme.primary }]}
                        onPress={enviarComentario}
                    >
                        <Text style={styles.iconoEnviar}>➤</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.primary} />
            ) : comentarios.length === 0 ? (
                <Text style={[styles.empty, { color: theme.subtitle }]}>
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
        padding: 15
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold"
    },
    subtitulo: {
        marginBottom: 15
    },
    formContainer: {
        padding: 15,
        borderRadius: 25,
        marginBottom: 20,
        elevation: 4,
        zIndex: 1000
    },
    label: {
        marginBottom: 5,
        fontWeight: "600"
    },
    dropdown: {
        borderRadius: 20,
        marginBottom: 10
    },
    comentarioBox: {
        borderRadius: 25,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1
    },
    textArea: {
        flex: 1,
        minHeight: 40
    },
    botonEnviar: {
        padding: 12,
        borderRadius: 50,
        elevation: 5
    },
    iconoEnviar: {
        color: "white",
        fontSize: 16
    },
    card: {
        padding: 15,
        borderRadius: 25,
        marginBottom: 15,
        elevation: 4,
        borderWidth: 1,
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
        zIndex: 999
    },
    nombre: {
        fontWeight: "bold"
    },
    postre: {
        marginBottom: 5,
        fontWeight: "600"
    },
    comentario: {
        marginBottom: 5
    },
    fecha: {
        fontSize: 11
    },
    empty: {
        textAlign: "center",
        marginTop: 40
    }
});