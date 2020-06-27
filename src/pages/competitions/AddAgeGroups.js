import React, { Component } from 'react';

import PageTitle from "../../components/PageTitle/PageTitle";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {Paper, TextField, FormHelperText, Typography, InputAdornment, Box, Button, Snackbar} from '@material-ui/core';
import Select from 'react-select';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios'
import {baseURL} from '../constants'
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

var languages=[];
var grpName="";
var options=[];
class AddGroup extends React.PureComponent {

    state={
        error_groupname:false,
        groupname:'',
        error_class:false,
        error_lang:false,
        selectedOption:null,
        selectedLang:null,
        openS1:false,
        openS2:false,
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

    let gLanguage = await axios.get(baseURL+'api/com/getLanguage/',{
        headers:{
           'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openS2:true})
    });
     languages.length=0;
     for(let i = 0; i<this.state.languagesList.length ; i++) {
          let x =this.state.languagesList[i].codeName;
          languages.push({"value": x, "label": x });
    }
     let gClasses = await axios.get(baseURL+'api/com/getClasses/',{
        headers:{
           'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openS2:true})
    });
     options.length=0;
     for(let i = 0; i<gClasses.data.length; i++) {
          let x = gClasses.data[i].classNo;
          options.push({"value": x, "label": x });
    }
  }catch(error){this.props.history.push('/app/dashboard')}
  }

  async fetchData() {

    for(let i=0; i< this.state.selectedOption.length ; i++) {

      await axios.post(
        baseURL+'api/cmp/insertAgeGroups/', {
        "AgeGroupID":
	    {
		 "AgeGroupName":grpName
	    },
	    "ClassID":
	     {
		 "classNo":this.state.selectedOption[i].value
	     }
        },{
            headers: {
              'Content-Type' : 'application/json',
              Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }
      ).then(response => {
          this.setState({openS1:true})
          setTimeout(()=>{this.props.history.push('/app/dashboard')},2000)
      }).catch(error => {
        this.setState({openS2:true})
      });
    }
  }

    handleGroupNameChange=(newValue)=>{
        this.setState({groupname:newValue,error_groupname:false})

    }
    handleChange = selectedOption => {
        this.setState({ selectedOption,error_class:false });
    };
      handleChangeLang = selectedLang => {
        this.setState({ selectedLang,error_lang:false });
    };

    onSubmit=()=>{

       if(this.state.groupname==''){
        this.setState({error_groupname:true})
       }
       if(this.state.selectedLang==null){
            this.setState({error_lang:true})
       }
       else{
       if(this.state.selectedOption==null){
        this.setState({error_class:true})
        return
       }
        if(this.state.error_groupname == false && this.state.error_class == false && this.state.error_lang == false)
        {
           grpName = this.state.groupname+"-"+this.state.selectedLang.value
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
       <PageTitle title="New Group"/>
       <Snackbar open={this.state.openS1} autoHideDuration={3000} onClose={this.handleCloseS1} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS1} severity="success">
          Age Group Added Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openS2} autoHideDuration={3000} onClose={this.handleCloseS2} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleCloseS2} severity="error">
          Error Occurred!
        </Alert>
      </Snackbar>
       <Paper elevation={3} style={{width:'1000px',margin:'80px'}}>
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
        <Box p={1} style={{marginLeft:'160px',width:'320px'}}>

        <Select  style={{color:"red"}}
        //styles={customStyles}
        value={this.state.selectedLang}
        onChange={this.handleChangeLang}
        options={languages}
        placeholder="Select Language..."
      />
      {this.state.error_lang?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
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
        //styles={customStyles}
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
        Add New Group
      </Button>
     </Box>
     </Box>
        </div>
        </Paper>
       </div>
    );
  }
}
export default AddGroup;
