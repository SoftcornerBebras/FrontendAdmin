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
import {baseURL} from '../constants'
import MUIDataTable from "mui-datatables";
import Edit from "@material-ui/icons/Edit"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import {Link} from 'react-router-dom';


const userStatus = { active : "active", approved : "approved" , inactive : "inactive"};
var gresult;

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260",//warning
  declined: "#FF5C93", //secondary
};
const headerList=["Name","Email","Phone","Role","Created On","Created By","Status","Approval","Edit"];
const status='';
const approval='';
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
                    gender:gresult.data.results[i].userRoleID.userID.gender,
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
                    email:gresult.data.results[i].userRoleID.userID.loginID,
                    phone:gresult.data.results[i].userRoleID.userID.phone,
                     birthdate: gresult.data.results[i].userRoleID.userID.birthdate,
                    gender:gresult.data.results[i].userRoleID.userID.gender,
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
      <PageTitle title="Contact Info"/>
<ExpansionPanel>
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
      <Grid item xs={12}>
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
