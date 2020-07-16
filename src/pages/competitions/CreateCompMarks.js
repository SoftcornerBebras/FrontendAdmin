import React,{Component, useEffect,useState} from "react";
import Grid from '@material-ui/core/Grid';
import PageTitle from "../../components/PageTitle/PageTitle";
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import {Button, Paper, Box, TextField, InputAdornment, Typography,FormHelperText, Divider} from '@material-ui/core';
import {Link} from 'react-router-dom';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {baseURL} from '../constants'

const styles = theme => ({
  formControl: {
    minWidth: 120
  },
  input: {
    display: "none"
  }
});

var selectedAge="",selectedAgeGroup,compInfo=[],
levels=[],
error_correct=[false,false,false],error_incorrect=[false,false,false];

class MarkingScheme extends React.PureComponent{

    constructor(props)
    {
      super(props);
      this.state = {
        ageGroups:[],
        compName:"",
        fromPage:"",
        compID:"",
        correctMarks:[],
        incorrectMarks:[],
        rerenderer:false,
        openError:false,
      }
    };


  async componentDidMount ()
  {

    selectedAgeGroup = this.props.location.selectedAgeGroup
     let gQuesLevel = await axios.get(baseURL+'api/com/getQuestionLevel/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });

     levels.length=0;
     for(let i = 0; i<gQuesLevel.data.length ; i++) {
        let x =gQuesLevel.data[i].codeName;
        levels.push({"id":(i+1).toString() , "name":x });
     }

     try {
        compInfo.length = 0
        if(this.props.location.data != undefined) {

          if(this.props.location.fromPage == "editDetails") {
        await axios.get(baseURL+'api/cmp/getMarksAgeCmpWise/'+selectedAgeGroup.AgeGroupID+"&"+this.props.location.compID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }).then(response =>{
                let marks=[]
                for(let i=0;i<response.data.length;i++){
                    marks.push(response.data[i])
                }
              for(let i=0;i<marks.length;i++){
                for(let j=i;j<marks.length;j++){
                    if(marks[j].questionLevelCodeID.codeName < marks[i].questionLevelCodeID.codeName){
                        let temp=marks[j]
                        marks[j]=marks[i]
                        marks[i]=temp
                    }
                }
              }
            let correctMrks=[],incorrectMrks=[];
            for(let i = 0; i<marks.length ; i++) {
            correctMrks.push(marks[i].correctMarks);
            incorrectMrks.push(marks[i].incorrectMarks);
            this.setState({correctMarks:correctMrks,incorrectMarks:incorrectMrks})
         }
          });

        }
          selectedAge = this.props.location.data[0].ageGroup
          compInfo.push({ name: "Type :", detail: this.props.location.data[0].type })
          compInfo.push({ name: "Start date :", detail: this.props.location.data[0].start })
          compInfo.push({ name: "End date  :", detail: this.props.location.data[0].end })
          compInfo.push({ name: "Time Limit (hh:mm)  : ", detail: this.props.location.data[0].time })
          compInfo.push({ name: "Bonus Marks  : ", detail: this.props.location.data[0].bonus })
          compInfo.push({ name: "Additional info  : ", detail: this.props.location.data[0].info })
          this.setState({compName:this.props.location.data[0].name,
            fromPage:this.props.location.fromPage,
            compID: this.props.location.compID
          })

        }
        if(this.props.location.data===undefined)this.props.history.push('/app/dashboard')
        }
        catch(error){
            this.props.history.push('/app/dashboard')
        }
  }

  handleCorrectMarks=(newValue, id)=>{
    this.setState({rerenderer:!this.state.rerenderer})
    error_correct[id] = false;
    let correctMrks = this.state.correctMarks
    correctMrks[id] = newValue;
    this.setState({correctMarks:correctMrks})
  };

  handleIncorrectmarks=(newValue, id)=>{
  if(!newValue.includes('-')){
     error_incorrect[id] = true;
  }else {
     error_incorrect[id] = false;
  }
     this.setState({rerenderer:!this.state.rerenderer})

    let incorrectMrks = this.state.incorrectMarks
    incorrectMrks[id] = newValue;
    this.setState({incorrectMarks:incorrectMrks})
  };

  onSubmit = () => {

    let flag=0
    for(let i=0;i <levels.length; i++) {
       if((this.state.correctMarks[i]) == null || (this.state.incorrectMarks[i]) == "") {
            error_correct[i]=true
            flag=1
       }
       if((this.state.incorrectMarks[i]) == null || (this.state.incorrectMarks[i]) == "" || error_incorrect[i]==true ) {
            error_incorrect[i]=true
            flag=1
       }

    }
    if(flag ==1) {
        this.setState({rerenderer:!this.state.rerenderer})
      return
    }

    if(this.state.fromPage == "createComp") {
      for(var i = 0; i < levels.length; i++){
      axios.post(
        baseURL+'api/cmp/insertMarkScheme/', {
          "competitionAgeID":{

                     "created_on": selectedAgeGroup.created_on,
                        "AgeGroupName": selectedAgeGroup.AgeGroupName

                },
                "CmpData":{
                    "competitionName":this.state.compName,
                    "startDate":compInfo[1].detail,
                    "cmptype":compInfo[0].detail
                },
                "questionLevelCodeID":{
                  "codeName":levels[i]
                },
                "correctMarks":this.state.correctMarks[i],
                "incorrectMarks":this.state.incorrectMarks[i]
        },{
          headers: {
              'Content-Type' : 'application/json',
              Authorization: 'Token '+localStorage.getItem('id_token')
          }
        }
      ).then(response =>{
      this.props.history.push({
        pathname: "/app/competitions/create/3/",
        data: compInfo,
        compName:this.state.compName,
        compID: this.state.compID,
        ageGroup: selectedAge,
        selectedAgeGroup:selectedAgeGroup,
        marks: {
          correctMarks:this.state.correctMarks,
          incorrectMarks:this.state.incorrectMarks
        },
        fromPage: "createComp"
      });
      }).catch(error => {
        this.setState({openError:true})
      });
    }
  }

    if(this.state.fromPage == "addNewGroup") {
        for(var i = 0; i < levels.length; i++){
          axios.post(
            baseURL+'api/cmp/insertMarkScheme/', {
              "competitionAgeID":{
                 "created_on": selectedAgeGroup.created_on,
                   "AgeGroupName": selectedAgeGroup.AgeGroupName
                    },
                    "CmpData":{
                        "competitionName":this.state.compName,
                        "startDate":compInfo[1].detail,
                        "cmptype":compInfo[0].detail
                    },
                    "questionLevelCodeID":{
                      "codeName":levels[i]
                    },
                    "correctMarks":this.state.correctMarks[i],
                    "incorrectMarks":this.state.incorrectMarks[i]
            },{
              headers: {
                  'Content-Type' : 'application/json',
                  Authorization: 'Token '+localStorage.getItem('id_token')
              }
            }
          ).then(response =>{
            this.props.history.push({
            pathname: "/app/competitions/update/3/",
            data: compInfo,
            compName:this.state.compName,
            compID: this.state.compID,
            ageGroup: selectedAge,
            selectedAgeGroup:selectedAgeGroup,
            marks: {
              correctMarks:this.state.correctMarks,
              incorrectMarks:this.state.incorrectMarks
            },
            fromPage: "addNewGroup"
          });
          }).catch(error => {
            this.setState({openError:true})
          });
        }
    }

    if(this.state.fromPage == "editDetails") {

      for(var i = 0; i < levels.length; i++){
          axios.post(
            baseURL+'api/cmp/updateMarks/', {
                "AgeID":selectedAgeGroup.AgeGroupID,
                "competitionID":this.state.compID,
                "queslevelcode":levels[i]['name'],
                "corrMarks":this.state.correctMarks[i],
                "incorrMarks":this.state.incorrectMarks[i]
            },{
              headers: {
                  'Content-Type' : 'application/json',
                  Authorization: 'Token '+localStorage.getItem('id_token')
              }
            }
          ).then(response =>{
          this.props.history.push({
            pathname: "/app/competitions/edit/3/",
            data: compInfo,
            compName:this.state.compName,
            selectedAgeGroup:selectedAgeGroup,
            compID: this.state.compID,
            ageGroup: selectedAge,
            marks: {
              correctMarks:this.state.correctMarks,
              incorrectMarks:this.state.incorrectMarks
            },
            fromPage: "editDetails"
           });
          }).catch(error => {
             this.setState({openError:true})
          });
      }
    };
  }

  handleClose = () => {
    this.setState({openError:false})
  }

  render() {
  const { classes } = this.props;

  return (

    <Paper style={{padding:"10px"}}>
    <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
    <div className="App">
        <Box p={1} flexGrow={1} m={1} bgcolor="#2196f3">
          <Typography
            variant="h5"
            style={{ color: "white" }}
            gutterBottom
            align="center"
          >
            {this.state.compName}
          </Typography>
        </Box>
        <Grid container spacing={1}>
          {compInfo.map(info => (
            <React.Fragment key={info.name}>
              <Grid item xs={6}>
                <Typography align="right" style={{fontSize:"18px"}} gutterBottom>
                  {info.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom style={{fontSize:"18px"}} align="left">
                  {info.detail}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Divider style={{marginTop:"2%"}}/>
        <Typography style={{marginTop:"1%", marginLeft:"36%"}} variant="h6"> Selected Age Group : {selectedAge} </Typography>
        <Box display="flex" flexDirection="row" p={1} m={1} >
          <Box p={1} m={1} style={{marginTop:"40px", marginLeft:"8%"}}>
          <Typography variant="h5" color='textSecondary' style={{marginLeft:"2%"}} >
            Levels:
            </Typography>
          </Box>
          <Box p={1} m={1} style={{marginTop:"40px"}}>
          <Typography variant="h5" color='textSecondary' style={{marginLeft:"30%",width:"300px"}}  >
            Correct Marks:
            </Typography>
          </Box>
          <Box p={1} m={1} style={{marginTop:"40px"}}>
          <Typography variant="h5" color='textSecondary' style={{marginLeft:"40%",width:"300px"}} >
            Incorrect Marks:
            </Typography>
          </Box>
        </Box>

        {levels.map((row,index)=> {return(
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginTop:"40px", marginLeft:"10%"}}>
        <Typography variant="h5" color='textSecondary' style={{marginLeft:"2%"}}  >
          {row.name}
          </Typography>
        </Box>
        <Box p={1} style={{marginTop:"30px"}}>
        <TextField
           id={row.id}
           label={error_correct[row.id-1]?"Enter Correct Marks":''}
           helperText={error_correct[row.id-1] ? 'Required* ' : ''}
           error={error_correct[row.id-1]}
           onChange={ e => this.handleCorrectMarks(e.target.value,row.id-1) }
           style={{marginLeft:'30%',width:'300px',display:'flex'}}
           placeholder="Enter Correct Marks"
           value={this.state.correctMarks[index]}
           variant="outlined"
           InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_correct?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }} />
        </Box>
        <Box p={1} style={{marginTop:"30px"}}>
        <TextField
           id={row.id+row.name}
           label={error_incorrect[row.id-1] ? "Enter Incorrect Marks":''}
           helperText={error_incorrect[row.id-1] ? 'Required* ' : ''}
           error={error_incorrect[row.id-1]}
           onChange={ e => this.handleIncorrectmarks(e.target.value,row.id-1) }
           style={{marginLeft:'50%',width:'300px',display:'flex'}}
           placeholder="Enter Incorrect Marks"
           value={this.state.incorrectMarks[index]}
           variant="outlined"
           InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_incorrect?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }} />
        </Box>
        </Box>
      )})}
      <Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginLeft:'84%',width:'150px'}}>
        Add Marks
      </Button>
    </div>
    </Paper>
  );
  }
}

MarkingScheme.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(MarkingScheme);

