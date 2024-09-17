import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

export default function Confirmation() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // För små skärmar

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row", // Kolumn på små skärmar
      }}
    >
      <Box sx={{ flex: 1, padding: 2 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          Tack för ditt köp!
        </Typography>
        <Typography>
          Dina varor är nu reserverade och redo att hämtas på DenThu
          skadeverkstad.
        </Typography>
        <Typography>
          Om du har betalat med kort dras inte pengarna förrän ordern är hämtad.
        </Typography>
        <Typography sx={{ paddingY: 2 }}>
          Vi skickar ett mail med en orderbekräftelse till dinmail@hotmail.com.
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "lightgrey",
          padding: 2,
          display: "flex",
          borderRadius: 2,
          flexDirection: "column",
          marginTop: isSmallScreen ? 2 : 0, // Lägger till marginal ovanpå på små skärmar
        }}
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: 600, marginBottom: 2, paddingX: 2 }}
        >
          Ordersummering
        </Typography>
        <Box
          sx={{
            flex: 1,
            paddingX: 2,
            paddingY: 1,
            display: "flex",
            gap: 3,
            flexDirection: isSmallScreen ? "column" : "row", // Ändrar layout till kolumn på små skärmar
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Betalningsmetod</Typography>
            <Typography>Kortbetalning</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Datum för order</Typography>
            <Typography>2024-10-02</Typography>
          </Box>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              height: 80,
            }}
          >
            <img
              src="https://i.imgur.com/FNo0BUN.jpeg"
              alt="flower"
              height="80"
              style={{ borderRadius: 10 }}
            />
            <Box sx={{ height: "100%" }}>
              <Typography sx={{ fontSize: 16, marginX: 2, fontWeight: 600 }}>
                Produktnamnet
              </Typography>
              <Typography sx={{ fontSize: 14, marginX: 2 }}>
                Pris per produkt: 150 kr
              </Typography>
              <Typography sx={{ fontSize: 14, marginX: 2 }}>
                Antal: 3 st
              </Typography>
            </Box>
            <Box sx={{ height: "100%" }}>
              <Typography
                sx={{
                  fontSize: 16,
                  marginX: 2,
                  fontWeight: 600,
                  justifyContent: "start",
                }}
              >
                450 kr
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
