import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {Redirect} from 'react-router-dom';
import ErrorBoundary from '../error/ErrorBoundary'
import Alert from '@material-ui/lab/Alert'; 
import {TextField,Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar,CircularProgress} from '@material-ui/core';
import axios from 'axios'
import {baseURL} from '../constants'
import DateTimePicker from 'react-datetime-picker';

const compInfo = [{ name: "", start: "", end: "", info: "", type:"", time:"", ageGroup:"", bonus:""}];

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
  }
});

var ageGroupData=[]
export var selectedAgeGroupUpdate="", selectedAgeGroupEdit="";
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
    };
  };

  async componentDidMount() {
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
              compInfo[0].start = this.props.location.data[1].detail
              compInfo[0].end = this.props.location.data[2].detail

              this.setState({compID : this.props.location.compID,
                compType: compInfo[0].type,
                time: compInfo[0].time,
                startDate: new Date(compInfo[0].start),
                endDate: new Date(compInfo[0].end)
              })
            }
       }
       catch(error){
          this.props.history.push('/app/dashboard')
       }
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

    this.setState({time:document.getElementById('time').value})
    compInfo[0].time = document.getElementById('time').value;

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
     if (compInfo[0].time.length <= 3) {
      document.getElementById("errTime").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("errTime").style.display = "none";
    }

    if (compInfo[0].type == "") {
      document.getElementById("errType").style.display = "block";
      anyError = "yes";
    } else {
      document.getElementById("errType").style.display = "none";
    }
    if (compInfo[0].ageGroup == "") {
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
      if(this.state.fromPage == "addNewGroup") {
              axios.post(
            baseURL+'api/cmp/insertCmpAge/', {
                "AgeGroupClassID":
                {
                    "AgeGroupID":
                    {
                        "AgeGroupName":selectedAgeGroupUpdate.AgeGroupName,
                        "created_on":selectedAgeGroupUpdate.created_on
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
            this.props.history.push({
             pathname: "/app/competitions/update/2/",
              data: compInfo,
              compID: this.state.compID,
              fromPage: "addNewGroup"
            });
          }).catch(error => {
            this.setState({openError:true})
          });
      }
      if(this.state.fromPage == "editDetails") {
        this.props.history.push({
          pathname: "/app/competitions/edit/2/",
          data: compInfo,
          compID: this.state.compID,
          fromPage: "editDetails"
        });
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

          selectedAgeGroupUpdate  = ageGroups[i]
        }
      }
    }
    if(this.state.fromPage == "editDetails") {
      for(let i=0; i< ageGrpsPrev.length; i++) {
        if(value == ageGrpsPrev[i].AgeGroupName) {
          selectedAgeGroupEdit  = ageGrpsPrev[i]
          this.setState({bonus:ageGrpsPrev[i].bonus})
          compInfo[0].bonus = ageGrpsPrev[i].bonus
          document.getElementById("errMarks").style.display = "none";
          break
        }
      }
    }
    }
  };

  render() {

    const {classes} = this.props;
    compInfo[0].time = this.props.location.data[3].detail
    return (
      <ErrorBoundary>
         <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
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
                    <TextField
                      id="time"
                      label="Duration(hh:mm)"
                      type="time"
                      defaultValue={compInfo[0].time}
                      className={classes.textField}
                      disabled={this.state.edit}
                      onChange={()=>{document.getElementById("errTime").style.display = "none"}}
                      InputLabelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        step: 300 // 5 min
                      }}
                    />
                    <FormHelperText
                      id="errTime"
                      style={{ color: "red", alignItems: "center", display: "none" }}
                    >
                      Enter Time Duration
                    </FormHelperText>
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
                <TextField
                  required
                  id="bonusMarks"
                  label="Bonus Marks"
                  onChange={e => this.handleChangeBonus(e.target.value)}
                  value={this.state.bonus}
                  fullWidth />
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
                    id="compName"
                    label="Additional Information (if any)"
                    onChange={e => this.handleChangeInfo(e.target.value)}
                    fullWidth
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
                    {this.state.fromPage=="editDetails" ? <>Next</> : <>Add </>}
                  </Button>
                </div>
              </React.Fragment>
            </React.Fragment>
          </Paper>
        </main>
      </ErrorBoundary>
    );
  }
}

export default (withStyles)(useStyles)(CreateCompetition);
