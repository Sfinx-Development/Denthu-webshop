import { Box, Divider, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "start",
        minHeight: "100vh",
        width: "100%",
        padding: "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Integritetspolicy
      </Typography>

      <Typography sx={{ marginBottom: 2 }}>
        På Denthu värnar vi om din integritet och säkerheten för dina
        personuppgifter. Denna policy förklarar hur vi samlar in, använder och
        skyddar dina uppgifter.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        1. Vilka uppgifter samlar vi in?
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi samlar in följande information när du gör en beställning:
      </Typography>
      <ul>
        <li>
          **Kontaktuppgifter:** Förnamn, efternamn, e-postadress och
          telefonnummer.
        </li>
        <li>
          **Adress:** Endast vid leveranser, för att kunna skicka dina varor.
        </li>
        <li>
          **Betalningsuppgifter:** Hanteras av Swedbank eller annan
          betalningsleverantör.
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        2. Varför samlar vi in dessa uppgifter?
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi använder dina personuppgifter för att:
      </Typography>
      <ul>
        <li>Identifiera dig som kund och hantera din beställning.</li>
        <li>Kontakta dig vid frågor om din order.</li>
        <li>Leverera dina varor om du valt hemleverans.</li>
        <li>Skicka betalningsinformation till vår betalningsleverantör.</li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        3. Hur länge sparar vi dina uppgifter?
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi sparar dina uppgifter så länge det är nödvändigt för att uppfylla de
        syften som beskrivs i denna policy:
      </Typography>
      <ul>
        <li>
          Beställningsinformation lagras i enlighet med bokföringslagen i minst
          7 år.
        </li>
        <li>
          Kontaktuppgifter raderas eller anonymiseras när de inte längre behövs
          för kommunikation.
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        4. Delning av data med tredje part
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi delar dina uppgifter med:
      </Typography>
      <ul>
        <li>
          **Swedbank och andra betalningsleverantörer:** För att kunna hantera
          betalningar.
        </li>
        <li>
          **Transportföretag:** Vid leveranser delar vi din adress och
          kontaktinformation med transportföretaget.
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        5. Dina rättigheter
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>Du har rätt att:</Typography>
      <ul>
        <li>Begära en kopia av de uppgifter vi har om dig.</li>
        <li>Begära rättelse av felaktiga uppgifter.</li>
        <li>
          Begära radering av dina uppgifter när de inte längre är nödvändiga.
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        6. Kontakt
      </Typography>
      <Typography>
        Om du har frågor om vår integritetspolicy eller vill utöva dina
        rättigheter, vänligen kontakta oss:
        <br />
        E-post:{" "}
        <a href="mailto:denthu.webbshop@outlook.com">
          denthu.webbshop@outlook.com
        </a>
      </Typography>
    </Box>
  );
}
