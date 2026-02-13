'use client';

import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface UserContextType {
    role: 'user' | 'admin' | 'super-admin';
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
    role: 'user',
    isAdmin: false,
    isSuperAdmin: false,
    isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();
    const [role, setRole] = useState<'user' | 'admin' | 'super-admin'>('user');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const syncUser = async () => {
            if (user) {
                try {
                    // Determine API URL
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

                    const response = await axios.post(`${API_URL}/users/sync`, {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                    });

                    setRole(response.data.role);
                } catch (error) {
                    console.error('Failed to sync user:', error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isLoaded) {
                // User loaded but null (not signed in)
                setIsLoading(false);
                setRole('user');
            }
        };

        if (isLoaded) {
            syncUser();
        }
    }, [user, isLoaded]);

    const isAdmin = role === 'admin' || role === 'super-admin';
    const isSuperAdmin = role === 'super-admin';

    return (
        <UserContext.Provider value={{ role, isAdmin, isSuperAdmin, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserRole = () => useContext(UserContext);
