import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { mockUsers } from '../mock/users';
import { ROLES } from '../constants';

export const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [activeRole, setActiveRole] = useState(user?.role || ROLES.ADMIN);

  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user]);

  const switchRole = (newRole) => {
    setActiveRole(newRole);
    // Find matching mock user for this role to make dashboard data seamless
    const matchingUser = mockUsers.find((u) => u.role === newRole) || {
      ...user,
      role: newRole
    };
    setUser(matchingUser);
    localStorage.setItem('pfa_user', JSON.stringify(matchingUser));
  };

  return (
    <RoleContext.Provider value={{ activeRole, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
