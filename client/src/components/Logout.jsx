import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Logout = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ returnTo: window.location.origin });
  }, [logout]);

  return null;
};
