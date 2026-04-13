import axios from "axios";

const API_URL = "https://postremaniac-api.onrender.com/auth"; 

export const login = async (data) => {
  return await axios.post(`${API_URL}/login`, data);
};

export const register = async (data) => {
  return await axios.post(`${API_URL}/register`, data);
};
//https://postremaniac-api.onrender.com