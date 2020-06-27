import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import { arr } from './SchoolDetail';
import PageTitle from "../../components/PageTitle/PageTitle";
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import {Link} from 'react-router-dom';
import { render } from "react-dom";
import {baseURL} from "../constants"
import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260",//warning
  declined: "#FF5C93", //secondary
};
const headerList=["School Name","School Type","School Group","City","State","UDISE Code",{
  name:'Address1',
  options: {
      filter:false,
      viewColumns:false,
      display:false
  }},{
  name:'Address2',
  options: {
      filter:false,
      viewColumns:false,
      display:false
  }},{
    name:'District',
    options: {
        filter:false,
        viewColumns:false,
        display:false
    }},{
      name:'Country',
      options: {
          filter:false,
          viewColumns:false,
          display:false
      }},{
        name:'Phone',
        options: {
            filter:false,
            viewColumns:false,
            display:false
        }},{
          name:'Pincode',
          options: {
              filter:false,
              viewColumns:false,
              display:false
          }},{
            name:'SchoolID',
            options: {
                filter:false,
                viewColumns:false,
                display:false
            }},{
              name:'Latitude',
              options: {
                  filter:false,
                  viewColumns:false,
                  display:false
              }},{
                name:'Longitude',
                options: {
                    filter:false,
                    viewColumns:false,
                    display:false
                }},{
                  name:'RegisteredBy',
                  options: {
                      filter:false,
                      viewColumns:false,
                      display:false
                  }},{
                    name:'RegisteredOn',
                    options: {
                        filter:false,
                        viewColumns:false,
                        display:false
                    }},{
    name:"",
    options: {
        filter:false,
        viewColumns:false
    }
}];


var gresult
class School extends React.PureComponent {

constructor(props){
  super(props);
}
state={
  getValue:[],
  countRows:0,
  pageSize:10,
  nextLink:'',
  prevLink:'',
  openError:false,

}
    async  componentDidMount () {

    try{
        gresult = await axios.get(
        baseURL+'api/com/viewSchools/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}

        }
        );
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {
            this.setState(prev=>({getValue:[...prev.getValue,{
                    schoolID:gresult.data.results[i].schoolID,
                    schoolName: gresult.data.results[i].schoolName,
                    schoolTypeCode: gresult.data.results[i].schoolTypeCodeID.codeName,
                    schoolGroup: gresult.data.results[i].schoolGroupID.codeName,
                    city: gresult.data.results[i].addressID.city,
                    state:gresult.data.results[i].addressID.stateID.name,
                    udise:gresult.data.results[i].UDISEcode,
                    address1:gresult.data.results[i].addressID.line1,
                    address2:gresult.data.results[i].addressID.line2,
                
                    district:gresult.data.results[i].addressID.districtID.name,
                    country:gresult.data.results[i].addressID.countryID.nicename,
                    phone:gresult.data.results[i].phone,
                    pincode:gresult.data.results[i].addressID.pincode,
                    latitude:gresult.data.results[i].addressID.latitude,
                    longitude:gresult.data.results[i].addressID.longitude,
                    registeredBy:gresult.data.results[i].registered_By,
                    registeredOn:gresult.data.results[i].registered_On
               
                  }]}))
        }
        this.setState({countRows:gresult.data.count})
        this.setState({pageSize:gresult.data.page_size})
        this.setState({nextLink:gresult.data.links.next})
        this.setState({prevLink:gresult.data.links.previous})
        

    }catch(error){ this.props.history.push('/app/dashboard') }
  }

   async  handlePageChange(newValue) {

       if(this.state.nextLink!=null) {
        gresult = await axios.get(this.state.nextLink , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }).catch(error=>{this.setState({openError:true})});
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {
            this.setState(prev=>({getValue:[...prev.getValue,{
                    schoolID:gresult.data.results[i].schoolID,
                    schoolName: gresult.data.results[i].schoolName,
                    schoolTypeCode: gresult.data.results[i].schoolTypeCodeID.codeName,
                    schoolGroup: gresult.data.results[i].schoolGroupID.codeName,
                    city: gresult.data.results[i].addressID.city,
                    state:gresult.data.results[i].addressID.stateID.name,
                    udise:gresult.data.results[i].UDISEcode,
                    address1:gresult.data.results[i].addressID.line1,
                    address2:gresult.data.results[i].addressID.line2,

                    district:gresult.data.results[i].addressID.districtID.name,
                    country:gresult.data.results[i].addressID.countryID.nicename,
                    phone:gresult.data.results[i].phone,
                    pincode:gresult.data.results[i].addressID.pincode,
                    latitude:gresult.data.results[i].addressID.latitude,
                    longitude:gresult.data.results[i].addressID.longitude,
                    registeredBy:gresult.data.results[i].registered_By,
                    registeredOn:gresult.data.results[i].registered_On
                  }]}))
        }
        this.setState({countRows:gresult.data.count})
        this.setState({pageSize:gresult.data.page_size})
        this.setState({nextLink:gresult.data.links.next})
        this.setState({prevLink:gresult.data.links.previous})
      
      }
    }
    handleAlertClose=()=>{this.setState({openError:false})}
render(){
  return (
    <>
    <Snackbar open={this.state.openError} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
        onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
        <b>Error Occured!</b>
        </Alert>
    </Snackbar>
      <PageTitle title="School List"/>
      <Grid item xs={12}>
         <MUIDataTable
            title="School List"
            
            data={this.state.getValue.map(item => {
              return [
                  item.schoolName,
                  item.schoolTypeCode,
                  item.schoolGroup,
                  item.city,
                  item.state,
                  item.udise,
                  item.address1,
                  item.address2,
                  item.district,
                  item.country,
                  item.phone,
                  item.pincode,
                  item.schoolID,
                  item.latitude,
                  item.longitude,
                  item.registeredBy,
                  item.registeredOn,
          ]
         
          }
          
          )}
          
          columns={headerList}
             options={{
               selectableRows:false,
               download:false,
               rowsPerPage: this.state.pageSize,
               onRowClick:rowData=>func({rowData},this.props.history),
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
export default School;


function func({rowData},history)
{
 arr[0].schoolName=rowData[0];
 arr[0].schoolType=rowData[1];
 arr[0].UDISECode=rowData[5];
 arr[0].Phone=rowData[10];
 arr[0].Pincode=rowData[11];
 arr[0].State=rowData[4];
 arr[0].AddressLine1=rowData[6];
 arr[0].AddressLine2=rowData[7];
 arr[0].Country=rowData[9];
 arr[0].schoolGroup=rowData[2];
 arr[0].District=rowData[8];
 arr[0].City=rowData[3];
 arr[0].schoolID=rowData[12];
 arr[0].latitude=rowData[13];
 arr[0].longitude=rowData[14];
 arr[0].registeredBy=rowData[15];
 arr[0].registeredOn=rowData[16];
  history.push("/app/school/school-detail")
}
