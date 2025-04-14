import React, { useState, useEffect } from 'react';
import { useAuthStore, selectUserInfo } from '../store/authStore.store';
import { updateUserProfile, getUserProfile } from '../services/userService';
import {
    usePostStore,
    selectMyPosts,
    selectLoadingMyPosts,
    selectMyPostsError
} from '../store/postStore';
import PostList from '../components/PostList';

function ProfilePage() {
    const zustandUserInfo = useAuthStore(selectUserInfo);
    const updateUserInfoInStore = useAuthStore((state) => state.updateUserInfo);

    const [formData, setFormData] = useState({ username: '', email: '', bio: '' });
    const [initialData, setInitialData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Added loading state for profile fetch

    const myPosts = usePostStore(selectMyPosts);
    const isLoadingMyPosts = usePostStore(selectLoadingMyPosts);
    const myPostsError = usePostStore(selectMyPostsError);
    const fetchMyPosts = usePostStore((state) => state.fetchMyPosts);
    const clearMyPostsError = usePostStore((state) => state.clearMyPostsError);

    useEffect(() => {
        const loadProfile = async () => {
             setIsLoadingProfile(true);
             setIsUpdating(false);
             setUpdateError('');
             setUpdateSuccess('');
             try {
                 const data = await getUserProfile();
                 const profileData = {
                     username: data.username || '',
                     email: data.email || '',
                     bio: data.bio || ''
                 };
                 setFormData(profileData);
                 setInitialData(data); 
             } catch (err) {
                 setUpdateError(err.response?.data?.message || err.message || 'Failed to load profile data.');
             } finally {
                 setIsLoadingProfile(false);
             }
        }
        loadProfile();
        fetchMyPosts();
        return () => {
            clearMyPostsError();
        };
    }, [fetchMyPosts, clearMyPostsError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setUpdateSuccess('');
        setUpdateError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess('');

        const currentInitialComparable = {
            username: initialData?.username || '',
            email: initialData?.email || '',
            bio: initialData?.bio || ''
        };

        if (JSON.stringify(formData) === JSON.stringify(currentInitialComparable)) {
             setUpdateError("No changes detected.");
             return;
        }
        setIsUpdating(true);
        try {
            const updatedData = await updateUserProfile(formData);
            updateUserInfoInStore(updatedData);
            setFormData({ username: updatedData.username, email: updatedData.email, bio: updatedData.bio });
            setInitialData(updatedData); // Update initialData to reflect the saved state
            setUpdateSuccess('Profile updated successfully!');
        } catch (err) {
            setUpdateError(err.response?.data?.message || err.message || 'Failed to update profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoadingProfile) {
         return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
         );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            <div className="max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-center mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Your Profile
                </h2>
                 {initialData?.createdAt && (
                    <p className="text-sm text-gray-500 text-center mb-8">
                        Member since: {new Date(initialData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                 )}
                 <form onSubmit={handleSubmit} className="space-y-5">
                     {updateError && (
                        <p className="text-red-400 text-sm text-center p-3 bg-red-900/50 border border-red-700/60 rounded-md">
                            {updateError}
                        </p>
                      )}
                     {updateSuccess && (
                        <p className="text-green-400 text-sm text-center p-3 bg-green-900/40 border border-green-700/50 rounded-md">
                            {updateSuccess}
                        </p>
                      )}

                     <div>
                         <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-gray-300">Username:</label>
                         <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-100 placeholder-gray-400 transition-colors duration-200 text-sm"
                        />
                     </div>

                     <div>
                         <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-300">Email:</label>
                         <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-100 placeholder-gray-400 transition-colors duration-200 text-sm"
                         />
                     </div>

                     <div>
                         <label htmlFor="bio" className="block mb-1.5 text-sm font-medium text-gray-300">Bio:</label>
                         <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength="150"
                            rows="4"
                            className="w-full p-3 bg-gray-700/80 border border-gray-600/70 rounded-md focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 focus:bg-gray-700 outline-none text-gray-100 placeholder-gray-400 resize-y transition-colors duration-200 text-sm"
                            placeholder="Tell us a little about yourself..."
                          />
                         <p className="text-xs text-gray-500 mt-1 text-right">{formData.bio?.length || 0}/150</p>
                     </div>

                     <button
                        type="submit"
                        disabled={isUpdating || JSON.stringify(formData) === JSON.stringify({ username: initialData?.username || '', email: initialData?.email || '', bio: initialData?.bio || '' })}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                         {isUpdating ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                     </button>
                 </form>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700/50">
                <h3 className="text-2xl font-semibold mb-6 text-gray-100">Your Posts</h3>

                 {isLoadingMyPosts && (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
                     </div>
                 )}

                 {!isLoadingMyPosts && myPostsError && (
                     <div className="text-center py-5 text-red-400 bg-red-900/50 border border-red-700/60 p-4 rounded-md text-sm">
                        <p className="font-medium">Error loading your posts:</p>
                        <p>{myPostsError}</p>
                    </div>
                 )}

                 {!isLoadingMyPosts && !myPostsError && myPosts.length === 0 && (
                     <div className="text-center py-10 text-gray-500">
                        <p>You haven't created any posts yet.</p>
                    
                    </div>
                 )}

                 {!isLoadingMyPosts && !myPostsError && myPosts.length > 0 && (
                     <PostList posts={myPosts} />
                 )}
            </div>
        </div>
    );
}

export default ProfilePage;