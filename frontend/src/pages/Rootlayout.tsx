import { Badge, Box, IconButton, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useState } from "react";

export default function Rootlayout() {
  const [isWiggling, setIsWiggling] = useState(false);
  const navigate = useNavigate();

  const handleWiggle = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 2000);
  };
 

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
          position: "relative", 
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

{/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
             marginTop: "0px",
               
         
          }}
        > */}
       
           <IconButton
              onClick={() => {
                handleWiggle();
                navigate("/cart"); // Navigera till "/cart" samtidigt
              }}
              sx={{
                position: "absolute",
                right: 20, 
                justifyContent: "right",
                color: "black",
                // backgroundColor: "#662c9c",
                backgroundColor: "white",
                animation: isWiggling
                  ? "wiggle 0.3s ease-in-out infinite"
                  : "none",
                "&:hover": { backgroundColor: "white" },
                borderRadius: "50%",
                "@keyframes wiggle": {
                  "0%, 100%": {
                    transform: "rotate(-5deg)",
                  },
                  "50%": {
                    transform: "rotate(5deg)",
                  },
                },
              }}
            >
              {/* {cart && cart.items.length > 0 ? (
                <Badge badgeContent={getTotalAmountCartItems()} color="success">
                  <ShoppingBagIcon />
                </Badge>
              ) : (
                <ShoppingBagIcon />
              )} */}

              <Badge  color="success">
                  <ShoppingBagIcon />
                </Badge>
             
                
              
            </IconButton>
            {/* </Box> */}
           
        
        
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
