import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const getUserRole = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded.rol; // 🔥 aquí está el rol
  } catch (error) {
    console.log("Error obteniendo rol:", error);
    return null;
  }
};