import React, { useState } from 'react';
import { registerUser, loginUser, checkEmail } from '../../axios/user_req'; 
import '../../css/AuthFlow.css';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthFlow ({ authType = 'login' }) {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [type, setType] = useState(authType);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state

    const { saveToken } = useAuthContext();
    const navigate = useNavigate();

    // Validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Alphanumeric characters and underscores only

    // Handle input change
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email' && type === 'register') {
            try {
                // Check email availability in real time
                const result = await checkEmail(value);
                
                if (result) {
                    setMessage('');
                } else {
                    setMessage('Email already in use.');
                }
            } catch (error) {
                setMessage('Error checking email availability.');
            }
        }
    };

    // Validate form data before submission
    const validateForm = () => {
        const { email, password, username } = formData;

        if (type === 'register' && (!username || !usernameRegex.test(username))) {
            setMessage('Username can only contain letters, numbers, and underscores.');
            return false;
        }

        if (!email || !emailRegex.test(email)) {
            setMessage('Invalid email format.');
            return false;
        }

        if (!password || !passwordRegex.test(password)) {
            setMessage(
                'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.'
            );
            return false;
        }

        return true;
    };


    const handleSubmit = async () => {
        if (loading) return;
        if (!validateForm()) {
            return; // Prevent submission if validation fails
        }
        setLoading(true);
        setMessage('');

        try {
            if (type === 'login') {
                const data = await loginUser(formData);
                if (data.token) {
                    saveToken(data.token); // Save token to context and localStorage
                    setMessage('Login successful!');
                    navigate('/'); // Redirect to homepage
                }
            } else {
                const registerData = await registerUser(formData);
                
                saveToken(registerData.token); // Save token
                navigate('/'); // Redirect to homepage
            }
        } catch (error) {
            setMessage(
                type === 'login' ? 'Login failed. Please try again.' : 'Registration failed. Please try again.'
            );
            // Clear the message after 5 seconds
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>{type === 'login' ? 'Login' : 'Register'}</h1>
            </div>

            <div className="auth-form">
                {type === 'register' && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username || ''}
                        onChange={handleChange}
                    />
                )}
                
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                {/* Switch between login and register */}
                <button
                    className="switch-button"
                    onClick={() => setType(type === 'login' ? 'register' : 'login')}
                >
                    Switch to {type === 'login' ? 'Register' : 'Login'}
                </button>

                {/* Submit */}
                <button className="submit-button" onClick={handleSubmit} disabled={loading || message != ''}>
                    {loading ? (
                        <span className="loading">Loading...</span>  // Display loading text or animation
                    ) : (
                        type === 'login' ? 'Login' : 'Register'
                    )}
                </button>
            </div>
            {message && <p className="auth-message">{message}</p>}
        </div>
    );
}
