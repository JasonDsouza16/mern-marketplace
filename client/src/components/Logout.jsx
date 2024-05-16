import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";

export const Logout = () => {
  const { logout } = useAuth0();
  useEffect(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  });
  return <></>;
};
