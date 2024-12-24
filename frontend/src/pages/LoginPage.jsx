import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import './LoginPage.css'

const LoginPage = () => {
    const {loginUser, error} = useContext(AuthContext)
    
    return (
        <div className='login-container'>
            <form onSubmit={loginUser} className='login-form'>
                <h2 className='login-title'>Welcome Back</h2>
                
                {error && <div className='error-message'>{error}</div>}
                
                <div className='form-group'>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username"
                        placeholder='Enter Username' 
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        placeholder='Enter Password' 
                    />
                </div>

                <button type="submit" className='login-button'>
                    Login
                </button>
            </form> 
        </div>
    )
}

export default LoginPage