import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// 🔥 Obtener token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.log("Error obteniendo token:", error);
    return null;
  }
};

// 🔥 Obtener datos completos del usuario
export const getUserData = async () => {
  try {
    const token = await getToken();

    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded; 
  } catch (error) {
    console.log("Error decodificando token:", error);
    return null;
  }
};

// 🔥 Obtener rol
export const getUserRole = async () => {
  try {
    const user = await getUserData();
    return user?.rol || null;
  } catch (error) {
    console.log("Error obteniendo rol:", error);
    return null;
  }
};

// 🔥 Obtener ID del usuario 
export const getUserId = async () => {
  try {
    const user = await getUserData();
    return user?.id || null;
  } catch (error) {
    console.log("Error obteniendo ID:", error);
    return null;
  }
};

// 🔥 Obtener username 
export const getUsername = async () => {
  try {
    const user = await getUserData();
    return user?.sub || null;
  } catch (error) {
    console.log("Error obteniendo username:", error);
    return null;
  }
};

// 🔥 Logout 
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.log("Error cerrando sesión:", error);
  }
};