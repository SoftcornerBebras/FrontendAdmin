import React, { Component } from 'react';
import Select from 'react-select';
import Box from '@material-ui/core/Box';
import MuiAlert from '@material-ui/lab/Alert';

import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import MUIDataTable from "mui-datatables";

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import PageTitle from "../../components/PageTitle/PageTitle";

import {baseURL} from '../constants'

var selectedOption=''
var selectedAge=''
var selectedOptionCountry={"value":99,"label":"INDIA"}
var selectedOptionState='Select State..'
var selectedOptionSchool=''
var selectedOptionSchoolType=''
var selectedOptionSchoolGroup=''
var selectedOptionDistrict=''
var selectedcmp=''
var obj=[],totalMarks=''
const headerList=["Student Name","Gender","Class","School","Score","Bonus","Total Score","Max. Marks","Time Taken","Rank"]
var options=[{"value":"National Toppers","label":"National Toppers"},
{"value":"State Toppers","label":"State Toppers"},
{"value":"District Toppers","label":"District Toppers"},
{"value":"School Toppers","label":"School Toppers"},
{"value":"School Group Toppers","label":"School Group Toppers"},
{"value":"School Type Toppers","label":"School Type Toppers"}
]

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class Toppers extends Component {
    state={
        rerender:false,
        selectedcmp:'',
        selectedAge:'',
        studentsList:[],
        openS1:false,
        openS2:false,
        openS3:false,
        openS4:false,
        openError:false,
        isProcessing:true,
        noStudents:false,
        competition:[],
        compAgeGrp:[],
        country:[],states:[],schools:[],groups:[],districts:[],types:[],
    }
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

  handleCloseError=()=>{
    this.setState({openError:false})
  }

calculateToppers(){
  return(obj.sort(function(a, b) {

        var d1=new Date();
        var d2=new Date()
        var h1=d1.setHours(a["time"].split(":")[0])
        var m1=d1.setMinutes(a["time"].split(":")[1])
        var s1=d1.setMilliseconds(a["time"].split(":")[2])
        var h2=d2.setHours(b["time"].split(":")[0])
        var m2=d2.setMinutes(b["time"].split(":")[1])
        var s2=d2.setMilliseconds(b["time"].split(":")[2])
        return  b["total"]- a["total"] ||  h1-h2 || m1-m2 || s1-s2

  }))

}

async fetchTotal()
{

  var total
  try{
    total= await axios.get(
      baseURL+'api/cmp/getTotalMarks/'+selectedcmp['value']+"&"+selectedAge['value']+'/',{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
   totalMarks=total.data
  }
  catch(error){
    this.setState({openError:true})
  }

}
  handleChangeCmp=(newVal)=>{
    this.setState({selectedcmp:newVal})
    selectedAge=""
    selectedOption=""
    selectedOptionState=""
    selectedOptionDistrict=""
    selectedOptionSchool=""
    selectedOptionSchoolType=""
    selectedOptionSchoolGroup=""
    this.setState({isProcessing:true})
selectedcmp=newVal
if(selectedcmp!='')
    {
      this.fetch();
    }
    selectedAge="Select Age Group.."

  }
  handleChangeAge=(newVal)=>{
    this.setState({selectedAge:newVal})
    this.setState({isProcessing:true})
    selectedOption=""
    selectedOptionState=""
    selectedOptionDistrict=""
    selectedOptionSchool=""
    selectedOptionSchoolGroup=""
    selectedOptionSchoolType=""
    selectedAge=newVal
selectedOption="Select Option.."
this.fetchTotal()
  }
  handleCountryChange=(newValue)=>{
    this.setState({selectedOptionCountry:newValue})
    selectedOptionState=""
    selectedOptionDistrict=""
    selectedOptionSchool=""
    selectedOptionSchoolGroup=""
    selectedOptionSchoolType=""
 selectedOptionCountry=newValue
 if(selectedOption==options[0]){
 this.fetchStudents('country')
 }
 else if(selectedOption==options[1]){
 this.fetchState()
 selectedOptionState='Select State..'
 }
  this.setState({rerender:!this.state.rerender})
  }


  handleStateChange=(newValue)=>
  {
    selectedOptionState=newValue
    selectedOptionDistrict=""
    selectedOptionSchool=""
    selectedOptionSchoolGroup=""
    selectedOptionSchoolType=""
    if(selectedOptionState!='Select State..' && selectedOption==options[2]){
  selectedOptionDistrict='Select District..'
  this.fetchDistrict()
    }
   else if(selectedOptionState!='Select State..' && selectedOption==options[1]){
      this.fetchStudents('state');
    }
    selectedOptionDistrict='Select District..'
    this.setState({rerender:!this.state.rerender})
  }
  handleDistrictChange=(newValue)=>
  {
    this.setState({rerender:!this.state.rerender})
    selectedOptionDistrict=newValue
    selectedOptionSchool=""
    selectedOptionSchoolGroup=""
    selectedOptionSchoolType=""
    if(selectedOptionDistrict!=''){
      this.fetchStudents('district')
    }

  }
  handleSchoolChange=(newValue)=>{
    this.setState({rerender:!this.state.rerender})
    selectedOptionSchool=newValue
    selectedOptionSchoolGroup=""
    selectedOptionSchoolType=""

    if(selectedOptionSchool!=''){
      this.fetchStudents('school')
    }
  }
  handleSchoolGroupChange=(newValue)=>{
    this.setState({rerender:!this.state.rerender})
    selectedOptionSchoolGroup=newValue
    if(selectedOptionSchoolGroup!=''){
      this.fetchStudents('schoolgroup')
    }
  }

  handleSchoolTypeChange=(newValue)=>{
    this.setState({rerender:!this.state.rerender})
    selectedOptionSchoolType=newValue
    if(selectedOptionSchoolType!=''){
      this.fetchStudents('schooltype')
    }
  }

handleChange=(newVal)=>{
  document.getElementById("table").style.display="none"
  if(selectedcmp=='' && (selectedAge==''||selectedAge=='Select Age Group..')){
this.setState({openS3:true})
  }
  else if(selectedcmp==''){
    this.setState({openS2:true})
  }
  else if(selectedAge==''){
    this.setState({openS1:true})
}
else if(selectedAge=='Select Age Group..'){
  this.setState({openS1:true})
}
else{

  this.setState({isProcessing:false,studentsList:[]})
selectedOption=newVal
 selectedOptionState='Select State..'
 selectedOptionDistrict=''
 selectedOptionSchoolGroup=''
 selectedOptionSchoolType=''
 selectedOptionSchool=''
if(selectedOption==options[0]){
    document.getElementById('Country').style.display="block"
    document.getElementById('State').style.display="none"

    document.getElementById('School').style.display="none"
    document.getElementById('Group').style.display="none"
    document.getElementById('Type').style.display="none"

    document.getElementById('District').style.display="none"
    this.fetchCountry();
    this.fetchStudents('country')
}
else if(selectedOption==options[1]){
    document.getElementById('Country').style.display="block"
    document.getElementById('State').style.display="block"

    document.getElementById('School').style.display="none"
    document.getElementById('Group').style.display="none"
    document.getElementById('Type').style.display="none"

    document.getElementById('District').style.display="none"
    this.fetchCountry()
    this.fetchState()
  }

else if(selectedOption==options[2]){
    document.getElementById('Country').style.display="block"
    document.getElementById('State').style.display="block"
    document.getElementById('School').style.display="none"
    document.getElementById('Group').style.display="none"
    document.getElementById('Type').style.display="none"
    document.getElementById('District').style.display="block"
    this.fetchCountry()
    this.fetchState()
    if(selectedOptionState!='Select State..'){
    this.fetchDistrict()
    }

}

else if(selectedOption==options[3]){
  document.getElementById('Country').style.display="none"
  document.getElementById('State').style.display="none"
  document.getElementById('School').style.display="block"
  document.getElementById('Group').style.display="none"
    document.getElementById('Type').style.display="none"
  document.getElementById('District').style.display="none"
this.fetchSchool()
}

else if(selectedOption==options[4]){
  document.getElementById('Country').style.display="none"
  document.getElementById('State').style.display="none"
  document.getElementById('School').style.display="none"
    document.getElementById('Type').style.display="none"
  document.getElementById('Group').style.display="block"
  document.getElementById('District').style.display="none"
this.fetchGroup()
}
else if(selectedOption==options[5]){
  document.getElementById('Country').style.display="none"
  document.getElementById('State').style.display="none"
  document.getElementById('School').style.display="none"
    document.getElementById('Type').style.display="block"
  document.getElementById('Group').style.display="none"
  document.getElementById('District').style.display="none"
this.fetchType()
}
}
}

async componentDidMount(){

    selectedAge="";selectedOption="";selectedOptionSchool="";selectedOptionSchoolType="";
    selectedcmp="";selectedOptionSchoolGroup="";selectedOptionDistrict="";selectedOptionState="";
    this.setState({openError:false})

  var gresultCmp
      this.state.competition.length=0;
    try{
      gresultCmp= await axios.get(
        baseURL+'api/cmp/getCompetition/',{
         headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
      );


  for(var i=0;i<gresultCmp.data.length;i++)
  {
      if(gresultCmp.data[i].competitionName.toString().includes(gresultCmp.data[i].startDate.toString().split("-")[0])){

        this.setState(prev=>({competition:[...prev.competition,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName}]}))
        }
        else
        {
          this.setState(prev=>({competition:[...prev.competition,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName +' '
          +gresultCmp.data[i].startDate.toString().split("-")[0] }]}))

        }
    }
    }
    catch(error){
        this.props.history.push('/app/dashboard')
    }
}

async fetch(){
  var getCompAge

  var cmp=selectedcmp['value'];
  this.state.compAgeGrp.length=0;
  try{
    getCompAge=await axios.get(
      baseURL+'api/cmp/getAgeGrpCmpWise/'+ cmp+"/",{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
    for(var i=0;i<getCompAge.data.AgeGrp.length;i++)
    {
    this.setState(prev=>({compAgeGrp:[...prev.compAgeGrp,{"value":getCompAge.data.AgeGrp[i].AgeGroupID,"label":getCompAge.data.AgeGrp[i].AgeGroupName}]}))
    }
  }
  catch(error){
     this.setState({openError:true})
  }
}

async fetchCountry(){
  var gresultCountry
  this.state.country.length=0;
  try{
    gresultCountry= await axios.get(
      baseURL+'api/com/getCountry/',{
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );

    for(var i=0;i<gresultCountry.data.length;i++)
    {
      this.setState(prev=>({country:[...prev.country,{"value":gresultCountry.data[i].countryID,"label":gresultCountry.data[i].nicename}]}))
    }
  }
  catch(error){
    this.setState({openError:true})
  }

}

async fetchState(){
  var getStates
  this.state.states.length=0;
  try{
    getStates= await axios.get(
      baseURL+'api/com/getStateCountryWise/'+selectedOptionCountry['value']+"/",{
      headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
    if(getStates.data.length!=0){
    for(var i=0;i<getStates.data.length;i++)
    {
      this.setState(prev=>({states:[...prev.states,{"value":getStates.data[i].stateID,"label":getStates.data[i].name}]}))
    }
    }
  }
  catch(error){
     this.setState({openError:true})
  }

}

async fetchDistrict(){
  var getDistricts
  this.state.districts.length=0;
  try{
    getDistricts= await axios.get(
      baseURL+'api/com/getDistrictStateWise/'+selectedOptionState['value']+"/",{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
    if(getDistricts.data.length!=0){
    for(var i=0;i<getDistricts.data.length;i++)
    {
      this.setState(prev=>({districts:[...prev.districts,{"value":getDistricts.data[i].districtID,"label":getDistricts.data[i].name}]}))
    }
    }
  }
  catch(error){
     this.setState({openError:true})
  }
}

async fetchSchool(){
  var getSchools
  this.state.schools.length=0;
  try{
    getSchools= await axios.get(
      baseURL+'api/com/getSchool/',{
        headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
    for(var i=0;i<getSchools.data.length;i++)
    {
      this.setState(prev=>({schools:[...prev.schools,{"value":getSchools.data[i].schoolID ,
      "label":getSchools.data[i].schoolName+','+getSchools.data[i].addressID.city+","
      +getSchools.data[i].addressID.stateID.name+","+getSchools.data[i].addressID.pincode}]}))
    }
  }
  catch(error){
     this.setState({openError:true})
  }
}

async fetchGroup(){
  var getGroups
  this.state.groups.length=0;
  try{
    getGroups= await axios.get(
      baseURL+'api/com/getSchoolGroups/',{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
    for(var i=0;i<getGroups.data.data.length;i++)
    {
      this.setState(prev=>({groups:[...prev.groups,{"value":getGroups.data.data[i].codeID,"label":getGroups.data.data[i].codeName}]}))
    }
  }
  catch(error){
    this.setState({openError:true})
  }
}
async fetchType(){
  var getTypes
  this.state.types.length=0;
  try{
    getTypes= await axios.get(
      baseURL+'api/com/getSchoolTypes/',{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
    for(var i=0;i<getTypes.data.data.length;i++)
    {
      this.setState(prev=>({types:[...prev.types,{"value":getTypes.data.data[i].codeID,"label":getTypes.data.data[i].codeName}]}))
    }
  }
  catch(error){
    this.setState({openError:true})
  }
}

async fetchStudents(val){
  var getStudents
  if(val=='country'){
  try{
    getStudents= await axios.get(
      baseURL+'api/cmp/getCountryWiseToppers/'+selectedcmp['value']+"&"+selectedAge['value']+"&"+selectedOptionCountry['value']+"/",{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
  }
  catch(error){
     this.setState({openError:true})
  }
  }
  else if(val=='state'){
    try{
      getStudents=await axios.get(
        baseURL+'api/cmp/getStateWiseStudents/'+selectedcmp['value']+"&"+selectedAge['value']+"&"+selectedOptionCountry['value']+"&"+selectedOptionState['value']+"/",{
        headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
      );
    }
    catch(error){
      this.setState({openError:true})
    }
  }
else if(val=='district'){
  try{
    getStudents=await axios.get(
      baseURL+'api/cmp/getDistrictWiseStudents/'+selectedcmp['value']+"&"+selectedAge['value']+"&"+selectedOptionCountry['value']+"&"+selectedOptionState['value']+"&"+selectedOptionDistrict['value']+"/",{
       headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    }
    );
  }
  catch(error){
     this.setState({openError:true})
  }
}
else if(val=='school'){

  try{
    getStudents=await axios.get(
      baseURL+'api/cmp/getAgeGrpWiseToppers/' +selectedcmp['value']+"&"+selectedAge['value']+"&"+selectedOptionSchool['value']+"/",{
      headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    }
    );
  }
  catch(error){
    this.setState({openError:true})
  }
}
else if(val=='schoolgroup'){
  try{
    getStudents=await axios.get(
      baseURL+'api/cmp/getSchoolGroupWiseStudents/' +selectedcmp['value']+"&"+selectedAge['value']+"&"+selectedOptionSchoolGroup['value']+"/",{
      headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    }
    );
  }
  catch(error){
     this.setState({openError:true})
  }
}
else if(val=='schooltype'){
  try{
    getStudents=await axios.get(
      baseURL+'api/cmp/getSchoolTypeWiseStudents/' +selectedcmp['value']+"&"+selectedAge['value']+"&"+selectedOptionSchoolType['value']+"/",{
      headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
    }
    );
  }
  catch(error){
     this.setState({openError:true})
  }
}

obj.length=0;
this.state.studentsList.length=0;
if(getStudents.data.length!=0){
this.setState({noStudents:false})
for(var i=0;i<getStudents.data.length;i++)
{
  obj.push({ "username":getStudents.data[i].userID.username,
    "gender":getStudents.data[i].userID.gender.codeName,
    "class":getStudents.data[i].schoolClassID.classNumber,
    "school":getStudents.data[i].schoolClassID.schoolID.schoolName+","+getStudents.data[i].schoolClassID.schoolID.addressID.city+","+getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name.charAt(0)+ getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name.substring(1).toLowerCase() +","+getStudents.data[i].schoolClassID.schoolID.addressID.pincode,
    "score":getStudents.data[i].score,
    "bonus":getStudents.data[i].bonusMarks,
    "total":getStudents.data[i].score+getStudents.data[i].bonusMarks,
    "max":totalMarks,
    "time":getStudents.data[i].timeTaken })
  }
  this.calculateToppers()
  for(var i=0;i<obj.length;i++)
  {
    if(i>=3){
      break
    }
    else{
    this.setState(prev=>({studentsList:[...prev.studentsList,{
      "username":obj[i].username,
      "gender":obj[i].gender,
      "class":obj[i].class,
    "school":obj[i].school,
    "score":obj[i].score,
    "bonus":obj[i].bonus,
    "total":obj[i].total,
    "max":obj[i].max,

    "time":obj[i].time,
    "rank":(i+1)

  }]}))
}
  }
}
  if(this.state.studentsList.length!=0){
      this.setState({isProcessing:false})
      document.getElementById("table").style.display="block"
  }
  else{
    this.setState({openS4:true,isProcessing:true,noStudents:true})
    document.getElementById("table").style.display="none"
  }
}


  render(){

    return (
        <div>
        <PageTitle title="Toppers"/>
        <Snackbar open={this.state.openError} autoHideDuration={3000} onClose={this.handleCloseError} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseError} severity="error">
          Error occured! Please try again.
        </Alert>
      </Snackbar>
        <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS1} severity="warning">
          Select Age Group!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS2} severity="warning">
          Select Competition!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS3} autoHideDuration={3000} onClose={this.handleCloseS3} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS3} severity="warning">
          Select Competition and Age Group!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS4} autoHideDuration={3000} onClose={this.handleCloseS4} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS4} severity="warning">
          No students enrolled for this criteria!
        </Alert>
      </Snackbar>
          <Box display="flex" flexDirection="row" p={1} m={1}>

          <Box  p={1} m={1} style={{width:"20%",zIndex:"200"}}>

      <Select

       value={selectedcmp}
       onChange={this.handleChangeCmp}
       options={this.state.competition}
       placeholder="Select Competition.."

     />
       </Box>

       <Box  p={1} m={1} style={{width:"20%",zIndex:"200"}}>


       <Select

        value={selectedAge}
        onChange={this.handleChangeAge}
        options={this.state.compAgeGrp}
        placeholder="Select Age Group.."
      />
        </Box>



        <Box  p={1} m={1} style={{width:"20%",zIndex:"200"}}>


       <Select

        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        placeholder="Select Option.."
      />
        </Box>




        <Box  id="Country"p={1} m={1} style={{width:"20%",display:"none",zIndex:"200"}}>

       <Select
        value={selectedOptionCountry}
        onChange={this.handleCountryChange}
        options={this.state.country}
        //styles={customStyles}
        placeholder="Select Country.."
        style={{zIndex:"200"}}
      />
        </Box>




        <Box id="State" p={1} m={1} style={{width:"20%",display:"none",zIndex:"200",marginLeft:"0.5%"}}>

       <Select
        value={selectedOptionState}
        onChange={this.handleStateChange}
        options={this.state.states}
        placeholder="Select State.."
      />

        </Box>
        <Box id="District" p={1} m={1} style={{width:"20%",display:"none",marginLeft:"0.5%",zIndex:"200"}}>

       <Select
        value={selectedOptionDistrict}
        onChange={this.handleDistrictChange}
        options={this.state.districts}
        placeholder="Select District.."
      />

        </Box>


        <Box id="School" p={1} m={1} style={{width:"20%",display:"none",zIndex:"200"}} >

       <Select
        value={selectedOptionSchool}
        onChange={this.handleSchoolChange}
        options={this.state.schools}
        placeholder="Select School.."
      />
        </Box>
        <Box id="Group"  p={1} m={1} style={{width:"20%",display:"none",zIndex:"200"}}>

       <Select
        value={selectedOptionSchoolGroup}
        onChange={this.handleSchoolGroupChange}
        options={this.state.groups}
        placeholder="Select School Group.."
      />
        </Box>

        <Box id="Type"  p={1} m={1} style={{width:"20%",display:"none",zIndex:"200"}}>

       <Select
        value={selectedOptionSchoolType}
        onChange={this.handleSchoolTypeChange}
        options={this.state.types}
        placeholder="Select School Type.."
      />
        </Box>

        </Box>

<Grid container spacing={4} id="table" style={{display:"none"}} >
      <Grid item xs={12}>

        <MUIDataTable
            title="Toppers List"

            data={this.state.studentsList.map(item => {
              return [
                  item.username,
                  item.gender,

                  item.class,

                  item.school,

                  item.score,
                  item.bonus,
                  item.total,
                  item.max,
                  item.time,
                  item.rank
              ]
          })}
           columns={headerList}
             options={{
               selectableRows:false,
               pagination:false,
               print:false,
               download:false,
               viewColumns:false,
              textLabels: {
                body: {
                    noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                },
            },


          }}

              />


        </Grid>
      </Grid>
      }

        </div>
    );
  }
}

export default Toppers;
