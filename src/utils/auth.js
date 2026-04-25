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

// 🔥 Verificar si el token es válido
export const isTokenValid = async () => {
  try {
    const token = await getToken();

    if (!token) return false;

    const decoded = jwtDecode(token);

    // 🔥 Validar expiración
    const now = Date.now() / 1000; // en segundos

    if (decoded.exp < now) {
      console.log("⚠️ Token expirado");

      await logout(); // 🔥 eliminar sesión automáticamente
      return false;
    }

    return true;

  } catch (error) {
    return false;
  }
};

// 🔥 Obtener datos completos del usuario
export const getUserData = async () => {
  try {
    const tokenValido = await isTokenValid();

    if (!tokenValido) return null;

    const token = await getToken();
    const decoded = jwtDecode(token);

    return decoded;

  } catch (error) {
    return null;
  }
};

// 🔥 Obtener rol
export const getUserRole = async () => {
  try {
    const user = await getUserData();
    return user?.rol || null;
  } catch (error) {
    return null;
  }
};

// 🔥 Obtener ID del usuario
export const getUserId = async () => {
  try {
    const user = await getUserData();
    return user?.id || null;
  } catch (error) {
    return null;
  }
};

// 🔥 Obtener username
export const getUsername = async () => {
  try {
    const user = await getUserData();
    return user?.sub || null;
  } catch (error) {
    return null;
  }
};

// 🔥 Obtener email
export const getUserEmail = async () => {
  try {
    const user = await getUserData();
    return user?.email || null;
  } catch (error) {
    return null;
  }
};

// 🔥 Logout
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("rol");
  } catch (error) {
    console.log("Error cerrando sesión:", error);
  }
};