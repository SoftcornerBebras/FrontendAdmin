import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from "../../images/map-redmarker.png";
import axios from 'axios';
import { EsriProvider } from 'leaflet-geosearch';
import styled from 'styled-components';
import {baseURL,mapURL} from '../constants'
import {Redirect} from 'react-router-dom'

const locArrayBackend=[];

const Wrapper =styled.div`
  width: ${props=>props.width};
  height:${props=>props.height};
  `;

export default class Maps extends Component {
  state={
    schools:[]
  }
  async componentDidMount(){

    try{
      let gresultSchools = await axios.get(
      baseURL+'api/com/getSchool/', {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
      );
      this.setState({schools:gresultSchools.data})
    }
    catch(error){
        return <Redirect to='/app/dashboard' />
    }
    try{
      let gresult = await axios.get(
      baseURL+'api/com/getAddress/', {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
      }
      );

      var provider = new EsriProvider();
      var query_addr=''
      for(let i=0;i<gresult.data.length;i++){
        query_addr=gresult.data[i].line1+", "+gresult.data[i].line2+", "+gresult.data[i].city+", "+gresult.data[i].districtID.name+", "+gresult.data[i].stateID.name+", "+gresult.data[i].pincode;
        var results =  await provider.search({ query: query_addr });
        let  x=results[0].y;
        let y=results[0].x;
      locArrayBackend.push({"value": [x,y] , "label": this.state.schools[i].schoolName,"address":gresult.data[i].line1+" "+gresult.data[i].line2 +" "+gresult.data[i].city})
      }
    }
    catch(error){
        return <Redirect to='/app/dashboard' />
    }
    finally{
      this.map =L.map('map',{
        center: [22.9734,78.6569],
        zoom:5,
        zoomControl:true
      });
    L.tileLayer(mapURL,{
      maxZoom:20,
      maxNativeZoom:17
    },
    ).addTo(this.map);

    var Icon = L.icon({
      iconUrl: markerIcon,
      iconSize:     [61, 70], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 49], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -50] // point from which the popup should open relative to the iconAnchor
  });
  for(var i=0;i<locArrayBackend.length;i++)
  {
    L.marker(locArrayBackend[i].value, {icon:Icon}).addTo(this.map).bindPopup('<b>'+locArrayBackend[i].label+'</b>'+'<br></br>'+locArrayBackend[i].address)
  }
  }

   }
render(){
  return <Wrapper width="1280px" height="720px" id="map" />
}
}
