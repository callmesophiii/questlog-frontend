import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [hero, setHero] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const storedHero = JSON.parse(localStorage.getItem("hero"));
      if (storedHero) setHero(storedHero);
    }
  }, [token]);

  const login = (data) => {
    setToken(data.token);
    setHero(data.hero);
    localStorage.setItem("token", data.token);
    localStorage.setItem("hero", JSON.stringify(data.hero));
  };

  const logout = () => {
    setToken(null);
    setHero(null);
    localStorage.removeItem("token");
    localStorage.removeItem("hero");
  };

  return (
    <AuthContext.Provider value={{ hero, token, login, logout, setHero }}>
      {children}
    </AuthContext.Provider>
  );
};