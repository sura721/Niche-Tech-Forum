import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectUserInfo } from '../store/authStore.store';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const CATEGORIES = ['JavaScript', 'React', 'Node.js', 'Next.js'];

function Navbar() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const userInfo = useAuthStore(selectUserInfo);
    const logout = useAuthStore((state) => state.logout);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
            setSearchQuery('');
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                const toggleButton = document.getElementById('mobile-menu-button');
                if (!toggleButton || !toggleButton.contains(event.target)) {
                    setIsMobileMenuOpen(false);
                }
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <nav
            className="bg-gray-900 border-b border-gray-700 shadow-lg sticky top-0 z-50"
            ref={menuRef}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                        <button
                            id="mobile-menu-button"
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                to="/"
                                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                JS Forum
                            </Link>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:ml-6">
                            <div className="flex space-x-4">
                                <Link
                                    to="/"
                                    className="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Home
                                </Link>
                                {CATEGORIES.map(category => (
                                    <Link
                                        key={category}
                                        to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                                        className="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                                    >
                                        {category}
                                    </Link>
                                ))}
                                <Link to="/posts/new" className="text-gray-300 hover:text-indigo-400 px-0.5 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"> <PlusIcon className='w-5 h-5'/> </Link>
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                        <div className="hidden lg:block ml-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 xl:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200 placeholder-gray-400 transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                                    aria-label="Search"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </button>
                            </form>
                        </div>

                        <div className="hidden lg:flex items-center space-x-2 ml-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                                    >
                                        {userInfo?.username || 'Profile'}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md whitespace-nowrap"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden bg-gray-900 border-t border-gray-800" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <div className="px-2 py-2">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="search"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200 placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-400"
                                    aria-label="Search"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </button>
                            </form>
                        </div>

                        <Link
                            to="/"
                            className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>

                        <hr className="border-gray-800 my-1" />

                        <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Categories
                        </p>
                        {CATEGORIES.map(category => (
                            <Link
                                key={`mobile-${category}`}
                                to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                                className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {category}
                            </Link>
                        ))}

                        <hr className="border-gray-800 my-1" />

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-indigo-400 hover:text-indigo-300 hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {userInfo?.username || 'Profile'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-base font-medium text-center transition-colors duration-200 shadow-md mt-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;