import { useContext, createContext, useState } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const [userId, setUserId] = useState(null);

    const saveToken = (token) => {
        setAuthToken(token);
        localStorage.setItem('authToken', token); // Save to localStorage

        const decodedToken = jwtDecode(token); // Decode token to extract userId
        setUserId(decodedToken.userId); // Assuming 'userId' is in the decoded token
    };

    const removeToken = () => {
        setAuthToken(null);
        setUserId(null); // Clear the userId when logging out
        localStorage.removeItem('authToken'); // Remove from localStorage
    };

    const login = (token) => {
        saveToken(token); // Store token and update context
    };

    const logout = () => {
        removeToken(); // Clear token and update context
    };

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            return true; // Token invalid or expired
        }
    };

    return (
        <AuthContext.Provider value={{ authToken, userId, login, logout, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
}

// Corrected useAuthContext Hook
export function useAuthContext() {
    return useContext(AuthContext);
}