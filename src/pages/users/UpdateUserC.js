import React from 'react';
import {Route , Redirect , useHistory} from 'react-router-dom'
import PageTitle from "../../components/PageTitle/PageTitle";
import {Paper, TextField, Typography, Box, Button, OutlinedInput, FormHelperText,
        InputLabel, InputAdornment, FormControl, IconButton, Radio, FormControlLabel, Snackbar} from '@material-ui/core';
import {Error, Visibility, VisibilityOff} from '@material-ui/icons';
import { RadioGroup, RadioButton} from 'react-radio-buttons';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ErrorBoundary from "../../pages/error/ErrorBoundary";
import Fab from '@material-ui/core/Fab';
import {baseURL} from '../constants'
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
// import './stylesusers.css';
const userStatus = { unapproved : "unapproved", approved : "approved" , inactive : "inactive"};

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing(3),
  },
  datePicker:{
    width:500,

  }
})

var dataX;
var options_gender=[];
var options_role = [];
var fromPage="";
class UpdateUser extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            selectedOption: "",
            dataX :"",
            selectedOption_role: "",
            phone:"",
            value:"",
            userRoleID:"",
            userID:"",
            date: "",
            approval:"",
            username:"",
            Firstname:"",
            Lastname:"",
            loginID:"",
            emailID: "",
           error_firstname:false,
           error_loginID:false,
           error_role:false,
           error_gender:false,
           dateString:"",
           onClick:false,
           openAlert:false,
           openError:false,
           userName: localStorage.getItem("username"),
           finalStatus:"",
           selectedOptionGender:"",
           GenderList:[],
           selectedOptionRole:"",
           RoleList:[],
           approval : "",
           status:"",
           readOnly:true,
           isHidden:true,
          clicked:false,
        };
    }

    async componentDidMount(){

      console.log(this.props.location)

    try {

      var dataX = this.props.location.data[0]
      this.setState({dataX:this.props.location.data[0]})

        if(dataX.userRoleID != null && dataX.userID.username!= null){
            fromPage="users"

        let ph;
            if(dataX.userID.phone == null) {
                ph = ""
            }
            else {
                ph = dataX.userID.phone
            }
          var res = dataX.userID.username.split(" ");
           
            if(dataX.userID.birthdate == null) {
              this.setState({
                userID: dataX.userID.userID,
                loginID: dataX.userID.loginID,
                username: dataX.userID.username,
                firstname:res[0],
                lastname:res[1],
                selectedOption_role:dataX.RoleID.RoleName,
                phone:ph,
                selectedOption: dataX.userID.gender.codeName,
                date:"",
                dateString:"",
                emailID:dataX.userID.email,
                approval:dataX.userID.is_active.codeName,
                status:dataX.userID.is_active.codeName,
                userRoleID:dataX.userRoleID
            })
            }
            else {
              this.setState({
                userID: dataX.userID.userID,
                loginID: dataX.userID.loginID,
                username: dataX.userID.username,
                firstname:res[0],
                lastname:res[1],
                selectedOption_role:dataX.RoleID.RoleName,
                phone:ph,
                selectedOption: dataX.userID.gender.codeName,
                date:new Date(dataX.userID.birthdate),
                dateString:dataX.userID.birthdate,
                emailID:dataX.userID.email,
                approval:dataX.userID.is_active.codeName,
                status:dataX.userID.is_active.codeName,
                userRoleID:dataX.userRoleID
            })
          }

        }
        else
        {
            fromPage="contactInfo"

            let ph;

            if(dataX.phone == null) {
                ph = ""
            }
            else {
                ph = dataX.phone
            }
            var res = dataX.username.split(" ");
            if(dataX.birthdate == null) {
              this.setState({
                userID: dataX.userID,
                loginID: dataX.loginID,
                username: dataX.username,
                firstname:res[0],
                lastname:res[1],
                selectedOption_role:dataX.role,
                phone:ph,
                selectedOption: dataX.gender,
                date:"",
                dateString:"",
                emailID:dataX.email,
                approval:dataX.is_active,
                status:dataX.is_active,
                userRoleID:dataX.userRoleID
              })
            }
            else {
              this.setState({
                userID: dataX.userID,
                loginID: dataX.loginID,
                username: dataX.username,
                firstname:res[0],
                lastname:res[1],
                selectedOption_role:dataX.role,
                phone:ph,
                selectedOption: dataX.gender,
                date:new Date(dataX.birthdate),
                dateString:dataX.userID.birthdate,
                emailID:dataX.email,
                approval:dataX.is_active,
                status:dataX.is_active,
                userRoleID:dataX.userRoleID
              })
            }
        }

        let gresult = await axios.get(
        baseURL+'api/usr/roleList/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
        this.setState({
               RoleList:gresult.data,
               selectedOptionRole: this.state.selectedOption_role,
        })

        options_role.length=0;
        for(let i=0;i<this.state.RoleList.length;i++)
        {
            let x =this.state.RoleList[i].RoleName;
            options_role.push({"value": x , "label": x })
        }

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

    }catch(error){
      console.log(error)
      // this.props.history.push('/app/dashboard')
    }
  }


    async fetchData()
    {

        let finalDate=null
       if(this.state.dateString==this.state.date)
       {
            if(this.state.date == ""){
                finalDate = null
            } else {
                finalDate = this.state.date.toString()
            }
       }
       else
       {
          if(this.state.date != "" && this.state.date != null) {
            this.state.date = (""+this.state.date.getFullYear()+"-"+(this.state.date.getMonth()+1)+"-"+this.state.date.getDate());
            finalDate = this.state.date.toString()
          } else {finalDate=null}
       }
       if(this.state.approval == userStatus.unapproved)
       {
            this.state.finalStatus= userStatus.unapproved;
       }
       if(this.state.approval == userStatus.approved)
       {
            this.state.finalStatus= userStatus.approved;
       }
       if(this.state.status == userStatus.unapproved && this.state.approval== userStatus.inactive)
       {
             this.state.finalStatus= userStatus.approved;
       }
       if(this.state.status == userStatus.inactive)
       {
            this.state.finalStatus= userStatus.inactive;
       }
       let finalRole;
        if(this.state.selectedOptionRole.value==null) {
          finalRole=this.state.selectedOptionRole ;
        }
        else {
          finalRole=this.state.selectedOptionRole.value;
        }
        let phone;
        if(this.state.phone === "+" ||this.state.phone.length<5 || this.state.phone === "") {
          phone=null
        } else {
          phone = this.state.phone
            if(!phone.includes('+')){
                phone = '+'+phone
            }
         }

         let email=null
         if(this.state.emailID != "" && this.state.emailID != null){
          email = this.state.emailID
         }

         console.log({
            "userID" :{

                "username":this.state.username,
                "email":email,
                "phone":phone,
                "birthdate" : finalDate,
                "gender": {
                    "codeName":this.state.selectedOption
                },
                "modified_by": this.state.userName,
                "is_active" : {
                    "codeName":this.state.finalStatus
                }
            },
            "RoleID":{
                "RoleName":finalRole
            }
        })
        try{
        let gresult = await axios.post(
        baseURL+'api/usr/updateUser/'+this.state.userRoleID+"/", {
            "userID" :{

                "username":this.state.username,
                "email":email,
                "phone":phone,
                "birthdate" : finalDate,
                "gender": {
                    "codeName":this.state.selectedOption
                },
                "modified_by": this.state.userName,
                "is_active" : {
                    "codeName":this.state.finalStatus
                }
            },
            "RoleID":{
                "RoleName":finalRole
            }
        },{
            headers: {
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }
        );
        this.alertAndRedirect();
        }catch(error){
          console.log(error)
          // this.setState({openError:true})
        }
    }

    alertAndRedirect() {
        let date = new Date(this.state.date)
        setTimeout(() => {this.setState({openAlert:true,phone:"",date:null});},1000);
        setTimeout(() => {
            this.setState({openAlert:false, onClick:true});
        },4000);
    };

    onChange = date => {this.setState({ date : date});}

    handleChangeGender = selectedOptionGender => {
        this.setState({selectedOptionGender});
         this.setState({selectedOption:selectedOptionGender.value})
        
      };

    handleChangeRole = selectedOptionRole => {
        this.setState({selectedOptionRole});
        this.setState({selectedOption_role:selectedOptionRole.value})
        
      };

  handleClose = () => {
    this.setState({openAlert:false,openError:false});
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

  onSubmit = () => {
      this.handlePhoneChange();
      if(this.state.firstname=='')
      {
        this.setState({error_firstname:true})
      }
      if(this.state.loginID=="")
      {
        this.setState({error_loginID:true})
      }
      if(this.state.selectedOption_role==null)
      {
        this.setState({error_role:true});
      }
      if(this.state.selectedOption==null)
      {
        this.setState({error_gender:true});

      }
      if(this.state.selectedOption != null && this.state.selectedOption_role != null && this.state.loginID != ""
        && this.state.firstname != "" )
      {
        this.state.username = this.state.firstname+" "+this.state.lastname;
        this.fetchData();
      }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption,error_gender:false });
  };

  handleStatusChange = (newValue) => {
      this.setState({status:newValue})
  };


  handleApprovalChange = (newValue) => {
    this.setState({approval:newValue})
  };

  handleChange_role = selectedOption_role => {
    this.setState({ selectedOption_role,error_role:false });
  };

   handleClickShowPassword = () => {
        if(this.state.showPassword)
        {
          this.setState({showPassword:false});
        }
        else{
          this.setState({showPassword:true});
        }
    };

   handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleFirstnameChange = ( newValue) => {
      this.setState({
        firstname:newValue,
        error_firstname:false,
  })};

   handleLastnameChange = ( newValue) => {
      this.setState({
        lastname:newValue,
        error_lastname:false,
  })};


  handleLoginIDChange = ( newValue) => {
    this.setState({
      loginID:newValue,
      error_loginID:false,
    })};

  handlePasswordChange = ( newValue) => {
    this.setState({
      password: newValue,
     error_pass:false,
     })};

  handleEmailIDChange = ( newValue) => {

    if(newValue == "") {
        this.setState({emailID:null})
    }
    else {
    this.setState({
      emailID: newValue
     })
     }
    if(this.state.selectedOption_role != "Student") {
      this.handleLoginIDChange(newValue)
    }
  };
  onCancel=()=>{
   
    if(this.state.dataX.userRoleID != null && this.state.dataX.userID.username!= null){
      fromPage="users"

  let ph;
      if(this.state.dataX.userID.phone == null) {
          ph = ""
      }
      else {
          ph = this.state.dataX.userID.phone
      }
    var res = this.state.dataX.userID.username.split(" ");
     
      if(this.state.dataX.userID.birthdate == null) {
        this.setState({
          userID: this.state.dataX.userID.userID,
          loginID: this.state.dataX.userID.loginID,
          username: this.state.dataX.userID.username,
          firstname:res[0],
          lastname:res[1],
          selectedOption_role:this.state.dataX.RoleID.RoleName,
          selectedOptionRole:this.state.dataX.RoleID.RoleName,
          phone:ph,
          selectedOption: this.state.dataX.userID.gender.codeName,
          selectedOptionGender: this.state.dataX.userID.gender.codeName,        
          date:"",
          dateString:"",
          emailID:this.state.dataX.userID.email,
          approval:this.state.dataX.userID.is_active.codeName,
          status:this.state.dataX.userID.is_active.codeName,
          userRoleID:this.state.dataX.userRoleID
      })
      }
      else {
        this.setState({
          userID: this.state.dataX.userID.userID,
          loginID: this.state.dataX.userID.loginID,
          username: this.state.dataX.userID.username,
          firstname:res[0],
          lastname:res[1],
          selectedOption_role:this.state.dataX.RoleID.RoleName,
          selectedOptionRole:this.state.dataX.RoleID.RoleName,
          selectedOptionGender: this.state.dataX.userID.gender.codeName,        
          phone:ph,
          selectedOption: this.state.dataX.userID.gender.codeName,
          date:new Date(this.state.dataX.userID.birthdate),
          dateString:this.state.dataX.userID.birthdate,
          emailID:this.state.dataX.userID.email,
          approval:this.state.dataX.userID.is_active.codeName,
          status:this.state.dataX.userID.is_active.codeName,
          userRoleID:this.state.dataX.userRoleID
      })
    }

  }
  else
  {
      fromPage="contactInfo"

      let ph;

      if(this.state.dataX.phone == null) {
          ph = ""
      }
      else {
          ph = this.state.dataX.phone
      }
      var res = this.state.dataX.username.split(" ");
      if(this.state.dataX.birthdate == null) {
        this.setState({
          userID: this.state.dataX.userID,
          loginID: this.state.dataX.loginID,
          username: this.state.dataX.username,
          firstname:res[0],
          lastname:res[1],
          selectedOption_role:this.state.dataX.role,
          selectedOptionRole:this.state.dataX.role,
          selectedOptionGender: this.state.dataX.userID.gender,     
          phone:ph,
          selectedOption: this.state.dataX.gender,
          date:"",
          dateString:"",
          emailID:this.state.dataX.email,
          approval:this.state.dataX.is_active,
          status:this.state.dataX.is_active,
          userRoleID:this.state.dataX.userRoleID
        })
      }
      else {
        this.setState({
          userID: this.state.dataX.userID,
          loginID: this.state.dataX.loginID,
          username: this.state.dataX.username,
          firstname:res[0],
          lastname:res[1],
          selectedOption_role:this.state.dataX.role,
          selectedOptionRole:this.state.dataX.role,
          selectedOptionGender: this.state.dataX.userID.gender,     
          phone:ph,
          selectedOption: this.state.dataX.gender,
          date:new Date(this.state.dataX.birthdate),
          dateString:this.state.dataX.userID.birthdate,
          emailID:this.state.dataX.email,
          approval:this.state.dataX.is_active,
          status:this.state.dataX.is_active,
          userRoleID:this.state.dataX.userRoleID
        })
      }
  }
    this.setState({readOnly:true,clicked:false,isHidden:true});
  }
  render(){
    const {readOnly} = this.state;
    const { selectedOption,selectedOption_role } = this.state;
    const {value, error, successValidation} = this.state;
    const underlineStyle = successValidation ? { borderColor: 'green' } : null;
    const { classes } = this.props;
    const customStyles={
      control:base=> ({
        ...base,
        height:'56px',
        marginTop:'10px',
        fontSize:'16px',
        backgroundColor: readOnly? 'white':'white'
      }),
      option : (provided) => ({
        ...provided,
        width:'300px'
      })
    }

    return (
      <ErrorBoundary>
        <PageTitle title="Update User Details"/>
        <Fab variant="extended" style={{ marginLeft:'90%',marginTop:'-8%' }} color="primary"
        onClick={e => {this.setState({readOnly: !readOnly,isHidden:false,clicked:true})}} disabled={this.state.clicked}>
        <EditIcon/>EDIT
      </Fab>

        <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openAlert} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="success">
        <b>User Updated Successfully!</b>
        </Alert>
      </Snackbar>
        <Paper elevation={3} style={{width:'1000px',marginLeft:'10%',marginTop:'2%', paddingLeft:"3%"}}>
        <div>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginTop:"40px"}}>
        <Typography variant="h5" color='textSecondary'  >
          First Name
          </Typography>
        </Box>
        <Box p={1} style={{marginTop:"30px"}}>
        <TextField
           id="outlined-textarea"
           disabled={readOnly}
           label={this.state.error_firstname?"Enter First Name":''}
           helperText={this.state.error_firstname ? 'Required* ' : ''}
           error={this.state.error_firstname}
           onChange={ e => this.handleFirstnameChange(e.target.value) }
            value={this.state.firstname}
           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter First Name"
           variant="outlined"
           InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_firstname?  <Error style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}/>
        </Box>
        </Box>


        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} >
        <Typography variant="h5" color='textSecondary'  >
          Last Name
          </Typography>
        </Box>
        <Box p={1}>
        <TextField
           id="outlined-textarea"
           disabled={readOnly}
           onChange={ e => this.handleLastnameChange(e.target.value) }
           value={this.state.lastname}
           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter Last Name"
           variant="outlined" />
        </Box>
        </Box>


        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Gender
          </Typography>
        </Box>


        <Box p={1} style={{marginLeft:'170px',width:'320px',display:'flex'}}>
        <div style={{width: '320px'}}>

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
                    neutral50: readOnly?'#808080':'#1A1A1A',
                },
            })}
            isDisabled={Boolean(readOnly)}
          />
      {this.state.error_gender?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
      </div>
        </Box>
        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Phone
          </Typography>
        </Box>
        <Box p={1} >
        <PhoneInput
          containerStyle={{marginTop:'10px',marginLeft:'180px',height:'56px'}}
          inputStyle={{height:'56px',fontSize:'16px'}}
          country={'in'}
          disabled={readOnly}
          value={this.state.phone}
          onChange={phone=>this.setState({phone:phone})}
        />
        </Box>
        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
        Email
          </Typography>
        </Box>

        <Box p={1} >
        <TextField
          id="outlined-textarea"
          disabled={readOnly}
          style={{marginLeft:'190px',width:'300px',display:'flex'}}
          placeholder="Enter Email ID"
          variant="outlined"
          value={this.state.emailID}
          onChange={e =>{this.handleEmailIDChange(e.target.value)}}
          />

        </Box>

        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Date Of Birth
        </Typography>

        </Box>

        <Box p={1} style={{marginLeft:'114px',height:'73px',width:'315px',display:'flex'}}>
        <DatePicker
        
          style={{height:'90px',fontSize:'16px',backgroundColor:'#ffffff'}}
          onChange={this.onChange}
          value={this.state.date}
          format="dd-MM-yyyy"
          disabled={readOnly}
          className={classes.datePicker}
        />
        </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1} >
        <Typography variant="h5" color='textSecondary'  >
          Login ID
          </Typography>
        </Box>

        <Box p={1} >
        <TextField
          disabled
          id="outlined-textarea"
          value={this.state.loginID}
           label={this.state.error_loginID?"Enter LoginID":''}
           helperText={this.state.error_loginID ? 'Required* ' : ''}
           error={this.state.error_loginID}
          style={{marginLeft:'163px',width:'300px',display:'flex'}}
          placeholder="Login ID"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_loginID?  <Error style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}
        />
        </Box>

        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Role
          </Typography>
        </Box>


        <Box p={1} style={{marginLeft:'202px',width:'320px',display:'flex'}}>
        <div style={{width: '320px'}}>
         <Select
          id='role'

          value={this.state.selectedOptionRole}
          onChange={this.handleChangeRole}
          label="Role"
          options={options_role}
          placeholder={this.state.selectedOption_role}
          variant='outlined'
          styles={customStyles}
          theme={theme => ({
            ...theme,
            colors: {
                ...theme.colors,
                neutral50: readOnly?'#808080':'#1A1A1A',
            },
        })}
              isDisabled={Boolean(readOnly)}
          />
      {this.state.error_role?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}

      </div>
      </Box>
        </Box>


        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Status
          </Typography>
        </Box>

        <Box p={1} m={1}>
        <FormControl component="fieldset"  className={classes.formControl,classes.margin} >
        <RadioGroup  value={this.state.status}>
          <FormControlLabel  style={{marginTop:"-10px",marginLeft:"155px"}} value={userStatus.approved} control={<Radio color="primary" disabled={readOnly} onChange={e => this.handleStatusChange(e.target.value)}/>} label="Active" />
          <FormControlLabel  style={{marginTop:"-10px"}} value={userStatus.inactive} control={<Radio color="primary" disabled={readOnly}onChange={e => this.handleStatusChange(e.target.value)}/>} label="Inactive" />
        </RadioGroup>
      </FormControl>

        </Box>

        </Box>


        { this.state.status == userStatus.inactive ? null : (
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Approval
          </Typography>
        </Box>

        <Box p={1} m={1}>
        <FormControl component="fieldset"  className={classes.formControl,classes.margin} >
        <RadioGroup  value={this.state.approval}>
          <FormControlLabel  style={{marginTop:"-10px",marginLeft:"128px"}} value={userStatus.approved} control={<Radio disabled={readOnly} color="primary" onChange={e => this.handleApprovalChange(e.target.value)}/>} label="Approved" />
          <FormControlLabel  style={{marginTop:"-10px"}} value={userStatus.unapproved} control={<Radio color="primary" disabled={readOnly} onChange={e => this.handleApprovalChange(e.target.value)}/>} label="Unapproved" />
        </RadioGroup>
      </FormControl>

        </Box>

        </Box>
        )}

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>

        {!this.state.isHidden?<Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginLeft:'200px',width:'200px',display:'flex'}}>
        Update Details
      </Button>:''}
      {this.state.onClick && fromPage=='users' ? <Redirect to="/app/users" /> :null}
      {this.state.onClick && fromPage=='contactInfo' ? <Redirect to="/app/schools" /> :null}
     </Box>
     <Box p={1} m={1}>
        {!this.state.isHidden? <Button onClick={this.onCancel} variant="contained" color="textSecondary"  style={{width:"200px",display:'flex'}}>
        Cancel
      </Button>:''}
     </Box>
    
     </Box>

        </div>
        <div>
        </div>
        </Paper>
       </ErrorBoundary>

    );
  }
}

UpdateUser.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UpdateUser);
