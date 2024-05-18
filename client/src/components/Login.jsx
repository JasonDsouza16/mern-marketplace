import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";

export const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  useEffect(() => {
    loginWithRedirect();
  });
  return <></>;
};
