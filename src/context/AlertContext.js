import React, { createContext, useContext, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState("alert"); // alert | confirm
  const [type, setType] = useState("info"); // success | error | warning | info
  const [onConfirm, setOnConfirm] = useState(null);

  // 🎨 COLORES SEGÚN TIPO
  const getColor = () => {
    switch (type) {
      case "success": return "#4CAF50";
      case "error": return "#F44336";
      case "warning": return "#FF9800";
      default: return "#E89AB0"; // info (tu rosado)
    }
  };

  // 🔹 ALERT NORMAL
  const showAlert = (t, m, alertType = "info") => {
    setTitle(t);
    setMessage(m);
    setType(alertType);
    setMode("alert");
    setVisible(true);
  };

  // 🔥 CONFIRM
  const showConfirm = (t, m, onConfirmCallback, alertType = "warning") => {
    setTitle(t);
    setMessage(m);
    setType(alertType);
    setMode("confirm");
    setOnConfirm(() => onConfirmCallback);
    setVisible(true);
  };

  const resetState = () => {
    setVisible(false);
    setOnConfirm(null);
    setMode("alert");
    setType("info");
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    resetState();
  };

  const handleCancel = () => {
    resetState();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>

      {children}

      <Modal transparent visible={visible} animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#FFFDF9",
            padding: 20,
            borderRadius: 20,
            width: "80%",
            elevation: 5
          }}>

            <Text style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 10,
              color: "#5A3E36"
            }}>
              {title}
            </Text>

            <Text style={{ marginBottom: 15, color: "#333" }}>
              {message}
            </Text>

            {/* 🔥 BOTONES */}
            {mode === "alert" ? (
              <TouchableOpacity
                style={{
                  backgroundColor: getColor(),
                  padding: 12,
                  borderRadius: 12,
                  alignItems: "center"
                }}
                onPress={handleCancel}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  OK
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: "#ccc",
                    padding: 12,
                    borderRadius: 12,
                    flex: 1,
                    marginRight: 5,
                    alignItems: "center"
                  }}
                  onPress={handleCancel}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: getColor(),
                    padding: 12,
                    borderRadius: 12,
                    flex: 1,
                    marginLeft: 5,
                    alignItems: "center"
                  }}
                  onPress={handleConfirm}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Confirmar
                  </Text>
                </TouchableOpacity>

              </View>
            )}

          </View>
        </View>
      </Modal>

    </AlertContext.Provider>
  );
};

// 🔥 HOOK
export const useAlert = () => useContext(AlertContext);