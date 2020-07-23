import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PageTitle from "../../components/PageTitle/PageTitle";
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {baseURL, metabaseURL, metabaseSecretKey} from '../constants'
import {Link,Redirect} from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';

var jwt = require("jsonwebtoken");
//for live graph

  var agegroup=[],agevalue=''
  var competition=[],cmpvalue=''

  
class AnalysisRedirect extends Component {
    constructor(props){
        super(props);
  
    console.log(this.props.location.data) 

    }
    state={
        src:'',
        title:'',
        agevalue:'',
        cmpvalue:'',
    }
    async componentDidMount(){
        agevalue=''
        cmpvalue=''
      
        try{
                this.setState({
                    src:this.props.location.data.split("*")[0],
                    title:this.props.location.data.split("*")[1]
                })
           
        
        if (this.props.location.data.split("*")[1]!="Live Analysis"){
          document.getElementById("progress").style.display="block"
          document.getElementById("Iframe").onload=function(){
          document.getElementById("progress").style.display="none"
    }
  }
        if (this.props.location.data.split("*")[1]=="Live Analysis"){
                document.getElementById("Iframe").style.display="none"
                document.getElementById("LiveCmp").style.display="block"
                document.getElementById("LiveAge").style.display="block"
                var data=this.props.location.data.split("*")[0]
                var arr=data.split(",")
                competition.length=0
                for(var i=0;i<arr.length;i++){
                    if(arr[i]!=""){
                    competition.push({"value":arr[i].split(":")[0],"label":arr[i].split(":")[1]})
                    }
                }
            }
        }
        catch(error) {
            
            this.props.history.push("/app/analysisPage")

        };
    }
    handleCompetitionChange=(newValue)=>{
        this.setState({cmpvalue:newValue})
        cmpvalue=newValue
        this.fetchAge()
    }

    handleAgeChange=(newValue)=>{
    this.setState({agevalue:newValue})
    agevalue=newValue
    //for live graph
    var payload = {
        resource: { dashboard: 100 },
        params: {
          "age_group":agevalue['label'],
          "competition": cmpvalue['label'],
          
        },
        
      };
      var token = jwt.sign(payload, metabaseSecretKey);
      var srcLiveGraph = metabaseURL + "/embed/dashboard/" + token + "#bordered=true&titled=true";
      this.setState({src:srcLiveGraph})
      document.getElementById("progress").style.display="block"
      this.sleep(2000).then(()=>{
      document.getElementById("Iframe").style.display="block"
      document.getElementById("Iframe").onload=function(){
      document.getElementById("progress").style.display="none"
      }
    })

    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    async fetchAge(){
        var cmp=cmpvalue['value'];
    
    agegroup.length=0;
    try{
      var getCompAge=await axios.get(
        baseURL+'api/cmp/getAgeCmpWise/'+ cmp+"/",{
            headers:{Authorization:"Token "+localStorage.getItem('id_token')}
        }
      );
    for(var i=0;i<getCompAge.data.AgeGrp.length;i++)
    {
      agegroup.push({"value":getCompAge.data.AgeGrp[i].AgeGroupID,"label":getCompAge.data.AgeGrp[i].AgeGroupName})
    }
    }
    catch(error){
        this.props.history.push("/app/analysisPage")
    }
}

    render(){
        return (
 <React.Fragment>
     <Box flexDirection="row" p={1} m={1} >
    <Box p={1} m={1} style={{marginTop:"-2%"}}>
    <Link to="/app/analysisPage" style={{textDecoration:"none"}}>
     <Button id="back" variant="contained" color="primary"  startIcon={<ArrowBackIcon />}>
         BACK
         </Button>
         </Link>
     </Box>
     <Box p={1} m={1} style={{marginLeft:"45%",marginTop:"-6%"}}>
     <PageTitle title={this.state.title} />
     </Box>
     </Box>
     <Box display="flex" flexDirection="row" >
       <Box id ="LiveCmp" p={1} m={1} style={{marginLeft:"30%",width:"25%",display:"none"}} >
     <Select

  value={cmpvalue}
  onChange={this.handleCompetitionChange}
  options={competition}
  placeholder="Select Competition.."

          />
          </Box>
          <Box id="LiveAge"p={1} m={1} style={{width:"25%",display:"none"}}>
     <Select

  value={agevalue}
  onChange={this.handleAgeChange}
  options={agegroup}
  placeholder="Select Age Group.."

          />
          </Box>
          </Box>
  <div id="progress" style={{display:"none"}}>
  <CircularProgress  variant='indeterminate' style={{color:'primary',marginLeft:"50%",marginTop:"20%"}}/>
  </div>
<iframe
    id="Iframe"
    src={this.state.src}
    frameborder="0"
    width="100%"
    height="200%"
    allowtransparency
></iframe> 

     </React.Fragment>

        )
    }
}
export default AnalysisRedirect;