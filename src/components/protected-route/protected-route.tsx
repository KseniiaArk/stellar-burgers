import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { selectIsAuthChecked, selectUser } from '../../services/slices/auth-slice';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

export const ProtectedRoute = ({
  children
}: {
  children: React.ReactElement;
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) return children;

  return (
    <Navigate
      to='/login'
      state={{
        from: {
          ...location,
          background: location.state?.background,
          state: null
        }
      }}
      replace
    />
  );
};

export const UnAuthRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (!user) return children;

  
  const from = location.state?.from || { pathname: '/' };
  const backgroundLocation = location.state?.from?.background || null;

  return (
    <Navigate replace to={from} state={{ background: backgroundLocation }} />
  );
};
