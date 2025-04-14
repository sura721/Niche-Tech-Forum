import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../store/authStore.store';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore(selectAuthLoading);
    const error = useAuthStore(selectAuthError);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const clearError = useAuthStore((state) => state.clearError);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        return () => { clearError(); };
    }, [isAuthenticated, navigate, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        if (!username || !email || !password) {
             return;
        }
        try {
            const userData = { username, email, password };
            await register(userData);
        } catch (err) {
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 md:mt-16 mb-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Create Your Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                     <p className="text-red-400 text-sm text-center p-3 bg-red-900/50 border border-red-700/60 rounded-md">
                        {error}
                    </p>
                )}

                <div>
                    <label
                        htmlFor="username"
                        className="block mb-1.5 text-sm font-medium text-gray-300"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-100 placeholder-gray-400 transition-colors duration-200 text-sm"
                        placeholder="Choose a username"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block mb-1.5 text-sm font-medium text-gray-300"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-100 placeholder-gray-400 transition-colors duration-200 text-sm"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block mb-1.5 text-sm font-medium text-gray-300"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        autoComplete="new-password"
                        className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-100 placeholder-gray-400 transition-colors duration-200 text-sm"
                        placeholder="Minimum 6 characters"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Registering...
                       </span>
                    ) : 'Sign Up'}
                </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                    Login here
                </Link>
            </p>
        </div>
    );
}

export default SignupPage;