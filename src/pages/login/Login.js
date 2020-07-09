import React, { useState , useEffect , useRef} from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { withRouter } from "react-router-dom";
import axios from 'axios'
// styles
import useStyles from "./styles";

// logo
import logo from "./logo1.png";
import google from "../../images/google.svg";

// context
import { useUserDispatch, loginUser, signOut } from "../../context/UserContext";

import {baseURL} from '../constants'


function Login( props) {
  var classes = useStyles();

   // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [isEmailLoading, setIsEmailLoading] = useState(false);
  var [error,setError] = useState(null);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  var [emailID,setEmailID] = React.useState("");
  var [errorEmailID,setErrorEmailID] = React.useState(false);
  var [openLink,setOpenLink] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenLink(false);
    setOpenEmail(false);
    window.location.reload();
  };

  const handleCloseE = () => {
    setOpenEmail(false);
  };

  const handleNext = () => {
    setIsEmailLoading(true);
    if(emailID != "")
    {
        axios.post(baseURL +"api/usr/reset_password/", {emailID: emailID},
        {
            headers: {
            'content-type' : 'application/json'
            }
        }
      )
      .then(response => {
        let resStat=response.status;
        if(resStat==200)
        {
          setOpenEmail(true);
          setTimeout(() => {handleCloseE(); handleClose();} , 2000);
        }
        setIsEmailLoading(false);
        setErrorEmailID(false);
        } ).catch(error => {
        setErrorEmailID(true)});
    }
    else {
      setErrorEmailID(true);
    }
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} width="1000px" />
        <Typography className={classes.logotypeText}>Bebras</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>

            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome User
              </Typography>
                <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Enter Login ID"
                type="text"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>{
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError, setOpenLink
                      )
                      }
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
                 <React.Fragment>
                  <Button
                    color="primary"
                    size="large"
                    onClick={handleClickOpen}
                    className={classes.forgetButton}>
                    Forget Password
                  </Button>
                  <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
                    {openEmail ? (<DialogTitle id="form-dialog-title">Email sent successfully</DialogTitle>) : (<DialogTitle id="form-dialog-title">Send Mail</DialogTitle>)}
                    {openEmail ? null : (<>
                    <DialogContent>
                      <DialogContentText>
                        Please enter your registered email ID below. We'll send you a reset password link shortly.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        value={emailID}
                        helperText={errorEmailID ? 'Please try again!' : ''}
                        error={errorEmailID}
                        onChange={e => {setEmailID(e.target.value);setErrorEmailID(false)}}
                        fullWidth />
                    </DialogContent>
                    <DialogActions>
                      {isEmailLoading ? (
                      <CircularProgress size={26} className={classes.loginLoader} />
                    ) : (
                      <Button onClick={handleNext} color="primary">
                        Send
                      </Button>
                      )}
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                    </DialogActions></> )}
                  </Dialog>
                  </React.Fragment>
                  <React.Fragment>
                  <Dialog open={openLink} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Redirect to Bebras Portal</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Please go to the below link given to access your account:
                        <br/>
                        <a href='https://54.196.61.229:3001/studenthome' target="_blank">Bebras User Site</a>
                      </DialogContentText>
                    </DialogContent>
                  </Dialog>
                  </React.Fragment>
              </div>
            </React.Fragment>

        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
