import { Box, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

export default function Rootlayout() {
  const navigate = useNavigate();
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
        sx={{
          height: 150,
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
        sx={{
          height: 100,
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid white",
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
      </Box>
    </Box>
  );
}
