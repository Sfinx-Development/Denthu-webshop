import { Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  titel: string;
}

const AddAndEditAdminButton = (props: Props) => {
  return (
    <Button
      type="submit"
      data-cy="admin-add-product"
      variant="contained"
      sx={{ backgroundColor: "black" }}
    >
      <EditIcon fontSize="small" style={{ marginRight: "8px" }} />

      <Typography variant="body1">{props.titel}</Typography>
    </Button>
  );
};

export default AddAndEditAdminButton;
