// import { zodResolver } from "@hookform/resolvers/zod";
// import { Box, Paper, TextField, Typography } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import { z } from "zod";
// import { Product } from "../../data/types";
// import AddAndEditAdminButton from "../components/AddAndEditAdminButton";
// import { useProductContext } from "../contexts/ProductContext";

// const FormSchema = z.object({
//   title: z.string().min(1, { message: "Titel är obligatoriskt." }),
//   description: z
//     .string()
//     .min(1, { message: "Beskrivning måste vara 5 siffror." }),
//   price: z
//     .string()
//     .min(1, { message: "Pris är obligatoriskt." })
//     .refine(
//       (value) => {
//         const parsedPrice = parseFloat(value);
//         return !isNaN(parsedPrice) && parsedPrice > 0;
//       },
//       { message: "Ogiltigt pris." }
//     ),
//   image: z.string().url({ message: "Bild ska vara en url" }),
//   inStock: z
//     .string()
//     .min(1, { message: "Antal är obligatoriskt." })
//     .refine(
//       (value) => {
//         const parsedPrice = parseFloat(value);
//         return !isNaN(parsedPrice) && parsedPrice > 0;
//       },
//       { message: "Antal måste vara en giltig siffra och mer än 0." }
//     ),
// });

// export default function AdminAddAndEdit() {
//   const { allProducts, editProduct, addProduct } = useProductContext();

//   const navigate = useNavigate();

//   const { param } = useParams();

//   const productToEdit = allProducts.find((p) => p.id == param);

//   const isNewProductMode = param === "ny";

//   if (!productToEdit && !isNewProductMode) {
//     return <Typography variant="h6">Ojdå, produkten hittades inte.</Typography>;
//   }

//   const { register, handleSubmit, formState, getValues, reset } =
//     useForm<Product>({
//       resolver: zodResolver(FormSchema),
//     });

//   const handleOnSubmit = async () => {
//     const product: Product = {
//       id: productToEdit ? productToEdit.id : "default",
//       title: getValues("title"),
//       description: getValues("description"),
//       price: getValues("price"),
//       image: getValues("image"),
//       inStock: getValues("inStock"),
//     };

//     productToEdit
//       ? editProduct(product)
//       : isNewProductMode
//       ? addProduct(product)
//       : "";

//     reset();

//     navigate("/admin");
//   };

//   return (
//     <Paper sx={{ display: "flex", flexDirection: "column" }}>
//       <Paper
//         sx={{
//           display: "flex",
//           flex: "1",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6" padding={2} data-cy="product-form">
//           {productToEdit ? "Redigera produkt" : "Lägg till ny produkt"}
//         </Typography>

//         <form
//           onSubmit={handleSubmit(handleOnSubmit)}
//           data-cy="product-form"
//           className="flex flex-1 flex-col items-center"
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               width: "100%",
//             }}
//           >
//             <TextField
//               label="Titel"
//               {...register("title")}
//               inputProps={{
//                 "data-cy": "product-title",
//               }}
//               variant="standard"
//               defaultValue={productToEdit?.title}
//               helperText={
//                 formState.errors.title ? (
//                   <Typography
//                     variant="caption"
//                     data-cy="product-title-error"
//                     sx={{ color: "red" }}
//                   >
//                     {formState.errors.title?.message}
//                   </Typography>
//                 ) : null
//               }
//               error={Boolean(formState.errors.title)}
//             />

//             <TextField
//               label="Beskrivning"
//               {...register("description")}
//               inputProps={{
//                 "data-cy": "product-description",
//               }}
//               variant="standard"
//               defaultValue={productToEdit?.description}
//               helperText={
//                 formState.errors.description ? (
//                   <Typography
//                     variant="caption"
//                     data-cy="product-description-error"
//                     sx={{ color: "red" }}
//                   >
//                     {formState.errors.description?.message}
//                   </Typography>
//                 ) : null
//               }
//               error={Boolean(formState.errors.description)}
//             />

//             <TextField
//               label="Pris"
//               {...register("price")}
//               variant="standard"
//               inputProps={{
//                 "data-cy": "product-price",
//               }}
//               defaultValue={productToEdit?.price}
//               helperText={
//                 formState.errors.price ? (
//                   <Typography
//                     variant="caption"
//                     data-cy="product-price-error"
//                     sx={{ color: "red" }}
//                   >
//                     {formState.errors.price?.message}
//                   </Typography>
//                 ) : null
//               }
//               error={Boolean(formState.errors.price)}
//             />

//             <TextField
//               label="Bild (url)"
//               {...register("image")}
//               variant="standard"
//               inputProps={{
//                 "data-cy": "product-image",
//               }}
//               defaultValue={productToEdit?.image}
//               helperText={
//                 formState.errors.image ? (
//                   <Typography
//                     variant="caption"
//                     data-cy="product-image-error"
//                     sx={{ color: "red" }}
//                   >
//                     {formState.errors.image?.message}
//                   </Typography>
//                 ) : null
//               }
//               error={Boolean(formState.errors.image)}
//             />

//             <TextField
//               label="Antal"
//               {...register("inStock")}
//               variant="standard"
//               defaultValue={productToEdit ? productToEdit.inStock : 1}
//             />

//             <Box mt={2} mb={2}>
//               <AddAndEditAdminButton
//                 titel={productToEdit ? "Redigera" : "Lägg till"}
//               />
//             </Box>
//           </Box>
//         </form>
//       </Paper>
//     </Paper>
//   );
// }
