import '../css/Header.css'

export default function Header({ isLoggedIn }) {
    return (
        <header className="header">
            <div className="logo">
                <span role="img" aria-label="logo">📚</span> Bookaround
            </div>
            <div className='search-bar'>
                <input type="text" placeholder="Search for book..." />
            </div>
            <div className="user-actions">
                {isLoggedIn ? (
                    <>
                        <span className="icon">💬</span>
                        <span className="icon">🔔</span>
                        <img src="https://via.placeholder.com/40" alt="Profile" className="profile-image" />
                    </>
                ) : (
                    <>
                        <a href="/login" className="login-link">Login</a>       
                        {/* <a href="/register" className="login-link">Login</a>*/}
                    </>
                )}
            </div>
        </header>
    )
}