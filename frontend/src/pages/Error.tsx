import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
        width: "100%",
        padding: 2,
      }}
    >
      {/* <ErrorOutlineIcon sx={{ fontSize: 80, color: "#d32f2f", mb: 2 }} /> */}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        Oops! Något gick fel.
      </Typography>
      <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
        Vi kunde tyvärr inte hitta sidan du letar efter.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ textTransform: "none", paddingX: 3, paddingY: 1 }}
      >
        Tillbaka till startsidan
      </Button>
    </Box>
  );
}
