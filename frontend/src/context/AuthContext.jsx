
import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  const checkAuth = async ()=>{
    try{
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    }catch{
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(()=>{
    checkAuth();
  },[]);

  const logout = async ()=>{
    await api.post("/auth/logout");
    setUser(null);
    window.location.href="/login";
  };

  return (
    <AuthContext.Provider value={{user,setUser,loading,logout}}>
      {children}
    </AuthContext.Provider>
  );
};
