import React from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import validator from 'validator';
import { Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {Paper, TextField, Typography, Box, Button, OutlinedInput, FormHelperText,
        InputLabel, InputAdornment, FormControl, IconButton, Snackbar} from '@material-ui/core';
import {Error, Visibility, VisibilityOff} from '@material-ui/icons';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios'
import {baseURL} from '../constants.js'
import ErrorBoundary from '../error/ErrorBoundary'

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
  datePicker:{
    width:300,
    height:50,
    border:'1px solid white',
    borderRadius:'5px'
  }
})

var options_role = [];
var options=[];

class AddUser extends React.PureComponent{

    constructor(props)
    {
        super(props)
        this.state = {
          selectedOption: "",
          selectedOption_role: "",
          phone:"",
          userRoleID:"",
          userID:"",
          date: new Date(),
          error: false,
          error_input:false,
          approval:'approved',
          username:"",
          firstname:"",
          lastname:"",
          loginID:"",
          password:"",
          emailID: "",
          status:'active',
          showPassword: false,
          onClick:false,
          openAlert:false,
          openError:false,
          error_pass:false,
           error_firstname:false,
           error_lastname:false,
           error_loginID:false,
           error_email:false,
           error_role:false,
           error_gender:false,
           openPassError:false,
           error_phone:false,
           is_active:"",
           userName: localStorage.getItem("username"),
           rolelist : [],
           genderlist:[],
        };
    }
    async componentDidMount() {
        try{
        let gresult = await axios.get(
        baseURL+'api/usr/roleListAdd/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
        this.setState({rolelist:gresult.data})

         options_role.length = 0;
    for(let i=0;i<this.state.rolelist.length;i++)
    {
        let x =this.state.rolelist[i].RoleName;
        options_role.push({"value": x , "label": x })
    }

        }catch(error){ this.props.history.push('/app/dashboard')}


          try{
        let gresultG = await axios.get(
        baseURL+'api/usr/getGender/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
       this.setState({genderlist:gresultG.data})
         options.length = 0;
    for(let i=0;i<this.state.genderlist.length;i++)
    {
        let x =this.state.genderlist[i].codeName;
        options.push({"value": x , "label": x })
    }
    }catch(error){this.props.history.push('/app/dashboard') }
}


    async fetchData()
    {

      let data, phone;


      if(this.state.phone == "+") {
        phone=""
      } else {
        phone = this.state.phone
      }
      if(!phone.includes('+') && phone !==""){
            phone = '+'+phone
        }

      if(this.state.date == ""){

        data = [this.state.loginID,this.state.username,this.state.emailID,phone,this.state.password,
        "",this.state.selectedOption_role.value];

      } else {

        data = [this.state.loginID,this.state.username,this.state.emailID,phone,this.state.password,
        ""+this.state.date.getFullYear()+"-"+(this.state.date.getMonth()+1)+"-"+this.state.date.getDate(),
        this.state.selectedOption_role.value];
      }



        try{

        await axios.post(
        baseURL+'api/usr/insertUser/', {
            "userID" :{
                "loginID":data[0],
                "username":data[1],
                "email":data[2],
                "phone":data[3],
                "password":data[4],
                "birthdate":data[5].toString(),
                "gender": {
                       "codeName": this.state.selectedOption.value
                },
                "created_by" : this.state.userName,
                "modified_by" : this.state.userName,
                "is_active" : {
                       "codeName":userStatus.approved
                }
            },
            "RoleID":{
                "RoleName":data[6]
            }
        },{
            headers: {
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }
        ).then(response =>{
             this.alertAndRedirect();
        })
        .catch(function (response) {
            this.setState({openError:true});
        });

        }catch(error)
        {
               this.setState({openError:true});
        }
    }

  alertAndRedirect(){
     setTimeout(() => {this.setState({openAlert:true});},1000);
        setTimeout(() => {
            this.setState({openAlert:false, onClick:true});
        },4000);
  }

  onChange = date => {
    if(date==null) {
      this.setState({ date: "" })
    } else {
      this.setState({ date })
    }
  }

  handleClose = () => {
    this.setState({openAlert:false,openError:false,openPassError:false});
  };

  handlePhoneChange = () => {

    let ph = this.state.phone.replace(/\s/g,'');
    ph = ph.replace(/-/g,'');

    if(ph === "+" || ph === '') {
      this.setState({ phone : ""})
    } else {

      this.setState({ phone : ph, error_phone:false })
    }
  }

  onSubmit = () => {

    this.handlePhoneChange();

    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
          if(!this.state.password.match(re))
          {
            this.setState({openPassError:true})
            return
          }

      if(this.state.password=='')
      {
        this.setState({error_pass:true})
      }

      if(this.state.firstname=='')
      {
        this.setState({error_firstname:true})
      }
      if(this.state.lastname=='')
      {
       this.setState({error_lastname:true})
      }
      if(this.state.phone == '') {
        this.setState({error_phone:true})
      }

      if(this.state.loginID=='')
      {
        this.setState({error_loginID:true})
      }

      if(!validator.isEmail(this.state.emailID)){
          this.setState({error_email:true})
      }

      if(this.state.selectedOption_role=="")
      {
        this.setState({error_role:true});
      }
      if(this.state.selectedOption=="")
      {
        this.setState({error_gender:true});

      }

    if(this.state.phone != '+'&& this.state.phone != ''&& this.state.error_email== false &&
    this.state.error_gender == false && this.state.error_loginID == false &&
    this.state.error_role==false && this.state.error_firstname == false && this.state.error_lastname == false && this.state.error_pass==false)
    {
        this.state.username = this.state.firstname +" "+ this.state.lastname;
        this.fetchData();
    }

  }

  handleChange = selectedOption => {
    this.setState({ selectedOption,error_gender:false });
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
  });
  };

  handleLastnameChange = ( newValue) => {
  this.setState({
    lastname:newValue,
    error_lastname:false,
  });
  };


  handleLoginIDChange = ( newValue) => {
    this.setState({
      loginID:newValue,
      error_loginID:false,
    });
  }
  handlePasswordChange = ( newValue) => {
    this.setState({
      password: newValue,
     error_pass:false,
     });
    }

  handleEmailIDChange = ( newValue) => {
    this.setState({
      emailID: newValue,
      error_email:false,

     });

  };

  render(){

    const { selectedOption,selectedOption_role } = this.state;

    const{classes} = this.props;

    return (

      <ErrorBoundary>
        <PageTitle title="Add New User"/>
        <Snackbar open={this.state.openPassError} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="info">
        <b>Please check if your password length is abover 8 characters and contains atleast one lowercase letter, one uppercase letter,
        one numeric digit, and one special character!</b>
        </Alert>
      </Snackbar>
        <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openAlert} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="success">
        <b>User Added Successfully!</b>
        </Alert>
      </Snackbar>
        <Paper elevation={3} style={{width:'1000px',margin:'100px'}}>
        <div>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginTop:"40px"}}>
        <Typography variant="h5" color='textSecondary'  >
          FirstName
          </Typography>
        </Box>
        <Box p={1} style={{marginTop:"30px"}}>
        <TextField
           id="outlined-textarea"
           label={this.state.error_firstname?"Enter firstname":''}
           helperText={this.state.error_firstname ? 'Required* ' : ''}
           error={this.state.error_firstname}
           onChange={ e => this.handleFirstnameChange(e.target.value) }

           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter First Name"
           variant="outlined"
           InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_username?  <Error style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}/>
        </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} >
        <Typography variant="h5" color='textSecondary'  >
          LastName
          </Typography>
        </Box>
        <Box p={1}>
        <TextField
           id="outlined-textarea"
           onChange={ e => this.handleLastnameChange(e.target.value) }
           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter Last Name"
           variant="outlined" />
        </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1} >
        <Typography variant="h5" color='textSecondary'  >
          Password
          </Typography>
        </Box>

        <Box p={1} >


<FormControl className={classes.margin, classes.textField} variant="outlined" style={{marginLeft:'135px',width:'300px',display:'flex'}}>

          {this.state.error_pass?<InputLabel style={{ backgroundColor:"white",color:"red",}}>Enter Password</InputLabel>:''}


          <OutlinedInput
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            placeholder="Enter password"
         error={this.state.error_pass}
            onChange={e => this.handlePasswordChange(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                  edge="end"
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility /> }
                </IconButton>
              </InputAdornment>
            }
          />
          {this.state.error_pass?<FormHelperText style={{color:"red"}}>
        Required*</FormHelperText>:''}
        </FormControl>

        </Box>

        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Gender
          </Typography>
        </Box>


        <Box p={1} style={{marginLeft:'160px',width:'300px',display:'flex'}}>
        <div style={{width: '360px'}}>

        <Select  style={{color:"red"}}

        value={selectedOption}
        onChange={this.handleChange}
        options={options}

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
          containerStyle={{marginTop:'10px',marginLeft:'170px',height:'40px'}}
          inputStyle={{height:'40px'}}
          country={'in'}
          value={this.state.phone}
          onChange={phone=>this.setState({phone:phone})}
          isValid={(value,country) => {
            if(value.match(/12345/))
            {
            return 'Invalid Value'}
            else if(value.match(/1234/)){
            return false}
            else return true
          }}
        />
        {this.state.error_phone?<FormHelperText style={{color:"red",marginLeft:"40%"}}> Required*</FormHelperText>:''}

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

          style={{marginLeft:'180px',width:'300px',display:'flex'}}
          placeholder="Enter Email ID"
          variant="outlined"
        error={this.state.error_email}
        label={this.state.error_email?"Enter valid Email ID":''}
        helperText={this.state.error_email?"Required*":''}


          onChange={e =>{this.handleEmailIDChange(e.target.value);this.handleLoginIDChange(e.target.value)}}

          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_email?  <Error style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}

        />

        </Box>

        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Date Of Birth
        </Typography>

        </Box>

        <Box p={1} style={{marginLeft:'100px',width:'300px',display:'flex'}}>
        <div style={{marginTop:"10px"}}>
        <DatePicker
          onChange={this.onChange}
          value={this.state.date}
          format="yyyy-MM-dd"
          className={classes.datePicker}

        />
        </div>

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
          style={{marginLeft:'150px',width:'300px',display:'flex'}}
          placeholder="Login ID"
          variant="outlined"
           value={this.state.loginID}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_loginID?  <Error style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}/>
        </Box>

        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h5" color='textSecondary'  >
          Role
          </Typography>
        </Box>


        <Box p={1} style={{marginLeft:'190px',width:'300px',display:'flex'}}>
        <div style={{width: '360px'}}>
        <Select
        value={selectedOption_role}
        onChange={this.handleChange_role}
        options={options_role}

      />
      {this.state.error_role?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}

      </div>
      </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>

        <Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginLeft:'290px',width:'300px',display:'flex'}}>
        Add New User
      </Button>
      {this.state.onClick ? <Redirect to="/app/users" /> :null}
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

AddUser.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default (withStyles)(styles)(AddUser);
