import React, { Component } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import {Link,Redirect} from 'react-router-dom';
import {baseURL, metabaseURL, metabaseSecretKey} from '../constants'
import axios from 'axios'

import ErrorBoundary from '../error/ErrorBoundary'

var jwt = require("jsonwebtoken");

//for users dashboard
var payloadUsers = {
  resource: { dashboard: 1 },
  params: {},
  // exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var tokenUsers = jwt.sign(payloadUsers, metabaseSecretKey);
var srcUsers = metabaseURL + "/embed/dashboard/" + tokenUsers + "#bordered=true&titled=true";

//for questions dashboard
var payload = {
  resource: { dashboard: 99 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcQuestions = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for competitions dashboard
var payload = {
  resource: { dashboard: 33 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcCompetitions = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for school groups dashboard
var payload = {
  resource: { dashboard: 98 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcSchoolGroups = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for school types dashboard
var payload = {
  resource: { dashboard: 97 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcSchoolTypes = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for competition results dashboard
var payload = {
  resource: { dashboard: 101 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcResults = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for districts dashboard
var payload = {
  resource: { dashboard: 66 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcDistricts = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for states dashboard
var payload = {
  resource: { dashboard: 65 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, metabaseSecretKey);
var srcStates = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

//for schools dashboard
var payload = {
  resource: { dashboard: 34 },
  params: {},
  //exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};

var token = jwt.sign(payload, metabaseSecretKey);
var srcSchools = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";
var cmp=''

class AnalysisPage extends Component {

   constructor(props) {
    super(props);
    this.state = {
         liveTitle:"",
         cmp:''
    }
    };
   async componentDidMount()
   {
        let gCmp = await axios.get(baseURL+'api/cmp/getCompetition/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        return <Redirect to='/app/dashboard' />
    });

     var date = new Date()
     var currdate = date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate() + " "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
     var date1 = new Date(currdate)

      for(let i = 0; i<gCmp.data.length ; i++) {
     if(date1>=new Date(gCmp.data[i].startDate.replace(/T|Z/g," ")) && date1<new Date(gCmp.data[i].endDate.replace(/T|Z/g," ")))
     {
          this.setState({liveTitle : gCmp.data[i].competitionName+" Live Analysis"})
         document.getElementById('Live').style.display="block"
         this.setState({cmp:(this.state.cmp+','+(gCmp.data[i].competitionID+":"+gCmp.data[i].competitionName))})
     }
     }
console.log(cmp)
   }
  render(){
   return (
      <ErrorBoundary>
    <PageTitle title='Analysis' />
    <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'4%'}}>

          <Box  p={1} m={1}style={{marginLeft:'15%'}} >
          <Tooltip title="Analytics of Admins, Students, School Coordinators" arrow >
           {/* <a href= {srcUsers} style={{textDecoration: 'none',color:"black"}}>  */}
           <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcUsers +"*"+'Users'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained"style={{width:"200px",height:"210%",backgroundColor:'#90CAF9'}}>
          <b>Users</b>
          </Button>
          </Link>
          {/* </a>   */}
          
           </Tooltip>
            </Box>
            <Box  p={1} m={1} style={{marginLeft:"-20px"}}>
            <Tooltip title="Analytics of various Schools" arrow >
            {/* <a href= {srcSchools} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcSchools +"*"+'Schools'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained"  style={{width:"200px",height:"210%",backgroundColor:'#90CAF9'}}>
          <b>Schools</b>
      </Button>
      </Link>
      {/* </a> */}
      </Tooltip>
            </Box>
            <Box  p={1} m={1} style={{marginLeft:"-20px"}}>
            <Tooltip title="Analytics of various Questions" arrow >
            {/* <a href= {srcQuestions} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcQuestions +"*"+'Questions'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained"  style={{width:"200px",height:"210%",backgroundColor:'#90CAF9'}}>
          <b>Questions</b>
      </Button>
      </Link>
      {/* </a> */}
      </Tooltip>

            </Box>
            <Box  p={1} m={1} style={{marginLeft:"-20px"}}>
            <Tooltip title="Analytics of various Competitions" arrow >
            {/* <a href= {srcCompetitions} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcCompetitions +"*"+'Competitions'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained" style={{width:"200px",height:"210%",backgroundColor:'#90CAF9'}}>
          <b>Competitions</b>
      </Button>
      {/* </a> */}
      </Link>
      </Tooltip>
            </Box>
            </Box>

            <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-1%'}}>
          <Box  p={1} m={1}style={{marginLeft:'15%'}} >
          <Tooltip title="Analytics of various States" arrow >
          {/* <a href= {srcStates} style={{textDecoration: 'none',color:"black"}}> */}
          <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcStates +"*"+'States'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained" style={{width:"200px",height:"210%",backgroundColor:'#BBDEFB'}}>
          <b>States</b>
      </Button>
      </Link>
      {/* </a> */}
      </Tooltip>
            </Box>
            <Box  p={1} m={1} style={{marginLeft:"-20px"}}>
            <Tooltip title="Analytics of various Districts" arrow >
            {/* <a href= {srcDistricts} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcDistricts +"*"+'Districts'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained"  style={{width:"200px",height:"210%",backgroundColor:'#BBDEFB'}}>
          <b>Districts</b>
      </Button>
      </Link>
      {/* </a> */}
      </Tooltip>
            </Box>
            <Box  p={1} m={1} style={{marginLeft:"-20px"}}>
            <Tooltip title="Analytics of School Types (Private, Govt.)" arrow >
            {/* <a href= {srcSchoolTypes} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcSchoolTypes +"*"+'School Types'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained"  style={{width:"200px",height:"210%",backgroundColor:'#BBDEFB'}}>
          <b>School Types</b>
      </Button>
      {/* </a> */}
      </Link>
      </Tooltip>
            </Box>
            <Box  p={1} m={1} style={{marginLeft:"-20px"}}>
            <Tooltip title="Analytics of School Groups (Khed etc.)" arrow >
            {/* <a href= {srcSchoolGroups} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcSchoolGroups +"*"+'School Groups'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained" style={{width:"200px",height:"210%",backgroundColor:'#BBDEFB'}}>
          <b>School Groups</b>
          </Button>
          {/* </a> */}
          </Link>
          </Tooltip>
            </Box>
            </Box>

            <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-1%'}}>
            <Box p={1} m={1} style={{marginLeft:'15.25%'}}>
            <Tooltip title="Analytics of Total Responses, Correct/Incorrect Responses, Time Taken " arrow >
            {/* <a href= {srcResults} style={{textDecoration: 'none',color:"black"}}> */}
            <Link to={{
             pathname: "/app/analysisRedirect",
              data : srcResults +"*"+'Results'
            }}
            style={{textDecoration: 'none',color:"black"}}>
           
          <Button variant="contained" id="totalResp" style={{width:"400px",height:"210%",backgroundColor:'#E3F2FD'}}>
          <b>Results</b>
        </Button>
        </Link>
        {/* </a> */}
        </Tooltip>
        </Box>
        <Box p={1} m={1} style={{marginLeft:'-17px'}}>
            <Tooltip title="Textual Analytics of Toppers" arrow >
            <Link to="/app/toppers" style={{textDecoration: 'none',color:"black"}}>
             <Button variant="contained" style={{width:"400px",height:"210%",backgroundColor:'#E3F2FD' }}>
            <b>Toppers</b>
            </Button>
            </Link>
            </Tooltip>
              </Box>
            </Box>

            <Box display="flex" flexDirection="row" p={1} m={1} style={{marginTop:'-1%'}}>
            <Box  p={1} m={1} style={{marginLeft:"15.5%"}}>
            {/* <a href= {srcLiveGraph} style={{textDecoration: 'none',color:"black"}}> */}           
            <Tooltip title={this.state.liveTitle} arrow>
            <Link to={{
             pathname: "/app/analysisRedirect",
              data :  this.state.cmp+"*"+'Live Analysis'
            }}
            style={{textDecoration: 'none',color:"black"}}>
          <Button id="Live" variant="contained"  style={{width:"800px",height:"210%",backgroundColor:'#E3F2FD',display:'none'}}>
        <b>Live Analysis</b>
      </Button>
      </Link>
      </Tooltip>
      {/* </a> */}
            </Box>
            </Box>
      </ErrorBoundary>
    );
  }
}
export default AnalysisPage;
