import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { Product } from "../../data/types";
import TableMUI from "../components/TableMUIComponent";
import { logOutUserAsync } from "../slices/adminSlice";
import { getProductsAsync, Product } from "../slices/productSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";
// import { useProductContext } from "../contexts/ProductContext";
// import { useAppDispatch } from "../store/store";
// import { logOutUserAsync } from "../store/userSlice";

export default function OrdersForShipping() {
 

  return (
 <Typography>HEJ KLICKA I SKICKAD ORDER</Typography>
  );
}
