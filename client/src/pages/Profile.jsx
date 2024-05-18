import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <Avatar src={user.picture} alt="Profile Picture" sx={{ width: 100, height: 100, mb: 2 }} />
          <Typography variant="h6" component="p">
            Name: {user.name}
          </Typography>
          <Typography variant="body1" component="p">
            Email: {user.email}
          </Typography>
          {/* Add more fields as needed */}
        </CardContent>
      </Card>
    )
  );
};

