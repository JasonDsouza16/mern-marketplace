import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ItemContainer } from '../components/ItemContainer';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const createOrUpdateUser = async () => {
        try {
          const response = await axios.post('http://localhost:4000/api/users/create-or-update', {
            name: user.name,
            email: user.email,
          });
          console.log('User created or updated:', response.data);
        } catch (error) {
          console.error('Error creating or updating user:', error);
        }
      };

      createOrUpdateUser();
    }
  }, [isAuthenticated, user]);
  return (
    <div className="container">
      <ItemContainer/>
    </div>
  );
};



