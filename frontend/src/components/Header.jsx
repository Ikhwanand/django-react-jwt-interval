import { Link } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import './Header.css'

const Header = () => {
    const {user, logoutUser} = useContext(AuthContext)
    return (
        <header className="header">
            <div className="nav-container">
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    {user ? (
                        <button className="logout-btn" onClick={logoutUser}>Logout</button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </nav>
                {user && (
                    <div className="user-info">
                        <p>Welcome, {user.username}</p>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header