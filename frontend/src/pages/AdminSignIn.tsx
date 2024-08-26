// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import {
//   Button,
//   Container,
//   FormControl,
//   IconButton,
//   Input,
//   InputAdornment,
//   InputLabel,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LogIn } from "../../data/types";
// import { useAppDispatch, useAppSelector } from "../store/store";
// import { logInUserAsync } from "../store/userSlice";

// //roomreducer?? kanske? så att allt ändras automatiskt med färger beroende på var du är inne på?
// export default function AdminSignIn() {
//   const error = useAppSelector((state) => state.adminSlice.error);
//   const user = useAppSelector((state) => state.adminSlice.admin);

//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [signedIn, setSignedIn] = useState(false);
//   const handleClickShowPassword = () => setShowPassword((show) => !show);
//   const handleMouseDownPassword = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();
//   };

//   //   useEffect(() => {
//   //     console.log("LOGGAR UT");
//   //     dispatch(logOutUserAsync());
//   //   }, []);

//   const handleSignIn = async () => {
//     try {
//       console.log("LOGGAR IN");
//       const login: LogIn = {
//         email: email,
//         password: password,
//       };
//       await dispatch(logInUserAsync(login));
//       //   await dispatch(GetMyTeamsAsync());
//       //hämta produkter ska ske här istället
//       setSignedIn(true);
//     } catch (error) {
//       console.error("Sign in error:", error);
//     }
//   };

//   useEffect(() => {
//     //och om produkter finns
//     if (user && !error && signedIn) {
//       console.log("HÄR INNE");
//       navigate("/admin");
//     }
//   }, [user, signedIn]);

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       handleSignIn();
//     }
//   };

//   return (
//     <Container
//       sx={{
//         padding: "20px",
//         height: "100vh",
//         width: "100%",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           flex: 1,
//           padding: 50,
//         }}
//       >
//         {error ? (
//           <Typography variant="h6">Inloggning misslyckades</Typography>
//         ) : null}
//         <TextField
//           id="standard-basic"
//           label="Email"
//           variant="standard"
//           sx={{ width: "250px", marginTop: 5 }}
//           onChange={(event) => {
//             setEmail(event.target.value);
//           }}
//           onKeyDown={handleKeyPress}
//         />

//         <FormControl sx={{ width: "250px", marginTop: 5 }} variant="standard">
//           <InputLabel htmlFor="standard-adornment-password">
//             Password
//           </InputLabel>
//           <Input
//             id="standard-adornment-password"
//             type={showPassword ? "text" : "password"}
//             onChange={(event) => {
//               setPassword(event.target.value);
//             }}
//             onKeyDown={handleKeyPress}
//             endAdornment={
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={handleClickShowPassword}
//                   onMouseDown={handleMouseDownPassword}
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             }
//           />
//         </FormControl>

//         <Button
//           variant="contained"
//           sx={{
//             marginTop: 4,
//             marginBottom: 1,
//             paddingRight: 5,
//             paddingLeft: 5,
//           }}
//           onClick={handleSignIn}
//         >
//           Logga in
//         </Button>
//       </div>
//     </Container>
//   );
// }
