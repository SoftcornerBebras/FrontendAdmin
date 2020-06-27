import React, { Component } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Paper, TextField, FormHelperText, Typography, InputAdornment, Box, Button, Snackbar} from '@material-ui/core';
import Select from 'react-select';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import {baseURL} from '../constants'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

var classes=''
var prevclasses=[];
var options=[];
var grpName=""

class UpdateGroup extends React.PureComponent {

  constructor(props){
    super(props)
    this.state={
        error_groupname:false,
        // groupname:"",
        error_class:false,
        error_lang:false,
        selectedOption:null,
        selectedLang:null,
        PrevClassList:[],
        classList:[],
        rerenderer:false,
        ageId:"",
        group:'',
        lang:'',
        openS1:false,
        openS2:false,
    }
  }
    handleCloseS1=(event,reason)=>{
      if (reason === 'clickaway') {
        return;
      }

      this.setState({openS1:false});
    }

    handleCloseS2=(event,reason)=>{
      if (reason === 'clickaway') {
        return;
      }

      this.setState({openS2:false});
    }
  async componentDidMount() {

    try{

        this.setState({ageId:this.props.location.data.split(',')[0]})
            // groupname:this.props.location.data.split(',')[1]})

        let gAgeClasses = await axios.get(baseURL + 'api/cmp/getClassAgeWise/'+this.props.location.data.split(',')[0]+'/',{
            headers:{
               'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }).catch(error => {
            this.setState({openS2:true})
        });
         this.setState({PrevClassList:gAgeClasses.data});

         prevclasses.length=0;
         for(let i = 0; i<this.state.PrevClassList.length ; i++) {
              let x =this.state.PrevClassList[i].ClassID.classNo;
              prevclasses.push({"value": x, "label": x });
        }
         this.setState({selectedOption:prevclasses})

         let gClasses = await axios.get(baseURL + 'api/com/getClasses/',{
            headers:{
               'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }).catch(error => {
            this.setState({openS2:true})
        });
         this.setState({classList:gClasses.data});
         options.length=0;
         for(let i = 0; i<this.state.classList.length; i++) {
              let x = this.state.classList[i].classNo;
              options.push({"value": x, "label": x });
        }
          grpName = this.props.location.data.split(',')[1].split("-")
          this.setState({group:grpName[0],lang:grpName[1]})
          this.setState({rerenderer:!this.state.rerenderer})
     }
     catch(error) {
        this.props.history.push('/app/dashboard')
     }
  }

  async fetchData() {
     await axios.post(
       baseURL+'api/cmp/updateAgeGrp/', {
	         "AgeID":this.state.ageId,
	         "AgeGroupName":this.state.group+"-"+this.state.lang,
	          "classes":classes
       },{
           headers: {
             'Content-Type' : 'application/json',
             Authorization: 'Token '+localStorage.getItem('id_token')
           }
       }
     ).then(response => {
         this.setState({openS1:true})
         setTimeout(()=>{this.props.history.push('/app/settings')},2000)
     }).catch(error => {
       this.setState({openS2:true})
      });

  }

    handleGroupNameChange=(newValue)=>{
        this.setState({group:newValue,error_groupname:false})
    }
    handleChange = selectedOption => {
        this.setState({ selectedOption,error_class:false });
         this.setState({rerenderer:!this.state.rerenderer})
    };
      handleChangeLang =(newValue)=> {
        this.setState({lang:newValue,error_groupname:false})
    };

    onSubmit=()=>{

       classes=[];
       if(this.state.group==''){
        this.setState({error_groupname:true})
       }
       if(this.state.selectedOption==null){
        this.setState({error_class:true})
       }
       else{
        for(var i=0;i<this.state.selectedOption.length;i++)
        {
                classes.push(this.state.selectedOption[i]['value'])
        }
        if(this.state.error_groupname == false && this.state.error_class == false)
        {
           grpName = this.state.group+"-"+this.state.lang
           this.fetchData()
        }
    }
  }

  render(){
    const customStyles={
        control:base=> ({
          ...base,
          height:'52px',
        })
      }
    return (
      <div>
       <PageTitle title="Update Age Group"/>
       <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS1} severity="success">
          Update Successful!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS2} severity="error">
          Error Occurred!
        </Alert>
      </Snackbar>
       <Paper elevation={3} style={{width:'1000px',margin:'100px'}}>
        <div>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginTop:"40px"}}>
        <Typography variant="h4" color='textSecondary'  >
          Group Name
          </Typography>
        </Box>
        <Box p={1} style={{marginTop:"30px"}}>
        <TextField
           id="outlined-textarea"
           label={this.state.error_groupname?"Enter Group Name":''}
           helperText={this.state.error_groupname ? 'Required* ' : ''}
           error={this.state.error_groupname}
           onChange={ e => this.handleGroupNameChange(e.target.value) }
           value={this.state.group}
           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter Group Name"
           multiline
           variant="outlined"
           InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_groupname?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}/>
        </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} >
        <Typography variant="h4" color='textSecondary'  >
         Language
          </Typography>
        </Box>
        <Box p={1} style={{marginLeft:'30px',width:'320px'}}>
       <TextField
           disabled
           id="outlined-textarea"
           value={this.state.lang}
           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter Language"
           variant="outlined"
           />
        </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} >
        <Typography variant="h4" color='textSecondary'  >
         Classes
          </Typography>
        </Box>
        <Box p={1} style={{marginLeft:'180px',width:'320px'}}>

        <Select  style={{color:"red"}}
        value={this.state.selectedOption}
        onChange={this.handleChange}
        options={options}
        placeholder="Select Classes..."
        isMulti={true}
      />
      {this.state.error_class?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
        </Box>
        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>

        <Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginLeft:'290px',width:'300px',display:'flex'}}>
        Update
      </Button>
     </Box>
     </Box>
        </div>
        </Paper>
       </div>
    );
  }
}
export default UpdateGroup;
