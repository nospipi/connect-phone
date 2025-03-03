"use client";

import { useEffect } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
  useOrganization,
} from "@clerk/nextjs";
import { Box } from "@mui/material";

const Footer = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  return (
    <Box
      sx={{
        display: "flex",
        padding: 2,
        borderTop: "1px solid #3f3f3f",
        alignItems: "center",
        gap: 2,
        fontSize: "default",
        fontWeight: "light",
      }}
    >
      <UserButton />
      <span>
        {user?.firstName} {user?.lastName}
      </span>
    </Box>
  );
};
export default Footer;
