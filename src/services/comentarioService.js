import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://postremaniac-api.onrender.com/comentarios";

// 🔐 HEADERS CENTRALIZADOS
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("No hay token, usuario no autenticado");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// 🔥 CREAR COMENTARIO
export const crearComentario = async (productoId, contenido) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.post(
      API_URL,
      {
        productoId,
        contenido
      },
      { headers }
    );

    return response.data;

  } catch (error) {
    manejarError(error, "crear comentario");
  }
};

// 📥 OBTENER TODOS
export const obtenerComentarios = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.get(API_URL, { headers });

    return response.data;

  } catch (error) {
    manejarError(error, "obtener comentarios");
  }
};

// ❌ ELIMINAR
export const eliminarComentario = async (comentarioId) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.delete(
      `${API_URL}/${comentarioId}`,
      { headers }
    );

    return response.data;

  } catch (error) {
    manejarError(error, "eliminar comentario");
  }
};

// 🔥 MANEJO CENTRALIZADO DE ERRORES
const manejarError = (error, accion) => {
  if (error.response) {
    console.error(`Error al ${accion}:`, error.response.data);
    throw new Error(error.response.data?.message || "Error del servidor");
  } else if (error.request) {
    console.error(`Error de red al ${accion}`);
    throw new Error("No hay conexión con el servidor");
  } else {
    console.error(`Error inesperado al ${accion}:`, error.message);
    throw new Error("Error inesperado");
  }
};