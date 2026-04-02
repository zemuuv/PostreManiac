import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const subirImagenFirebase = async (uri) => {
  try {

    // 🔥 Convertir imagen a blob (forma correcta en React Native)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Error al convertir imagen"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // 🔥 Nombre del archivo en Firebase
    const nombreArchivo = `productos/${Date.now()}.jpg`;

    const storageRef = ref(storage, nombreArchivo);

    // 🔥 Subir imagen
    await uploadBytes(storageRef, blob);

    // 🔥 LIBERAR MEMORIA
    blob.close && blob.close();

    // 🔥 AQUÍ ESTÁ LA CLAVE (ANTES FALLABA)
    const url = await getDownloadURL(storageRef);

    console.log("URL GENERADA:", url); // 👈 DEBUG

    return url; // ✅ DEVOLVER URL, NO nombreArchivo

  } catch (error) {
    console.log("Error subiendo imagen:", error);
    throw error;
  }
};