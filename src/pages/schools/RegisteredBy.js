import React, { Component } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import Paper from '@material-ui/core/Paper';
import { arr } from './SchoolDetail';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import {baseURL,metabaseURL,metabaseSecretKey} from '../constants'
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import GetAppIcon from '@material-ui/icons/GetApp';
import ErrorIcon from '@material-ui/icons/Error';
import RoomIcon from '@material-ui/icons/Room';
import './styles.css';
var jwt = require("jsonwebtoken");

//for schools dashboard
var payload = {
  resource: { dashboard: 34 },
  params: {},
  exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcSchools = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

class RegisteredBy extends Component {
  state={
    getValue:[],
    countRows:0,
    pageSize:10,
    nextLink:'',
    prevLink:'',
    nameVar:'',
    email:'',
    created_on:'',
    dob:'',
    gender:'',
    phone:'',

  }

  async  componentDidMount () {

    try{
       var createdby = arr[0].registeredBy;
      let gresult = await axios.get(
      baseURL+'api/usr/getRegisteredBy/'+ createdby+"/", {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
      );
    this.setState(prev=>({getValue:[...prev.getValue,{
      username:gresult.data[0].username,
      email:gresult.data[0].loginID,
      phone:gresult.data[0].phone,
      createdBy:gresult.data[0].created_by,
      createdOn:gresult.data[0].created_on,
      dob:gresult.data[0].birthdate,
      status:gresult.data[0].is_active.codeName,
      gender:gresult.data[0].gender.codeName
          }]}))

       let date=this.state.getValue['0'].dob.split("-");
       let createdOn=arr[0].registeredOn.split("-");
        this.setState({nameVar:this.state.getValue['0'].username,
      gender:this.state.getValue['0'].gender,
      email:this.state.getValue['0'].email,
    phone:this.state.getValue['0'].phone,
    dob:date[2]+"/"+date[1]+'/'+date[0],
    created_on: createdOn[2]+"/"+createdOn[1]+'/'+createdOn[0]});
    }catch(error){ this.props.history.push('/app/dashboard') }

}

  render(){
    return (
      <div>
          <PageTitle title="Registered By"/>
          <Paper  elevation={3} style={{width:'1000px',marginLeft:'100px',marginTop:"50px"}} >

      <div className="sidenav">
        <a href="#/app/school/directions" className="directions"><RoomIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Directions</a>
        <a href="#/app/school/ContactInfo" className="contact"><PhoneIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Contact Info</a>
        <a href="#/app/school/RegisteredBy" className="registeredBy" ><PersonIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Registered By</a>
        <a href="#/app/school/StudentDetails" className="studentsEnrolled" ><PeopleIcon style={{marginLeft:"-40px",marginRight:"20px"}}/>Student Details</a>
        <a href= {srcSchools} className="analysis" ><BarChartIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Analysis</a>
        <a href="#/app/school/download" className="download" ><GetAppIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Download</a>
      </div>

      <Grid item container direction="column" xs={12}>
        <Grid container style={{marginLeft:"10%",marginTop:"5%",marginBottom:"5%"}} >
           <React.Fragment >
              <Grid item xs={4} >
                <Typography variant="h6">Name :</Typography>
                <br></br>
                <Typography variant="h6">Email :</Typography>
                <br></br>
                <Typography variant="h6">Phone :</Typography>
                <br></br>
                <Typography variant="h6">Birth Date :</Typography>
                <br></br>
                <Typography variant="h6">Gender :</Typography>
                <br></br>
                <Typography variant="h6">Registered On :</Typography>
              </Grid>
              <Grid item xs={8} >
                <Typography variant="h6">{this.state.nameVar}</Typography>
                <br></br>
                <Typography variant="h6">{this.state.email}</Typography>
                <br></br>
      <Typography variant="h6">{this.state.phone}</Typography>
                <br></br>
      <Typography variant="h6">{this.state.dob}</Typography>
                <br></br>
                <Typography variant="h6">{this.state.gender}</Typography>
                <br></br>
                <Typography variant="h6">{this.state.created_on}</Typography>
              </Grid>
            </React.Fragment>
          </Grid>
      </Grid>
          </Paper>
      </div>
    );
  }
}

export default RegisteredBy;
