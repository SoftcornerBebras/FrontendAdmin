import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import PageTitle from "../../components/PageTitle/PageTitle";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import ReactExport from "react-data-export";
import axios from 'axios';
import {baseURL} from '../constants'
import Select from 'react-select';
import Snackbar from '@material-ui/core/Snackbar';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const styles = theme => ({
    root: {
      width: '80%',
      marginLeft:'10%',

      marginTop:'5%'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',

    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },

  });
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

var value='',valueTopperCategory=''
var filename='',sheetname='',panelval=''
var total={}

var dataSet1 = [],obj=[],isopen=''
var school=[],competition=[],agegroup=[],country=[],states=[],groups=[],districts=[]
var selectedOptionSchool='',getSchools='',selectedAgeGroup='',selectedCmpVal=''
var selectedOptionSchoolRes='',selectedAgeGroupRes='',selectedCmpValRes='',resvalue='',listvalue=''
var selectedOptionSchoolList='',selectedCmpValList='',selectedAgeGroupList='',selectedOptionSchoolListAll=''

var selectedOptionCountry={"value":99,"label":"India"}
var selectedOptionState='Select State..'
var selectedOptionSchoolToppers=''
var selectedOptionSchoolGroup=''
var selectedOptionDistrict=''
var getStudents='',a='',totalMarks='',marksTot=[]

class ExportDocs extends Component {

    state={
        expanded:false,
        value:'',
        openS1:false,
        school:[],
        competition:[],
        country:[],
        states:[],
        groups:[],
        districts:[],
        agegroup:[],
        openS2:false,
        openS3:false,
        openS4:false,
        openS5:false,
        openS6:false,
        rerender:false,
        labels: [],
        valueTopperCategory:'',
        openError:false,

    }
    handleCloseError=() => {
        this.setState({openError:false})
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
    return  b["score"]- a["score"] ||  h1-h2 || m1-m2 || s1-s2

      }))

    }
    async fetchTotalMarks(comp,userID){
      var cmp=comp['value'];
     var total,agegrp

      try{
       total= await axios.get(
         baseURL+'api/cmp/getTotalMarks/'+cmp +"&"+a+'/',{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
         }
       );

  marksTot[userID]=total.data
     }
     catch(error) {
        this.setState({openError:true})
     }

    }

    async fetchTotal(comp)
{

     var cmp=comp['value'];
     var total,agegrp

      try{
       total= await axios.get(
         baseURL+'api/cmp/getTotalMarks/'+cmp +"&"+a+'/',{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
         }
       );
      totalMarks=total.data
     }
     catch(error) {
        this.setState({openError:true})
     }
  }

    handleSchoolChange=(newValue)=>{
      selectedOptionSchool=newValue
      document.getElementById('SchoolC').style.display="none"
      this.setState({rerender:!this.state.rerender})
      this.fetch('panel2')
    }
    handleAllSchoolStudentsList=(newValue)=>{
      selectedOptionSchoolListAll=newValue
      document.getElementById('List').style.display="none"
      this.setState({rerender:!this.state.rerender})
      this.fetchAllStudentsSchoolWise(selectedOptionSchoolListAll)
      sheetname="Students-"+selectedOptionSchoolListAll['label']
      filename="Students-"+selectedOptionSchoolListAll['label']
    }
    handleCompetitionChange=(newValue)=>{
      selectedCmpVal=newValue
      document.getElementById('Toppers').style.display="none"
      selectedAgeGroup=''
      this.setState({rerender:!this.state.rerender})
      this.fetch('panel6')
    }

    handleAgeGroupChange=(newValue)=>{
      if(selectedCmpVal!=''){
      selectedAgeGroup=newValue
      selectedOptionCountry={"value":99,"label":"India"}
      selectedOptionState='Select State..'
      selectedOptionDistrict=''
      selectedOptionSchoolGroup=''
      selectedOptionSchoolToppers=''
      this.setState({rerender:!this.state.rerender})
      a=selectedAgeGroup['value']
      this.fetchTotal(selectedCmpVal)

      if(valueTopperCategory=='National Toppers'){
      this.handleToggle()
      this.sleep(5000).then(()=>{
        this.fetchStudents('National')})
        this.handleCloseProgress()
        sheetname='National Toppers-'+selectedOptionCountry['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
        filename='National Toppers-'+selectedOptionCountry['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
      }
      }
      else{
        this.setState({openS2:true})
      }
    }

    handleSchoolChangeList=(newValue)=>{
      if(selectedCmpValList!=''){
      selectedOptionSchoolList=newValue
      this.setState({rerender:!this.state.rerender})
      }
      else
      {
        this.setState({openS2:true})
      }

      document.getElementById('List').style.display="none"
      if(selectedCmpValList!=''){
        this.fetchStudentsSchoolCmpWise(selectedOptionSchoolList,selectedCmpValList)
      }



    sheetname="Students-"+selectedOptionSchoolList['label']+'-'+selectedCmpValList['label']
        filename="Students-"+selectedOptionSchoolList['label']+'-'+selectedCmpValList['label']

  }
    handleCmpChangeList=(newValue)=>{
      selectedCmpValList=newValue
     selectedAgeGroupList='Select Age Group..'
     selectedOptionSchoolList='Select School..'
      this.setState({rerender:!this.state.rerender})
    this.fetch('panel4')

    }

    handleAgeGroupChangeList=(newValue)=>{
      if(selectedCmpValList!=''){
        this.setState({selectedAgeGroupList:newValue})
        selectedAgeGroupList=newValue
      }
      else{
        this.setState({openS2:true})
      }
      document.getElementById('List').style.display="none"

      if(selectedAgeGroupList!=''){
      this.fetchStudentsCmpAgeWise(selectedCmpValList,selectedAgeGroupList)
      }

      sheetname="Students-"+selectedCmpValList['label']+'-'+selectedAgeGroupList['label']
        filename="Students-"+selectedCmpValList['label']+'-'+selectedAgeGroupList['label']

  }

    handleSchoolChangeRes=(newValue)=>{
        if(selectedCmpValRes==''){
          this.setState({openS2:true})
        }
      else if(selectedOptionSchoolRes!=''){
        selectedOptionSchoolRes=newValue
        document.getElementById('Res').style.display="none"
      this.setState({rerender:!this.state.rerender})
        if(selectedOptionSchoolRes!=''){
          this.fetchStudentsSchoolCmpWise(selectedOptionSchoolRes,selectedCmpValRes)
          sheetname="Results-"+selectedOptionSchoolRes['label']+'-'+selectedCmpValRes['label']
          filename="Results-"+selectedOptionSchoolRes['label']+'-'+selectedCmpValRes['label']
        }
      }
    }

    handleCmpChangeRes=(newValue)=>{
      selectedCmpValRes=newValue
      selectedAgeGroupRes='Select Age Group..'
      selectedOptionSchoolRes='Select School..'
      this.setState({rerender:!this.state.rerender})
      this.fetch('panel5')

    }
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleAgeGroupChangeRes=(newValue)=>{
     if(selectedCmpValRes==''){
      this.setState({openS2:true})
     }
     else{
      this.setState({selectedAgeGroupRes:newValue})
      selectedAgeGroupRes=newValue
      document.getElementById('Res').style.display="none"
      if(selectedAgeGroupRes!=''){
      this.handleToggle()
      a=selectedAgeGroupRes['value']
      this.fetchTotal(selectedCmpValRes)
      this.sleep(5000).then(()=>{
      this.fetchStudentsCmpAgeWise(selectedCmpValRes,selectedAgeGroupRes)
      this.handleCloseProgress()

      })

    sheetname="Results-"+selectedCmpValRes['label']+'-'+selectedAgeGroupRes['label']
    filename="Results-"+selectedCmpValRes['label']+'-'+selectedAgeGroupRes['label']
   }
  }
}

    handleCountryChange=(newValue)=>{
      selectedOptionCountry=newValue
      if(valueTopperCategory=='National Toppers'){
        this.fetch('panel6')
      }
      else if(valueTopperCategory=='State Toppers'){
      this.handleToggle()
       this.fetchState()
       this.handleCloseProgress()
       selectedOptionState='Select State..'
      }
      else if(valueTopperCategory=='District Toppers'){
        this.handleToggle()
        this.fetchState()
        this.handleCloseProgress()
        selectedOptionState='Select State..'
       }

       this.setState({rerender:!this.state.rerender})
    }


    handleStateChange=(newValue)=>
    {
      selectedOptionState=newValue
      this.setState({rerender:!this.state.rerender})
      if(selectedOptionState!='Select State..' && valueTopperCategory=='District Toppers'){
        selectedOptionDistrict='Select District..'
        this.handleToggle()
        this.fetchDistrict()
        this.handleCloseProgress()
      }
     else if(selectedOptionState!='Select State..' && valueTopperCategory=='State Toppers'){
        this.handleToggle()
      this.sleep(5000).then(()=>{
      this.fetchStudents('State');
      this.handleCloseProgress()
      })

        sheetname='State Toppers-'+selectedOptionCountry['label']+'-'+selectedOptionState['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
        filename='State Toppers-'+selectedOptionCountry['label']+'-'+selectedOptionState['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']

     }

   this.setState({rerender:!this.state.rerender})
    }
    handleDistrictChange=(newValue)=>
    {
      selectedOptionDistrict=newValue
      this.setState({rerender:!this.state.rerender})
      if(selectedOptionDistrict!='' ){
      this.handleToggle()
      this.sleep(5000).then(()=>{
       this.fetchStudents('District')
       this.handleCloseProgress()
       })

        sheetname='District Toppers-'+selectedOptionCountry['label']+'-'+selectedOptionState['label']+'-'+selectedOptionDistrict['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
        filename='District Toppers-'+selectedOptionCountry['label']+'-'+selectedOptionState['label']+'-'+selectedOptionDistrict['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']

      }

    }
    handleSchoolChangeToppers=(newValue)=>{
      selectedOptionSchoolToppers=newValue
      this.setState({rerender:!this.state.rerender})

      if(selectedOptionSchoolToppers!=''){
      this.handleToggle()
      this.sleep(5000).then(()=>{
       this.fetchStudents('School')
       this.handleCloseProgress()
       })

       if(selectedOptionSchoolToppers['value']!=null){
          sheetname='School Toppers-'+selectedOptionSchoolToppers['value'].split(',')[1]+','+selectedOptionSchoolToppers['value'].split(',')[3]+','+selectedOptionSchoolToppers['value'].split(',')[4]+','+selectedOptionSchoolToppers['value'].split(',')[5]+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
          filename='School Toppers-'+ selectedOptionSchoolToppers['value'].split(',')[1]+','+selectedOptionSchoolToppers['value'].split(',')[3]+','+selectedOptionSchoolToppers['value'].split(',')[4]+','+selectedOptionSchoolToppers['value'].split(',')[5]+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
       }
      }
    }
    handleSchoolGroupChange=(newValue)=>{
      selectedOptionSchoolGroup=newValue
      this.setState({rerender:!this.state.rerender})
      if(selectedOptionSchoolGroup!=''){
      this.handleToggle()
      this.sleep(5000).then(()=>{
        this.fetchStudents('School Group')
          this.handleCloseProgress()
        })
        sheetname='School Group Toppers-'+selectedOptionSchoolGroup['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
        filename='School Group Toppers-'+selectedOptionSchoolGroup['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']

      }
    }
   handleRadioChangeToppers = (event) => {
     if(selectedCmpVal!='' && selectedAgeGroup!=''){
      this.setState({valueTopperCategory:event.target.value});
      valueTopperCategory=event.target.value
      document.getElementById('Toppers').style.display="none"
      selectedOptionCountry={"value":99,"label":"India"}
      selectedOptionState='Select State..'
      selectedOptionDistrict=''
      selectedOptionSchoolGroup=''
      selectedOptionSchoolToppers=''
      this.fetch('panel6')
     }
      else if(selectedCmpVal=='' && selectedAgeGroup==''){
        this.setState({openS4:true})
      }
      else if(selectedCmpVal==''){
        this.setState({openS2:true})
      }
      else if(selectedAgeGroup==''){
        this.setState({openS3:true})
      }
   };
    handleRadioChangeRes=(event)=>{
      resvalue=event.target.value
      selectedOptionSchoolRes=''
      selectedCmpValRes=''
      selectedAgeGroupRes=''
      document.getElementById('Res').style.display="none"
      this.setState({rerender:!this.state.rerender})
      this.fetch('panel5')
    }

    handleRadioChangeList = (event) => {
      listvalue=event.target.value
      selectedOptionSchoolList=''
      selectedOptionSchoolListAll=''
      selectedCmpValList=''
      selectedAgeGroupList=''
      this.setState({rerender:!this.state.rerender})
      this.fetch('panel4')

    };

  handleRadioChange = (event) => {
    this.setState({value:event.target.value});
    value=event.target.value
  };

    handleChange = (panel) => (event, isExpanded) => {
    this.setState({expanded:(isExpanded ? panel : false)});
    panelval=panel
    isopen=isExpanded
    if(isExpanded){

      selectedOptionSchool=selectedCmpValList=selectedAgeGroupList=selectedOptionSchoolList=selectedOptionSchoolListAll=selectedCmpValRes=selectedAgeGroupRes=selectedOptionSchoolRes=resvalue=listvalue=value=''
     selectedCmpVal=selectedAgeGroup=valueTopperCategory=''
      document.getElementById('schRes').style.display="none"
      document.getElementById('ageGrpRes').style.display="none"
      document.getElementById('cmpRes').style.display="none"
      document.getElementById('schList').style.display="none"
      document.getElementById('allSchList').style.display="none"
      document.getElementById('ageGrpList').style.display="none"
      document.getElementById('cmpList').style.display="none"
      document.getElementById('List').style.display="none"
      document.getElementById('Res').style.display="none"
      document.getElementById('SchoolC').style.display="none"
      document.getElementById('Country').style.display="none"
      document.getElementById('State').style.display="none"
      document.getElementById('District').style.display="none"
      document.getElementById('School').style.display="none"
      document.getElementById('Group').style.display="none"
      document.getElementById('Toppers').style.display="none"
      this.fetch(panel)
    }
  };

  async fetch(panel){
    var getData
    this.state.labels.length=0
    dataSet1.length=0
    if(panel=='panel3')
    {
      sheetname='Administrators'
      filename='Administrators'

      this.setState({labels:[
        {label:'Username',value:'username'},
        {label:'LoginID',value:'loginID'},
        {label:'Email',value:'email'},
        {label:'Gender',value:'gender'},
        {label:'Birth Date',value:'birthdate'},
        {label:'Created On',value:'created_On'},
        {label:'Created By',value:'created_By'},
        {label:'Modified On',value:'modified_On'},
        {label:'Modified By',value:'modified_By'},
        {label:'Phone',value:'phone'},
        {label:'Role',value:'role'},
        {label:'Status',value:'is_active'},

      ]})
    try{
      getData=await axios.get(
        baseURL+'api/usr/getAdmins/',{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
      );

    for(var i=0;i<getData.data.length;i++){
      if(getData.data[i].RoleID.RoleName=='Admin'){
      dataSet1.push(
        {
        username:getData.data[i].userID.username,
        loginID:getData.data[i].userID.loginID,
        email:getData.data[i].userID.email,
        gender:getData.data[i].userID.gender.codeName,
        birthdate:getData.data[i].userID.birthdate,
        created_On:getData.data[i].userID.created_on,
        created_By:getData.data[i].userID.created_by,
        modified_On:getData.data[i].userID.modified_on,
        modified_By:getData.data[i].userID.modified_by,
        phone:getData.data[i].userID.phone,
        role:getData.data[i].RoleID.RoleName,
        is_active:getData.data[i].userID.is_active.codeName,
      }
      )
      }
    }
    document.getElementById('admintext').innerHTML='Total number of administrators : '+dataSet1.length
    }
    catch(error){this.setState({openError:true})}
    }
    else if(panel=='panel2'){
      dataSet1.length=0
      if(school.length==0){
      this.fetchSchools()
      }
      if(selectedOptionSchool['value']!=null){
        sheetname='School Coordinators-'+selectedOptionSchool['label']
        filename='School Coordinators-'+selectedOptionSchool['label']
        this.setState({labels:[
          {label:'Username',value:'username'},
          {label:'LoginID',value:'loginID'},
          {label:'Email',value:'email'},
          {label:'Gender',value:'gender'},
          {label:'Birth Date',value:'birthdate'},
          {label:'Created On',value:'created_On'},
          {label:'Created By',value:'created_By'},
          {label:'Modified On',value:'modified_On'},
          {label:'Modified By',value:'modified_By'},
          {label:'Phone',value:'phone'},
          {label:'Role',value:'role'},
          {label:'Status',value:'is_active'},
          {label:'School Name',value:'school'},
          {label:'UDISE Code',value:'udise'},
          {label:'Country',value:'country'},
          {label:'State',value:'state'},
          {label:'District',value:'district'},
          {label:'City',value:'city'},
          {label:'Pincode',value:'pincode'},

        ]})
      try{
        getData=await axios.get(
          baseURL+'api/usr/getUserRoleLocation/'+selectedOptionSchool['value'].split(',')[0]+'&school/',{
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      for(var i=0;i<getData.data.length;i++){

        dataSet1.push(
          {
          username:getData.data[i].userRoleID.userID.username,
          loginID:getData.data[i].userRoleID.userID.loginID,
          email:getData.data[i].userRoleID.userID.email,
          gender:getData.data[i].userRoleID.userID.gender.codeName,
          birthdate:getData.data[i].userRoleID.userID.birthdate,
          created_On:getData.data[i].userRoleID.userID.created_on,
          created_By:getData.data[i].userRoleID.userID.created_by,
          modified_On:getData.data[i].userRoleID.userID.modified_on,
          modified_By:getData.data[i].userRoleID.userID.modified_by,
          phone:getData.data[i].userRoleID.userID.phone,
          role:getData.data[i].userRoleID.RoleID.RoleName,
          is_active:getData.data[i].userRoleID.userID.is_active.codeName,
          school:selectedOptionSchool['value'].split(',')[1],
          udise:selectedOptionSchool['value'].split(',')[2],
          city:selectedOptionSchool['value'].split(',')[3],
          state:selectedOptionSchool['value'].split(',')[4],
          country:selectedOptionSchool['value'].split(',')[5],
          pincode:selectedOptionSchool['value'].split(',')[6],
          district:selectedOptionSchool['value'].split(',')[7]
        }
        )

      }
      document.getElementById('SchoolC').style.display="block"
        }
      catch(error){this.setState({openError:true})}
    }
    }
    else if(panel=='panel7'){

      sheetname='Schools'
      filename='Schools'
      try{
        getSchools= await axios.get(
          baseURL+'api/com/getSchool/',{
              headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      }
      catch(error){this.setState({openError:true})}
      this.setState({labels:[
        {label:'School Name',value:'school'},
        {label:'School Type',value:'schooltype'},
        {label:'School Group',value:'schoolgroup'},
        {label:'UDISE Code',value:'udise'},
        {label:'Phone',value:'phone'},
        {label:'Address Line 1',value:'line1'},
        {label:'Address Line 2',value:'line2'},
        {label:'Country',value:'country'},
        {label:'State',value:'state'},
        {label:'District',value:'district'},
        {label:'City',value:'city'},
        {label:'Pincode',value:'pincode'},
        {label:'Registered By',value:'registered_by'},
        {label:'Registered On',value:'registered_on'},
        {label:'Modified By',value:'modified_by'},
        {label:'Modified On',value:'modified_on'},

      ]})

      for(var i=0;i<getSchools.data.length;i++)
      {
        dataSet1.push(
          {
          school:getSchools.data[i].schoolName,
          country:getSchools.data[i].addressID.countryID.nicename,
          state:getSchools.data[i].addressID.stateID.name,
          district:getSchools.data[i].addressID.districtID.name,
          line1:getSchools.data[i].addressID.line1,
          line2:getSchools.data[i].addressID.line2,
          phone:getSchools.data[i].phone,
          registered_by:getSchools.data[i].registered_By,
          registered_on:getSchools.data[i].registered_On,
          modified_by:getSchools.data[i].modified_by,
          modified_on:getSchools.data[i].modified_on,
          schoolgroup:getSchools.data[i].schoolGroupID.codeName,
          schooltype:getSchools.data[i].schoolTypeCodeID.codeName,
          city:getSchools.data[i].addressID.city,
          udise:getSchools.data[i].UDISEcode,
          pincode:getSchools.data[i].addressID.pincode,
        })
       }
      document.getElementById('schooltext').innerHTML='Total number of schools : '+getSchools.data.length

    }
    else if(panel=='panel6'){

      this.fetchCompetition()
      if(selectedCmpVal['value']!=null){

      var cmp=selectedCmpVal['value'];
      this.fetchAgeGroup(cmp)
      }
      this.setState({labels:[
        {label:'Username',value:'username'},
        {label:'Gender',value:'gender'},
        {label:'Class',value:'class'},
        {label:'Competition',value:'competition'},
        {label:'Age Group',value:'group'},
        {label:'School Name',value:'schoolname'},
        {label:'School City',value:'schoolcity'},
        {label:'School District',value:'schooldistrict'},
        {label:'School State',value:'schoolstate'},
        {label:'School Country',value:'schoolcountry'},
        {label:'School Pincode',value:'schoolpincode'},
        {label:'Score',value:'score'},
        {label:'Bonus',value:'bonus'},
        {label:'Total Score',value:'total'},
        {label:'Max. Marks',value:'max'},
        {label:'Time Taken',value:'time'},
        {label:'Rank',value:'rank'},
      ]
      })
      if(valueTopperCategory=='National Toppers'){
        document.getElementById('Country').style.display="block"
        document.getElementById('State').style.display="none"
        document.getElementById('School').style.display="none"
        document.getElementById('Group').style.display="none"
        document.getElementById('District').style.display="none"
        if(this.state.country.length==0){
        this.fetchCountry()}
        if(isopen==true){
        this.handleToggle()
        this.sleep(5000).then(()=>{
        this.fetchStudents('National')
        this.handleCloseProgress()
        })

        }
       sheetname='National Toppers-'+selectedOptionCountry['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']
       filename='National Toppers-'+selectedOptionCountry['label']+'-'+selectedCmpVal['label']+'-'+selectedAgeGroup['label']

      }
      if(valueTopperCategory=='State Toppers'){
        document.getElementById('Country').style.display="block"
        document.getElementById('State').style.display="block"
        document.getElementById('School').style.display="none"
        document.getElementById('Group').style.display="none"
        document.getElementById('District').style.display="none"
        if(this.state.country.length==0){
        this.fetchCountry()}
        if(this.state.states.length==0){
            this.handleToggle()
            this.fetchState()
            this.handleCloseProgress()
        }
        }

      if(valueTopperCategory=='District Toppers'){
        document.getElementById('Country').style.display="block"
        document.getElementById('State').style.display="block"
        document.getElementById('School').style.display="none"
        document.getElementById('Group').style.display="none"
        document.getElementById('District').style.display="block"
        if(this.state.country.length==0){
        this.fetchCountry()}
        if(this.state.states.length==0){
            this.handleToggle()
            this.fetchState()
            this.handleCloseProgress()
        }
        if(selectedOptionState!='Select State..' && this.state.districts.length==0){
           this.handleToggle()
           this.fetchDistrict()
           this.handleCloseProgress()
        }
        }
      if(valueTopperCategory=='School Toppers'){
        document.getElementById('Country').style.display="none"
        document.getElementById('State').style.display="none"
        document.getElementById('School').style.display="block"
        document.getElementById('Group').style.display="none"
        document.getElementById('District').style.display="none"
        this.fetchSchools()

      }
      if(valueTopperCategory=='School Group Toppers'){
        document.getElementById('Country').style.display="none"
        document.getElementById('State').style.display="none"
        document.getElementById('School').style.display="none"
        document.getElementById('Group').style.display="block"
        document.getElementById('District').style.display="none"
        this.fetchGroup()
      }
    }
    else if(panel=='panel4'){

      this.fetchCompetition()
      if(selectedCmpValList['value']!=null){
          var cmp=selectedCmpValList['value'];
          this.fetchAgeGroup(cmp)
      }
      this.setState({labels:[
        {label:"Username",value:'username'},
        {label:"Gender",value:"gender"},
        {label:"Class",value:"class"},
        {label:"Competition",value:"competition"},
        {label:"Age Group",value:"group"},
        {label:"School Name",value:"schoolname"},
        {label:"School City",value:"schoolcity"},
        {label:"School District",value:"schooldistrict"},
        {label:"School State",value:"schoolstate"},
        {label:"School Country",value:"schoolcountry"},
        {label:"School Pincode",value:"schoolpincode"},
      ]})
       if(listvalue=='All'){
        document.getElementById('allSchList').style.display="block"
        document.getElementById('schList').style.display="none"
        document.getElementById('List').style.display="none"
        document.getElementById('cmpList').style.display="none"
        document.getElementById('ageGrpList').style.display="none"
         this.fetchSchools()
      }
      if(listvalue=='School Wise'){
        document.getElementById('schList').style.display="block"
        document.getElementById('cmpList').style.display="block"
        document.getElementById('ageGrpList').style.display="none"
        document.getElementById('List').style.display="none"
        document.getElementById('allSchList').style.display="none"
        this.fetchSchools()
      }

      else if(listvalue=='Competition Wise'){
        document.getElementById('schList').style.display="none"
        document.getElementById('cmpList').style.display="block"
        document.getElementById('ageGrpList').style.display="block"
        document.getElementById('List').style.display="none"
        document.getElementById('allSchList').style.display="none"
      }

    }
    else if(panel=='panel5'){
      this.fetchCompetition()
      if(selectedCmpValRes['value']!=null){
          var cmp=selectedCmpValRes['value'];
          this.fetchAgeGroup(cmp)
      }
      this.setState({labels:[
        {label:"Username",value:'username'},
        {label:"Gender",value:"gender"},
        {label:"Class",value:"class"},
        {label:"Competition",value:"competition"},
        {label:"Age Group",value:"group"},
        {label:"School Name",value:"schoolname"},
        {label:"School City",value:"schoolcity"},
        {label:"School District",value:"schooldistrict"},
        {label:"School State",value:"schoolstate"},
        {label:"School Country",value:"schoolcountry"},
        {label:"School Pincode",value:"schoolpincode"},
        {label:"Score",value:"score"},
        {label:"Bonus",value:"bonus"},
        {label:"Total Score",value:"total"},
        {label:"Max. Marks",value:"max"},
        {label:"Time Taken",value:"time"},
        {label:"Achievement",value:"achievement"},
      ]})

      if(resvalue=='School Wise'){
        document.getElementById('schRes').style.display="block"
        document.getElementById('cmpRes').style.display="block"
        document.getElementById('ageGrpRes').style.display="none"
        document.getElementById('Res').style.display="none"
        this.fetchSchools()
      }

      else if(resvalue=='Competition Wise'){
        document.getElementById('schRes').style.display="none"
        document.getElementById('cmpRes').style.display="block"
        document.getElementById('ageGrpRes').style.display="block"
        document.getElementById('Res').style.display="none"

      }
    }
    }
    async fetchStudentsSchoolCmpWise(school,cmp){
      var gresult
    if(panelval=='panel5' && resvalue=='School Wise'){
      this.handleToggle()
    }
      try{
        gresult= await axios.get(
          baseURL+'api/cmp/getSchoolStudentsCmpWise/'+school['value'].split(',')[0]+'&'+cmp['value']+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          });
        }
      catch(error){this.setState({openError:true})}
  if(gresult!=null){
    if(gresult.data.length==0)
    {
      this.setState({openS5:true})
      this.handleCloseProgress()
      document.getElementById('List').style.display="none"

    }
    else{
    var counts={}
    for (var i = 0; i < gresult.data.length; i++)
     {
        counts[gresult.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName] = 1 + (counts[gresult.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName] || 0);
    }
    obj.length=0
    if(panelval=='panel5'){
      for(var i=0;i<gresult.data.length;i++)
      {
          a=gresult.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupID
          this.fetchTotalMarks(selectedCmpValRes,gresult.data[i].userID.userID)
      }
       this.sleep(5000).then(()=>{
        for(var key in counts){
          obj.length=0
          this.studentData(gresult,key)
          this.fillDataSet()
        }
        this.handleCloseProgress()
      })
  }
    if(panelval=='panel4'){
      this.fillDataSetList(gresult)
    }
    document.getElementById('List').style.display="block"
  }
  }
    }
    async fetchStudentsCmpAgeWise(cmp,agegrp){
      var gresult
       try{

         gresult=await axios.get(
           baseURL+'api/cmp/getStudentsAgeGrpWise/' +agegrp['value']+"&"+cmp['value']+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
         }
         );
       }
       catch(error){this.setState({openError:true})}
      obj.length=0
      if(gresult!=null){
        if(gresult.data.length==0){
          this.setState({openS5:true})
          document.getElementById('List').style.display="none"
        }
        else{
        this.studentData(gresult,agegrp['label'])
      if(panelval=='panel5'){
        this.fillDataSet()
        }
        else{
          this.fillDataSetList(gresult)
        }
        document.getElementById('List').style.display="block"
      }
    }
     }
     fillDataSetList(gresult){
      dataSet1.length=0
      for(var i=0;i<gresult.data.length;i++){

        dataSet1.push({
          "username":gresult.data[i].userID.username,
          "gender":gresult.data[i].userID.gender.codeName,
          "class":gresult.data[i].schoolClassID.classNumber,
          "competition":gresult.data[i].competitionAgeID.competitionID.competitionName,
          "group":gresult.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName,
          "schoolname":gresult.data[i].schoolClassID.schoolID.schoolName,
          "schoolcity":gresult.data[i].schoolClassID.schoolID.addressID.city,
          "schooldistrict":gresult.data[i].schoolClassID.schoolID.addressID.districtID.name,
          "schoolstate":gresult.data[i].schoolClassID.schoolID.addressID.stateID.name,
          "schoolcountry":gresult.data[i].schoolClassID.schoolID.addressID.countryID.nicename,
          "schoolpincode":gresult.data[i].schoolClassID.schoolID.addressID.pincode,
        })
      }
     }
    fillDataSet(){
       if(resvalue!='School Wise'){
      dataSet1.length=0
      }
      var a
      for(var i=0;i<obj.length;i++){
        if (i==0){
         a= (resvalue=='School Wise'?'School':obj[i].agegrp)+' Topper'
        }
        else if(i==1){
          a=(resvalue=='School Wise'?'School':obj[i].agegrp)+' First Runner Up'
        }
        else if(i==2){
          a=(resvalue=='School Wise'?'School':obj[i].agegrp)+' Second Runner Up'
        }
        else if(i>2){
          a="Participant"
        }
        dataSet1.push({
          "username":obj[i].username,
          "gender":obj[i].gender,
          "class":obj[i].class,
          "competition":obj[i].competition,
          "group":obj[i].agegrp,
          "schoolname":obj[i].school.split(',')[0],
          "schoolcity":obj[i].school.split(',')[1],
          "schooldistrict":obj[i].school.split(',')[2],
          "schoolstate":obj[i].school.split(',')[3],
          "schoolcountry":obj[i].school.split(',')[4],
          "schoolpincode":obj[i].school.split(',')[5],
          "score":obj[i].score,
          "bonus":obj[i].bonus,
          "total":obj[i].total,
          "max":obj[i].max,
          "time":obj[i].time,
          "achievement":a
        })
      }
       if(dataSet1.length!=0){
         document.getElementById('Res').style.display="block"
       }
    }

async fetchAllStudentsSchoolWise(){
  var gresultStudents
  try{
    gresultStudents= await axios.get(
      baseURL+'api/cmp/getAllStudentsSchoolWise/'+selectedOptionSchoolListAll['value'].split(',')[0]+'/',{
        headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
    );
  }
  catch(error){this.setState({openError:true})}
  if(gresultStudents!=null){
    if(gresultStudents.data.length==0){
      this.setState({openS5:true})
    }
  }
  this.fillDataSetList(gresultStudents)
   document.getElementById('List').style.display="block"
}


    async fetchCompetition(){
      var gresultCmp
      try{
        gresultCmp= await axios.get(
          baseURL+'api/cmp/getCompetition/',{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      this.state.competition.length=0;
      for(var i=0;i<gresultCmp.data.length;i++)
      {
        if(gresultCmp.data[i].competitionName.toString().includes(gresultCmp.data[i].startDate.toString().split("-")[0])){
            this.setState(prev=>({competition:[...prev.competition,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName}]}))
//          competition.push({"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName})
          }
          else
          {
            this.setState(prev=>({competition:[...prev.competition,{"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName
            +' '+gresultCmp.data[i].startDate.toString().split("-")[0] }]}))
//            competition.push({"value":gresultCmp.data[i].competitionID,"label":gresultCmp.data[i].competitionName
//            +' '+gresultCmp.data[i].startDate.toString().split("-")[0] })

          }
      }
      }
      catch(error){this.setState({openError:true})}
    }
   async fetchAgeGroup(cmp){
      var getCompAge
    this.state.agegroup.length=0;
      try{
        getCompAge=await axios.get(
          baseURL+'api/cmp/getAgeGrpCmpWise/'+ cmp+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      for(var i=0;i<getCompAge.data.AgeGrp.length;i++)
      {
        this.setState(prev=>({agegroup:[...prev.agegroup,{"value":getCompAge.data.AgeGrp[i].AgeGroupID,"label":getCompAge.data.AgeGrp[i].AgeGroupName}]}))
//        agegroup.push({"value":getCompAge.data.AgeGrp[i].AgeGroupID,"label":getCompAge.data.AgeGrp[i].AgeGroupName})
      }
      }
      catch(error){this.setState({openError:true})}
    }
    async fetchCountry(){
      var gresultCountry
      try{
        gresultCountry= await axios.get(
          baseURL+'api/com/getCountry/',{
               headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      this.state.country.length=0;
    for(var i=0;i<gresultCountry.data.length;i++)
    {
        this.setState(prev=>({country:[...prev.country,{"value":gresultCountry.data[i].countryID,"label":gresultCountry.data[i].nicename}]}))
//      country.push({"value":gresultCountry.data[i].countryID,"label":gresultCountry.data[i].nicename})
    }}
      catch(error){this.setState({openError:true})}
   }

    async fetchState(){
      var getStates
      try{
        getStates= await axios.get(
          baseURL+'api/com/getStateCountryWise/'+selectedOptionCountry['value']+"/",{
               headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      this.state.states.length=0;
    if(getStates.data.length!=0){
    for(var i=0;i<getStates.data.length;i++)
    {
        this.setState(prev=>({states:[...prev.states,{"value":getStates.data[i].stateID,"label":getStates.data[i].name}]}))
//      states.push({"value":getStates.data[i].stateID,"label":getStates.data[i].name})
    }
    }}
      catch(error){this.setState({openError:true})}
    }
    async fetchDistrict(){
      var getDistricts
      try{
        getDistricts= await axios.get(
          baseURL+'api/com/getDistrictStateWise/'+selectedOptionState['value']+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      this.state.districts.length=0;
      if(getDistricts.data.length!=0){
        for(var i=0;i<getDistricts.data.length;i++)
        {
            this.setState(prev=>({districts:[...prev.districts,{"value":getDistricts.data[i].districtID,"label":getDistricts.data[i].name}]}))
//          districts.push({"value":getDistricts.data[i].districtID,"label":getDistricts.data[i].name})
        }
      }
      }
      catch(error){this.setState({openError:true})}
    }
    async fetchGroup(){
      var getGroups
      try{
        getGroups= await axios.get(
          baseURL+'api/com/getSchoolGroups/',{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      this.state.groups.length=0;
      for(var i=0;i<getGroups.data.data.length;i++)
      {
        this.setState(prev=>({groups:[...prev.groups,{"value":getGroups.data.data[i].codeID,"label":getGroups.data.data[i].codeName}]}))
//          groups.push({"value":getGroups.data[i].codeID,"label":getGroups.data[i].codeName})
      }
      }
      catch(error){this.setState({openError:true})}
    }

    async fetchSchools(){
      try{
        getSchools= await axios.get(
          baseURL+'api/com/getSchool/',{
              headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );

      this.state.school.length=0;
      for(var i=0;i<getSchools.data.length;i++)
      {
          this.setState(prev=>({school:[...prev.school,{"value": getSchools.data[i].schoolID+','+getSchools.data[i].schoolName+','+getSchools.data[i].UDISEcode+','+getSchools.data[i].addressID.city+","+getSchools.data[i].addressID.stateID.name+","+getSchools.data[i].addressID.countryID.nicename+','+getSchools.data[i].addressID.pincode+','+getSchools.data[i].addressID.districtID.name
          ,"label":getSchools.data[i].schoolName+','+getSchools.data[i].addressID.city+","+getSchools.data[i].addressID.stateID.name+","
          +getSchools.data[i].addressID.pincode}]}))
      }
      }
      catch(error){this.setState({openError:true})}
    }
    async fetchStudents(val){
      dataSet1.length=0
      if(val=='National'){
      try{
        getStudents= await axios.get(
          baseURL+'api/cmp/getCountryWiseToppers/'+selectedCmpVal['value']+"&"+selectedAgeGroup['value']+"&"+selectedOptionCountry['value']+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
        );
      }
      catch(error){this.setState({openError:true})}
      }
      else if(val=='State'){
        try{
          getStudents=await axios.get(
            baseURL+'api/cmp/getStateWiseStudents/'+selectedCmpVal['value']+"&"+selectedAgeGroup['value']+"&"+selectedOptionCountry['value']+"&"+selectedOptionState['value']+"/",{
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
          );
        }
        catch(error){this.setState({openError:true})}
      }
    else if(val=='District'){
      try{
        getStudents=await axios.get(
          baseURL+'api/cmp/getDistrictWiseStudents/'+selectedCmpVal['value']+"&"+selectedAgeGroup['value']+"&"+selectedOptionCountry['value']+"&"+selectedOptionState['value']+"&"+selectedOptionDistrict['value']+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
      }
      catch(error){this.setState({openError:true})}
    }
    else if(val=='School'){
      try{
        getStudents=await axios.get(
          baseURL+'api/cmp/getAgeGrpWiseToppers/' +selectedCmpVal['value']+"&"+selectedAgeGroup['value']+"&"+selectedOptionSchoolToppers['value'].split(',')[0]+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
      }
      catch(error){this.setState({openError:true})}
    }
    else if(val=='School Group'){
      try{
        getStudents=await axios.get(
          baseURL+'api/cmp/getSchoolGroupWiseStudents/' +selectedCmpVal['value']+"&"+selectedAgeGroup['value']+"&"+selectedOptionSchoolGroup['value']+"/",{
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
      }
      catch(error){this.setState({openError:true})}
    }
    if(getStudents!=null)
    {
    if(getStudents.data.length==0){
      this.setState({openS5:true})
      document.getElementById('Toppers').style.display="none"
    }
    else{
    obj.length=0
      this.studentData(getStudents,selectedAgeGroup['label'])
      for(var i=0;i<obj.length;i++)
      {
        if(i>=3){
          break
        }
        else{
       dataSet1.push({
          "username":obj[i].username,
          "gender":obj[i].gender,
          "class":obj[i].class,
          "competition":obj[i].competition,
          "group":obj[i].agegrp,
          "schoolname":obj[i].school.split(',')[0],
          "schoolcity":obj[i].school.split(',')[1],
          "schooldistrict":obj[i].school.split(',')[2],
          "schoolstate":obj[i].school.split(',')[3],
          "schoolcountry":obj[i].school.split(',')[4],
          "schoolpincode":obj[i].school.split(',')[5],
          "score":obj[i].score,
          "bonus":obj[i].bonus,
          "total":obj[i].total,
          "max":obj[i].max,
          "time":obj[i].time,
          "rank":(i+1) })
       }
      }
       document.getElementById('Toppers').style.display="block"
    }
   }
  }

    studentData=(getStudents,key)=>{
      var grp=''
      if(key!=null)
      {
        grp=key
      }
      if(getStudents.data.length!=0){
      for(var i=0;i<getStudents.data.length;i++)
      {
       if(grp==getStudents.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName && getStudents.data[i].score != 999)
       {
        if(panelval=='panel5' && resvalue=='School Wise'){
       obj.push({ "username":getStudents.data[i].userID.username,
          "gender":getStudents.data[i].userID.gender.codeName,
          "class":getStudents.data[i].schoolClassID.classNumber,
          "school":getStudents.data[i].schoolClassID.schoolID.schoolName+","+getStudents.data[i].schoolClassID.schoolID.addressID.city+","+getStudents.data[i].schoolClassID.schoolID.addressID.districtID.name+','+getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name.charAt(0)+ getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name.substring(1).toLowerCase() +","+getStudents.data[i].schoolClassID.schoolID.addressID.countryID.nicename+','+getStudents.data[i].schoolClassID.schoolID.addressID.pincode,
          "score":getStudents.data[i].score,
          "bonus":getStudents.data[i].bonusMarks,
          "total":getStudents.data[i].score+getStudents.data[i].bonusMarks,
          "max":marksTot[getStudents.data[i].userID.userID],
          "time":getStudents.data[i].timeTaken,
          "competition":getStudents.data[i].competitionAgeID.competitionID.competitionName,
          "agegrp":getStudents.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName })
        }
        else{
          obj.push({ "username":getStudents.data[i].userID.username,
          "gender":getStudents.data[i].userID.gender.codeName,
          "class":getStudents.data[i].schoolClassID.classNumber,
          "school":getStudents.data[i].schoolClassID.schoolID.schoolName+","+getStudents.data[i].schoolClassID.schoolID.addressID.city+","+getStudents.data[i].schoolClassID.schoolID.addressID.districtID.name+','+getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name.charAt(0)+ getStudents.data[i].schoolClassID.schoolID.addressID.stateID.name.substring(1).toLowerCase() +","+getStudents.data[i].schoolClassID.schoolID.addressID.countryID.nicename+','+getStudents.data[i].schoolClassID.schoolID.addressID.pincode,
          "score":getStudents.data[i].score,
          "bonus":getStudents.data[i].bonusMarks,
          "total":getStudents.data[i].score+getStudents.data[i].bonusMarks,
          "max":totalMarks,
          "time":getStudents.data[i].timeTaken,
          "competition":getStudents.data[i].competitionAgeID.competitionID.competitionName,
          "agegrp":getStudents.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName })
        }
       }
    }
    if(obj.length == 0) { this.setState({openS5:true})}
    this.calculateToppers()
   }
  }

handleClick=()=>{
  if(value=='')
  {
    this.setState({openS1:true})
  }
  else{
    this.props.history.push({
      pathname:'/app/certificate',
      data:value
    })
  }
}
handleExcel=()=>{
  this.setState({openS6:true})
}
  render(){

    const { classes } = this.props;
    return (
      <div>
        <PageTitle title="Export"/>
        <Snackbar open={this.state.openError} autoHideDuration={3000} onClose={this.handleCloseError} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseError} severity="warning">
          Select Certificate Category!
        </Alert>
      </Snackbar>
        <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS1} severity="warning">
          Select Certificate Category!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS2} severity="warning">
          Select Competition!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS3} autoHideDuration={3000} onClose={this.handleCloseS3} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS3} severity="warning">
          Select Age Group!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS4} autoHideDuration={3000} onClose={this.handleCloseS4} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS4} severity="warning">
          Select Competition and Age Group !
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS5} autoHideDuration={3000} onClose={this.handleCloseS5} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS5} severity="warning">
          No students!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.openS6} autoHideDuration={3000} onClose={this.handleCloseS6} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS6} severity="success">
          Download Successful!
        </Alert>
      </Snackbar>
        <div  className={classes.root} >
             <ExpansionPanel expanded={this.state.expanded === 'panel3'} onChange={this.handleChange('panel3')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >

            <Typography className={classes.heading} >
            Administrators</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download Administrators List</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography id='admintext'>

          </Typography>
          <ExcelFile filename={filename}  element={<Button  variant="contained" color="primary" onClick={this.handleExcel} style={{marginLeft:'225px',marginTop:'-1%'}} >
        Download Data</Button>}>
                 <ExcelSheet data={dataSet1} name={sheetname}>
                 {this.state.labels.map(label => (
            <ExcelColumn
              label={label.label}
              value={label.value}
            />
          ))}

         </ExcelSheet>
         </ExcelFile>

        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={this.state.expanded === 'panel7'} onChange={this.handleChange('panel7')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel7bh-content"
          id="panel7bh-header"
        >

            <Typography className={classes.heading} >
            Schools</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download Schools List</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography id='schooltext'>

          </Typography>
          <ExcelFile filename={filename}  element={<Button  variant="contained" color="primary" onClick={this.handleExcel} style={{marginLeft:'270px',marginTop:'-1%'}} >
        Download Data</Button>}>
                 <ExcelSheet data={dataSet1} name={sheetname}>
                 {this.state.labels.map(label => (
            <ExcelColumn
              label={label.label}
              value={label.value}
            />
          ))}

         </ExcelSheet>
         </ExcelFile>

        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={this.state.expanded === 'panel2'} onChange={this.handleChange('panel2')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}

        >
          <Typography className={classes.heading} >
           School Coordinators</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download School Coordinators List</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

           <Typography id='coordinatortext' component='h6' style={{marginTop:'1%'}}>
        Select School
          </Typography>
         <Box p={1} m={1} style={{width:'30%',marginLeft:'3%',marginTop:'-1%',zIndex:"300"}}>

        <Select

          value={selectedOptionSchool}
          onChange={this.handleSchoolChange}
          options={this.state.school}
          //styles={{width:'30%'}}
          placeholder="Select School.."

                  />
                  </Box>
          <ExcelFile filename={filename} element={<Button id="SchoolC" variant="contained" color="primary" onClick={this.handleExcel} style={{marginLeft:'56px',marginTop:'-1%',display:"none"}}>
        Download Data</Button>}>
                 <ExcelSheet data={dataSet1} name={sheetname}>
                 {this.state.labels.map(label => (
            <ExcelColumn
              label={label.label}
              value={label.value}
            />
          ))}
         </ExcelSheet>
         </ExcelFile>


        </ExpansionPanelDetails>
      </ExpansionPanel>


      <ExpansionPanel expanded={this.state.expanded === 'panel4'} onChange={this.handleChange('panel4')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
            <Typography className={classes.heading} >
            Students</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download Students List</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

        <FormControl component="fieldset"  className={classes.formControl}>
        <FormLabel component="legend" >Select Category</FormLabel>

        <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-3%',marginBottom:'-5%'}}>
        <Box  p={1} m={1}>
        <RadioGroup
        value={listvalue}
       onChange={this.handleRadioChangeList}
        >

      <Box display="flex" flexDirection="row" p={1} m={1} >

      <Box  p={1} m={1}>
        <FormControlLabel value="All" control={<Radio color='primary'/>}  label="School Wise" />
         </Box>
      <Box  p={1} m={1}>
        <FormControlLabel value="School Wise" control={<Radio color='primary'/>}  label="School-Competition Wise" />
         </Box>
         <Box  p={1} m={1} >
          <FormControlLabel value="Competition Wise" control={<Radio color='primary'/>}   label="Competition-Age Group Wise" />
          </Box>
          </Box>
        </RadioGroup>
        </Box>
        </Box>
      </FormControl>
</ExpansionPanelDetails>
<ExpansionPanelDetails>
     <Box id="cmpList" p={1} m={1} style={{width:"30%",zIndex:"200",marginLeft:"6%",marginTop:'-4%',display:'none'}}>

        <Select
          value={selectedCmpValList}
          onChange={this.handleCmpChangeList}
          options={this.state.competition}
         //styles={customStyles}
         placeholder="Select Competition.."
       />

         </Box>
         <Box  id="schList"p={1} m={1} style={{width:"30%",zIndex:"200",marginLeft:"0.5%",marginTop:'-4%',display:'none'}}>

        <Select


         value={selectedOptionSchoolList}
          onChange={this.handleSchoolChangeList}
          options={this.state.school}
         //styles={customStyles}
         placeholder="Select School.."
         style={{zIndex:"200"}}
       />
         </Box>

         <Box id="ageGrpList" p={1} m={1} style={{width:"30%",marginLeft:"0.5%",zIndex:"200",marginTop:'-4%',display:"none"}}>

        <Select
          value={selectedAgeGroupList}
          onChange={this.handleAgeGroupChangeList}
         options={this.state.agegroup}
         //styles={customStyles}
         placeholder="Select Age Group.."
       />

         </Box>

         <Box  id="allSchList"p={1} m={1} style={{width:"30%",zIndex:"200",marginLeft:"7%",marginTop:'-4%',display:'none'}}>

        <Select


         value={selectedOptionSchoolListAll}
          onChange={this.handleAllSchoolStudentsList}
          options={this.state.school}
         //styles={customStyles}
         placeholder="Select School.."
         style={{zIndex:"200"}}
       />
         </Box>
      <ExcelFile  filename={filename} element={<Button id='List' variant="contained" color="primary" onClick={this.handleExcel} style={{display:'none',marginLeft:'30px',marginTop:'-13%'}}>
        Download Data</Button>}>

                 <ExcelSheet data={dataSet1} name={sheetname}>
                 {this.state.labels.map(label => (
            <ExcelColumn
              label={label.label}
              value={label.value}

            />

            ))}
         </ExcelSheet>
         </ExcelFile>

        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={this.state.expanded === 'panel5'} onChange={this.handleChange('panel5')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
            <Typography className={classes.heading} >
            Results</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download Results List</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

        <FormControl component="fieldset"  className={classes.formControl}>
        <FormLabel component="legend" >Select Category</FormLabel>

        <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-3%',marginBottom:'-5%'}}>
        <Box  p={1} m={1}>
        <RadioGroup
        value={resvalue}
       onChange={this.handleRadioChangeRes}
        >

      <Box display="flex" flexDirection="row" p={1} m={1} >
      <Box  p={1} m={1}>
        <FormControlLabel value="School Wise" control={<Radio color='primary'/>}  label="School Wise" />
         </Box>
         <Box  p={1} m={1} >
          <FormControlLabel value="Competition Wise" control={<Radio color='primary'/>}   label="Competition Wise" />
          </Box>
          </Box>
        </RadioGroup>
        </Box>
        </Box>
      </FormControl>
</ExpansionPanelDetails>
<ExpansionPanelDetails>
     <Box id="cmpRes" p={1} m={1} style={{width:"30%",zIndex:"200",marginLeft:"6%",marginTop:'-4%',display:'none'}}>

        <Select
          value={selectedCmpValRes}
          onChange={this.handleCmpChangeRes}
          options={this.state.competition}
         //styles={customStyles}
         placeholder="Select Competition.."
       />

         </Box>
         <Box  id="schRes"p={1} m={1} style={{width:"30%",zIndex:"200",marginLeft:"0.5%",marginTop:'-4%',display:'none'}}>

        <Select


         value={selectedOptionSchoolRes}
          onChange={this.handleSchoolChangeRes}
          options={this.state.school}
         //styles={customStyles}
         placeholder="Select School.."
         style={{zIndex:"200"}}
       />
         </Box>

         <Box id="ageGrpRes" p={1} m={1} style={{width:"30%",marginLeft:"0.5%",zIndex:"200",marginTop:'-4%',display:"none"}}>

        <Select
          value={selectedAgeGroupRes}
          onChange={this.handleAgeGroupChangeRes}
         options={this.state.agegroup}
         //styles={customStyles}
         placeholder="Select Age Group.."
       />

         </Box>

      <ExcelFile  filename={filename} element={<Button id='Res' variant="contained" color="primary" onClick={this.handleExcel} style={{display:'none',marginLeft:'30px',marginTop:'-13%'}}>
        Download Data</Button>}>

                 <ExcelSheet data={dataSet1} name={sheetname}>
                 {this.state.labels.map(label => (
            <ExcelColumn
              label={label.label}
              value={label.value}

            />

            ))}
         </ExcelSheet>
         </ExcelFile>

        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading} >
            Certificates</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download Certificates</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {/* <Typography>

          </Typography>*/}
          <FormControl component="fieldset"  className={classes.formControl}>
        <FormLabel component="legend" >Select Category</FormLabel>

        <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-3%',marginBottom:'-5%'}}>
        <Box  p={1} m={1}>
        <RadioGroup aria-label="quiz" name="quiz"
        value={value}
       onChange={this.handleRadioChange}
        >

      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Box  p={1} m={1}>
                   <FormControlLabel value="National Toppers" control={<Radio color='primary'/>}  label="National Toppers" />
         </Box>
         <Box  p={1} m={1}>
          <FormControlLabel value="School Toppers" control={<Radio color='primary'/>}   label="School Toppers" />
          </Box>
          <Box  p={1} m={1}>
          <FormControlLabel value="Participation" control={<Radio color='primary' />}  label="Participation" />
          </Box>
          </Box>
        </RadioGroup>
        </Box>
        <Box  p={1} m={1} style={{marginTop:'5%'}}>
        <Button variant="contained" color="primary" onClick={this.handleClick}   startIcon={<ArrowForwardIcon />   }   >
          Proceed
        </Button>
        </Box>
        </Box>
      </FormControl>

        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel expanded={this.state.expanded === 'panel6'} onChange={this.handleChange('panel6')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6bh-content"
          id="panel6bh-header"
        >
            <Typography className={classes.heading} >
            Toppers</Typography>
          <Typography style={{marginLeft:'20%'}} className={classes.secondaryHeading}>Download Toppers List</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

        <Box p={1} m={1} style={{width:'35%',marginLeft:'8%',marginTop:'-1%',zIndex:"300"}}>

   <Select

     value={selectedCmpVal}
     onChange={this.handleCompetitionChange}
     options={this.state.competition}
     //styles={{width:'30%'}}
     placeholder="Select Competition.."

             />
           </Box>


           <Box p={1} m={1} style={{width:'35%',marginLeft:'5%',marginTop:'-1%',zIndex:"300"}}>

<Select

value={selectedAgeGroup}
onChange={this.handleAgeGroupChange}
options={this.state.agegroup}
//styles={{width:'30%'}}
placeholder="Select Age Group.."

        />
      </Box>


      </ExpansionPanelDetails>

      <ExpansionPanelDetails>
        <FormControl component="fieldset"  className={classes.formControl}>
        <FormLabel component="legend" >Select Category</FormLabel>

        <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-3%',marginBottom:'-5%'}}>
        <Box  p={1} m={1}>
        <RadioGroup aria-label="quiz" name="quiz"
        value={valueTopperCategory}
       onChange={this.handleRadioChangeToppers}
        >

      <Box display="flex" flexDirection="row" p={1} m={1}>
      <Box  p={1} m={1}>
                   <FormControlLabel value="National Toppers" control={<Radio color='primary'/>}  label="National Toppers" />
         </Box>
         <Box  p={1} m={1}>
          <FormControlLabel value="State Toppers" control={<Radio color='primary'/>}   label="State Toppers" />
          </Box>
          <Box  p={1} m={1}>
          <FormControlLabel value="District Toppers" control={<Radio color='primary' />}  label="District Toppers" />
          </Box>

          <Box  p={1} m={1}>
          <FormControlLabel value="School Toppers" control={<Radio color='primary' />}  label="School Toppers" />
          </Box>
          <Box  p={1} m={1}>
          <FormControlLabel value="School Group Toppers" control={<Radio color='primary' />}  label="School Group Toppers" />
          </Box>

          </Box>
        </RadioGroup>
        </Box>

        </Box>
      </FormControl>
</ExpansionPanelDetails>
<ExpansionPanelDetails>

<Box  id="Country"p={1} m={1} style={{width:"20%",display:'none',zIndex:"200",marginLeft:"6%"}}>

        <Select


         value={selectedOptionCountry}
          onChange={this.handleCountryChange}
          options={this.state.country}
         //styles={customStyles}
         placeholder="Select Country.."
         style={{zIndex:"200"}}
       />
         </Box>




         <Box id="State" p={1} m={1} style={{width:"20%",display:'none',zIndex:"200",marginLeft:"0.5%"}}>

        <Select
          value={selectedOptionState}
          onChange={this.handleStateChange}
          options={this.state.states}
         //styles={customStyles}
         placeholder="Select State.."
       />

         </Box>
         <Box id="District" p={1} m={1} style={{width:"20%",display:'none',marginLeft:"0.5%",zIndex:"200"}}>

        <Select
          value={selectedOptionDistrict}
          onChange={this.handleDistrictChange}
         options={this.state.districts}
         //styles={customStyles}
         placeholder="Select District.."
       />

         </Box>


         <Box id="School" p={1} m={1} style={{width:"30%",display:'none',zIndex:"200",marginLeft:"5%"}} >

        <Select
         value={selectedOptionSchoolToppers}
         onChange={this.handleSchoolChangeToppers}
         options={this.state.school}
         //styles={customStyles}
         placeholder="Select School.."
       />
         </Box>
         <Box id="Group"  p={1} m={1} style={{width:"30%",display:"none", zIndex:"200",marginLeft:"5%"}}>

        <Select
          value={selectedOptionSchoolGroup}
          onChange={this.handleSchoolGroupChange}
         options={this.state.groups}
         //styles={customStyles}
         placeholder="Select School Group.."
       />
         </Box>



           {/* <Box p={1} m={1} style={{width:'30%',marginLeft:'-1%',marginTop:'-0.5%',zIndex:"300"}}> */}

           <ExcelFile filename={filename} element={<Button id="Toppers" variant="contained" color="primary" onClick={this.handleExcel} style={{marginLeft:'30px',marginTop:'8%'}}>
        Download Data</Button>}>

                 <ExcelSheet data={dataSet1} name={sheetname}>
                 {this.state.labels.map(label => (
            <ExcelColumn
              label={label.label}
              value={label.value}
            />
          ))}
         </ExcelSheet>
         </ExcelFile>

{/*
                </Box> */}
        </ExpansionPanelDetails>
      </ExpansionPanel>
        </div>



      <Backdrop className={classes.backdrop}  open={this.state.openprogress}  >
      <CircularProgress  color="primary" />
      <Typography component="h1" style={{color:"black"}}><b> Please Wait..</b></Typography>



     </Backdrop>


        </div>
    );
  }
}



ExportDocs.propTypes= {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(ExportDocs);
