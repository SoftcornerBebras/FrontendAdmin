import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import PageTitle from "../../components/PageTitle/PageTitle";
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import {baseURL,userPortalURL} from '../constants';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PropTypes from 'prop-types';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { withStyles } from '@material-ui/core/styles';

var categories=[{"value":'National Toppers',"label":'National Toppers'},
{"value":'School Toppers',"label":'School Toppers'},
{"value":'Participants',"label":'Participants'}]

var file='',skill='',language='',domain='',level='',schgrp='',value=''

var uploadType=''
var templateName=''
var previewType=''
var ageGroup=''
var AgeGroups=[]

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme =>({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  input1: {
    height: 6,
  },
})
class Settings extends Component {

    constructor(props){
      super(props);
      this.state={
      uploadType:'',
      previewType:'',
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
      openS11:false,
      openError:false,
      rerenderer:false
      }
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
  handleCloseS11=(event,reason)=>{
    if (reason === 'clickaway') {
      return;
    }

    this.setState({openS11:false});
  }
  handleCloseError=()=>{
    this.setState({openError:false})
  }

  componentDidMount=()=>{

    file='';previewType="";skill="";language="";domain="";level="";schgrp="";value="";uploadType="";ageGroup="";templateName="";
   this.setState({rerenderer:!this.state.rerenderer})
    document.getElementById('filename').innerHTML='No file chosen'
    uploadType='Select Certificate Category..'
    
    axios({
      method: 'get',
      url: baseURL+'api/cmp/viewAgeGroup/',
      headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    })
      .then(response =>{
      AgeGroups.length=0;
        for(var i=0;i<response.data.length;i++){
          AgeGroups.push({'value':response.data[i].AgeGroupID, 'label':response.data[i].AgeGroupName})
        }
      })
      .catch(error=> {
        this.setState({openError:true})
      });
  }
  onFileChange = (event) => {

    file= event.target.files[0]
    if(file!=null ){
    document.getElementById('filename').innerHTML=file['name']

    var templateExtn=file['name'].substring(file['name'].length-5,file['name'].length)
   if(templateExtn!='.pptx')
   {
        this.setState({openError:true})
   }
   else{

     let today = new Date();
     let date = today.getFullYear() + '-' + (today.getMonth()+1)+'-'+today.getDate();
     let time = today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds();
     let finalDate = date + '_' + time


     if(uploadType['value']=='Participants'){
      templateName='Bebras_Certificate_Participation'+'_'+finalDate+templateExtn
     }
     else if(uploadType['value']=='School Toppers'){
       templateName='Bebras_Certificate_School_Toppers'+'_'+finalDate+templateExtn
     }

    else if(uploadType['value']=='National Toppers'){
      templateName='Bebras_Certificate_National_Toppers'+'_'+finalDate+templateExtn
    }
  }
   }
  }
  handlePreview=()=>{
    var type
    if(previewType==''){
      this.setState({openS1:true})
    }
    else{
      this.handleToggle()
    if(previewType['value']=='Participants'){
      type='Participation'
    }
    if(previewType['value']=='School Toppers'){
      type='School_Toppers'
    }if(previewType['value']=='National Toppers'){
      type='National_Toppers'
    }
    axios({
      method: 'get',
      url: baseURL + 'api/cmp/getLatestTemplate/'+type+"/",
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    })
    .then(response =>{
          var name=response.data
          fetch(baseURL+'media/ppt/'+response.data,{
             headers: {
               "Content-Type": "application/pdf",
             },
           })
            .then(response =>
              response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = name;
                a.click();
                previewType=""
                this.handleCloseProgress()
                this.setState({openS2:true})
              }))
         })
         .catch(error=>{
           this.handleCloseProgress()
           this.setState({openS3:true})
            });
         }
      }
  handlePreviewTypeChange=(newValue)=>{
    this.setState({previewType:newValue})
    previewType=newValue
  }
  check=()=>{

if(uploadType['value']==null){
  this.setState({openS1:true})
document.getElementById('file').disabled=true
}
  }
  handleDownload(){
   var a
    fetch(baseURL+'media/ppt/output006.pdf',{
			 headers: {
			   "Content-Type": "application/pdf",
			 },
	   })
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					 a = document.createElement('a');
					a.href = url;
					a.download = 'Certificate PDF.pdf';
					a.click();
                    previewType=""
                    this.setState({rerenderer:!this.state.rerenderer})
				});
    })
  }
handleTypeChange=(newValue)=>{
  this.setState({uploadType:newValue})
  uploadType=newValue
  document.getElementById('file').disabled=false
  document.getElementById('filename').innerHTML='No file chosen'
}

handleUpload=()=>{
  if(file==''){
    this.setState({openS4:true})
  }
  else if(document.getElementById('filename').innerHTML=='No file chosen'){
    this.setState({openS4:true})
  }
  else{
    this.handleToggle()
  var data = new FormData();
  data.append('ppt', file,templateName);

  axios({
    method: 'post',
    url: baseURL + 'api/cmp/customizePPT/',
    data: data,
    headers: {'Content-Type': 'multipart/form-data', Authorization: 'Token '+localStorage.getItem('id_token')}
    })
    .then(response =>{
      this.handleCloseProgress()
      uploadType=""
      this.setState({openS5:true})
    })
    .catch(error=> {
      this.handleCloseProgress()
      this.setState({openS6:true})
    });
  }
}
handleAgeGroupInsert=()=>{

  this.props.history.push({
    pathname:'/app/competitions/addGroups',

  })
}
handleAgeGroupUpdate=()=>{
if(ageGroup==''){
this.setState({openS10:true})
}
else{
  var data = new FormData();
  data.append('AgeID',ageGroup['value']);

  axios({
    method: 'post',
    url: baseURL+'api/cmp/checkUpdateAgeGrp/',
    data: data,
    headers: {
                 'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
            }
    })
    .then(response =>{
      if(response.data=='Update'){
      this.props.history.push({
        pathname:'/app/updateAgeGrps',
        data: ageGroup['value']+','+ageGroup['label']
      })
      }
      else if (response.data=="AgeGroup can't be updated") {
          this.setState({openS11:true})
      }
    })
    .catch(error=> {
      this.setState({openError:true})
    });

}
}
handleAgeGroupChange=(newValue)=>{
  ageGroup=newValue
  this.setState({rerenderer:!this.state.rerenderer})
}
 handleLanguageInsert=()=>{
  value="Language"
  this.setState({rerenderer:!this.state.rerenderer})
  if( language==''){
    this.setState({openS7:true})
  }
else{
  var data = new FormData();
  data.append('language',language);

  axios({
    method: 'post',
    url: baseURL + 'api/com/insertLanguage/',
    data: data,
    headers: {
                 'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
            }
    })
    .then(response =>{
      if(response.data==200){
        document.getElementById('language').value=''
        language=''
        this.setState({openS8:true})
    }
      else if (response.data==-1) {
        document.getElementById('language').value=''
        language=''
        this.setState({openS9:true})
      }
    })
    .catch(error=> {
      this.setState({openError:true})
    });
  }
}
 handleSkillInsert=()=>{
    value="Skill"
  this.setState({rerenderer:!this.state.rerenderer})
  if( skill==''){
    this.setState({openS7:true})
  }
else{
  var data = new FormData();
  data.append('skill',skill);

  axios({
    method: 'post',
    url: baseURL+'api/com/insertSkill/',
    data: data,
    headers: {
                 'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
            }
    })
    .then(response =>{
      if(response.data==200){
      document.getElementById('skill').value=''
      skill=''
      this.setState({openS8:true})
      }
      else if (response.data==-1) {
        document.getElementById('skill').value=''
        skill=''
        this.setState({openS9:true})
      }
    })
    .catch(error=> {
      this.setState({openError:true})
    });
  }
}
 handleLevelInsert=()=>{

  value="Question Level"
  this.setState({rerenderer:!this.state.rerenderer})
  if( level==''){
    this.setState({openS7:true})
  }
else{
  var data = new FormData();
  data.append('level',level);

  axios({
    method: 'post',
    url: baseURL+'api/com/insertLevel/',
    data: data,
    headers: {
                 'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
            }
    })
    .then(response =>{
      if(response.data==200){
      document.getElementById('level').value=''
      level=''
      this.setState({openS8:true})
      }
      else if (response.data==-1) {
        document.getElementById('level').value=''
        level=''
        this.setState({openS9:true})
      }
    })
    .catch(error=> {
      this.setState({openError:true})
    });
  }
}

  goToPortalPage = () => {
    window.location.replace(userPortalURL+"bulkresponseupload")
  }

 handleSchoolGroupInsert=()=>{

  value="School Group"
  this.setState({rerenderer:!this.state.rerenderer})
  if( schgrp==''){
    this.setState({openS7:true})
  }
else{
  var data = new FormData();
  data.append('schoolGroup',schgrp);

  axios({
    method: 'post',
    url: baseURL + 'api/com/insertSchoolGrps/',
    data: data,
    headers: {
               'Content-Type' : 'application/json',
               Authorization: 'Token '+localStorage.getItem('id_token')
            }
    })
    .then(response =>{
      if(response.data==200){
      document.getElementById('schgrp').value=''
      schgrp=''
      this.setState({openS8:true})
      }
      else if (response.data==-1) {
        document.getElementById('schgrp').value=''
        schgrp=''
        this.setState({openS9:true})
      }
    })
    .catch(error=> {
      this.setState({openError:true})
    });
  }
}
handleDomainInsert=()=>{

  value='Domain'
  this.setState({rerenderer:!this.state.rerenderer})
  if( domain==''){
    this.setState({openS7:true})
  }
else{
  var data = new FormData();
  data.append('domain',domain);

  axios({
    method: 'post',
    url: baseURL + 'api/com/insertDomain/',
    data: data,
    headers: {
                 'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
            }
    })
    .then(response =>{
      if(response.data==200){
      document.getElementById('domain').value=''
      domain=''
      this.setState({openS8:true})
      }
      else if (response.data==-1) {
        document.getElementById('domain').value=''
        domain=''
        this.setState({openS9:true})
      }
    })
    .catch(error=> {
      this.setState({openError:true})
    });
  }
}
handleLanguage=(newValue)=>{
language=newValue
  this.setState({rerenderer:!this.state.rerenderer})
}
handleDomain=(newValue)=>{
  domain=newValue
  this.setState({rerenderer:!this.state.rerenderer})
  }
handleSkill=(newValue)=>{
    skill=newValue
  this.setState({rerenderer:!this.state.rerenderer})
}
handleLevel=(newValue)=>{
  level=newValue
  this.setState({rerenderer:!this.state.rerenderer})
  }

handleGroup=(newValue)=>{
  schgrp=newValue
  this.setState({rerenderer:!this.state.rerenderer})
  }


  downloadTemplate = () => {
     fetch(baseURL + 'media/csv/BulkUploadTemplate.csv',{
             headers: {
               "Content-Type": "application/pdf",
             },
           }).then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'Bulk Upload Template.csv';
					a.click();
					this.handleCloseProgress()
                    this.setState({openS2:true})
				});
    })
    .catch(error=>{
           this.handleCloseProgress()
           this.setState({openS3:true})
     });
  }

  render(){
    const classes = this.props.classes
    return (
      <div>

        <PageTitle title="Settings"/>
        <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS1} severity="warning">
          Select Certificate Category!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS2} severity="success">
          Download Successful!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS3} autoHideDuration={3000} onClose={this.handleCloseS3} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS3} severity="error">
          Error Occured! Download Failed!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS4} autoHideDuration={3000} onClose={this.handleCloseS4} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS4} severity="warning">
          Select File First!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS5} autoHideDuration={3000} onClose={this.handleCloseS5} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS5} severity="success">
          File Upload Successful!
        </Alert>
      </Snackbar>
       <Snackbar open={this.state.openS6} autoHideDuration={3000} onClose={this.handleCloseS6} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS6} severity="error">
          Error Occured! Upload Failed!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS7} autoHideDuration={3000} onClose={this.handleCloseS7} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS7} severity="warning">
          Enter {value} First!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS8} autoHideDuration={3000} onClose={this.handleCloseS8} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS8} severity="success">
         Successfully Added {value} !
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS9} autoHideDuration={3000} onClose={this.handleCloseS9} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS9} severity="warning">
        {value} already exists!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS10} autoHideDuration={3000} onClose={this.handleCloseS10} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS10} severity="warning">
          Select AgeGroup First!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS11} autoHideDuration={3000} onClose={this.handleCloseS10} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS11} severity="warning">
          Update Not Possible!
        </Alert>
      </Snackbar>

      <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Download Template for Bulk Upload of Questions
          </Typography>
          <Button
              variant="contained"
              color="primary"
               component="label"
               style={{ margin:"2%"}}
                 startIcon={<GetAppIcon/>}
                 onClick={this.downloadTemplate}
              >Download Bulk Upload Template</Button>
              </Box>
              </Paper>

      <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Download Existing Certificate Template
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>

          <Box p={1} m={1} style={{width:"30%",zIndex:"300"}}>
              <Select
            value={previewType}
            onChange={this.handlePreviewTypeChange}
            options={categories}
            placeholder="Select Certificate Category.."
            />
          </Box>

          <Box p={1} m={1}>

          <Button
              variant="contained"
              color="primary"
               component="label"
           startIcon={<GetAppIcon/>}
           onClick={this.handlePreview}
              >Download Existing Template</Button>
              </Box>
              </Box>
              </Paper>
              <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>

      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Upload New Certificate Template
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>

         <Box p={1} m={1} style={{width:"30%",zIndex:"200"}}>
              <Select

  value={uploadType}
  onChange={this.handleTypeChange}
  options={categories}
  placeholder="Select Certificate Category.."

          />
          </Box>
          <Box p={1} m={1}>

          <Button
              variant="contained"
              color="primary"
               component="label"
               onClick={this.check}
               startIcon={<InsertDriveFileIcon />   }
           >
              Choose File
              <input
              id="file"
                type="file"
                accept='.pptx'
                style={{ display: "none" }}
                onChange={this.onFileChange}
                disabled={false}
            />

            </Button>

          </Box>
          <Box  p={1} m={1} style={{marginLeft:'-1%',marginTop:'1.5%'}}>
              <p id='filename' style={{marginTop:'1.5%'}}>No file Chosen</p>
              </Box>
          <Box p={1} m={1}>

              <Button
              variant="contained"
              color="primary"
              onClick={this.handleUpload}
    startIcon={<PublishIcon />   }
               component="label">
                  Upload
              </Button>
          </Box>
          </Box>
           </Paper>
           <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Add New Language
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>
         <Box p={1} m={1} >
           <TextField
           id='language'
           placeholder='Enter New Language'
           variant="outlined"
           onChange={e => this.handleLanguage(e.target.value)}
          defaultValue={language}
           label="Language"
           style={{width:"120%"}}
           InputProps={{ classes: { input: classes.input1 } }}
           InputLabelProps={{
            shrink: true,
          }}
           />

           </Box>
          <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'1%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.handleLanguageInsert}
             startIcon={<AddIcon />   }
               component="label">
                  Add Language
              </Button>
            </Box>
         </Box>
             </Paper>
             <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Add New Domain
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>
         <Box p={1} m={1} >
           <TextField
           id='domain'
           placeholder='Enter New Domain'
           variant="outlined"
           label="Domain"
           onChange={e => this.handleDomain(e.target.value)}

           defaultValue={domain}
           style={{width:"120%"}}
           InputProps={{ classes: { input: classes.input1 } }}
           InputLabelProps={{
            shrink: true,
          }}
           />

           </Box>
          <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'1%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.handleDomainInsert}
             startIcon={<AddIcon />   }
               component="label">
                  Add Domain
              </Button>
            </Box>
         </Box>
             </Paper>
             <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Add New Question Level
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>
         <Box p={1} m={1} >
           <TextField
           id='level'
           placeholder='Enter New Question Level'
           variant="outlined"
           defaultValue={level}
           onChange={e => this.handleLevel(e.target.value)}

           label="Question Level"
           style={{width:"120%"}}
           InputProps={{ classes: { input: classes.input1 } }}
           InputLabelProps={{
            shrink: true,
          }}
           />

           </Box>
          <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'1%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.handleLevelInsert}
             startIcon={<AddIcon />   }
               component="label">
                  Add Question Level
              </Button>
            </Box>
         </Box>
             </Paper>
             <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Add New Skill
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>
         <Box p={1} m={1} >
           <TextField
           id='skill'
           placeholder='Enter New Skill'
           variant="outlined"
           defaultValue={skill}
           label="Skill"
           onChange={e => this.handleSkill(e.target.value)}

           style={{width:"120%"}}
           InputProps={{ classes: { input: classes.input1 } }}
           InputLabelProps={{
            shrink: true,
          }}
           />

           </Box>
          <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'1%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.handleSkillInsert}
             startIcon={<AddIcon />   }
               component="label">
                  Add Skill
              </Button>
            </Box>
         </Box>
             </Paper>
             <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
          Add New School Group
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>
         <Box p={1} m={1} >
           <TextField
           id='schgrp'
           placeholder='Enter New School Group'
           variant="outlined"
           defaultValue={schgrp}
           label="School Group"
           onChange={e => this.handleGroup(e.target.value)}

           style={{width:"120%"}}
           InputProps={{ classes: { input: classes.input1 } }}
           InputLabelProps={{
            shrink: true,
          }}
           />

           </Box>
          <Box p={1} m={1} style={{marginLeft:'5%',marginTop:'1%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.handleSchoolGroupInsert}
             startIcon={<AddIcon />   }
               component="label">
                  Add School Group
              </Button>
            </Box>
         </Box>
             </Paper>

             <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
     <Box p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{marginTop:'15px'}}  >
          Add Offline Responses
          </Typography>

          </Box>
          <Box p={1} m={1} style={{marginLeft:'10%',marginTop:'2.5%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.goToPortalPage}
             startIcon={<ArrowForwardIcon />   }
               component="label">
                  Proceed
              </Button>
            </Box>
            </Box>
          </Paper>

             <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
           <Box display="flex" flexDirection="row" p={1} m={1}>
     <Box p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{marginTop:'15px'}}  >
          Add New Age Group
          </Typography>

          </Box>
          <Box p={1} m={1} style={{marginLeft:'11.5%',marginTop:'2.5%'}}>
          <Button
              variant="contained"
              color="primary"
              onClick={this.handleAgeGroupInsert}
             startIcon={<ArrowForwardIcon />   }
               component="label">
                  Proceed
              </Button>
            </Box>
            </Box>
          </Paper>
            <Paper elevation={3} style={{width:'1000px',marginLeft:'100px'}}>
      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Typography variant="h6" color='textSecondary' style={{margin:'20px'}}  >
         Update Age Group
          </Typography>
          </Box>
          <Box display="flex" flexDirection="row" style={{marginTop:'-3%'}} p={1} m={1}>

          <Box p={1} m={1} style={{width:"30%",zIndex:"300"}}>
              <Select

            value={ageGroup}
            onChange={this.handleAgeGroupChange}
            options={AgeGroups}
            placeholder="Select Age Group.."
            />
          </Box>

          <Box p={1} m={1}>

          <Button
              variant="contained"
              color="primary"
               component="label"
           startIcon={<ArrowForwardIcon/>}
           onClick={this.handleAgeGroupUpdate}
              >Proceed</Button>
              </Box>

              </Box>
              </Paper>

<Backdrop className={classes.backdrop}  open={this.state.openprogress}  onClick={this.handleCloseProgress}>

       <CircularProgress color="primary" />
     </Backdrop>
      </div>
    );
  }
}


Settings.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Settings)
