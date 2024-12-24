import { useState, useEffect, useContext } from "react"
import AuthContext from "../context/AuthContext"
import './HomePage.css';

const HomePage = () => {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { authTokens, logoutUser, user } = useContext(AuthContext)

    useEffect(() => {
        getNotes()
    }, [])

    const getNotes = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://127.0.0.1:8000/api/notes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            
            if (response.status === 200) {
                setNotes(data)
            } else {
                logoutUser()
            }
        } catch (err) {
            setError('Failed to fetch notes')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1 className="welcome-title">Welcome {user.username}</h1>
                <p className="welcome-subtitle">Your Personal Dashboard</p>
            </div>

            <div className="user-info">
                <h2>Your Profile</h2>
                <div className="stat-grid">
                    <div className="stat-card">
                        <h3>Notes</h3>
                        <p>{notes.length}</p>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="content-grid">
                {notes.map(note => (
                    <div key={note.id} className="content-card">
                        <h3>{note.id}</h3>
                        <p>{note.body}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage