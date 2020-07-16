import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { arr } from './SchoolDetail';
import PageTitle from "../../components/PageTitle/PageTitle";
import axios from 'axios';
import {baseURL, metabaseURL,metabaseSecretKey} from '../constants'
import MUIDataTable from "mui-datatables";
import Edit from "@material-ui/icons/Edit"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {Link} from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import GetAppIcon from '@material-ui/icons/GetApp';
import ErrorIcon from '@material-ui/icons/Error';
import RoomIcon from '@material-ui/icons/Room';
import './styles.css';
var jwt = require("jsonwebtoken");

const userStatus = { active : "active", approved : "approved" , inactive : "inactive"};
var gresult;

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260",//warning
  declined: "#FF5C93", //secondary
};
const headerList=["Name","Email","Phone","Role","Created On",{name:"Created By",options:{display:false,filter:false,viewColumns:false}},
  {name:"UserID",options:{display:false,filter:false,viewColumns:false}},
  {name:"LoginID",options:{display:false,filter:false,viewColumns:false}},
  {name:"Gender",options:{display:false,filter:false,viewColumns:false}},
  {name:"UserRoleID",options:{display:false,filter:false,viewColumns:false}},
  {name:"Birthdate",options:{display:false,filter:false,viewColumns:false}},
  {name:"Is Active",options:{display:false,filter:false,viewColumns:false}},"Status","Approval"];

const status='';
const approval='';

//for schools dashboard
var payload = {
  resource: { dashboard: 34 },
  params: {},
  exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcSchools = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";


class ContactInfo extends React.PureComponent{
  state={
    getValue:[],
    countRows:0,
    pageSize:10,
    nextLink:'',
    prevLink:'',
    approval:'',
    status:'',
    openError:false
  }
  
  async componentDidMount () {

    try{
        gresult = await axios.get(
        baseURL+'api/usr/viewUserRoleLocation/'+arr[0].schoolID+'&school/', {
           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {

          this.setState(prev=>({getValue:[...prev.getValue,{
            username:gresult.data.results[i].userRoleID.userID.username,
            loginID:gresult.data.results[i].userRoleID.userID.loginID,
            email:gresult.data.results[i].userRoleID.userID.loginID,
            phone:gresult.data.results[i].userRoleID.userID.phone,
            birthdate: gresult.data.results[i].userRoleID.userID.birthdate,
            gender:gresult.data.results[i].userRoleID.userID.gender.codeName,
            createdBy:gresult.data.results[i].userRoleID.userID.created_by,
            createdOn:gresult.data.results[i].userRoleID.userID.created_on,
            is_active:gresult.data.results[i].userRoleID.userID.is_active.codeName,
            role:gresult.data.results[i].userRoleID.RoleID.RoleName,
            userID:gresult.data.results[i].userRoleID.userID.userID,
            userRoleID:gresult.data.results[i].userRoleID.userRoleID
          }]}))
        }
        this.setState({countRows:gresult.data.count})
        this.setState({pageSize:gresult.data.page_size})
        this.setState({nextLink:gresult.data.links.next})
        this.setState({prevLink:gresult.data.links.previous})

      }catch(error){this.props.history.push('/app/dashboard') }
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


   async  handlePageChange(newValue) {

      try{
       if(this.state.nextLink!=null) {
        gresult = await axios.get(this.state.nextLink , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        });
        for(var i = 0 ; i < gresult.data.length ; i++)
        {
          this.setState(prev=>({getValue:[...prev.getValue,{
            username:gresult.data.results[i].userRoleID.userID.username,
            loginID:gresult.data.results[i].userRoleID.userID.loginID,
            email:gresult.data.results[i].userRoleID.userID.loginID,
            phone:gresult.data.results[i].userRoleID.userID.phone,
            birthdate: gresult.data.results[i].userRoleID.userID.birthdate,
            gender:gresult.data.results[i].userRoleID.userID.gender.codeName,
            createdBy:gresult.data.results[i].userRoleID.userID.created_by,
            createdOn:gresult.data.results[i].userRoleID.userID.created_on,
            is_active:gresult.data.results[i].userRoleID.userID.is_active.codeName,
            role:gresult.data[i].userRoleID.RoleID.RoleName,
            userID:gresult.data.results[i].userRoleID.userID.userID,
            userroleID:gresult.data.results[i].userRoleID.userRoleID
          }]}))
       }
        this.setState({countRows:gresult.data.count});
        this.setState({pageSize:gresult.data.page_size});
        this.setState({nextLink:gresult.data.links.next});
        this.setState({prevLink:gresult.data.links.previous});
      }
     }catch(error){this.setState({openError:true})}
   }

   handleClose_error=()=>{this.setState({openError:false})}

  render(){
  return (
    <>
    <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose_error}>
        <Alert onClose={this.handleClose_error} variant="filled" severity="error">
        <b>Error occured!</b>
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

      <PageTitle title="Contact Info"/>
<ExpansionPanel style={{width:'95%'}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5" >{arr[0].schoolName}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

         <Typography variant="h6">
        Contact: {arr[0].Phone} </Typography>
      </ExpansionPanelDetails>
      </ExpansionPanel>
      <br></br>
      <Grid item xs={12} style={{width:'95%'}}>
         <MUIDataTable
            title="School Coordinators"

            data={this.state.getValue.map(item => {
              return [
                  item.username,
                  item.email,
                  item.phone,
                  item.role,
                  item.createdOn,
                  item.createdBy,
                  item.userID,
                  item.gender,
                  item.birthdate,
                  item.is_active,
                  item.userRoleID,
                  item.loginID,
                   <h4 style = {{color:states[this.finalStatus(item.is_active).toLowerCase()]}}>{this.finalStatus(item.is_active)}</h4>,
                  <h4 style = {{color:states[this.finalApproval(item.is_active).toLowerCase()]}}>{this.finalApproval(item.is_active)}</h4>
            ]})}

          columns={headerList}
             options={{
               selectableRows:false,
               onRowClick:item=> func(item,this.props.history),
               rowsPerPage: this.state.pageSize,
               print:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRows,
                onChangePage: () => this.handlePageChange(),
                textLabels: {
                  body: {
                      noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                  },
              },

              }}

          />
        </Grid>
    </>
  );
   }


 }
ContactInfo.propTypes ={
  classes:PropTypes.object.isRequired,
 };

export default ContactInfo;

function func(rowData,history)
{
  var data = [{
    username:rowData[0],
    email:rowData[1],
    phone:rowData[2],
    role:rowData[3],
    createdOn:rowData[4],
    createdBy:rowData[5],
    userID:rowData[6],
    gender:rowData[7],
    birthdate:rowData[8],
    is_active:rowData[9],
    userRoleID:rowData[10],
    loginID:rowData[11],
  }]
  history.push({pathname:'/app/user/update', data:data})
}