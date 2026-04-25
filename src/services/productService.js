import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://postremaniac-api.onrender.com/productos";

// 🔥 HEADERS CENTRALIZADOS
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// 🔍 Obtener todos los productos
export const getProductos = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(API_URL, { headers });
    return response;

  } catch (error) {
    console.log("Error obteniendo productos:", error.response?.data || error.message);
    throw error;
  }
};

// ➕ Crear producto
export const createProducto = async (producto) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(API_URL, producto, { headers });
    return response;

  } catch (error) {
    throw error;
  }
};

// ✏️ ACTUALIZAR PRODUCTO 
export const updateProducto = async (id, producto) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.put(
      `${API_URL}/${id}`,
      producto,
      { headers }
    );

    return response;

  } catch (error) {
    throw error;
  }
};

// 🗑 Eliminar producto
export const deleteProducto = async (id) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.delete(`${API_URL}/${id}`, { headers });

    return response;

  } catch (error) {
    throw error;
  }
};