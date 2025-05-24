"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useWalletConnection from '@/hooks/useWalletConnection';

// Define the possible user roles
export type UserRole = 'publisher' | 'advertiser' | null;

// Define the context shape
interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isRoleSelected: boolean;
}

// Create the context with default values
const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
  isRoleSelected: false,
});

// Custom hook to use the role context
export const useRole = () => useContext(RoleContext);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRoleState] = useState<UserRole>(null);
  const { connected } = useWalletConnection();
  const router = useRouter();

  // Load the role from localStorage on component mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'publisher' || savedRole === 'advertiser') {
      setRoleState(savedRole);
    }
  }, []);

  // Set the role and save it to localStorage
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    
    if (newRole) {
      localStorage.setItem('userRole', newRole);
      // Navigate to the appropriate dashboard
      router.push(`/dashboard/${newRole}`);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  // Check if a role is selected
  const isRoleSelected = role !== null;

  // Clear role if wallet disconnects
  useEffect(() => {
    if (!connected && role) {
      setRoleState(null);
      localStorage.removeItem('userRole');
    }
  }, [connected, role]);

  return (
    <RoleContext.Provider value={{ role, setRole, isRoleSelected }}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleProvider;
