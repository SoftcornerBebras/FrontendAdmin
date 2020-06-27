import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from 'react-select';
import axios from 'axios';
import PageTitle from "../../components/PageTitle/PageTitle";
import Box from '@material-ui/core/Box';
import MUIDataTable from "mui-datatables";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {baseURL} from '../constants'

var schoolval = 'Select School..'
var cmpval='Select Competition..';
var agegrpval='Select Competition Age Group..';
const headerList=["Student Name","Gender","Class","School Name","UDISE Code","City","State",{
name:'ID',
options: {
    filter:false,
    viewColumns:false,
    display:false
}}];

var success=true
class RemoveParticipants extends Component {

  state={
    studentsList:[],
    openS1:false,
    openS2:false,
    countRows:0,
    pageSize:10,
    nextLink:'',
    prevLink:'',
    openS3:false,
    compAgeGrp:[],
    competitions:[],
    schools:[],
    rerender:false,
  }
  handleCompetitionChange=(newValue)=>{
    this.setState({rerender:!this.state.rerender})
      cmpval=newValue;

    if(cmpval!='Select Competition..')
    {
      this.fetch();
    }
    agegrpval="Select Competition Age Group.."
    document.getElementById('table').style.display="none"

  }

  handleSchoolChange=(newValue)=>{
     this.setState({rerender:!this.state.rerender})
     schoolval = newValue;
     if(schoolval!='Select School..')
     {
       this.fetchCmp();
     }
     cmpval=cmpval!='Select Competition..'
     agegrpval="Select Competition Age Group.."
    document.getElementById('table').style.display="none"
  }

  handleClose=(event,reason)=>{
    if (reason === 'clickaway') {
      return;
    }

    this.setState({openS1:false,openS2:false,openS3:false});
  }
    handleAgeGroupChange=(newValue)=>{
      agegrpval=newValue

     this.fetchStudents()

    }

   async RemoveStatus(studList){

     try{
   let gresult = await axios.post(
     baseURL + 'api/cmp/removeStudents/', {
         "studentList" : studList
     },{
         headers: {
             'Content-Type' : 'application/json',
             Authorization: 'Token '+localStorage.getItem('id_token')
         }
     }
     ).then(response => {
        this.setState({openS1:true})
        setTimeout(()=>{this.props.history.push('/app/dashboard')},2000)
     });
   }
    catch(error){
         this.setState({openS2:true})
         success=false
       }

    }
    async fetchStudents(){

  var cmp=cmpval['value'];
  try{
    let getStudents=await axios.get(
      baseURL + 'api/cmp/getAgeGrpWise/'+cmp+"&"+agegrpval['value']+"&"+schoolval['value']+"/",{
          headers: { Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );

  this.state.studentsList.length=0;
    for(var i=0;i<getStudents.data.length;i++){
      if(getStudents.data[i].score==999)
      {
          this.setState(prev=>({studentsList:[...prev.studentsList,{
          "username":getStudents.data[i].userID.username,
          "gender":getStudents.data[i].userID.gender.codeName,
          "class":getStudents.data[i].schoolClassID.classNumber,
          "schoolName":getStudents.data[i].schoolClassID.schoolID.schoolName,
        "udise":getStudents.data[i].schoolClassID.schoolID.UDISEcode,
          "city":getStudents.data[i].schoolClassID.schoolID.addressID.city,
          "state":getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name,
           "id":getStudents.data[i].studentEnrollmentID}]}))
    }
   } }
  catch(error){this.setState({openS2:true})}
    if(this.state.studentsList.length==0)
    {
      this.setState({openS3:true})
          success=false
    }
    else
    {
      document.getElementById('table').style.display="block"
    }
}

    async fetch(){
      var getCompAge
      var cmp=cmpval['value'];
      this.state.compAgeGrp.length=0;
      try{
        getCompAge=await axios.get(
          baseURL+'api/cmp/getAgeCmpWise/'+ cmp+"/",{
              headers: { Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

        for(var i=0;i<getCompAge.data['AgeGrp'].length;i++)
        {
          this.setState(prev=>({compAgeGrp:[...prev.compAgeGrp,{"value":getCompAge.data['AgeGrp'][i]['AgeGroupID'],
          "label":getCompAge.data['AgeGrp'][i]['AgeGroupName']}]}))
        }
      }
      catch(error){this.setState({openS2:true})}
    }

   async fetchCmp()
   {
      var gresultCmp
       try{
      gresultCmp= await axios.get(
        baseURL+'api/cmp/getNotStartedCmp/'+schoolval['value']+"/",{
          headers: { Authorization: 'Token '+localStorage.getItem('id_token')}
        }
      );

      this.state.competitions.length=0;
      for(var i=0;i<gresultCmp.data.length;i++)
      {
        this.setState(prev=>({competitions:[...prev.competitions,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName}]}))
      }
    }
    catch(error){this.setState({openS2:true})}
   }

  async componentDidMount(){

    try{
      let gSchools = await axios.get(baseURL+'api/com/getSchoolList/',{
        headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openS2:true})
    });
    this.state.schools.length=0;
    for(var i=0;i<gSchools.data.length;i++)
    {
      this.setState(prev=>({schools:[...prev.schools,{"value":gSchools.data[i].schoolID,"label":gSchools.data[i].schoolName}]}))
    }
    }catch(error){this.setState({openS2:true})}
  }


  render(){
    return (
      <div>
        <PageTitle title="Remove Participants"/>
        <Box display="flex" flexDirection="row" p={1} m={1}>
         <Box  p={1} m={1} style={{width:"25%",zIndex:'200'}}>
        <Select
        value={schoolval}
        onChange={this.handleSchoolChange}
        options={this.state.schools}

        placeholder='Select School..'
      />
      </Box>
        <Box  p={1} m={1} style={{width:"25%",zIndex:'200'}}>
<       Select
        value={cmpval}
        onChange={this.handleCompetitionChange}
        options={this.state.competitions}
        placeholder='Select Competition..'
      />
      </Box>
      <Box  p={1} m={1} style={{width:"25%",zIndex:'200'}}>
       <Select
        value={agegrpval}
        onChange={this.handleAgeGroupChange}
        options={this.state.compAgeGrp}
        placeholder='Select Competition Age Group..'
      />
</Box>
</Box>
<Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled"  onClose={this.handleClose} severity="success">
          Removed Participant(s) Successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleClose} severity="error">
          Error Occured!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS3} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert elevation={6} variant="filled" onClose={this.handleClose} severity="warning">
          No students Present!
        </Alert>
      </Snackbar>
<Grid container spacing={4} id="table" style={{display:"none"}}>

      <Grid item xs={12} style={{zIndex:"0"}}>
        <MUIDataTable
            title="Students  List"

            data={this.state.studentsList.map(item => {
              return [
                  item.username,
                  item.gender,

                  item.class,

                  item.schoolName,

                  item.udise,

                  item.city,
                  item.state,
                  item.id
              ]
          })}
           columns={headerList}
             options={{
               print:false,
               download:false,
               viewColumns:false,
              textLabels: {
                body: {
                    noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                },
            },
            onRowsDelete: (rowsDeleted) => {
              var ids=[]
              for(var i=0;i<rowsDeleted.data.length;i++){
              var index=rowsDeleted.data[i]["index"]
              ids.push(index)
              }
              var lists =[]
              for(var i=0;i<ids.length;i++)
              {
                lists.push(this.state.studentsList[ids[i]]['id'])
              }
               this.RemoveStatus(lists)

            }

          }}/>
        </Grid>
      </Grid>

      </div>
    );
  }
}

export default RemoveParticipants;
