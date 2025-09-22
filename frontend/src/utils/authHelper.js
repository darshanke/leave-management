export const getToken = () => localStorage.getItem("accessToken");
export const saveToken = (t) => localStorage.setItem("accessToken", t);
export const clearToken = () => localStorage.removeItem("accessToken");
