import React from "react";

import {
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { CartItem } from "../slices/cartSlice";

interface CustomButton {
  icon: React.ReactNode;
  datacy: string;
  onClick: () => void;
}

interface ProductWithButtons extends CartItem {
  customButtons: CustomButton[];
}

interface Props {
  products: ProductWithButtons[];
}

function ListComponent(props: Props) {
  return (
    <List>
      {props.products.map((p) => (
        <ListItem
          key={p.id}
          data-cy="cart-item"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "100%",
            padding: "8",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Card className="w-10 h-10">
            <div style={{ overflow: "visible" }}>
              <img
                src={p.id}
                alt="Product"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </Card>
          <ListItemText
            primary={<Typography variant="body2">{}</Typography>}
            data-cy="product-title"
            sx={{ padding: "4px" }}
          />
          <ListItemText
            primary={
              <Typography variant="body2">{`${
                p.price * p.quantity
              } kr`}</Typography>
            }
            data-cy="product-price"
            sx={{ padding: "4px" }}
          />
          <ListItemText
            primary={
              <Typography variant="body2">{`${p.quantity} st`}</Typography>
            }
            data-cy="product-quantity"
            sx={{ padding: "4px" }}
          />
          <div>
            {p.customButtons.map((button, buttonIndex) => (
              <div key={buttonIndex}>
                <Button
                  onClick={button.onClick}
                  data-cy={button.datacy}
                  sx={{ color: "darkgray" }}
                >
                  {button.icon}
                </Button>
              </div>
            ))}
          </div>
        </ListItem>
      ))}
    </List>
  );
}

export default ListComponent;
