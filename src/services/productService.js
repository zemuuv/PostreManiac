import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL = "http://localhost:8080/productos";




// 🔍 Obtener todos los productos
export const getProductos = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}` // 🔥 AQUÍ ESTÁ LA CLAVE
      }
    });

    return response;

  } catch (error) {
    console.log("Error obteniendo productos:", error);
    throw error;
  }
};


// ➕ Crear producto (requiere token)
export const createProducto = async (producto) => {
  try {
    const token = await AsyncStorage.getItem("token");

    console.log("aqui esta "+token);

    const response = await axios.post(API_URL, producto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;

  } catch (error) {
    console.log("Error creando producto:", error);
    throw error;
  }
};

// Eliminar producto
export const deleteProducto = async (id) => {
  const token = await getToken();

  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};