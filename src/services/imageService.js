import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// 📤 SUBIR IMAGEN
export const subirImagenFirebase = async (uri) => {
  try {

    // 🔥 Convertir imagen a blob (React Native fix)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError("Error al convertir imagen"));
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // 🔥 Nombre único
    const nombreArchivo = `productos/${Date.now()}.jpg`;

    const storageRef = ref(storage, nombreArchivo);

    // 🔥 Subir
    await uploadBytes(storageRef, blob);

    // 🔥 Liberar memoria
    blob.close && blob.close();

    const url = await getDownloadURL(storageRef);

    console.log("✅ Imagen subida:", url);

    return url;

  } catch (error) {
    console.log("❌ Error subiendo imagen:", error.message);
    throw error;
  }
};


// 🗑 ELIMINAR IMAGEN DESDE URL
export const eliminarImagenFirebase = async (url) => {
  try {

    if (!url) return;

    // 🔥 Convertir URL → path de Firebase
    const decodedUrl = decodeURIComponent(url);

    const path = decodedUrl.split("/o/")[1].split("?")[0];

    const imageRef = ref(storage, path);

    await deleteObject(imageRef);

    console.log("🗑 Imagen eliminada:", path);

  } catch (error) {

    // ⚠️ No romper flujo si falla (muy importante)
    console.log("⚠️ No se pudo eliminar imagen:", error.message);

  }
};