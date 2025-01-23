import { useAuthContext } from '../context/AuthContext'
import '../css/Header.css'

export default function Header () {
    const { saveToken } = useAuthContext();

    return (
        <header className="header">
            <div className="logo">
                <span role="img" aria-label="logo">📚</span> Bookaround
            </div>
            <div className='search-bar'>
                <input type="text" placeholder="Search for book..." />
            </div>
            <div className="user-actions">
                {saveToken ? (
                    <>
                        <span className="icon">💬</span>
                        <span className="icon">🔔</span>
                        <img src="https://via.placeholder.com/40" alt="Profile" className="profile-image" />
                    </>
                ) : (
                    <>
                        <a href="/signInUp" className="login-link">Login</a>       
                        {/* <a href="/register" className="login-link">Login</a>*/}
                    </>
                )}
            </div>
        </header>
    )
}