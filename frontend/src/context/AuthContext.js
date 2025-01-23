import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

    const saveToken = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token); // Save to localStorage
    };

    return (
        <AuthContext.Provider value={{ authToken, saveToken }}>
            {children}
        </AuthContext.Provider>
    );
}

// Corrected useAuthContext Hook
export function useAuthContext() {
    return useContext(AuthContext);
}
