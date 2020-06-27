import React, { Component } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles } from '@material-ui/core/styles';
import validator from 'validator';
import { Redirect} from 'react-router-dom'

import {Paper, TextField, Typography, Box, Button, OutlinedInput, FormHelperText,
        InputLabel, InputAdornment, FormControl, IconButton, Radio, FormControlLabel, Snackbar,
        Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Card, CardActionArea, CardContent, CardMedia,
        Divider, AppBar, Tab, Tabs} from '@material-ui/core';
import {Error, Visibility, VisibilityOff, VpnKey, Edit} from '@material-ui/icons';

import DatePicker from 'react-date-picker';
import Select from 'react-select';

import {useUserState } from "../../context/UserContext";
import UP from "../../images/pf3.jpg";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import {baseURL} from "../constants.js"
import ErrorBoundary from '../error/ErrorBoundary'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import TableUsers from './UserProfileTableUsers.js'
import TableQuestions from './UserProfileTableQuestions.js'
import TableSchools from './UserProfileTableSchools.js'

const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: 200,
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  overlay: {
    position:'absolute',
    top:'40px',
    left:'40px',
    color:'white',
    backgroundColor:'black'
  },
   paper:{
    display: "flex",
    flexDirection: "column",
    float: "right"
  },
});

var options_gender=[];

class UserProfile extends React.Component{


    constructor(props)
    {
        super(props)
        this.state = {
            dob : "",
            emailID : "",
            errorEmailID : false,
            errordob : false,
            openPassError:false,
            open : false,
            phone:"",
            openPass:false,
            OldPasswordID:"",
            PasswordID:"",
            ConfirmPasswordID:"",
            errorOldPasswordID: false,
            errorPasswordID : false,
            errorConfirmPasswordID : false,
           username: localStorage.getItem("username"),
           userID:'',
           selectedOption:'',
           createdon:'',
           userName:'',
           acronym : '',
           codeID:'',
           codeName:'',
           selectedOptionGender:"",
           GenderList:[],
            tabValue:0,
            openDetailsSuccess:false,
            openError:false,
            openPassSuccess:false,
            showPasswordO:false,
            showPasswordP:false,
            showPasswordC:false

        };
    }
    async componentDidMount(){
    try{
        let gresult = await axios.get(
        baseURL+'api/usr/getProfile/'+this.state.username, {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );

        let ph;
             if(gresult.data[0].phone == null) {
                ph = ""
            }
            else {
                ph = gresult.data[0].phone
            }

                this.setState({
                    userID: gresult.data[0].userID,
                    userName : gresult.data[0].username,
                    phone:ph,
                    selectedOption:gresult.data[0].gender.codeName,
                    dob:gresult.data[0].birthdate,
                    emailID:gresult.data[0].loginID,
                    createdon : gresult.data[0].created_on,
                });

        var str= this.state.userName.match(/\b(\w)/g).join('');
        this.setState({acronym:str});


    }catch(error){}


       try{
        let gresultG = await axios.get(
        baseURL+'api/usr/getGender/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
        this.setState({
               GenderList:gresultG.data,
               selectedOptionGender: this.state.selectedOption,
        })

          options_gender.length=0;
        for(let i=0;i<this.state.GenderList.length;i++)
        {
            let x =this.state.GenderList[i].codeName;
            options_gender.push({"value": x , "label": x })
        }
    }catch(error){ this.props.history.push('/app/dashboard') }
    }

  handleChangeGender = selectedOptionGender => {
    this.setState({selectedOptionGender});
    this.setState({selectedOption:selectedOptionGender.value})
  };


    emailChange = e => {
        this.setState({emailID:e, errorEmailID:false})
    };

    dobChange = e => {
        this.setState({dob:e, errordob:false})
    };

    editDetails = () => {
        this.setState({open:true})
    };

     changePassword = () => {
        this.setState({openPass:true})
    };

    oldPasswordChange = oldPass => {
        this.setState({OldPasswordID:oldPass})
    };

    PasswordChange = pass => {

            this.setState({PasswordID:pass})

    };

    ConfirmPasswordChange = confirmPass => {
        this.setState({ConfirmPasswordID:confirmPass})
    };

    handlePhoneChange = () => {

        if(this.state.phone === null ||this.state.phone === "" ) {
            this.setState({phone:""})
      }
      else {
        let ph = this.state.phone.replace(/\s/g,'');
      ph = ph.replace(/-/g,'');
      this.setState({ phone : ph })
      }

    }
    handleNext = () => {

         if(this.state.emailID == '')
         {
           this.setState({errorEmailID : true})
         }
            if(this.state.dob == '')
         {
           this.setState({errordob : true})
         }


         if(this.state.errorEmailID == false && this.state.errordob == false )
         {
            this.handlePhoneChange();

            let phone;
            if(this.state.phone === "+" ||this.state.phone.length<5 || this.state.phone === "") {
              phone=null
            } else {
              phone = this.state.phone
                if(!phone.includes('+')){
                    phone = '+'+phone
                }
             }
            try {
             axios.post(baseURL+"api/usr/updateProfile/"+this.state.userID+'/',
             {
                "username":this.state.username,
                "birthdate" : this.state.dob,
                "email":this.state.emailID,
                "phone":phone,
                "gender": {
                 "codeName":this.state.selectedOption
                },
                "modified_by": this.state.username,
             },
             {
            headers: {
                      'content-type' : 'application/json',
                       Authorization: 'Token '+localStorage.getItem('id_token')
                   }
            }
           ).then(response=>{
               if(response.status==200) {
                this.setState({open:false,openDetailsSuccess:true,phone})
              }
           }).catch(error=>{
            this.setState({openError:true,open:true})
           });
           }catch(error){ this.setState({openError:true}) }

         }

     }

    onSubmit = () => {

        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
          if(!this.state.PasswordID.match(re))
          {
            this.setState({openPassError:true})
            return
          }
        if(this.state.PasswordID=="" || this.state.openPassError)
        {
          this.setState({errorPasswordID:true})
            return
        }
        if(this.state.OldPasswordID=="")
        {
          this.setState({errorOldPasswordID:true})
            return
        }
        if(this.state.ConfirmPasswordID=="")
        {
          this.setState({errorConfirmPasswordID:true})
            return
        }
        if(this.state.PasswordID!=this.state.ConfirmPasswordID)
        {
           this.setState({errorPasswordID:true,errorConfirmPasswordID:true,PasswordID:"",ConfirmPasswordID:""})
        }
        else
        {

             axios.post(baseURL+"api/usr/changePassword/",
             {
                "loginID":this.state.username,
                "old_password":this.state.OldPasswordID,
                "new_password":this.state.PasswordID,
             },
             {
            headers: {
                'content-type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
              }
            }
           ).then(response=>{
               if(response.status == 200) {
                this.setState({openPass:false,openPassSuccess:true,ConfirmPasswordID:"",PasswordID:"",OldPasswordID:""})
              }else {
                this.setState({openError:true})
              }
           }).catch(error =>{ this.setState({openError:true,openPass:true})})

    }

    };

    handleChange = (event, newValue) => {
        this.setState({tabValue:newValue});
  };

  handleClose = () => {
    this.setState({openError:false,openPassSuccess:false,openDetailsSuccess:false,openPassError:false,
        errorConfirmPasswordID:false,errorPasswordID:false,errorOldPasswordID:false,
        errordob:false,errorEmailID:false,OldPasswordID:"",PasswordID:"",ConfirmPasswordID:""})
  }
  handleCloseDialog = ()=>{
    this.setState({open:false,openPass:false,showPasswordC:false,showPasswordO:false,showPasswordP:false,PasswordID:"",
        OldPasswordID:"",ConfirmPasswordID:""})
  }

  render(){
    const { classes } = this.props;
    const customStyles={
      control:base=> ({
        ...base,
        height:'20px',
        marginTop:'10px'
      }),
      option : (provided) => ({
        ...provided,
        width:'300px'
      })
    }
    return (
      <ErrorBoundary>
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openPassError} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="info">
        <b>Please check if your password length is abover 8 characters and contains atleast one lowercase letter, one uppercase letter,
        one numeric digit, and one special character!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openPassSuccess} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="success">
        <b>Password Changed Successfully!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openDetailsSuccess} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="success">
        <b>Details Updated Successully!</b>
        </Alert>
      </Snackbar>
        <PageTitle title = 'User Profile' />
        <Paper elevation={3}
          style={{marginRight:'10px',marginTop:'10px',marginLeft:'10px',height:'30%', padding:"20px"}}>

        <div>
        <Box display="flex" flexDirection="row">

        <Box display="flex" flexDirection="column" style={{width:'180px'}}>
        <Card
          style = {{height : '120px',width : '120px',marginLeft:'20px',
          position:'relative', marginTop:'10px'}} >
          <CardMedia
            component = 'img'
            image={UP}
            title="User Profile"
            style = {{height : '120px',width : '120px'}} />
            <div className={classes.overlay}><Typography style ={{fontSize : '30px',fontWeight: 'bold'}}>{this.state.acronym}</Typography></div>
        </Card>
        <Typography variant='h6' fontWeight='fontWeightBold' fontFamily="sans-serif" style={{marginTop:'10px', marginLeft:'20px'}}>{this.state.userName}</Typography>
        </Box>

        <Box display="flex" flexDirection="column"
          style={{marginTop:'30px', padding:'10px',width:'450px',marginLeft:'30px'}}>

        <Box display="flex" flexDirection="row">
        <Typography ><b>Email ID:</b>  {this.state.emailID}</Typography>

          </Box>

          <Box display="flex" flexDirection="row" style={{marginTop:'50px'}}>
          <Typography ><b>Gender:</b>  {this.state.selectedOption}</Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column"
          style={{marginTop:'30px', padding:'10px',width:'450px',marginLeft:'20px'}}>

        <Box display="flex" flexDirection="row">
        <Typography ><b>Contact:</b>  {this.state.phone}</Typography>

          </Box>

          <Box display="flex" flexDirection="row" style={{marginTop:'50px'}}>
          <Typography ><b>Date Of Birth:</b>  {this.state.dob}</Typography>

          </Box>
        </Box>

        <Box display="flex" flexDirection="column"
          style={{ padding:'10px',width:'450px',marginLeft:'20px'}}>
         <Box display="flex" flexDirection="row" style={{marginTop:'-10px'}}>
        <Button style={{marginRight:'5px',height:'50px'}} onClick= {this.editDetails}><Edit/>Edit</Button>
        <Button style={{marginRight:'5px',height:'50px'}} onClick= {this.changePassword}>
        <VpnKey style={{transform:'rotate(135deg)'}}/>Change Password</Button>
        </Box>
        <Typography style={{marginTop:'60px', textAlign:'center'}}><b>Joined on:</b> {this.state.createdon}</Typography>
        </Box>
        </Box>
        </div>
        </Paper>
         <React.Fragment>
          <Dialog open={this.state.open} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
                    <DialogTitle id="form-dialog-title">Edit Details</DialogTitle>

                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label={this.state.errorEmailID?"Enter email id":''}
                        type="email"
                        placeholder="Enter Email ID"
                        variant="outlined"
                        value={this.state.emailID}
                        helperText={this.state.errorEmailID ? 'Required' : ''}
                        error={this.state.errorEmailID}
                        onChange= {e=>this.emailChange(e.target.value)}
                        fullWidth/>

                         <Select
                              id='gender'

                              value={this.state.selectedOptionGender}
                              onChange={this.handleChangeGender}
                              label="Gender"
                              options={options_gender}
                              placeholder={this.state.selectedOption}
                              variant='outlined'
                              styles={customStyles}
                              theme={theme => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    neutral50: '#1A1A1A',  // Placeholder color
                                },
                                  })}
                            />
                         <TextField
                          placeholder="YYYY/MM/DD"
                        autoFocus
                        margin="dense"
                        id="dob"
                        label={this.state.errordob?"Enter birthdate YYYY-MM-DD":''}
                        type="text"
                        variant="outlined"
                        placeholder ="Enter birthdate YYYY-MM-DD"
                        value={this.state.dob}
                        helperText={this.state.errordob ? 'Required' : ''}
                        error={this.state.errordob}
                        onChange={e=>this.dobChange(e.target.value)}
                         fullWidth/>
                        <PhoneInput
                          containerStyle={{marginTop:'10px',width:'450px',height:'40px'}}
                          inputStyle={{width:'450px',height:'40px'}}
                          country={'in'}
                          value={this.state.phone}
                          onChange={phone=>this.setState({phone:phone})}
                        />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleNext} color="primary">
                        Save
                      </Button>
                      <Button onClick={this.handleCloseDialog} color="primary">
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
        </React.Fragment>
        <React.Fragment>
          <Dialog open={this.state.openPass} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
                    <DialogTitle id="form-dialog-title">Change Password</DialogTitle>

                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="oldPass"
                        label={this.state.errorOldPasswordID?"Enter Current Password id":''}
                        type={this.state.showPasswordO ? 'text' : 'password'}
                        variant="outlined"
                        placeholder="Enter Current Password"
                        value={this.state.OldPasswordID}
                        helperText={this.state.errorOldPasswordID ? 'Required' : ''}
                        error={this.state.errorOldPasswordID}
                        onChange= {e=>this.oldPasswordChange(e.target.value)}
                        fullWidth
                        InputProps={{ endAdornment:(
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={()=>{this.setState({showPasswordO:!this.state.showPasswordO})}}
                              onMouseDown={event => {event.preventDefault();}}
                              edge="end"
                            >
                              {this.state.showPasswordO ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )}}/>

                         <TextField
                        autoFocus
                        margin="dense"
                        id="pass"
                        label={this.state.errorPasswordID?"Enter New Password":''}
                        type={this.state.showPasswordP ? 'text' : 'password'}
                        variant="outlined"
                        placeholder="Enter Password"
                        value={this.state.PasswordID}
                        helperText={this.state.errorPasswordID ? 'Required' : ''}
                        error={this.state.errorPasswordID}
                        onChange= {e=>this.PasswordChange(e.target.value)}
                        fullWidth
                         InputProps={{ endAdornment:(
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={()=>{this.setState({showPasswordP:!this.state.showPasswordP})}}
                              onMouseDown={event => {event.preventDefault();}}
                              edge="end"
                            >
                              {this.state.showPasswordP ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )}}/>

                         <TextField
                        autoFocus
                        margin="dense"
                        id="confirmPassword"
                        label={this.state.errorConfirmPasswordID?"Enter Password Again":''}
                        type={this.state.showPasswordC ? 'text' : 'password'}
                        variant="outlined"
                        placeholder="Enter Password Again"
                        value={this.state.ConfirmPasswordID}
                        helperText={this.state.errorConfirmPasswordID ? 'Required' : ''}
                        error={this.state.errorConfirmPasswordID}
                        onChange= {e=>this.ConfirmPasswordChange(e.target.value)}
                        fullWidth
                         InputProps={{ endAdornment:(
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={()=>{this.setState({showPasswordC:!this.state.showPasswordC})}}
                              onMouseDown={event => {event.preventDefault();}}
                              edge="end"
                            >
                              {this.state.showPasswordC ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )}}/>
                         </DialogContent>
                    <DialogActions>
                      <Button  color="primary" onClick={this.onSubmit}>
                        Save
                      </Button>
                      <Button onClick={this.handleCloseDialog} color="primary">
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
        </React.Fragment>
        <Paper elevation={3} style={{marginRight:'10px',marginTop:'30px',marginLeft:'10px',height:'45%'}}>
            <AppBar position="static">
                <Tabs value={this.state.tabValue} onChange={this.handleChange}  aria-label="simple tabs">
                  <Tab label="Users" indicatorColor="#fff" variant="fullWidth" {...a11yProps(0)} />
                  <Tab label="Questions" indicatorColor="#fff" variant="fullWidth" {...a11yProps(1)}/>
                  <Tab label="Schools" indicatorColor="#fff" variant="fullWidth"{...a11yProps(2)}/>
                </Tabs>
              </AppBar>
              <TabPanel value={this.state.tabValue} index={0}>
                <TableUsers/>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={1}>
                <TableQuestions/>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={2}>
                 <TableSchools/>
              </TabPanel>
        </Paper>
        </ErrorBoundary>

    );
  }
}


UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UserProfile);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    width: ' 25%'
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
