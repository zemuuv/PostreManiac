import React, { useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function AppHeader() {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <Image
        source={require("../../assets/PostremaniacWeb.png")}
        style={styles.logo}
        resizeMode="contain"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end", // 🔥 mueve todo a la derecha
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 10
  },
  logo: {
    width: 120, // 🔥 100% más grande (antes 40)
    height: 120
  }
});