import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "../../data/types";
import { logInUserAsync } from "../slices/adminSlice";
import { useAppDispatch, useAppSelector } from "../slices/store";

export default function AdminSignIn() {
  const error = useAppSelector((state) => state.adminSlice.error);
  const user = useAppSelector((state) => state.adminSlice.admin);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [keepAlive, setKeepAlive] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  //deneenenne

  const handleSignIn = async () => {
    try {
      const login: LogIn = {
        email: email,
        password: password,
        keepAlive: keepAlive,
      };
      await dispatch(logInUserAsync(login));
      setSignedIn(true);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  useEffect(() => {
    if (user && !error && signedIn) {
      navigate("/admin");
    }
  }, [user, signedIn, error, navigate]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  const handleKeepAliveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeepAlive(event.target.checked);
  };

  return (
    <Container
      sx={{
        padding: "20px",
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          padding: 50,
        }}
      >
        {error && (
          <Typography variant="h6" color="error">
            Inloggning misslyckades
          </Typography>
        )}
        <TextField
          id="standard-basic"
          label="Email"
          variant="standard"
          sx={{ width: "250px", marginTop: 5 }}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={handleKeyPress}
        />

        <FormControl sx={{ width: "250px", marginTop: 5 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleKeyPress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={keepAlive} onChange={handleKeepAliveChange} />}
              label="Håll mig inloggad"
            />
          </FormGroup>
        </FormControl>

        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            marginBottom: 1,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          onClick={handleSignIn}
        >
          Logga in
        </Button>
      </div>
    </Container>
  );
}
