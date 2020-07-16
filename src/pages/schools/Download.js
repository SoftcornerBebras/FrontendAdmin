import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ListItem from '@material-ui/core/ListItem';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ClassIcon from '@material-ui/icons/Class';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import PageTitle from "../../components/PageTitle/PageTitle";
import axios from 'axios';
import Select from 'react-select';
import { arr } from './SchoolDetail';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {baseURL,metabaseURL,metabaseSecretKey} from '../constants'
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People'; 
import ErrorIcon from '@material-ui/icons/Error';
import RoomIcon from '@material-ui/icons/Room'; 
import './styles.css';
var jwt = require("jsonwebtoken");

export var cmpYear=[{year: ""}]

var selectedClass='Select Class..';
var index=0;
var students=[];
var classStudents=[];
var placeComp='Select Competition..'
var placeClass='Select Class..'
var placeAge='Select Competition Age Group..'
var success=false;
var readOnly=false;    
var classes=[];
var competition=[];
var compAgeGrp=[]
var cmpval='Select Competition..';
var certval={"value":"Participation","label":"Participation"}
var agegrpval='Select Competition Age Group..';
var certificateType=[{"value":"Participation","label":"Participation"},
{"value":"Toppers","label":"Toppers"}]
var schoolClassID=[];
var group=''
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme =>({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',

  },
  paper: {
    height: 'calc(62% - 64px)',
    top: 200,
    width:"18%"
  },
})

var gresultSchoolClassStudents;
var sch=''
class Download extends Component {
  constructor(props){
    super(props);
    sch=props.location
   if(sch.data==null){
   }else{
   arr[0].schoolName=sch.data.split(',')[0]
   arr[0].City=sch.data.split(',')[1]
   arr[0].schoolID=sch.data.split(',')[2]
   }

}
  state={
    class:0,
    open:true,
    competition:null,
    readOnly:false,
    agegrp:null,
    certval:null,
    openS1:false,
    openS2:false,
    openS3:false,
    openS4:false,
    openS5:false,
    openS6:false,
    openS7:false,
    openS8:false,
    openS9:false,
    openS10:false,
    openprogress:false,
    openError:false,
    rerender:false
  }

handleToggle = () => {
  this.setState({openprogress:true});
};
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

handleCloseS7=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }
  this.setState({openS7:false});
}
handleCloseS8=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }
  this.setState({openS8:false});
}
handleCloseS9=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }
  this.setState({openS9:false});
}
handleCloseS10=(event,reason)=>{
  if (reason === 'clickaway') {
    return;
  }

  this.setState({openS10:false});
}

 async fetch(){
    var getCompAge
    var cmp=cmpval['value'];
    cmpYear[0].year=cmp;
    compAgeGrp.length=0;
    try{
      getCompAge=await axios.get(
        baseURL+'api/cmp/getAgeCmpWise/'+ cmp+"/",{
            headers:{Authorization:"Token "+localStorage.getItem('id_token')}
        }
      );
    for(var i=0;i<getCompAge.data.AgeGrp.length;i++)
    {
      compAgeGrp.push({"value":getCompAge.data.AgeGrp[i].AgeGroupID,"label":getCompAge.data.AgeGrp[i].AgeGroupName})
    }
    }
    catch(error){
        this.setState({openError:true})}
 }

  handleClassChange =(newValue)=> {

    this.setState({class:newValue});
    selectedClass=newValue;
    index=classes.indexOf(selectedClass)

   if(selectedClass!='Select Class..' & cmpval!='Select Competition..'){

       axios({
         method: 'get',
               url: baseURL+'api/cmp/getClassWiseAgeGroup/'+cmpval['value']+"&"+selectedClass['value']+"/",
               headers:{Authorization:"Token "+localStorage.getItem('id_token')}
       })
       .then(response =>{
             success=true
             group=response.data.AgeGroupName
        })
        .catch(function (response) {
          success=false
           this.setState({openError:true})
           });
   }
  }

  handleCompetitionChange=(newValue)=>{
  this.setState({competition:newValue})
    cmpval=newValue;
  if(selectedClass!='Select Class..' & cmpval!='Select Competition..'){

      axios({
        method: 'get',
        url: baseURL+'api/cmp/getClassWiseAgeGroup/'+cmpval['value']+"&"+selectedClass['value']+"/",
        headers:{Authorization:"Token "+localStorage.getItem('id_token')}
      })
      .then(response =>{
            success=true
            if(response.data.length==0)
            {
              success=false
              this.setState({openS8:true})
            }
            else{
              group=response.data.AgeGroupName
            }
       })
       .catch(error=> {
         success=false
        this.setState({openError:true})
        });
  }
  if(cmpval!='Select Competition..')
  {
    this.fetch();
  }
  agegrpval="Select Competition Age Group.."

  }
  handleCertificateTypeChange=(newValue)=>{
    this.setState({certval:newValue})
    certval=newValue
    if (certval['value']=="Toppers"){
      this.handleToppers()
    }
    else if(certval['value']=="Participation"){
      this.handleECert()
    }
  }
  handleAgeGroupChange=(newValue)=>{
    this.setState({agegrp:newValue})
    agegrpval=newValue
  }

   async componentDidMount() {
    if(sch.data==null){
    certval="Select Certificate Type.."
    }
     if(sch.data!=null)
    {
      
      if(sch.data.split('_')[1]=='School Toppers')
      {
       certval=[{"value":"Toppers","label":"Toppers"}]
       this.handleToppers()
      }
      if(sch.data!=null & sch.data.split('_')[1]=='Participation')
      {
        certval=[{"value":"Participation","label":"Participation"}]
        this.handleECert()
      }
    }
    cmpval='Select Competition..'
    agegrpval='Select Competition Age Group..'
    selectedClass='Select Class..'
    compAgeGrp.length=0;
    var gresultClasses;
    var gresultCmp
    try{
      gresultCmp= await axios.get(
        baseURL+'api/cmp/getCompetitionSchoolWise/'+arr[0].schoolID+"/",{
            headers:{Authorization:"Token "+localStorage.getItem('id_token')}
        }
      );
    competition.length=0;
    for(var i=0;i<gresultCmp.data.length;i++)
    {
         if(gresultCmp.data[i].competitionName.toString().includes(gresultCmp.data[i].startDate.toString().split("-")[0])){
          competition.push({"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName})
          }
          else
          {
            competition.push({"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName +' '+gresultCmp.data[i].startDate.toString().split("-")[0] })
          }
    }
      gresultClasses= await axios.get(
        baseURL+'api/com/getSchoolWiseClasses/' + arr[0].schoolID+"/",{
            headers:{Authorization:"Token "+localStorage.getItem('id_token')}
        }
      );
    classes.length=0;
    schoolClassID.length=0;
    for(var i=0;i<gresultClasses.data.length;i++)
    {
      classes.push({"value":gresultClasses.data[i].classNumber,"label":gresultClasses.data[i].classNumber});
      schoolClassID.push({"value":gresultClasses.data[i].schoolClassID,"label":gresultClasses.data[i].schoolClassID});
    }
    readOnly=false;this.setState({readOnly:false})
    }catch(error){this.props.history.push('/app/dashboard')}
        this.setState({rerender:!this.state.rerender})
    }


    check1=()=>{

      if(agegrpval=='Select Competition Age Group..' & cmpval=='Select Competition..'){
        this.setState({openS4:true})
      }
      else if(agegrpval=='Select Competition Age Group..'){
        this.setState({openS1:true})
      }
      else if(cmpval=='Select Competition..'){
        this.setState({openS2:true})
      }
      else{
      readOnly=true
      this.handleToggle()
      axios({
      method: 'get',
      url: baseURL+'api/cmp/getSchoolTopperCertificates/'+cmpval['value']+"&"+agegrpval['value']+"&"+arr[0].schoolID +"/",
      headers:{Authorization:"Token "+localStorage.getItem('id_token')}
    })
    .then(response =>{
    if(response.status==200){
     this.sleep(5000).then(()=>{
     fetch(baseURL+'media/output/'+arr[0].schoolName+', '+arr[0].City+'-Toppers-'+agegrpval['label']+'-'+cmpval['label'].toString().split(" ")[2]+'.zip',{
     })
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = arr[0].schoolName+', '+arr[0].City+'-Toppers-'+agegrpval['label']+'-'+cmpval['label'].toString().split(" ")[2]+'.zip';
          a.click();
      readOnly=false
      this.handleCloseProgress()
      this.setState({openS9:true})
      axios({
      method: 'get',
        url: baseURL+'api/cmp/deleteFiles/'+arr[0].schoolID+'&'+0+'&'+agegrpval['label']+'&'+cmpval['label'].toString().split(" ")[2]+'&'+'schoolToppers'+'/',
        headers:{Authorization:"Token "+localStorage.getItem('id_token')}
      });
    });
   })
    .catch(error=>{
        this.handleCloseProgress()
        readOnly=false
        this.setState({openS10:true})
      });
  })}
  if(response.status==204){
    this.setState({openS7:true})
    this.handleCloseProgress()
       readOnly=false
  }
  })
  .catch(error=> {
       this.handleCloseProgress()
       readOnly=false
       if(error.status==204) {
            this.setState({openS7:true})
        }
      });
      }
    }
  check2=()=>{
      if(selectedClass=='Select Class..' & cmpval=='Select Competition..'){
        this.setState({openS3:true})
      }
      else if(cmpval=='Select Competition..'){
        this.setState({openS2:true})
      }
      else if(selectedClass=='Select Class..'){
        this.setState({openS5:true})
      }
      else{
        var data=[]
        if(success==false){
            this.setState({openS8:true})
          }
          else{
                readOnly=true
                this.handleToggle()
             axios({
              method: 'get',
                    url: baseURL+'api/cmp/getParticipationCertificates/'+cmpval['value']+"&"+schoolClassID[index].value+"/",
                    headers:{Authorization:"Token "+localStorage.getItem('id_token')}
            })
            .then(response =>{
            if(response.status==200){
              this.sleep(5000).then(()=>{
            fetch(baseURL+'media/output/'+arr[0].schoolName+', '+arr[0].City+'-Class-'+selectedClass['value']+'-'+cmpval['label'].toString().split(" ")[2]+'.zip',{
         })
          .then(response => {
            response.blob().then(blob => {

              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = arr[0].schoolName+', '+arr[0].City+'-Class-'+selectedClass['value']+'-'+cmpval['label'].toString().split(" ")[2]+'.zip';
              a.click();
            readOnly=false
            this.handleCloseProgress()
            this.setState({openS9:true})
         axios({
           method: 'get',
           url: baseURL+'api/cmp/deleteFiles/'+arr[0].schoolID+'&'+selectedClass['value']+'&'+cmpval['label'].toString().split(" ")[2]+'&'+'participation'+'/',
           headers:{Authorization:"Token "+localStorage.getItem('id_token')}
         }).then(response=>{});

         });
       })
        .catch(error=>{
        this.handleCloseProgress()
        readOnly=false
        this.setState({openS10:true})
        });
      })
      }
      if(response.status==204){
        this.setState({openS7:true})
        this.handleCloseProgress()
           readOnly=false
      }
      })
        .catch(error=> {
        this.handleCloseProgress()
        readOnly=false
        this.setState({openError:true})
          });
    }
  }
}
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


   handleClick=()=>{
    this.setState({open:!Boolean(this.state.open)});
    document.getElementById('Toppers').style.display='none'
  }
  handleECert=()=>{
    document.getElementById('Ecertificate').style.display='block'
    document.getElementById('Toppers').style.display='none'

  }
  handleToppers=()=>{

    document.getElementById('Ecertificate').style.display='none'
    document.getElementById('Toppers').style.display='block'
  }
  handleCloseError = () => {
    this.setState({openError:false})
  }

  render(){
    const classesP = this.props.classes
    const customStyles={
      control:base=> ({
        ...base,
        width:'50%',
      })
    }
    return (
    <div>
      <PageTitle title="Download"/>
      <div className="sidenav">
    <a href="#/app/school/directions" className="directions"><RoomIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Directions</a>
    <a href="#/app/school/ContactInfo" className="contact"><PhoneIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Contact Info</a>
  <a href="#/app/school/RegisteredBy" className="registeredBy" ><PersonIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Registered By</a>
  <a href="#/app/school/StudentDetails" className="studentsEnrolled" ><PeopleIcon style={{marginLeft:"-40px",marginRight:"20px"}}/>Student Details</a>
  <a href= {metabaseURL + "public/dashboard/be229927-122f-443f-8ea8-685c5255e5ca"} className="analysis" ><BarChartIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Analysis</a>
  <a href="#/app/school/download" className="download" ><GetAppIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Download</a>
  </div>
      <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS1} severity="warning">
          Select Competition Age Group!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS2} severity="warning">
          Select Competition!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS3} autoHideDuration={3000} onClose={this.handleCloseS3} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS3} severity="warning">
          Select Class and Competition!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS4} autoHideDuration={3000} onClose={this.handleCloseS4} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS4} severity="warning">
          Select Competition and Competition Age Group!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS5} autoHideDuration={3000} onClose={this.handleCloseS5} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS5} severity="warning">
          Select Class!
        </Alert>
     </Snackbar>
     <Snackbar open={this.state.openS6} autoHideDuration={3000} onClose={this.handleCloseS5} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS6} severity="warning">
          No students enrolled in this category!
        </Alert>
     </Snackbar>
     <Snackbar open={this.state.openS7} autoHideDuration={3000} onClose={this.handleCloseS7} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS7} severity="warning">
          No students in this class!
        </Alert>
     </Snackbar>
     <Snackbar open={this.state.openS8} autoHideDuration={3000} onClose={this.handleCloseS8} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS8} severity="warning">
          This class is not present in any age group of the selected competition!
        </Alert>
     </Snackbar>

     <Snackbar open={this.state.openS9} autoHideDuration={3000} onClose={this.handleCloseS9} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS9} severity="success">
          Download Successful!
        </Alert>
     </Snackbar>

     <Snackbar open={this.state.openS10} autoHideDuration={3000} onClose={this.handleCloseS10} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS10} severity="error">
          Error occured! Download Failed!
        </Alert>
     </Snackbar>

     <Snackbar open={this.state.openError} autoHideDuration={3000} onClose={this.handleCloseError} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseError} severity="error">
          Error occured!
        </Alert>
     </Snackbar>
     <Paper  elevation={3} style={{width:'90%',marginLeft:'5%',marginTop:"50px"}} >
     <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginTop:'5%',marginLeft:'5%'}} >
        
     <Typography variant='h6'  color='textSecondary'>Select Certificate Type</Typography>
</Box>
<Box  p={1} m={1} style={{width:"40%",marginTop:"5%",marginLeft:'30px'}}>
<Select
        value={certval}
        onChange={this.handleCertificateTypeChange}
        options={certificateType}
        placeholder="Select Certificate Type.."
        isDisabled={readOnly}
      />
      </Box>

</Box>

<Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'-2%'}}>
        <Typography variant='h6'  color='textSecondary'>Select Competition </Typography>
  </Box>
  <Box  p={1} m={1} style={{width:"40%",marginTop:"-2%",marginLeft:'58px'}}>
<Select
        value={cmpval}
        onChange={this.handleCompetitionChange}
        options={competition}
        placeholder={placeComp}
        isDisabled={readOnly}
      />
      </Box>

</Box>
<div id="Ecertificate" style={{display:"none"}}  >
<Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'-2%'}}>
        <Typography variant='h6'  color='textSecondary'>Select Class</Typography>
</Box>

  <Box  p={1} m={1} style={{width:"40%",marginTop:"-2%",marginLeft:'116px'}}>
       <Select
        value={selectedClass}
        onChange={this.handleClassChange}
        options={classes}
        placeholder={placeClass}
        isDisabled={readOnly}
      />
  </Box>
  
  </Box>
  <Box display="flex" flexDirection="row" p={1} m={1} >

  <Box p={1} m={1} id="downloadECert" style={{marginLeft:"20%"}}>
  <Button
        variant="contained"
        color="primary"
        onClick={this.check2}
        startIcon={<GetAppIcon />}
        disabled={readOnly}
      >
        Download Participation Certificates
      </Button>
  </Box>
  </Box>

  </div>
<div id="Toppers" style={{display:"none"}}>
<Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'-2%'}}>
        <Typography variant='h6'  color='textSecondary'>Select Age Group</Typography>
</Box>

<Box  p={1} m={1} style={{width:"40%",marginTop:"-2%",marginLeft:'76px'}}>
       <Select
        value={agegrpval}
        onChange={this.handleAgeGroupChange}
        options={compAgeGrp}
        placeholder={placeAge}
        isDisabled={readOnly}
      />
   </Box>
</Box>

<Box display="flex" flexDirection="row" p={1} m={1} >
<Box p={1} m={1} id='downloadToppers' style={{marginLeft:"20%"}}>
   <Button

        variant="contained"
        color="primary"
        onClick={this.check1}
        startIcon={<GetAppIcon />}
        disabled={readOnly}
        >
        Download School Toppers Certificates
      </Button>
    </Box>
    </Box>
    </div>
     
  </Paper>

   <Backdrop className={classesP.backdrop}  open={this.state.openprogress} >

       <CircularProgress color="primary" />
     </Backdrop>
    </div>
      );
  }
}
Download.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Download)
