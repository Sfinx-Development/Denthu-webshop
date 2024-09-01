import { Box, CardMedia, Typography } from "@mui/material";

interface ProductPreviewProps {
  name: string;
  imageUrl: string | null;
  description: string;
  price: number | string;
}
export default function ProductPreview(props: ProductPreviewProps) {
  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        {props.name}
      </Typography>
      {props.imageUrl && (
        <CardMedia
          component="img"
          alt={props.name}
          image={props.imageUrl}
          sx={{ height: "300px", objectFit: "contain", marginBottom: 2 }}
        />
      )}
      <Typography variant="body1" component="p" sx={{ whiteSpace: "pre-wrap" }}>
        {props.description}
      </Typography>
      <Typography variant="body1" component="p">
        {props.price} SEK
      </Typography>
    </Box>
  );
}
