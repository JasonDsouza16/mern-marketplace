import React, { useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ItemContainer } from "../components/ItemContainer";
import Loader from "../components/Loader";

export const HomePage = () => {
  const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const createOrUpdateUser = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();

          // Make an API call to check if the user is an admin
          const adminCheckResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/admin/isAdminCheck`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                email: user.email,
              },
            }
          );

          const userData = {
            name: user.name,
            email: user.email,
            role: adminCheckResponse.data.isAdmin ? "admin" : "user",
          };

          // Create or update user in your database
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/users/create-or-update`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Navigate to admin dashboard if user is admin
          if (response.data.role === "admin") {
            navigate("/admin");
          }
        } catch (error) {
          console.error("Error creating or updating user:", error);
        }
      }
    };

    createOrUpdateUser();
  }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

  return (
    <div className="container">
      {!isLoading && <ItemContainer />}
      {isLoading && <Loader />}
    </div>
  );
};
