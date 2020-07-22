import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from "../../images/map-redmarker.png";
import { arr } from './SchoolDetail';
import styled from 'styled-components';
import { EsriProvider } from 'leaflet-geosearch';
import {mapURL, metabaseURL,metabaseSecretKey} from '../constants'
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import GetAppIcon from '@material-ui/icons/GetApp';
import ErrorIcon from '@material-ui/icons/Error';
import RoomIcon from '@material-ui/icons/Room';
import './styles.css';

const Wrapper =styled.div`
  width: ${props=>props.width};
  height:${props=>props.height};
  `;

class Directions extends Component {
  
 async componentDidMount(){
  try{

    if(arr[0].AddressLine1 == "") this.props.history.push('/app/dashboard')

      var provider = new EsriProvider();

      var query_addr=arr[0].AddressLine1 +", "+arr[0].AddressLine2+", "+arr[0].City+", "+arr[0].District+", "+arr[0].State+", "+arr[0].Pincode;

      var results =  await provider.search({ query: query_addr });

      this.map =L.map('map',{
          center: [results[0].y,results[0].x],
          zoom:10,
          zoomControl:true,

        });

        L.tileLayer(mapURL,{
          maxZoom:20,
          maxNativeZoom:17
       },
      ).addTo(this.map);
    L.control.scale().addTo(this.map);
    var Icon = L.icon({
      iconUrl: markerIcon,
      iconSize:     [61, 70],
      shadowSize:   [50, 64],
      iconAnchor:   [22, 49],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -50]
  });
  L.marker([results[0].y,results[0].x], {icon:Icon}).addTo(this.map).bindPopup('<b>'+arr[0].schoolName+'</b>'+'<br></br>'+arr[0].AddressLine1+" "+arr[0].AddressLine2+" "+arr[0].City)
  }catch(error){this.props.history.push('/app/dashboard')}
}
render(){
 return(
  <React.Fragment>
  <Wrapper width="95%" height="90%" id="map" /> 
  <div className="sidenav" >
    <a href="#/app/school/directions" className="directions"><RoomIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Directions</a>
    <a href="#/app/school/ContactInfo" className="contact"><PhoneIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Contact Info</a>
    <a href="#/app/school/RegisteredBy" className="registeredBy" ><PersonIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Registered By</a>
    <a href="#/app/school/StudentDetails" className="studentsEnrolled" ><PeopleIcon style={{marginLeft:"-40px",marginRight:"20px"}}/>Student Details</a>
    <a href="#/app/school/download" className="download" ><GetAppIcon style={{marginLeft:"-40px",marginRight:"50px"}}/>Download</a>
  </div>
 </React.Fragment>
  )  
}
}

export default Directions
