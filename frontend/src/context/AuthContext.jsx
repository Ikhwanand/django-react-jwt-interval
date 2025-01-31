import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    )
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: e.target.username.value, 
                    password: e.target.password.value
                })
            })
            const data = await response.json()
            if (response.status === 200) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                navigate('/')
            } else {
                setError('Invalid credentials')
            }
        } catch (error) {
            setError('An error occurred during login')
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    const updateToken = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: authTokens?.refresh })
            })
            const data = await response.json()
            if (response.status === 200) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
            } else {
                logoutUser()
            }
        } catch (error) {
            console.error('Token refresh failed:', error)
            logoutUser()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const initialize = async () => {
            if (authTokens) {
                await updateToken()
            } else {
                setLoading(false)
            }
        }
        initialize()
    }, [])

    useEffect(() => {
        const FOUR_MINUTES = 1000 * 60 * 4
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, FOUR_MINUTES)
        return () => clearInterval(interval)
    }, [authTokens])

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        error,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    )
}