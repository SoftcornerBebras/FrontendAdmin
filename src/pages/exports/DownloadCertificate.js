import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';
import PropTypes from 'prop-types';
import {baseURL} from '../constants'  
import { withStyles } from '@material-ui/core/styles';

var value='',selectedOptionCountry={"value":99,"label":"India"},selectedCompetition='';
var selectedAge='Select Age Group..', selectedOptionSchool=''
var country=[],competition=[],school=[]

const styles = theme =>({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',

  }

})
class DownloadCertificate extends Component {


  constructor(props){
    super(props);
    value=props.location
    this.state={
     rerender:false,
     agegroup:[],
     openS1:false,
     openS2:false,
     openS3:false,
     openS4:false,
     openS5:false,
     openS6:false,
     openError:false,
     openNoStudents:false,
     competitionOpts:[],
     loadingData:false,
   }
  }
 handleToggle = () => {
  this.setState({openprogress:true});
};
handleCloseLoad=()=>{
    this.setState({loadingData:false})
}
handleCloseStudents = (event,reason) => {
    if (reason === 'clickaway') {
    return;
  }

  this.setState({openNoStudents:false});
}
handleCloseProgress = () => {
  this.setState({openprogress:false});
};
 handleCloseS1=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS1:false});
}
handleCloseS2=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS2:false});
}
handleCloseS3=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS3:false});
}
handleCloseS4=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS4:false});
}
handleCloseS5=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS5:false});
}
handleCloseS6=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS6:false});
}
handleCloseError=()=>{
    this.setState({openError:false})
}
  handleCountryChange=(newValue)=>{
    this.setState({rerender:!this.state.rerender})
 selectedOptionCountry=newValue
  }
  handleSchoolChange=(newValue)=>{
    this.setState({rerender:!this.state.rerender})
    selectedOptionSchool=newValue
  }
  handleCompetitionChange=(newValue)=>{
 selectedCompetition=newValue

 if(selectedCompetition!='')
    {
      this.setState({loadingData:true})
      this.fetch();
    }
    selectedAge="  "

    this.setState({rerender:!this.state.rerender})
  }
  handleChangeAge=(newVal)=>{
    this.setState({rerender:!this.state.rerender})
    selectedAge=newVal
  }

  handleDownload=()=>{
    if(selectedCompetition=='' & selectedAge=='Select Age Group..'){
      this.setState({openS3:true})
    }

    else if(selectedCompetition==''){
      this.setState({openS1:true})
    }

    else if(selectedAge=='Select Age Group..'){
      this.setState({openS2:true})
    }

    else{
      this.handleToggle()
      this.sleep(5000).then(()=>{})
    axios({
      method: 'get',
      url: baseURL+'api/cmp/getNationalTopperCertificates/'+selectedCompetition['value']+"&"+selectedAge['value']+"&"+selectedOptionCountry['value'] +"/",
      headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    })
    .then(response =>{
        if(response.status==200){
         this.sleep(5000).then(()=>{

          fetch(baseURL+'media/output/'+'National Toppers-'+selectedAge['label']+'-'+selectedCompetition['label'].toString().split(" ")[2]+'.zip',{
           headers: {
             "Content-Type": "application/pdf",
           },
         })
          .then(response => {
            response.blob().then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = 'National Toppers-'+selectedAge['label']+'-'+selectedCompetition['label'].toString().split(" ")[2]+'.zip';
              a.click();
        this.handleCloseProgress()
            this.setState({openS4:true})
        axios({

          url: baseURL+'api/cmp/deleteFiles/'+0+'&'+0+'&'+selectedAge['label']+'&'+selectedCompetition['label'].toString().split(" ")[2]+'&'+'nationalToppers'+'/',
              headers: {Authorization: 'Token '+localStorage.getItem('id_token')}

        }).then(response=> {
            selectedAge="";selectedOptionSchool="";selectedCompetition="";
        }).
        catch(error=> {this.setState({openError:true})});

      });
        }).catch(error=> this.setState({openError:true}));

      })
      }
      if(response.status==204){
      this.handleCloseProgress()
        this.setState({openNoStudents:true})
      }
      })
         .catch(error=> {
           this.handleCloseProgress()
           if(error.status == 204) {
            this.setState({openNoStudents:true})
           } else if(error.status==500) this.setState({openError:true})
           else {
            this.setState({openS5:true})}
          });

        }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async fetch(){

    var getCompAge

    var cmp=selectedCompetition['value']

    this.setState({agegroup:[]})
    try{
      getCompAge=await axios.get(
        baseURL+'api/cmp/getAgeGrpCmpWise/'+ cmp+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
      );
    }
    catch(error){this.setState({openError:true})}
    for(var i=0;i<getCompAge.data.AgeGrp.length;i++)
    {
        this.setState(prev=>({agegroup:[...prev.agegroup,{"value":getCompAge.data.AgeGrp[i].AgeGroupID,"label":getCompAge.data.AgeGrp[i].AgeGroupName}]}))
    }
    this.setState({loadingData:false})
  }
  async componentDidMount(){

    selectedAge="";selectedOptionSchool="";selectedCompetition="";
    country.length=competition.length=0
    this.setState({selectedAge:""})

    var gresult

  if(value.data=='National Toppers'){
    document.getElementById('nationalToppers').style.display="block"
    document.getElementById('school').style.display="none"

    try{
      gresult = await axios.get(
      baseURL + 'api/com/getCountry/', {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
      );

  }
  catch(error) {this.setState({openError:true})}
var gresultCmp
  try{
    gresultCmp = await axios.get(
    baseURL+'api/cmp/getCompetition/', {
        headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    }
    );

}
catch(error) {this.setState({openError:true})}
country.length=0
for(var i=0;i<gresult.data.length;i++){
  country.push({"value":gresult.data[i].countryID,"label":gresult.data[i].name})

}
competition.length=0
this.state.competitionOpts.length=0
for(var i=0;i<gresultCmp.data.length;i++){

    if(gresultCmp.data[i].competitionName.toString().includes(gresultCmp.data[i].startDate.toString().split("-")[0])){
      this.setState(prev=>({competitionOpts:[...prev.competitionOpts,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName}]}))
    }
    else
    {
      this.setState(prev=>({competitionOpts:[...prev.competitionOpts,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName +' '+gresultCmp.data[i].startDate.toString().split("-")[0] }]}))}
    }
  }
  else{

    document.getElementById('nationalToppers').style.display="none"
    document.getElementById('school').style.display="block"

    var getSchools
  try{
    getSchools= await axios.get(
      baseURL + 'api/com/getSchool/',{
         headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );

  }
   catch(error) {this.setState({openError:true})}

  school.length=0;
for(var i=0;i<getSchools.data.length;i++)
{
  school.push({"value": getSchools.data[i].schoolName+','+getSchools.data[i].addressID.city+","+getSchools.data[i].schoolID+','+getSchools.data[i].addressID.stateID.name+","+getSchools.data[i].addressID.pincode
  ,"label":getSchools.data[i].schoolName+','+getSchools.data[i].addressID.city+","+getSchools.data[i].addressID.stateID.name+","+getSchools.data[i].addressID.pincode})
}
  }
}
proceed=()=>{
  if(selectedOptionSchool==''){
  this.setState({openS6:true})
  }

  else{
  this.props.history.push({
    pathname:'/app/school/download',
    data:selectedOptionSchool['value']+'_'+value.data
  })
   }
}
  render(){
    const classes = this.props.classes
    return (
      <div>
          <Paper  elevation={3} style={{width:'50%',marginLeft:'20%',marginTop:"5%"}} >
          <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseS1} severity="warning">
          Select Competition!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseS2} severity="warning">
          Select Age Group!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS3} autoHideDuration={3000} onClose={this.handleCloseS3} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseS3} severity="warning">
          Select Competition and Age Group !
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS4} autoHideDuration={3000} onClose={this.handleCloseS4} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseS4} severity="success">
          Download Successful!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS5} autoHideDuration={3000} onClose={this.handleCloseS5} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseS5} severity="error">
              Error Occured! Download Failed!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS6} autoHideDuration={3000} onClose={this.handleCloseS6} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseS6} severity="warning">
          Select School!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openError} autoHideDuration={3000} onClose={this.handleCloseError} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseError} severity="error">
          Error Occured!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openNoStudents} autoHideDuration={3000} onClose={this.handleCloseStudents} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleCloseStudents} severity="warning">
         No students Present!
        </Alert>
      </Snackbar>

  <Box flexDirection='row' p={1} m={1}>
  <Box p={1} m={1}>
    <Typography variant='h5' style={{marginLeft:'35%'}}>{value.data}</Typography>
    </Box>
    </Box>

    <div id="nationalToppers" style={{display:'none'}}>
    <Box display="flex" flexDirection='row' p={1} m={1}>
  <Box p={1} m={1}  style={{marginLeft:'10%',marginTop:'0%'}}>
    <Typography variant='h6' >Select Country:</Typography>
    </Box>
    <Box p={1} m={1} style={{width:'40%',marginLeft:'10%',marginTop:'-1%',zIndex:"300"}}>

    <Select

          value={selectedOptionCountry}
          onChange={this.handleCountryChange}
          options={country}
          // styles={customStyles}
          placeholder="Select Country.."

                  />
    </Box>

    </Box>
    <Box display="flex" flexDirection='row' p={1} m={1}>
  <Box p={1} m={1}  style={{marginLeft:'10%',marginTop:'0%'}}>
    <Typography variant='h6' >Select Competition:</Typography>
    </Box>
    <Box p={1} m={1} style={{width:'40%',marginLeft:'4%',marginTop:'-1%',zIndex:"250"}}>

    <Select

          value={selectedCompetition}
          onChange={this.handleCompetitionChange}
         options={this.state.competitionOpts}
          // styles={customStyles}
          placeholder="Select Competition.."

                  />
    </Box>

    </Box>
    <Box display="flex" flexDirection='row' p={1} m={1}>
  <Box p={1} m={1}  style={{marginLeft:'10%',marginTop:'0%'}}>
    <Typography variant='h6' >Select Category:</Typography>
    </Box>
    <Box p={1} m={1} style={{width:'40%',marginLeft:'8%',marginTop:'-1%',zIndex:"200"}}>

    <Select

          value={selectedAge}
          onChange={this.handleChangeAge}
         options={this.state.agegroup}
          // styles={customStyles}
          placeholder="Select Category.."

                  />
    </Box>

    </Box>
    <Box display='flex' flexDirection='row' p={1} m={1}>
    <Box p={1} m={1} style={{marginLeft:'27%'}}>
    <Button
              variant="contained"
              color="primary"
              //component="label"
               component="label"
           startIcon={<GetAppIcon/>}
           onClick={this.handleDownload}
              >Download Certificates</Button>
              </Box>
              </Box>
      </div>


      <div id='school'style={{display:"none"}}>

      <Box display="flex" flexDirection='row' p={1} m={1}>
  <Box p={1} m={1}  style={{marginLeft:'10%',marginTop:'0%'}}>
    <Typography variant='h6' >Select School:</Typography>
    </Box>
    <Box p={1} m={1} style={{width:'40%',marginLeft:'10%',marginTop:'-1%',zIndex:"300"}}>

    <Select

          value={selectedOptionSchool}
          onChange={this.handleSchoolChange}
          options={school}
          // styles={customStyles}
          placeholder="Select School.."

                  />
    </Box>

    </Box>

    <Box display='flex' flexDirection='row' p={1} m={1}>
    <Box p={1} m={1} style={{marginLeft:'35%'}}>
    <Button
              variant="contained"
              color="primary"
              //component="label"
               component="label"
           startIcon={<ArrowForwardIcon/>}
           onClick={this.proceed}
              >Proceed</Button>
              </Box>
              </Box>
      </div>

      </Paper>

      <Backdrop className={classes.backdrop}  open={this.state.openprogress}  >

       <CircularProgress color="primary" />
     </Backdrop>



      </div>
    );
  }
}

DownloadCertificate.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(DownloadCertificate)
