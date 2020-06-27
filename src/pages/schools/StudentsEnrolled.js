import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography , IconButton, Button} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { arr } from './SchoolDetail';
import PageTitle from "../../components/PageTitle/PageTitle";
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Edit from "@material-ui/icons/Edit"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {Link} from 'react-router-dom';
import {baseURL} from '../constants'

var d = new Date();
var students=[]
var yearOptions=[{"value":d.getFullYear(),"label":d.getFullYear()},{"value":2019,"label":2019},{"value":2018,"label":2018}]


var cmpval='Select Competition..';
var cmpvalue='Select Competition..';
var competition=[]
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260",//warning
  declined: "#FF5C93", //secondary
};
var classes=[];
const userStatus = { active : "active", approved : "approved" , inactive : "inactive"};
const headerList=["Name","Class","Gender","Created On","Created By","Status","Approval","Edit"];
const headerList1=["Name","LoginID","Gender","Class","Age Group","Score","Total Marks"];
const status='';
const approval='';
var gresult,gresultClasses,gresultSchool;
let gresUserRoleID;
var gresult,gresultClasses,gresultSchool;
var getStudents;
class StudentsEnrolled extends React.PureComponent{
  state={
    notificationsPosition:2,
    errorToastId:null,
    getValue:[],
    getRes:[],
    countRows:0,
    countRowsC:0,
    pageSize:10,
    pageSizeC:10,
    nextLink:'',
    nextLinkC:'',
    prevLink:'',
    prevLinkC:'',
    approval:'',
    status:'',
    openS1:false,
    class:'',
    competition:null,
    comp:'',
    openError:false,
    loadingData:false
  }

  handleClose=(event,reason)=>{
    if (reason === 'clickaway') {
      return;
    }

    this.setState({openS1:false,openError:false,loadingData:false});
  }

  handleCmpChange=newValue=>{
    this.setState({comp:newValue})
    cmpvalue=newValue
    this.setState({getValue:[]})
    if(cmpvalue!='Select Competition..')
    {
      document.getElementById('Enrolled').style.display="none"
      this.fetchData();
      document.getElementById('Enrolled').style.display="block"
    }
  }

  handleCompetitionChange=(newValue)=>{
    this.setState({competition:newValue})
      cmpval=newValue;
    if(cmpval!='Select Competition..')
    {
      document.getElementById('Results').style.display="block"
      this.fetch();
    }
    }

async fetch(){
     var cmp=cmpval['value'];
    this.state.getRes.length=0;
    try{
      getStudents=await axios.get(
        baseURL+'api/cmp/viewSchoolStudentsCmpWise/'+arr[0].schoolID+"&"+cmp+"/",{
           headers: {Authorization: "Token "+localStorage.getItem('id_token')}
        }
      );
    }
    catch(error){}
    var getTotalMarks='',name=''
    var total=[]
    for(var i=0;i<getStudents.data.results.length;i++)
    {

      if(getStudents.data.results[i].score!= 999) {
       name=getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName

       if(total[name] == null) {
      try{
        getTotalMarks=await axios.get(
          baseURL+'api/cmp/getTotalMarks/'+cmp+"&"+getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupID+"/",{
            headers: {Authorization: "Token "+localStorage.getItem('id_token')}
          }
        );

      total[getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName]=getTotalMarks['data']
      }
      catch(error){this.setState({openError:true})}}

      this.setState(prev=>({getRes:[...prev.getRes,{
        username:getStudents.data.results[i].userID.username,
      score:getStudents.data.results[i].score + getStudents.data.results[i].bonusMarks,
    group:getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName,
    totalMarks:total[getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName],
    class:getStudents.data.results[i].schoolClassID.classNumber,
    loginID:getStudents.data.results[i].userID.loginID,
    gender:getStudents.data.results[i].userID.gender.codeName,
  }]}))
    }
    }
    this.setState({nextLinkC:getStudents.data.links.next,pageSizeC:getStudents.data.page_size,prevLinkC:getStudents.data.links.previous,countRowsC:getStudents.data.count})
  }

   results=()=>{
    document.getElementById('Enrolled').style.display="none"
    document.getElementById('competition').style.display="block"
    document.getElementById('cmp').style.display="none"
    document.getElementById('checkResults').style.display="none"
    document.getElementById('back').style.display="block"
    if(this.state.getRes.length!=0){
    document.getElementById('Results').style.display="block"
    }
  }
  enrolled=()=>{
     document.getElementById('Results').style.display="none"
    document.getElementById('Enrolled').style.display="block"
    document.getElementById('competition').style.display="none"
    document.getElementById('cmp').style.display="block"
    document.getElementById('back').style.display="none"
    document.getElementById('checkResults').style.display="block"
 }


async componentDidMount(){

     cmpvalue =  cmpval="Select Competition.."
    var gresultCmp
    try{
      gresultCmp= await axios.get(
        baseURL+'api/cmp/getCompetitionSchoolWise/'+arr[0].schoolID+"/",{
             headers: {Authorization: "Token "+localStorage.getItem('id_token')}
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
    }
    catch(error){this.props.history.push('/app/dashboard')}

    try{
      getStudents =await axios.get(
        baseURL+'api/cmp/getAllSchoolStudents/'+ arr[0].schoolID+"/",{
            headers: {Authorization: "Token "+localStorage.getItem('id_token')}
        }
      );
     for(var i=0;i<getStudents.data.StudData.results.length;i++)
     {
           this.setState(prev=>({getValue:[...prev.getValue,{
               userID:getStudents.data.StudData.results[i].userID.userID,
               username:getStudents.data.StudData.results[i].userID.username,
               loginID:getStudents.data.StudData.results[i].userID.loginID,
               createdBy:getStudents.data.StudData.results[i].userID.created_by,
               createdOn:getStudents.data.StudData.results[i].userID.created_on,
               classNumber:getStudents.data.StudData.results[i].schoolClassID.classNumber,
               gender:getStudents.data.StudData.results[i].userID.gender,
               birthdate:getStudents.data.StudData.results[i].userID.birthdate,
               phone:getStudents.data.StudData.results[i].userID.phone,
               email:getStudents.data.StudData.results[i].userID.email,
               userRoleID:getStudents.data.RoleData[i].userRoleID,
               role:getStudents.data.RoleData[i].RoleID.RoleName,
               is_active:getStudents.data.StudData.results[i].userID.is_active.codeName,
       }]}))
     }
         this.setState({nextLink:getStudents.data.StudData.links.next,pageSize:getStudents.data.StudData.page_size,prevLink:getStudents.data.StudData.links.previous,countRows:getStudents.data.StudData.count})

     }
     catch(error){this.props.history.push('/app/dashboard')}

     try{
       gresultClasses= await axios.get(
         baseURL+'api/com/getSchoolWiseClasses/' + arr[0].schoolID+"/",{
            headers: {Authorization: "Token "+localStorage.getItem('id_token')}
         }
       );
     for(var i=0;i<gresultClasses.data.length;i++)
     {
     classes.push(gresultClasses.data[i].classNumber);
     }
      this.setState({class:classes[0]+"-"+classes[(classes.length-1)]})
     }
     catch(error){this.props.history.push('/app/dashboard')}
    }

 async fetchData () {

var cmp=cmpvalue['value'];
      try{
        getStudents=await axios.get(
          baseURL+'api/cmp/viewSchoolStudentsDetailCmpWise/'+arr[0].schoolID+"&"+cmp+"/",{
               headers: {Authorization: "Token "+localStorage.getItem('id_token')}
          }
        );
    this.state.getValue.length=0
      for(var i=0;i<getStudents.data.StudData.results.length;i++)
      {
        this.setState(prev=>({getValue:[...prev.getValue,{
               userID:getStudents.data.StudData.results[i].userID.userID,
               username:getStudents.data.StudData.results[i].userID.username,
               loginID:getStudents.data.StudData.results[i].userID.loginID,
               createdBy:getStudents.data.StudData.results[i].userID.created_by,
               createdOn:getStudents.data.StudData.results[i].userID.created_on,
               classNumber:getStudents.data.StudData.results[i].schoolClassID.classNumber,
               gender:getStudents.data.StudData.results[i].userID.gender,
               birthdate:getStudents.data.StudData.results[i].userID.birthdate,
               phone:getStudents.data.StudData.results[i].userID.phone,
               email:getStudents.data.StudData.results[i].userID.email,
               userRoleID:getStudents.data.RoleData[i].userRoleID,
               role:getStudents.data.RoleData[i].RoleID.RoleName,
               is_active:getStudents.data.StudData.results[i].userID.is_active.codeName,
    }]}))
      }

        this.setState({countRows: getStudents.data.StudData.count});
       this.setState({pageSize : getStudents.data.StudData.page_size,nextLink:getStudents.data.StudData.links.next,prevLink:getStudents.data.StudData.links.previous});

      this.setState({loadingData:true})
       }
      catch(error){this.setState({openError:true})}
  }



finalApproval = (approval) => {
        if(approval == userStatus.approved )
        {
            return 'APPROVED';
        }
        else if(approval == userStatus.active )
        {
            return 'PENDING';
        }
        else
            return '';
   };

   finalStatus = (status) => {
        if(status == userStatus.active || status == userStatus.approved )
        {
            return 'ACTIVE';
        }
        if(status == userStatus.inactive )
        {
            return 'INACTIVE';
        }
   };
   async  handlePageChange() {

    try {
       if(this.state.nextLink!=null) {
        getStudents = await axios.get(this.state.nextLink , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        });
        if(cmpval=="Select Competition..."){
       for(var i=0;i<getStudents.data.StudData.results.length;i++)
       {

               this.setState(prev=>({getValue:[...prev.getValue,{
                   userID:getStudents.data.StudData.results[i].userID.userID,
                   username:getStudents.data.StudData.results[i].userID.username,
                   loginID:getStudents.data.StudData.results[i].userID.loginID,
                   createdBy:getStudents.data.StudData.results[i].userID.created_by,
                   createdOn:getStudents.data.StudData.results[i].userID.created_on,
                   classNumber:getStudents.data.StudData.results[i].schoolClassID.classNumber,
                   gender:getStudents.data.StudData.results[i].userID.gender,
                   birthdate:getStudents.data.StudData.results[i].userID.birthdate,
                   phone:getStudents.data.StudData.results[i].userID.phone,
                   email:getStudents.data.StudData.results[i].userID.email,
                   userRoleID:getStudents.data.RoleData[i].userRoleID,
                   role:getStudents.data.RoleData[i].RoleID.RoleName,
                   is_active:getStudents.data.StudData.results[i].userID.is_active.codeName,

           }]}))
       }
     this.setState({nextLink:getStudents.data.StudData.links.next,pageSize:getStudents.data.StudData.page_size,prevLink:getStudents.data.StudData.links.previous,countRows:getStudents.data.StudData.count})
    }
    else {

        for(var i=0;i<getStudents.data.StudData.results.length;i++)
      {

        this.setState(prev=>({getValue:[...prev.getValue,{
               userID:getStudents.data.StudData.results[i].userID.userID,
               username:getStudents.data.StudData.results[i].userID.username,
               loginID:getStudents.data.StudData.results[i].userID.loginID,
               createdBy:getStudents.data.StudData.results[i].userID.created_by,
               createdOn:getStudents.data.StudData.results[i].userID.created_on,
               classNumber:getStudents.data.StudData.results[i].schoolClassID.classNumber,
               gender:getStudents.data.StudData.results[i].userID.gender,
               birthdate:getStudents.data.StudData.results[i].userID.birthdate,
               phone:getStudents.data.StudData.results[i].userID.phone,
               email:getStudents.data.StudData.results[i].userID.email,
               userRoleID:getStudents.data.RoleData[i].userRoleID,
               role:getStudents.data.RoleData[i].RoleID.RoleName,
               is_active:getStudents.data.StudData.results[i].userID.is_active.codeName,
    }]}))
      }

        this.setState({countRows: getStudents.data.StudData.count});
       this.setState({pageSize : getStudents.data.StudData.page_size,nextLink:getStudents.data.StudData.links.next,prevLink:getStudents.data.StudData.links.previous});

    }
    }
    }catch(error){this.setState({openError:true})}

   }

 async  handlePageChange1() {

try{
  if(this.state.nextLinkC!=null) {
        getStudents = await axios.get(this.state.nextLinkC , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        });
        var cmp=cmpval['value'];
        var getTotalMarks='',name=''
        var total=[]
        for(var i=0;i<getStudents.data.results.length;i++)
        {
          if(getStudents.data.results[i].score!=999)
          {
           name=getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName

           if(total[name]==null){

            getTotalMarks=await axios.get(
              baseURL+'api/cmp/getTotalMarks/'+cmp+"&"+getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupID+"/",{
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
              }
            );

                total[getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName]=getTotalMarks['data']
            }

              this.setState(prev=>({getRes:[...prev.getRes,{
                 username:getStudents.data.results[i].userID.username,
                score:getStudents.data.results[i].score + getStudents.data.results[i].bonusMarks,
                group:getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName,
                totalMarks:total[getStudents.data.results[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName],
                class:getStudents.data.results[i].schoolClassID.classNumber,
                loginID:getStudents.data.results[i].userID.loginID,
                gender:getStudents.data.results[i].userID.gender.codeName,
             }]}))
         }
        }

         this.setState({nextLinkC:getStudents.data.links.next,pageSizeC:getStudents.data.page_size,prevLinkC:getStudents.data.links.previous,countRowsC:getStudents.data.count})

        }
        }catch(error){this.setState({openError:true})}
}
render(){

   return (
    <>
    <Snackbar open={this.state.openError} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleClose} severity="error">
         Error Occured!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleClose} severity="error">
          No matching records!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.loadingData} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleClose} severity="info">
          New Data Loaded!
        </Alert>
      </Snackbar>
    <Box display="flex" flexDirection="row" style={{marginTop:"-0.8%"}} >
    <Box p={1} m={1}  >

    <PageTitle title="Students Enrolled" />
   </Box>
   <Box p={1} m={1} id="cmp" style={{zIndex:"300",marginTop:"4%",width:"20%",marginLeft:"20%"}} >

    <Select
   value={cmpvalue}
    options={competition}
    onChange={this.handleCmpChange}
    placeholder="Select Competition..."
    />
   </Box>

   <Box p={1} m={1} id="competition" style={{zIndex:"300",marginTop:"4%",width:"20%",marginLeft:"20%",display:"none"}} >

      <Select
      value={cmpval}
      id='comp'
      options={competition}
      onChange={this.handleCompetitionChange}
      placeholder="Select Competition..."
      />
      </Box>

   <Box id='checkResults' p={1} m={1} style={{marginTop:"4%"}} >

    <Button
    variant="contained" color="primary"
    onClick={this.results}
    startIcon={<AssignmentTurnedInIcon />}
    >Check Results</Button>

   </Box>

   <Box id="back" p={1} m={1} style={{marginTop:"4%",display:"none"}} >

    <Button
    variant="contained" color="primary"
    onClick={this.enrolled}
    startIcon={<ArrowBackIcon />}
    >Back</Button>

   </Box>
   </Box>
        <ExpansionPanel

       >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4" ><b>{arr[0].schoolName}</b></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>


      <Typography variant="h6" >
                Contact: {arr[0].Phone}
                <br/>
                Classes: {this.state.class}
        </Typography>

  </ExpansionPanelDetails>
      </ExpansionPanel>



      <br></br>
      <div id="Enrolled">
      <Grid item xs={12} style={{zIndex:'0'}}>
         <MUIDataTable
            title="School Students"
            data={this.state.getValue.map(item => {
              return [
                  item.username,
                  item.classNumber,
                  item.gender.codeName,
                  item.createdOn,
                  item.createdBy,
                <h4 style = {{color:states[this.finalStatus(item.is_active).toLowerCase()]}}>{this.finalStatus(item.is_active)}</h4>,
                  <h4 style = {{color:states[this.finalApproval(item.is_active).toLowerCase()]}}>{this.finalApproval(item.is_active)}</h4>,
                   <Link to={{
                        pathname :"/app/user/update",
                        data : item
                   }}>
                  <IconButton >
                    <Edit />
                  </IconButton>
                  </Link>
            ]})}
          columns={headerList}
             options={{
               selectableRows:false,
               rowsPerPage: this.state.pageSize,
               print:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRows,
                onChangePage: () => this.handlePageChange(),
                textLabels: {
                  body: {
                    noMatch:<CircularProgress id='CircularP' variant='indeterminate' style={{color:'primary'}}/>
                  },
              },

              }}

          />
        </Grid>
        </div>
        <div id="Results" style={{display:"none"}}>
      <Grid item xs={12} style={{zIndex:'0'}}>
         <MUIDataTable
            title="School Students"

            data={this.state.getRes.map(item => {
              return [

                  item.username,
                  item.loginID,
                  item.gender,
                  item.class,
                  item.group,
                  item.score,
                  item.totalMarks,
            ]})}
          columns={headerList1}
             options={{
               selectableRows:false,
               rowsPerPage: this.state.pageSizeC,
               print:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSizeC],
                count: this.state.countRowsC,
                onChangePage: () => this.handlePageChange1(),
                textLabels: {
                  body: {
                    noMatch:<CircularProgress id='CircularP' variant='indeterminate' style={{color:'primary'}}/>
                  },
              },

              }}

          />
        </Grid>
        </div>
    </>
  );

            }
          }

//function func({rowData},{props})
//{
//
//   props.history.push('/app/school/school-detail')
//}
export default StudentsEnrolled;
