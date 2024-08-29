import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Badge, Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../slices/store";

export default function Rootlayout() {
  const [isWiggling, setIsWiggling] = useState(false);
  const navigate = useNavigate();
  const admin = useAppSelector((state) => state.adminSlice.admin);

  const handleWiggle = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <Box
        component="header"
        sx={{
          height: 150,
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src="https://i.imgur.com/kQZSgyD.jpeg"
          alt="Denthu logo"
          height={"120px"}
          onClick={() => {
            navigate("/");
          }}
          style={{ cursor: "pointer" }}
        />

        <IconButton
          onClick={() => {
            handleWiggle();
            navigate("/cart");
          }}
          sx={{
            position: "absolute",
            right: 20,
            justifyContent: "right",
            color: "black",
            backgroundColor: "white",
            animation: isWiggling ? "wiggle 0.3s ease-in-out infinite" : "none",
            "&:hover": { backgroundColor: "white" },
            borderRadius: "50%",
            "@keyframes wiggle": {
              "0%, 100%": {
                transform: "rotate(-5deg)",
              },
              "50%": {
                transform: "rotate(5deg)",
              },
            },
          }}
        >
          <Badge color="success">
            <ShoppingBagIcon />
          </Badge>
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          height: 100,
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid white",
          position: "relative",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "white",
            letterSpacing: 1,
          }}
        >
          © 2024 DenThu Webshop - All Rights Reserved
        </Typography>

        <Typography
          variant="body2"
          onClick={() => navigate("/admin/signin")}
          sx={{
            color: "white",
            position: "absolute",
            right: 20, // Diskret placering i hörnet
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
              color: "gray", // Färgändring vid hover för att indikera att det är en länk
            },
          }}
        >
          Admin
        </Typography>
      </Box>
    </Box>
  );
}
