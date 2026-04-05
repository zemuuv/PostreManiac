import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [carrito, setCarrito] = useState([]);

  // ➕ AGREGAR PRODUCTO
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {

      // 🔍 Buscar si ya existe
      const existe = prev.find(p => p.id === producto.id);

      // 🔥 Si ya existe → sumar pero respetando stock
      if (existe) {
        return prev.map(p => {
          if (p.id === producto.id) {
            const nuevaCantidad = p.cantidad + cantidad;

            return {
              ...p,
              cantidad: Math.min(nuevaCantidad, p.stock) 
            };
          }
          return p;
        });
      }

      // 🔥 Si NO existe → agregar nuevo producto
      return [
        ...prev,
        {
          ...producto,
          cantidad: Math.min(cantidad, producto.stock) // 🔥 seguridad
        }
      ];
    });
  };

  // ❌ ELIMINAR PRODUCTO
  const eliminarProducto = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  // 🔄 ACTUALIZAR CANTIDAD
  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            cantidad: Math.max(1, Math.min(nuevaCantidad, p.stock)) // 🔥 entre 1 y stock
          };
        }
        return p;
      })
    );
  };

  // 🧹 LIMPIAR CARRITO
  const limpiarCarrito = () => setCarrito([]);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarProducto,
        actualizarCantidad,
        limpiarCarrito
      }}
    >
      {children}
    </CartContext.Provider>
  );
};