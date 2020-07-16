import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import RoomIcon from '@material-ui/icons/Room';
import Backdrop from '@material-ui/core/Backdrop';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import PageTitle from "../../components/PageTitle/PageTitle";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import GetAppIcon from '@material-ui/icons/GetApp';
import ErrorIcon from '@material-ui/icons/Error';
import Fab from '@material-ui/core/Fab';
import PhoneInput from 'react-phone-input-2'
import {baseURL,metabaseURL, metabaseSecretKey} from '../constants';
import './styles.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import FormHelperText from '@material-ui/core/FormHelperText';
import 'react-phone-input-2/lib/style.css';
var jwt = require("jsonwebtoken");
const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',

  },
});

var labeld='',valued='';
export const arr=[{schoolName: "",schoolType:"",UDISECode:"",Phone:"",AddressLine1:"",AddressLine2:"",City:"",District:"",State:"",Pincode:"",Country:"",schoolID:"",latitude:"",longitude:"",registeredBy:"",registeredOn:""}];

//for schools dashboard
var payload = {
  resource: { dashboard: 34 },
  params: {},
  exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcSchools = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

let schooln="";
let dist="";
var options_districts = [];
var options_state=[];
var options_country=[];
var options_schoolType=[];
var options_schoolGroup=[];
var phone='',errorPhone=false

class SchoolDetail extends Component {
  state={
    readOnly:true,
    isHidden:true,
    open:false,
    post:false,
    clicked:false,
    openprogress:false,
    open_warning:false,
    open_error:false,
    vertical:'top',
    horizontal:'center',
    selectedOption:"",
    selectedOptionState:"",
    selectedOptionCountry:"",
    selectedOptionSchoolType:"",
    selectedOptionSchoolGroup:"",
    valued:'',
    labeld:'',
    districtList:[],
    stateList:[],
    countryList:[],
    placeholder:arr[0].District,
    placeholderState:arr[0].State,
    placeholderCountry:arr[0].Country,
    placeholderSchoolType:arr[0].schoolType,
    placeholderSchoolGroup:arr[0].schoolGroup,
    error_schoolname:false,
    error_schooltype:false,
    error_schoolgroup:false,
    error_udisecode:false,
    error_phone:false,
    error_line1:false,
    error_line2:false,
    error_country:false,
    error_state:false,
    error_district:false,
    error_city:false,
    error_pincode:false,
    phone:arr[0].Phone,
  }
  handleSchoolNameChange =(newValue)=> {

    this.setState({
      error_schoolname:false,
    });

  }
  handleLine1Change =(newValue)=> {

    this.setState({
      error_line1:false,
    });
  }
  handleLine2Change =(newValue)=> {

    this.setState({
      error_line2:false,
    });

  }

  handleUDISECodeChange =(newValue)=> {

    this.setState({
      error_udisecode:false,
    });

  }
  handlePhoneChange =()=> {

    if(this.state.phone === null ||this.state.phone === "" ) {
            this.setState({phone:""})
      }
      else {
        let ph = this.state.phone.replace(/\s/g,'');
      ph = ph.replace(/-/g,'');
      this.setState({ phone : ph })
      phone=ph
      }
  }
  handleCityChange =(newValue)=> {
    this.setState({
      error_city:false,
    });

  }
  handlePincodeChange =(newValue)=> {
    this.setState({
      error_pincode:false,
    });

  }


  handleClick=()=>{
this.setState({open:true});
  };
  handleClose=(event, reason)=>{
    if (reason === 'clickaway') {
      return;
    }
    this.setState({open:false});
  };

  handleToggle = () => {
    this.setState({openprogress:true});
  };
  handleCloseProgress = () => {
    this.setState({openprogress:false});
  };
  handleClickWarning=()=>{
    this.setState({open_warning:true});
      };

  handleClickError=()=>{
    this.setState({open_error:true});
      };
      handleClose_error=(event, reason)=>{
        if (reason === 'clickaway') {
          return;
        }
        this.setState({open_error:false});
      };

  handleChange= selectedOption =>{
    this.setState({ selectedOption, error_district:false,placeholder:selectedOption});
  };
  handleSchoolTypeChange =(newVal)=> {
    this.setState({selectedOptionSchoolType:newVal,
      error_schooltype:false,placeholderSchoolType:newVal
    });
  }

  handleSchoolGroupChange =(newValue)=> {
    this.setState({selectedOptionSchoolGroup:newValue,
      error_schoolgroup:false,placeholderSchoolGroup:newValue
    });
  }
  onMenuSchoolTypeOpen=selectedOptionSchoolType=>{
    this.setState({placeholderSchoolType:'Select School Type..'})
  }
  onMenuSchoolGroupOpen=selectedOptionSchoolGroup=>{
    this.setState({placeholderSchoolGroup:'Select School Group..'})
  }
  onMenuCountryOpen=selectedOptionCountry =>{
  this.setState({placeholderCountry:'Select Country..'});
  };
  onMenuOpen = selectedOption => {
    if(this.state.selectedOptionState=='Select State..'){
      this.handleClickWarning();
    }
    else{
    this.setState({placeholder:'Select District..'});
    options_districts.length=0;
    var id=0;
    var state='';
    if(options_state.length!=0){
    if(this.state.selectedOptionState.toString().length==arr[0].State.length  )
    {
    state=this.state.selectedOptionState;
    }
    else{
      state=this.state.selectedOptionState['value'];

    }
    arr[0].State=state;
    for(let i=0;i<this.state.stateList.length;i++)
    {
      if((this.state.stateList[i].name.toString().toLowerCase()==state.toString().toLowerCase() ))
      {
        id=this.state.stateList[i].stateID;
        break;
      }
    }
    for(let i=0;i<this.state.districtList.length;i++)
   {
    if(this.state.districtList[i].stateID==id)
    {let x =this.state.districtList[i].name;
    options_districts.push({"value": x , "label": x })
    }
   }
  }
 }
};


  handleChangeState = selectedOptionState => {
    this.setState({ selectedOptionState,open_warning:false,placeholder:'Select District..',error_state:false,selectedOption:'Select District..',placeholderState:selectedOptionState});

  };
  onMenuOpenState =selectedOptionState =>{
    this.setState({placeholderState:'Select State..'});
    options_state.length=0;
    var id=0;
    var country='';
    if(this.state.selectedOptionCountry.toString().length==arr[0].Country.length)
    {
    country=this.state.selectedOptionCountry;
    arr[0].Country=this.state.selectedOptionCountry;
    }
    else{
      country=this.state.selectedOptionCountry['value'];
   arr[0].Country=this.state.selectedOptionCountry['value'];
    }
      for(let i=0;i<this.state.countryList.length;i++)
    {
      if((this.state.countryList[i].name.toString().toLowerCase()==country.toString().toLowerCase() ))
      {
        id=this.state.countryList[i].countryID;
        break;
      }
    }
    for(let i=0;i<this.state.stateList.length;i++)
    {
      if(this.state.stateList[i].countryID==id)
        {let x =this.state.stateList[i].name;
        options_state.push({"value": x , "label": x })
        }
    }
  };

  handleChangeCountry = selectedOptionCountry => {

    this.setState({ selectedOptionCountry,error_country:false,placeholderCountry:selectedOptionCountry});
    this.setState({selectedOption:'Select District..',
    selectedOptionState:'Select State..',placeholder:'Select District..',placeholderState:'Select State..'});
    options_state.length=0;
    options_districts.length=0;
  };
  async componentDidMount() {
    try{
    let gresult = await axios.get(
    baseURL+'api/com/getDistrict/', {
        headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    }
    );
    this.setState({
      districtList:gresult.data,
      selectedOption:arr[0].District,
    })

    dist="\""+this.state.selectedOption+"\"";
    options_districts.length=0;
    options_state.length=0;
    options_country.length=0;
    for(let i=0;i<this.state.districtList.length;i++)
    {
        let x =this.state.districtList[i].name;
        if(options_districts.indexOf('x')===-1){
        options_districts.push({"value": x , "label": x })
        }
    }
    }catch(error){ this.props.history.push('/app/dashboard') }

    try{
          let gresultstate = await axios.get(
          baseURL+'api/com/getState/', {
              headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
          );
          this.setState({stateList:gresultstate.data,
          selectedOptionState:arr[0].State,
          })
          for(let i=0;i<this.state.stateList.length;i++)
          {
              let x =this.state.stateList[i].name;
              options_state.push({"value": x , "label": x })
          }
      }catch(error){ this.props.history.push('/app/dashboard') }



      try{
            let gresultcountry = await axios.get(
            baseURL+'api/com/getCountry/', {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
            );
            this.setState({countryList:gresultcountry.data,
            selectedOptionCountry:arr[0].Country,})
            for(let i=0;i<this.state.countryList.length;i++)
            {
                let x =this.state.countryList[i].nicename;
                options_country.push({"value": x , "label": x })
            }
        }catch(error){this.props.history.push('/app/dashboard') }
     options_schoolType.length=0
      try
      {
        let gresultSchoolTypes = await axios.get(
          baseURL+'api/com/getSchoolTypes/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        )
        this.setState({selectedOptionSchoolType:arr[0].schoolType})
        for (var i=0;i<gresultSchoolTypes.data.data.length;i++){
          options_schoolType.push({"value":gresultSchoolTypes.data.data[i].codeName,"label":gresultSchoolTypes.data.data[i].codeName})
        }
      }
      catch(error){ this.props.history.push('/app/dashboard') }

      options_schoolGroup.length=0;
      try
      {
        let gresultSchoolGroups = await axios.get(
          baseURL+'api/com/getSchoolGroups/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        )
        this.setState({selectedOptionSchoolGroup:arr[0].schoolGroup})
        for (var i=0;i<gresultSchoolGroups.data.data.length;i++){
          options_schoolGroup.push({"value":gresultSchoolGroups.data.data[i].codeName,"label":gresultSchoolGroups.data.data[i].codeName})
        }
      }
      catch(error){ 
        this.props.history.push('/app/dashboard') 
      }

      if(arr[0].schoolName==="") this.props.history.push('/app/dashboard')
}

async submitData()
  {
   this.handleToggle();
   if(!arr[0].Phone.includes('+')){
    arr[0].Phone = '+'+arr[0].Phone
   }
      await axios.post(baseURL+'api/com/updateSchools/'+arr[0].schoolID+'/',{
      'schoolName':arr[0].schoolName,
      'schoolTypeCodeID':{'codeName':arr[0].schoolType},
      'schoolGroupID':{'codeName':arr[0].schoolGroup},
      'UDISEcode':arr[0].UDISECode,
      'phone':arr[0].Phone,
      'modified_by':localStorage.getItem('username'),
      'addressID':{
      'line1':arr[0].AddressLine1,
      'line2':arr[0].AddressLine2,
      'city':arr[0].City,
      'districtID':{'name':arr[0].District},
      'stateID':{'name':arr[0].State},
      'countryID':{'nicename':arr[0].Country},
      'pincode':arr[0].Pincode,

    },
      },{headers:{'Content-Type':'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')}}
      ).then(response=>{
        this.handleCloseProgress();
        if(!(this.state.error_state|| this.state.error_country|| this.state.error_district))
        {
        this.handleClick();
        }

    this.setState({readOnly:true,clicked:false,isHidden:true});
      }).catch(error=>{
        this.handleCloseProgress();
        this.handleClickError();
      });
  }
  onSubmit=()=>{
    this.handlePhoneChange()

    var errorPresent=false

   if(document.getElementById('SchoolName').value=='')
   {
    this.setState({error_schoolname:true})
    errorPresent=true
   }
   if(this.state.placeholderSchoolType=='Select School Type..')
   {
    this.setState({error_schooltype:true})
    errorPresent=true
   }
   if(this.state.placeholderSchoolGroup=='Select School Group..')
   {
    this.setState({error_schoolgroup:true})
    errorPresent=true
   }
   if(document.getElementById('UDISECode').value=='')
   {
    this.setState({error_udisecode:true})
    errorPresent=true
   }
   if(document.getElementById('Line1').value=='')
   {
    this.setState({error_line1:true})
    errorPresent=true
   }
   if(document.getElementById('Line2').value=='')
   {
    this.setState({error_line2:true})
    errorPresent=true
   }
   if(document.getElementById('City').value=='')
   {
    this.setState({error_city:true})
    errorPresent=true
   }
   if(document.getElementById('Pincode').value=='')
   {
    this.setState({error_pincode:true})
    errorPresent=true
   }

   if(this.state.placeholder=='Select District..')
   {
    this.setState({error_district:true})
    errorPresent=true
   }
   if(this.state.placeholderState=='Select State..')
   {
    this.setState({error_state:true})
    errorPresent=true
   }
   if(this.state.placeholderCountry=='Select Country..')
   {
    this.setState({error_country:true})
    errorPresent=true
   }


    if(!errorPresent){
    arr[0].schoolName=document.getElementById('SchoolName').value;
    arr[0].UDISECode=document.getElementById('UDISECode').value;
    arr[0].Phone=phone
    arr[0].AddressLine1=document.getElementById('Line1').value;
    arr[0].AddressLine2=document.getElementById('Line2').value;
    arr[0].City=document.getElementById('City').value;
   arr[0].Pincode=document.getElementById('Pincode').value;
   if(this.state.placeholder == arr[0].District){
    arr[0].District=this.state.placeholder;
   }
   else {
    arr[0].District=this.state.placeholder['value'];
   }
   if(this.state.placeholderSchoolType == arr[0].schoolType){
    arr[0].schoolType=this.state.placeholderSchoolType
   }
   else {
      arr[0].schoolType=this.state.placeholderSchoolType['value']
   }
   if(this.state.placeholderSchoolGroup == arr[0].schoolGroup){
    arr[0].schoolGroup=this.state.placeholderSchoolGroup
   }
   else {
    arr[0].schoolGroup=this.state.placeholderSchoolGroup['value']
   }
   this.submitData();
  }

  }
  onCancel=()=>{
    document.getElementById('SchoolName').value=arr[0].schoolName
    document.getElementById('UDISECode').value=arr[0].UDISECode
    document.getElementById('Line1').value=arr[0].AddressLine1
    document.getElementById('Line2').value=arr[0].AddressLine2
    document.getElementById('City').value=arr[0].City
    document.getElementById('Pincode').value=arr[0].Pincode
    this.setState({phone:arr[0].Phone})
    this.setState({placeholder:arr[0].District})
    this.setState({placeholderState:this.state.oldstate})
    this.setState({placeholderCountry:arr[0].Country})
    this.setState({placeholderSchoolType:arr[0].schoolType})
    this.setState({placeholderSchoolGroup:arr[0].schoolGroup})
    this.setState({selectedOption:arr[0].District})
    this.setState({selectedOptionState:this.state.oldstate})
    this.setState({selectedOptionCountry:arr[0].Country})
    this.setState({selectedOptionSchoolType:arr[0].schoolType})
    this.setState({selectedOptionSchoolGroup:arr[0].schoolGroup})
    this.setState({readOnly:true,clicked:false,isHidden:true});
    }

  render(){

    const {readOnly} = this.state;
    const {classes}=this.props;
    const customStyles={
      control:base=> ({
        ...base,
        height:'56px',
      })
    }

    return (
    <div>
    <PageTitle title='School Details'></PageTitle>
    <Fab variant="extended" style={{ marginLeft:'900px',marginTop:'-4%' }} color="primary"
        onClick={e => {this.setState({readOnly: !readOnly,isHidden:false,clicked:true})}} disabled={this.state.clicked}>

              <EditIcon/>EDIT


      </Fab>

      <Snackbar open={this.state.open_warning} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose_warning}>
        <Alert onClose={this.handleClose_warning} variant="filled" severity="warning">
        <b>Select State First!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.open_error} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose_error}>
        <Alert onClose={this.handleClose_error} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.open} autoHideDuration={6000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="success">
        <b>Saved Changes Successfully!</b>
        </Alert>
      </Snackbar>
    <div className="sidenav">
    <a href="#/app/school/directions" className="directions"><RoomIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Directions</a>
    <a href="#/app/school/ContactInfo" className="contact"><PhoneIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Contact Info</a>
  <a href="#/app/school/RegisteredBy" className="registeredBy" ><PersonIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Registered By</a>
  <a href="#/app/school/StudentDetails" className="studentsEnrolled" ><PeopleIcon style={{marginLeft:"-40px",marginRight:"20px"}}/>Student Details</a>
  <a href= {srcSchools} className="analysis" ><BarChartIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Analysis</a>
  <a href="#/app/school/download" className="download" ><GetAppIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Download</a>
  </div>
    <Card style={{width:"1000px",marginLeft:"5%"}}>
      <CardContent>
      <Box display="flex" flexDirection="row"  p={1} m={1} >
        <Box p={1}>
        <TextField
          id="SchoolName"
          disabled={readOnly}
          label={this.state.error_schoolname?"Enter school name":'School Name'}
           helperText={this.state.error_schoolname ? 'Required* ' : ''}
           error={this.state.error_schoolname}
           onChange={e => this.handleSchoolNameChange(e.target.value)}
          defaultValue={arr[0].schoolName}
          //variant={readOnly?"filled":"outlined"}
          variant="outlined"
          style={{width:"250px"}}
          InputProps={{
             //readOnly:Boolean(readOnly),
             endAdornment: (
              <InputAdornment position="end">
              {this.state.error_schoolname?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          
        />
        </Box>
        <Box style={{marginLeft:'10px',width:'260px',marginTop:'-20px',zIndex:'200'}} p={1}>School Type
      <Select
      id='schoolType'
      value={this.state.selectedOptionSchoolType}
      onChange={this.handleSchoolTypeChange}
      onMenuOpen={this.onMenuSchoolTypeOpen}
      label="School Type"
      options={options_schoolType}
      placeholder={this.state.placeholderSchoolType}
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
   {this.state.error_schooltype?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
   </Box>
      <Box style={{marginLeft:'10px',width:'260px',marginTop:'-20px',zIndex:'200'}} p={1}>School Group
    <Select
    id='SchoolGroup'

    value={this.state.selectedOptionSchoolGroup}
    onChange={this.handleSchoolGroupChange}
    onMenuOpen={this.onMenuSchoolGroupOpen}
    label="School Group"
    options={options_schoolGroup}
    placeholder={this.state.placeholderSchoolGroup}
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
    {this.state.error_schoolgroup?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
   </Box>
   </Box>
    <Box display="flex" flexDirection="row" p={1} m={1} >
    <Box>
    <TextField
      id="UDISECode"
      disabled={readOnly}
      label={this.state.error_udisecode?"Enter UDISE Code":'UDISE Code'}
      helperText={this.state.error_udisecode ? 'Required* ' : ''}
      error={this.state.error_udisecode}
      onChange={e => this.handleUDISECodeChange(e.target.value)}
      //variant={readOnly?"filled":"outlined"}
      variant="outlined"
      defaultValue={arr[0].UDISECode}
      style={{marginLeft:'10px',width:"380px"}}
      InputProps={{
        //readOnly:Boolean(readOnly),
        endAdornment: (
         <InputAdornment position="end">
         {this.state.error_udisecode?  <ErrorIcon style={{color:"red"}} />:''}
         </InputAdornment>
       ),
       }}
       InputLabelProps={{
        shrink: true,
      }}
    />
  </Box>
  <Box>
  <PhoneInput
  id='Phone'
  containerStyle={{ marginLeft:'20px', height:'54px',width:'125%'}}
  value={this.state.phone}
  country={'in'}
  disabled={readOnly}
  inputStyle={{height:'54px',width:'125%'}}
  onChange={phone=>this.setState({phone:phone,error_phone:false})}
/>
{this.state.error_phone?<FormHelperText style={{color:"red",marginLeft:"18px"}}> Required*</FormHelperText>:''}
      </Box>
      </Box>
      <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box>
        <TextField
          id="Line1"
          disabled={readOnly}
          label={this.state.error_line1?"Enter Address Line1":'Address Line 1'}
           helperText={this.state.error_line1 ? 'Required* ' : ''}
           error={this.state.error_line1}
           onChange={e => this.handleLine1Change(e.target.value)}
          //variant={readOnly?"filled":"outlined"}
          variant="outlined"
          defaultValue={arr[0].AddressLine1}
          style={{marginLeft:'10px',width:"380px"}}
          InputProps={{
            //readOnly:Boolean(readOnly),
            endAdornment: (
             <InputAdornment position="end">
             {this.state.error_line1?  <ErrorIcon style={{color:"red"}} />:''}
             </InputAdornment>
           ),
           }}
           InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box >
      <TextField
          id="Line2"
          disabled={readOnly}
          label={this.state.error_line2?"Enter Address Line2":'Address Line 2'}
           helperText={this.state.error_line2 ? 'Required* ' : ''}
           error={this.state.error_line2}
           onChange={e => this.handleLine2Change(e.target.value)}

          //variant={readOnly?"filled":"outlined"}
          variant="outlined"
          defaultValue={arr[0].AddressLine2}
          style={{width:"380px",marginLeft:'22px'}}
          InputProps={{
            //readOnly:Boolean(readOnly),
            endAdornment: (
             <InputAdornment position="end">
             {this.state.error_line2?  <ErrorIcon style={{color:"red"}} />:''}
             </InputAdornment>
           ),
           }}
           InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      </Box>
      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Box  style={{width:'260px',marginTop:'-8px', zIndex:300}} p={1}>Country
      <Select
      id='Country'
      value={this.state.selectedOptionCountry}
      onChange={this.handleChangeCountry}
      onMenuOpen={this.onMenuCountryOpen}
      label="Country"
      options={options_country}
      placeholder={this.state.placeholderCountry}
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
   {this.state.error_country?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
    </Box>

    <Box style={{marginLeft:'10px',width:'260px',marginTop:'-8px',zIndex:300}} p={1}>State
      <Select
      id='State'
      label="State"
      className='select'
      classNamePrefix='react-select'
      styles={customStyles}
      value={this.state.selectedOptionState}
      onChange={this.handleChangeState}
      onMenuOpen={this.onMenuOpenState}
      options={options_state}
      placeholder={this.state.placeholderState}
      variant='outlined'
      theme={theme => ({
        ...theme,
        colors: {
            ...theme.colors,
            neutral50: readOnly?'#808080':'#1A1A1A',
        },
        })}
    isDisabled={Boolean(readOnly)}
    />
   {this.state.error_state?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
     </Box>
      <Box style={{marginLeft:'10px',width:'260px',marginTop:'-8px',zIndex:300}} p={1} >District
       <Select
        id='District'
        value={this.state.selectedOption}
        onMenuOpen={this.onMenuOpen}
        onChange={this.handleChange}
        label="District"
        classNamePrefix='react-select'
        options={options_districts}
        placeholder={this.state.placeholder}
        theme={theme => ({
          ...theme,
          colors: {
              ...theme.colors,
              neutral50: readOnly?'#808080':'#1A1A1A',
          },
      })}
        variant='outlined'
        styles={customStyles}
        isDisabled={Boolean(readOnly)}
      />
       {this.state.error_district?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
      </Box>
      </Box>
      <Box display="flex" flexDirection="row" p={1} m={1} >
      <Box style={{width:"250px",marginLeft:'150px'}}>
      <TextField
          id="City"
          disabled={readOnly}
          label={this.state.error_city?"Enter city":'City'}
           helperText={this.state.error_city ? 'Required* ' : ''}
           error={this.state.error_city}
           onChange={e => this.handleCityChange(e.target.value)}
          defaultValue={arr[0].City}
          style={{marginLeft:'10px'}}
          //variant={readOnly?"filled":"outlined"}
          variant="outlined"
          InputProps={{
            readOnly:Boolean(readOnly),
            endAdornment: (
             <InputAdornment position="end">
             {this.state.error_city?  <ErrorIcon style={{color:"red"}} />:''}
             </InputAdornment>
           ),
           }}
           InputLabelProps={{
            shrink: true,
          }}
             />
      </Box>
        <Box style={{width:"250px"}}> 
        <TextField
          id="Pincode"
          disabled={readOnly}
          label={this.state.error_pincode?"Enter pincode":'Pincode'}
           helperText={this.state.error_pincode ? 'Required* ' : ''}
           error={this.state.error_pincode}
           onChange={e => this.handlePincodeChange(e.target.value)}
          //variant={readOnly?"filled":"outlined"}
          variant="outlined"
          defaultValue={arr[0].Pincode}
          style={{marginLeft:'10px'}}
          InputProps={{
            //readOnly:Boolean(readOnly),
            endAdornment: (
             <InputAdornment position="end">
             {this.state.error_pincode?  <ErrorIcon style={{color:"red"}} />:''}
             </InputAdornment>
           ),
           }}
           InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      </Box>
      <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        {!this.state.isHidden? <Button onClick={this.onSubmit} variant="contained" color="primary"  style={{marginLeft:'140%',width:"120%",display:'flex'}}>
        Save Changes
      </Button>:''}
     </Box>
     <Box p={1} m={1}>
        {!this.state.isHidden? <Button onClick={this.onCancel} variant="contained" color="textSecondary"  style={{marginLeft:'230%',width:"200%",display:'flex'}}>
        Cancel
      </Button>:''}
     </Box>
     </Box>
      </CardContent>
    </Card>
    <Backdrop className={classes.backdrop}  open={this.state.openprogress}  onClick={this.handleCloseProgress}>
        <CircularProgress color="primary" />
      </Backdrop>
         </div>
    );
  }
}

SchoolDetail.propTypes ={
  classes:PropTypes.object.isRequired,
};

export default (withStyles)(styles)(SchoolDetail);
