import React from "react";
import { Grid , IconButton , CircularProgress, Box, TextField, InputAdornment, Snackbar} from "@material-ui/core";
import { Close as CloseIcon, Search } from "@material-ui/icons";
import AddUser from "../../pages/users/AddUser"
import { withStyles } from '@material-ui/core/styles';
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import green from '@material-ui/core/colors/green';
import Edit from "@material-ui/icons/Edit"
import {useHistory,Route,Redirect} from 'react-router-dom';
import {baseURL} from "../constants.js";
import ErrorBoundary from'../error/ErrorBoundary'
import Select from 'react-select';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

const userStatus = { active : "unapproved", approved : "approved" , inactive : "inactive"};

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260"//warning
};

const styles = theme => ({
  root: {
    background: "#fff"
  }
});
const headerList=[{name:"Name",options:{download:true}},
        {name:"LoginID",options:{download:true}},
        {name:"Phone",options:{download:true,display:false,filter:false,viewColumns:false}},
        {name:"Role",options:{download:true}},
        {name:"Created On",options:{download:true}},
        {name:"Created By",options:{download:true,display:false,filter:false,viewColumns:false}},
        {name:"userRoleID",options:{display:false,filter:false,viewColumns:false}},
        {name:"userID",options:{display:false,filter:false,viewColumns:false}},
        {name:"RoleID",options:{display:false,filter:false,viewColumns:false}},
        {name:"Email",options:{display:false,filter:false,viewColumns:false}},
        {name:"Birthdate",options:{display:false,filter:false,viewColumns:false}},
        {name:"Gender",options:{display:false,filter:false,viewColumns:false}},
        {name:"Modified By",options:{display:false,filter:false,viewColumns:false}},
        {name:"Modified On",options:{display:false,filter:false,viewColumns:false}},
        {name:"Is Active",options:{display:false,filter:false,viewColumns:false}},
        {name:"Status",options:{download:true}},
        {name:"Approval",options:{download:true}}];

class UsersPage extends React.PureComponent {


    constructor(props){
      super(props);
      this.state = {
        countRows:0,
        countRows2:0,
        pageSize:10,
        page:0,
        searchValue:"",
        nextLink:'',
        prevLink:'',
        getValue:[],
        getValue2:[],
        norecords:false,
      }
    };

 handleClose=(event,reason)=>{
    if (reason === 'clickaway') {
      return;
    }

    this.setState({norecords:false});
  }

    async componentDidMount () {
        try{

            let gresult = await axios.get(
            baseURL+'api/usr/viewUsers/', {
                 headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
            );
            if(gresult.data.results.length==0){
             this.setState({norecords:true})
             document.getElementById('UserList').style.display="none"
          }
          else{
              document.getElementById('UserList').style.display="block"
          }
            this.setState({getValue : gresult.data.results})
            this.setState({nextLink:gresult.data.links.next,pageSize:gresult.data.page_size,prevLink:gresult.data.links.previous,countRows:gresult.data.count})
        }catch(error){ this.props.history.push('/app/dashboard') }


    };

    async getSearchedData(data){
      this.setState({getValue2:[],page:0})
      let gresult = await axios.post(baseURL + 'api/usr/getUserSearch/',{"feed":data},
      {headers: { Authorization:"Token "+localStorage.getItem('id_token')}}
      ).catch(error => {this.setState({open_error:true})})
      if(gresult.data.length==0){
         this.setState({norecords:true})
         document.getElementById('UserSearch').style.display="none"
      }
      else{
       document.getElementById('UserSearch').style.display="block"
      }
      this.setState({getValue2 : gresult.data, page:0})
      this.setState({page:0,pageSize:gresult.page_size,countRows2:gresult.count})
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

   handleChangeData = data => {
    this.getSearchedData(data)
  }

  handleSearchChange = newValue => {
    this.setState({searchValue:newValue})
  }
  enterPressAlert = (e) => {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { //Enter keycode
     this.getSearchedData(e.target.value)
    }
  }

  render(){

  const classes = this.props;

  return (
    <ErrorBoundary>
       <Snackbar open={this.state.norecords} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleClose} variant="filled" severity="warning">
          No Records found!
        </Alert>
      </Snackbar>
      <PageTitle title="Users" />
        <Grid item >
          <TextField
            placeholder='Search'
            onKeyPress={e => this.enterPressAlert(e)}
            className = {classes.root}
            style={{width:"300px",height:'20px', marginLeft:'30%',marginTop:'-3%',marginBottom: '-10px'}}
            value={this.state.searchValue}
            onChange={ e => this.handleSearchChange(e.target.value)}
            InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                  endAdornment:(
              <InputAdornment position="end">
                <IconButton
                  onClick={()=>this.handleChangeData(this.state.searchValue)}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            )
            }}
          />
        </Grid>

      <Button color="primary" variant="contained" style={{ marginBottom: '-10px',marginLeft:'90%',marginTop:'-10%' }}
      onClick={() => this.props.history.push("/app/user/add")}>
      ADD</Button>
      <Grid container spacing={4}>
      {this.state.searchValue === "" ?
      <Grid id="UserList" item xs={12} style={{zIndex:"0"}}>
         <MUIDataTable
            title="User List"
            data={this.state.getValue.map(item =>{
              return [
                  item.userID.username,
                  item.userID.loginID,
                  item.userID.phone,
                  item.RoleID.RoleName,
                  item.userID.created_on.replace(/T|Z/g," "),
                  item.userID.created_by,
                  item.userID.userID,
                  item.userRoleID,
                  item.RoleID.RoleID,
                  item.userID.email,
                  item.userID.birthdate,
                  item.userID.gender.codeName,
                  item.userID.modified_by,
                  item.userID.modified_on,
                  item.userID.is_active.codeName,
                  <h4 style = {{color:states[this.finalStatus(item.userID.is_active.codeName).toLowerCase()]}}>{this.finalStatus(item.userID.is_active.codeName)}</h4>,
                  <h4 style = {{color:states[this.finalApproval(item.userID.is_active.codeName).toLowerCase()]}}>{this.finalApproval(item.userID.is_active.codeName)}</h4>,
            ]})}
           columns={headerList}
             options={{
               selectableRows:false,
               onRowClick:rowData=>func(rowData,this.props.history),
               rowsPerPage: this.state.pageSize,
               download:false,
               page:this.state.page,
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
        </Grid>:
            <Grid id="UserSearch" item xs={12} style={{zIndex:"0",display:"none"}}>
         <MUIDataTable
            title="User List"
            data={this.state.getValue2.map(item =>{
              return [
                  item.userID.username,
                  item.userID.loginID,
                  item.userID.phone,
                  item.RoleID.RoleName,
                  item.userID.created_on.replace(/T|Z/g," "),
                  item.userID.created_by,
                  item.userID.userID,
                  item.userRoleID,
                  item.RoleID.RoleID,
                  item.userID.email,
                  item.userID.birthdate,
                  item.userID.gender.codeName,
                  item.userID.modified_by,
                  item.userID.modified_on,
                  item.userID.is_active.codeName,
                  <h4 style = {{color:states[this.finalStatus(item.userID.is_active.codeName).toLowerCase()]}}>{this.finalStatus(item.userID.is_active.codeName)}</h4>,
                  <h4 style = {{color:states[this.finalApproval(item.userID.is_active.codeName).toLowerCase()]}}>{this.finalApproval(item.userID.is_active.codeName)}</h4>,
            ]})}
           columns={headerList}
             options={{
               selectableRows:false,
               onRowClick:rowData=>func(rowData,this.props.history),
               rowsPerPage: this.state.pageSize,
               download:false,
               page:this.state.page,
               onDownload:true,
               print:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRows2 ,
                textLabels: {
                  body: {
                      noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                  },
                },
             }}
           />
        </Grid>
        }
      </Grid>
    </ErrorBoundary>
  );
 }
}

UsersPage.propTypes= {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsersPage);

function func(rowData,history)
{
  var data = [{
    "userRoleID":rowData[7] ,
    "RoleID":{
      "RoleID":rowData[8],
      "RoleName":rowData[3],
    },
    "userID":{
      "birthdate": rowData[10],
      "created_by": rowData[5],
      "created_on":rowData[4] ,
      "email": rowData[9],
      "gender":{codeName:rowData[11]},
      "is_active":{codeName:rowData[14]},
      "loginID":rowData[1],
      "modified_by":rowData[12],
      "modified_on":rowData[13],
      "phone":rowData[2],
      "userID":rowData[6],
      "username": rowData[0]
    }
  }]
  history.push({pathname:'/app/user/update',data:data})
}
