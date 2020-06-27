import React, { useState , useEffect , useRef} from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab, InputAdornment,
  TextField, IconButton,
  Fade, Snackbar
} from "@material-ui/core";

import { withRouter, Redirect } from "react-router-dom";
import { Visibility, VisibilityOff} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios'
// styles
import useStyles from "./styles";

// logo
import logo from "./logo1.png";

// context
import { useUserDispatch, loginUser, signOut } from "../../context/UserContext";

import {baseURL} from '../constants'


function Login( props) {
  var classes = useStyles();

   // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error,setError] = useState(null);
  var [confirmPassword, setConfirmPassword] = useState("");
  var [password, setPassword] = useState("");
  var [openSuccess,setOpenSuccess] = useState(false);
  var [openError,setOpenError] = useState(false)
  var [onClick,setOnClick] = useState(false)
  var [uidb,setUidb] = useState("")
  var [token,setToken] = useState("")
  var [showPassword,setShowPassword] = useState(false)
  var [showPasswordC,setShowPasswordC] = useState(false)
  var [passError,setPassError] = useState(false)

  useEffect(() => {
    var str = props.location.search;
    var uidbX = str.match(new RegExp("=" + "(.*)" + "&token"));
    var tokenString = str.substring(
    str.lastIndexOf("token") + 6);
    setUidb(uidbX[1])
    setToken(tokenString)
  },[])

  const confirmNewPassword = () => {

    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    if(!password.match(re))
        {
          setPassError(true)
            return
        }
    if(password!= confirmPassword)
    {
      setError(true)
    }
    else {
      axios.post(baseURL+'api/usr/reset_password_confirm/(%3FP'+uidb+'%5B0-9A-Za-z%5D+)-(%3FP'+token+'.+)/$',
        {password : password},
        {
          headers: {
            'content-type' : 'application/json'
          }
        }
      ).then(response => {
        setTimeout(() => {setOpenSuccess(true)},1000);
        setTimeout(() => {
          setOpenSuccess(false)
          setOnClick(true)
        },4000);
      }).catch(error => {
        setTimeout(() => {setOpenError(true);},1000);
        setTimeout(() => {
          setOpenError(false)
        },4000);
      });
    }
  }

  const handleClose = () => {
    setError(false)
    setPassError(false)
  };



  return (
    <Grid container className={classes.container}>
    {onClick ? <Redirect to="/login" /> :null}
    <Snackbar open={passError} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="info">
        <b>Please check if your password length is abover 8 characters and contains atleast one lowercase letter, one uppercase letter,
        one numeric digit, and one special character!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccess} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="success">
        <b>Password has been Reset Successfully!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="error">
        <b>Error occured. Try Again!</b>
        </Alert>
      </Snackbar>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} width="1000px" />
        <Typography className={classes.logotypeText}>Bebras</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>

            <React.Fragment>
              <Typography variant="h4" className={classes.greeting}>
                Reset Password
              </Typography>
              <br/>
                <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Passwords don't match. Please try again...
                </Typography>
              </Fade>
              <TextField
                id="password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                  endAdornment:(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowPassword(!showPassword)}
                  onMouseDown={event => { event.preventDefault();}}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
                }}
                value={password}
                onChange={e => {setPassword(e.target.value); setError(false)}}
                margin="normal"
                placeholder="Enter New Password"
                fullWidth

              />
              <TextField
                id="passwordConfirm"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                  endAdornment:(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowPasswordC(!showPasswordC)}
                  onMouseDown={event => { event.preventDefault();}}
                  edge="end"
                >
                  {showPasswordC ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
                }}
                value={confirmPassword}
                onChange={e => {setConfirmPassword(e.target.value); setError(false)}}
                margin="normal"
                placeholder="Confirm Password"
                type={showPasswordC ? 'text' : 'password'}
                fullWidth

              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      confirmPassword.length === 0 || password.length === 0
                    }
                    onClick={() =>{confirmNewPassword()}
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </React.Fragment>

        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
