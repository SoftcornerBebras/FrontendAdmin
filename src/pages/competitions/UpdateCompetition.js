import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Link from "@material-ui/core/Link";
import Tooltip from '@material-ui/core/Tooltip';
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Backdrop from '@material-ui/core/Backdrop';
import {Redirect} from 'react-router-dom';
import ErrorBoundary from '../error/ErrorBoundary'
import Alert from '@material-ui/lab/Alert'; 
import {TextField,Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar,CircularProgress} from '@material-ui/core';
import axios from 'axios'
import {baseURL} from '../constants'
import DateTimePicker from 'react-datetime-picker';

const compInfo = [{ name: "", start: "", end: "", info: "", type:"", time:"", ageGroup:"", bonus:"",hh:"00",mm:"00"}];

const hrs = ["01", "02", "03", "04", "05","06","07","08","09","10","11", "12", "13", "14", "15","16","17","18","19","20","21", "22", "23"];
const mins = ["01", "02", "03", "04", "05","06","07","08","09","10","11", "12", "13", "14", "15","16","17","18","19","20","21", "22", "23", "24", "25","26","27","28","29","30","31", "32", "33", "34", "35","36","37","38","39","40","41", "42", "43", "44", "45","46","47","48","49","50","51", "52", "53", "54", "55","56","57","58","59"];

const useStyles = theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginLeft: "160px",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      width:'800px',
      marginTop: theme.spacing(6),
      marginLeft: "10%",
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});

var ageGroupData=[]
var selectedAgeGroup="", ageGroupValue=[]
let ageGrpsPrev = [], ageGroups = [];
class CreateCompetition extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      startDate: new Date(),
      endDate: new Date(),
      compID: "",
      time:"",
      ages:[],
      compType:"",
      edit:false,
      fromPage:"",
      bonus:"",
      cmpTypes:[],
      duration:"00",
      durationMins:"00",
      openprogress:false,
      compStarted:false,
    };
  };

  async componentDidMount() {

    this.setState({openprogress:true})

    try {
        let gcmpType = await axios.get(baseURL+'api/com/getCmpTypes/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });

     let types = []
     for(let i = 0; i<gcmpType.data.length ; i++) {
        types.push(gcmpType.data[i].codeName);
    }
    this.setState({cmpTypes:types});

        if(this.props.location.fromPage == 'addNewGroup') {
            this.setState({fromPage:this.props.location.fromPage,edit:true})
          let ageGrpsPrev = this.props.location.prevAges

           let gAgeGroup = await axios.get(baseURL+'api/cmp/viewAgeGroup/',{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }).catch(error => {
          this.setState({openError:true})
        });
          ageGroups = gAgeGroup.data
          for(let i=0; i< ageGrpsPrev.length ; i++) {
            for(let j=0; j< ageGroups.length; j++ ) {
              if(ageGroups[j].AgeGroupID == ageGrpsPrev[i].AgeGroupID){
                ageGroups.splice(j,1)
                break
              }
            }
          }
          let toShowAgeGroup= []
          for(let i=0; i< ageGroups.length;i++){
            toShowAgeGroup.push(ageGroups[i].AgeGroupName)
          }
          ageGroupData = toShowAgeGroup
          this.setState({ages:toShowAgeGroup})
        }
        if(this.props.location.fromPage == 'editDetails') {

          this.setState({fromPage:this.props.location.fromPage,edit:false})
           ageGrpsPrev = this.props.location.prevAges

          let toShowAgeGroup= []
          for(let i=0; i< ageGrpsPrev.length;i++){
            toShowAgeGroup.push(ageGrpsPrev[i].AgeGroupName)
          }

          ageGroupData = toShowAgeGroup
          this.setState({ages:toShowAgeGroup})

        }
        if(this.props.location.data != undefined) {

          compInfo[0].name = this.props.location.compName
          compInfo[0].info = this.props.location.data[4].detail
          compInfo[0].type = this.props.location.data[0].detail
          compInfo[0].time = this.props.location.data[3].detail
          compInfo[0].hh = compInfo[0].time.substring(0,2)
          compInfo[0].mm = compInfo[0].time.substring(3,)
          compInfo[0].start = this.props.location.data[1].detail
          compInfo[0].end = this.props.location.data[2].detail

          let today = new Date()

          let timer = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " "
           + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          let startTime = new Date(compInfo[0].start)
          let currTime = new Date(timer)

          if(currTime >= startTime && compInfo[0].type=='Main Challenge') {
            this.setState({compStarted:true})
          }

          if(localStorage.getItem("addedNewGrp") === "true") {
            compInfo[0].ageGroup = this.props.location.data[0].detail
            compInfo[0].bonus = this.props.location.data[5].detail
            localStorage.removeItem("addedNewGrp")
          }

          this.setState({compID : this.props.location.compID,  
            compType: compInfo[0].type,
            time: compInfo[0].time,
            startDate: new Date(compInfo[0].start),
            endDate: new Date(compInfo[0].end),
            duration:compInfo[0].hh,
            durationMins:compInfo[0].mm,
            bonus:compInfo[0].bonus
          })
        }
   }
   catch(error){
      this.props.history.push('/app/dashboard')
   }
   this.setState({openprogress:false})
  };

  handleChangeDuration = event => {
    this.setState({duration:event.target.value});
    compInfo[0].hh = event.target.value;
  };
  handleChangeDurationMins = event => {
    this.setState({durationMins:event.target.value});
    compInfo[0].mm = event.target.value;
  };

  handleChangeBonus = value => {
    if (value == "") {
      document.getElementById("errMarks").style.display = "block";
    } else {
      document.getElementById("errMarks").style.display = "none";
      compInfo[0].bonus = value
    }
    this.setState({bonus:value})
  };
  handleChange = event => {
    this.setState({compType:event.target.value})
    compInfo[0].type=event.target.value;
    document.getElementById("errType").style.display = "none";
  };

  handleUpdate = () => {

    compInfo[0].time = compInfo[0].hh + ":" + compInfo[0].mm
    this.setState({time:compInfo[0].time})

    const startDateString =
      this.state.startDate.getFullYear() +
      "-" +
      (this.state.startDate.getMonth() + 1) +
      "-" +
      this.state.startDate.getDate() + " " +
      this.state.startDate.getHours() + ":" +
      this.state.startDate.getMinutes() + ":" +
      this.state.startDate.getSeconds();
    compInfo[0].start = startDateString;

    const endDateString =
      this.state.endDate.getFullYear() +
      "-" +
      (this.state.endDate.getMonth() + 1) +
      "-" +
      this.state.endDate.getDate() + " " +
      this.state.endDate.getHours() + ":" +
      this.state.endDate.getMinutes() + ":" +
      this.state.endDate.getSeconds();;
    compInfo[0].end = endDateString;

    var anyError = "";
    const errIndi = this.validateRange();

    if (errIndi == "error") {
      document.getElementById("err2").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("err2").style.display = "none";
    }
    if (compInfo[0].name == "") {
      document.getElementById("err").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("err").style.display = "none";
    }
    if (compInfo[0].type == "") {
      document.getElementById("errType").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("errType").style.display = "none";
    }
    if (compInfo[0].ageGroup == "" ) {
      document.getElementById("errAgeGroups").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("errAgeGroups").style.display = "none";
    }
    if (compInfo[0].bonus == "") {
      document.getElementById("errMarks").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("errMarks").style.display = "none";
    }

    if (anyError == "") {

      if(compInfo[0].info ==="")compInfo[0].info="-"

    try{

      if(this.state.fromPage == "addNewGroup") {
          axios.post(baseURL+'api/cmp/insertCmpAge/', {
                "AgeGroupClassID":
                {
                    "AgeGroupID":
                    {
                        "AgeGroupName":selectedAgeGroup.AgeGroupName,
                        "created_on":selectedAgeGroup.created_on
                    }
                },
             "competitionID":{
                "competitionName":compInfo[0].name,
                "startDate":compInfo[0].start,
                "competitionType":{
                    "codeName":compInfo[0].type
                }
               },
               "defaultBonusMarks":compInfo[0].bonus
            },{
              headers: {
                  'Content-Type' : 'application/json',
                  Authorization: 'Token '+localStorage.getItem('id_token')
              }
            }
          ).then(response =>{
            if(compInfo[0].info ==="-")compInfo[0].info=""
            this.props.history.push({
             pathname: "/app/competitions/update/2/",
              data: compInfo,
              compID: this.state.compID,
              fromPage: "addNewGroup",
              ageGrpsPrev:ageGrpsPrev,
              selectedAgeGroup:selectedAgeGroup,
            });
          })
      }
      if(this.state.fromPage == "editDetails") {
        
      axios.post(baseURL+'api/cmp/updateCmp/',{
        "CompetitionData":{
          "competitionName":this.state.compName,
          "competitionInfo":compInfo[0].info,
          "startDate":compInfo[0].start,
          "endDate":compInfo[0].end,
          "testDuration":compInfo[0].time,
          "competitionType":{
            "codeName":compInfo[0].type
          }
        },
        "CompetitionID":this.state.compID,
        "bonus":compInfo[0].bonus,
        "agedata":{
          "ageid":selectedAgeGroup.AgeGroupID,
          "agename":selectedAgeGroup.AgeGroupName
        }
      },{
          headers: {
              'Content-Type' : 'application/json',
              Authorization: 'Token '+localStorage.getItem('id_token')
          }
        }
      ).then(response =>{
        if(compInfo[0].info ==="-")compInfo[0].info=""

        if(this.state.compStarted == true){
          this.props.history.push("/app/competition")
        } else {
          this.props.history.push({
            pathname: "/app/competitions/edit/2/",
            data: compInfo,
            ageGrpsPrev:ageGrpsPrev,
            selectedAgeGroup:selectedAgeGroup,
            compID: this.state.compID,
            fromPage: "editDetails"
          });
        }
      })
      }
    }catch(error){
        this.setState({openError:true})
      }
    }
  };

  validateRange = () => {
    if (this.state.startDate.getFullYear() > this.state.endDate.getFullYear()) return "error";
    else if (this.state.startDate.getFullYear() == this.state.endDate.getFullYear()) {
      if (this.state.startDate.getMonth() > this.state.endDate.getMonth()) return "error";
      else if (this.state.startDate.getMonth() == this.state.endDate.getMonth()) {
        if (this.state.startDate.getDate() > this.state.endDate.getDate()) return "error";
      }
    }
  };

  handleChangeName = value => {
    if (value == "") {
      document.getElementById("err").style.display = "block";
    } else {
      document.getElementById("err").style.display = "none";
      compInfo[0].name = value
    }
  };

  handleChangeInfo = value => {
    compInfo[0].info = value;
  };

  handleChangeAges = (event, value) => {
    compInfo[0].ageGroup = value;
    if (compInfo[0].ageGroup== "") {
      document.getElementById('errAgeGroups').style.display = "block";
    } else {
      document.getElementById('errAgeGroups').style.display = "none";
    }


    for(let i=0; i< ageGroupData.length; i++) {
     if(this.state.fromPage == "addNewGroup") {
      for(let i=0; i< ageGroups.length; i++) {
        if(value == ageGroups[i].AgeGroupName ) {
          selectedAgeGroup  = ageGroups[i]
        }
      }
    }

    if(this.state.fromPage == "editDetails") {
      for(let i=0; i< ageGrpsPrev.length; i++) {
        if(value == ageGrpsPrev[i].AgeGroupName) {
          selectedAgeGroup  = ageGrpsPrev[i]
          this.setState({bonus:ageGrpsPrev[i].bonus})
          compInfo[0].bonus = ageGrpsPrev[i].bonus
          document.getElementById("errMarks").style.display = "none";
          break
        }
      }
    }
    }
  };

  handleBack = ()=> {
    var data=[{
      competitionID: this.state.compID,
      competitionInfo: compInfo[0].info,
      competitionName: compInfo[0].name,
      competitionType:{
        codeName: compInfo[0].type},
      endDate: compInfo[0].end,
      startDate: compInfo[0].start,
      testDuration: compInfo[0].time+":00",
    }]

    this.props.history.push({
      pathname:'/app/competitions/info',
      data:data[0]
    })
  }

  render() {

    const {classes} = this.props;
    ageGroupValue = compInfo[0].ageGroup

    if(this.props.location.data != undefined){
      compInfo[0].time = this.props.location.data[3].detail
    }
    return (
      <ErrorBoundary>
         <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>

      <Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        onClick={this.handleBack }><ArrowBack/> Back </Button>

        {this.state.onClickAge? <Redirect to="/app/competitions/addGroups" /> : null}
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="h5" align="center">
              Competition Details
            </Typography>
            <React.Fragment>
              <React.Fragment>
                <p />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      disabled={this.state.edit}
                      required
                      id="compName"
                      label="Competition Name"
                      onChange={e => this.handleChangeName(e.target.value)}
                      fullWidth
                      defaultValue = {compInfo[0].name}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <FormHelperText
                      id="err"
                      style={{
                        color: "red",
                        marginLeft: "13px",
                        display: "none"
                      }}
                    >
                      Required*
                    </FormHelperText>
                  </Grid>
                </Grid>
              </React.Fragment>

              <div style={{ padding: 20 }}>
                <Grid container justify="space-around">
                  <Grid item xs={6}>
                    Start date:{" "}
                    <DateTimePicker
                        onChange={date => this.setState({startDate:date})}
                        value={this.state.startDate}
                        disabled={this.state.edit}
                      />
                  </Grid>
                  <Grid item xs={6}>
                    End date:{" "}
                    <DateTimePicker
                      value={this.state.endDate}
                      disabled={this.state.edit}
                      onChange={date => this.setState({endDate:date})}
                    />
                  </Grid>
                </Grid>
                <FormHelperText
                  id="err2"
                  style={{ color: "red", alignItems: "center", display: "none" }}
                >
                  Enter valid date range*
                </FormHelperText>
              </div>
              <div style={{ padding: 20 }}>
                <Grid container spacing={3} justify="space-around">
                  <Grid item align="right" xs={6}>
                    <InputLabel id="demo-simple-select-label">
                      Competition type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      style={{width:"180px"}}
                      value={this.state.compType}
                      disabled={this.state.edit}
                      onChange={this.handleChange}
                    >
                      {this.state.cmpTypes.map(typ => {return (
                      <MenuItem value={typ}>{typ}</MenuItem>
                       )})}
                    </Select>
                    <FormHelperText
                      id="errType"
                      align="right"
                      xs={6}
                      style={{ color: "red", display: "none" }}
                    >
                      Select Type
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={6}>
                  <InputLabel id="demo-simple-select-label">
                    Duration (hh:mm)
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.duration}
                    onChange={this.handleChangeDuration}
                  > 
                    <MenuItem value={"00"}>00</MenuItem>
                    {hrs.map(info => (
                      <MenuItem value={info}>{info}</MenuItem>
                    ))} 
                  </Select>
                  <b>:</b>&nbsp;&nbsp;
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.durationMins}
                    onChange={this.handleChangeDurationMins}
                  >
                    <MenuItem value={"00"}>00</MenuItem>
                    {mins.map(info => (
                      <MenuItem value={info}>{info}</MenuItem>
                    ))}    
                  </Select>
                </Grid>
                </Grid>
              </div>
              <Grid container spacing={3}>
              <Grid item xs={8}>
                <Autocomplete
                  id="autoMul"
                  options={this.state.ages}
                  getOptionLabel={option => option}
                  onChange={this.handleChangeAges}
                  defaultValue={ageGroupValue}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      id="ageGroups"
                      label="Age Groups"
                      placeholder="Select Age Group To Edit"
                      fullWidth
                    />
                  )}
                />
                <FormHelperText
                  id="errAgeGroups"
                  style={{ color: "red", marginLeft: "13px", display: "none" }}
                >
                  Required*
                </FormHelperText>
              </Grid>
              <Grid item xs={4}>
                <Tooltip title="Default Marks that'll be added for all Students" arrow>
                <TextField
                  id="bonusMarks"
                  label="Bonus Marks"
                  onChange={e => this.handleChangeBonus(e.target.value)}
                  value={this.state.bonus}
                  fullWidth />
                  </Tooltip>
                <FormHelperText
                  id="errMarks"
                  style={{
                    color: "red",
                    marginLeft: "13px",
                    display: "none"
                  }}
                >
                  Required*
                </FormHelperText>
              </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    disabled={this.state.edit}
                    id="compDesc"
                    label="Additional Information (if any)"
                    onChange={e => this.handleChangeInfo(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    defaultValue={compInfo[0].info}
                  />
                </Grid>
              </Grid>

              <React.Fragment>
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleUpdate}
                    className={classes.button}
                  >
                    {this.state.fromPage=="editDetails" ? (this.state.compStarted ? <>Save</> : <>Next</>) : <>Add </>}
                  </Button>
                </div>
              </React.Fragment>
            </React.Fragment>
          </Paper>
        </main>
        <Backdrop className={classes.backdrop}  open={this.state.openprogress}  >
          <CircularProgress  color="primary" />
          <Typography component="h1" style={{color:"black"}}><b> Please Wait..</b></Typography>
        </Backdrop>
      </ErrorBoundary>
    );
  }
}

export default (withStyles)(useStyles)(CreateCompetition);
