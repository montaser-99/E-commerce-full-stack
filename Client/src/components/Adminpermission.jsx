import React from 'react';
import { useSelector } from 'react-redux';
import isAdmin from '../Utils/isAdmin';

const AdminPermission = ({ children }) => {
  const { role } = useSelector((state) => state.user.userinfo || {});

  if (!role) return null; 

  return isAdmin(role) ? (
    <>{children}</>
  ) : (
    <p className="text dark">
      You do not have permission to access this section.
    </p>
  );
};

export default AdminPermission;
