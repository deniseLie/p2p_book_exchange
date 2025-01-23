import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css'

export default function Header () {
    const { authToken, logout, isTokenExpired } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken && isTokenExpired(authToken)) {
            logout(); // Automatically log out if the token is expired
        }
    }, [authToken, isTokenExpired, logout]);

    // Navigate to the profile page
    const handleProfileClick = () => {
        navigate('/profile'); 
    };

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
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSteItzPyeDKBxyWiOA8xrPZXIlxOYv1b1VVg&s/40" 
                            alt="Profile" 
                            className="profile-image" 
                            onClick={handleProfileClick} // Add onClick handler
                            style={{ cursor: 'pointer' }} // Make it clear it's clickable
                        />
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