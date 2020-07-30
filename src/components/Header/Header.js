import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Typography
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  Person as AccountIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import Alert from '@material-ui/lab/Alert';

// styles
import useStyles from "./styles";

import {Link, Redirect} from 'react-router-dom'

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserDispatch, signOut } from "../../context/UserContext";

function checkTimeout(dispatch, history, setOpenAlert) {

  let today = new Date()

  let time = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " "
   + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  let endTime = new Date(localStorage.getItem('tokenExpiry'))

  let alertTime = endTime.getFullYear()+'-'+(endTime.getMonth()+1)+'-'+endTime.getDate() + " "
   + endTime.getHours() + ":" + (parseInt(endTime.getMinutes())-5) + ":" + endTime.getSeconds();

  let currTime = new Date(time)
  alertTime = new Date(alertTime)

  if( currTime >= alertTime && localStorage.getItem("timeRemaining")=="0"){
    setOpenAlert(true)
    localStorage.setItem("timeRemaining",1)
  }

  if( endTime <= currTime) {
    setTimeout(()=>{signOut(dispatch,history)},2000)
  }

};

export default function Header(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();
  var userName = localStorage.getItem('username');


  // local
  var [profileMenu, setProfileMenu] = useState(null);
  var [openAlert,setOpenAlert] = useState(false);
  var [openHelp,setOpenHelp] = useState(false);

  const handleClose =(event,reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
    setOpenHelp(false);
  }

  const onLinkClick = () => {
    setProfileMenu(false);
  };

  checkTimeout(userDispatch,props.history,setOpenAlert);

  if(localStorage.getItem('helpDialog') == "1"){
    setOpenHelp(true);
    localStorage.setItem('helpDialog',0)
  }

  return (
  <>
    <Snackbar open={openAlert} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
       onClose={()=>handleClose()}>
      <Alert onClose={()=>handleClose()} variant="filled" severity="info">
      <b>You will be logged out soon for security reasons. Please login again.</b>
      </Alert>
    </Snackbar>

    <Snackbar open={openHelp} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
       onClose={()=>handleClose()}>
      <Alert onClose={()=>handleClose()} variant="filled" severity="info">
      <b>If you're a first time user, check out the FAQs section first.</b>
      </Alert>
    </Snackbar>

    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Bebras India - Admin
        </Typography>
        <div className={classes.grow} />

        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>

        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h6" weight="small">
              {userName}
            </Typography>
          </div>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> <Link to="/app/userProfile" onClick={()=>{onLinkClick()}} style={{textDecoration:'none'}} >Profile </Link>
          </MenuItem>

          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => signOut(userDispatch, props.history)}
            >
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
    </>
  );
}
