import React, { useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ItemContainer } from "../components/ItemContainer";
import Loader from "../components/Loader";

export const HomePage = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const createOrUpdateUser = async () => {
      if (isAuthenticated) {
        try {
          let userData = {
            name: user.name,
            email: user.email,
            role: "user",
          };

          // Check if the user's email is xyz-sa@gmail.com
          if (user.email === "mern.marketplace.sa@gmail.com") {
            console.log('match')
            userData = {
              ...userData,
              role: "admin", // Set the role to admin
            };
          }

          const response = await axios.post(
            "http://localhost:4000/api/users/create-or-update",
            userData
          );
          console.log("User created or updated:", response.data);

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
  }, [isAuthenticated, user]);

  return (
    <div className="container">
      {!isLoading && <ItemContainer />}
      {isLoading && <Loader />}
    </div>
  );
};
