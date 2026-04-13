import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://postremaniac-api.onrender.com/api/pedidos";

// 🔥 HEADERS CENTRALIZADOS
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// 🔥 CREAR PEDIDO
export const crearPedido = async (pedido) => {
  const headers = await getAuthHeaders();
  return axios.post(API_URL, pedido, { headers });
};

// 🔥 ADMIN - TODOS LOS PEDIDOS
export const obtenerPedidos = async () => {
  const headers = await getAuthHeaders();
  return axios.get(API_URL, { headers });
};

// 🔥 CLIENTE - SOLO SUS PEDIDOS
export const obtenerMisPedidos = async () => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_URL}/mis-pedidos`, { headers });
};

// 🔥 FILTRAR POR ESTADO (ADMIN)
export const obtenerPedidosPorEstado = async (estado) => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_URL}/estado/${estado}`, { headers });
};

// 🔥 ACTUALIZAR ESTADO (ADMIN)
export const actualizarEstadoPedido = async (id, estado) => {
  const headers = await getAuthHeaders();

  return axios.put(
    `${API_URL}/${id}/estado?estado=${estado}`,
    {}, // 🔥 body vacío obligatorio
    { headers }
  );
};

// 🔥 CONTAR PEDIDOS (ADMIN)
export const obtenerConteoPedidos = async () => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_URL}/conteo`, { headers });
};