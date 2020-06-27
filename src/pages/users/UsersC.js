import React, { useState, useEffect } from "react";
import { Grid , IconButton , CircularProgress, Box} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import AddUser from "../../pages/users/AddUser"
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import green from '@material-ui/core/colors/green';
import Edit from "@material-ui/icons/Edit"
import {useHistory,Link,Route,Redirect} from 'react-router-dom';
import {baseURL} from "../constants.js";
import ErrorBoundary from'../error/ErrorBoundary'
import Select from 'react-select';

const userStatus = { active : "unapproved", approved : "approved" , inactive : "inactive"};

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260"//warning
};

const headerList=[{name:"Name",options:{download:true}},
        {name:"LoginID",options:{download:true}},
        {name:"Phone",options:{download:true}},
        {name:"Role",options:{download:true}},
        {name:"Created On",options:{download:true}},
        {name:"Created By",options:{download:true}},
        {name:"Status",options:{download:true}},
        {name:"Approval",options:{download:true}},
        "Edit",{
    name:"",
    options: {
        filter:false,
        viewColumns:false,
    }
}];

class UsersPage extends React.PureComponent {


    constructor(props){
      super(props);
      this.state = {
        countRows:0,
        pageSize:10,
        nextLink:'',
        prevLink:'',
        getValue:[],
        years:[],
        selectedYear:""
      }
    };

    async componentDidMount () {
        try{

        let gyear = await axios.get(baseURL+'api/usr/getUserYears/',{
        headers:{
             'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
         }
     })
     let yearData = gyear.data.data
    for(let i = 0 ; i < yearData.length ; i ++) {
      this.setState(prevState => ({years:[...prevState.years,{"label":yearData[yearData.length-1-i].substring(0,4),
      "value":yearData[yearData.length-1-i].substring(0,4)}]}))
    }

            let gresult = await axios.get(
            baseURL+'api/usr/viewUsers/', {
                 headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
            );
            this.setState({getValue : gresult.data.results})
            this.setState({nextLink:gresult.data.links.next,pageSize:gresult.data.page_size,prevLink:gresult.data.links.previous,countRows:gresult.data.count})
        }catch(error){ this.props.history.push('/app/dashboard') }


    };

    async getYearData(year){
        this.setState({getValue:[]})
        let gresult = await axios.get(
            baseURL+'api/usr/getUsersYearWise/'+year, {
                 headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
            );
            this.setState({getValue : gresult.data.results})
            this.setState({nextLink:gresult.data.links.next,pageSize:gresult.data.page_size,prevLink:gresult.data.links.previous,countRows:gresult.data.count})

    }

   async handlePageChange() {
      let gresult;
       if(this.state.nextLink!=null) {
        gresult = await axios.get(this.state.nextLink , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        });
        this.setState(prevState => ({getValue : [...prevState.getValue,...gresult.data.results]}))
        this.setState({nextLink:gresult.data.links.next,pageSize:gresult.data.page_size,prevLink:gresult.data.links.previous,countRows:gresult.data.count})

    }};

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

   handleChangeYear = year => {
    this.setState({selectedYear:year});
    this.getYearData(year.value)
  }

  render(){

  return (
    <ErrorBoundary>
      <PageTitle title="Users" />
      <Box display="flex" flexDirection="row">
      <Box p={1} m={1} style={{width : "200px", marginTop:"-4%",marginLeft:"20%",zIndex:"300"}}>
      <Select style={{color:"red"}}
        value={this.selectedYear}
        onChange={this.handleChangeYear}
        options={this.state.years}
        placeholder="Select Year" />
      </Box>
      </Box>
      <Button color="primary" variant="contained" style={{ marginBottom: '10px',marginLeft:'90%',marginTop:'-60px' }}
      onClick={() => this.props.history.push("/app/user/add")}>
      ADD</Button>

      <Grid item xs={12} style={{zIndex:"0"}}>
         <MUIDataTable
            title="User List"
            data={this.state.getValue.map(item =>{
              return [
                  item.userID.username,
                  item.userID.loginID,
                  item.userID.phone,
                  item.RoleID.RoleName,
                  item.userID.created_on,
                  item.userID.created_by,
                  <h4 style = {{color:states[this.finalStatus(item.userID.is_active.codeName).toLowerCase()]}}>{this.finalStatus(item.userID.is_active.codeName)}</h4>,
                  <h4 style = {{color:states[this.finalApproval(item.userID.is_active.codeName).toLowerCase()]}}>{this.finalApproval(item.userID.is_active.codeName)}</h4>,
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
               download:false,
               onDownload:true,
               print:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRows ,
                onChangePage: () => this.handlePageChange(),
                textLabels: {
                  body: {
                      noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                  },
                },
             }}
           />
        </Grid>
    </ErrorBoundary>
  );
 }
}

export default UsersPage;
