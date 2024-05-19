import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

export const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card variant="outlined" sx={{ width: 400 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              Profile
            </Typography>
            <Avatar
              src={user.picture}
              alt="Profile Picture"
              sx={{ width: 100, height: 100, mb: 2, mx: "auto" }}
            />
            <Typography variant="h6" component="p" align="center">
              Name: {user.name}
            </Typography>
            <Typography variant="body1" component="p" align="center">
              Email: {user.email}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  );
};
