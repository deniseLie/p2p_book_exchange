import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext'
import '../css/Header.css'

export default function Header () {
    const { authToken, logout, isTokenExpired } = useAuthContext();

    useEffect(() => {
        if (authToken && isTokenExpired(authToken)) {
            logout(); // Automatically log out if the token is expired
        }
    }, [authToken, isTokenExpired, logout]);

    return (
        <header className="header">
            <div className="logo">
                <span role="img" aria-label="logo">📚</span> Bookaround
            </div>
            <div className='search-bar'>
                <input type="text" placeholder="Search for book..." />
            </div>
            <div className="user-actions">
                {authToken ? (
                    <>
                        <span className="icon">💬</span>
                        <span className="icon">🔔</span>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSteItzPyeDKBxyWiOA8xrPZXIlxOYv1b1VVg&s/40" alt="Profile" className="profile-image" />
                    </>
                ) : (
                    <>
                        <a href="/auth" className="login-link">Login</a>       
                    </>
                )}
            </div>
        </header>
    )
}