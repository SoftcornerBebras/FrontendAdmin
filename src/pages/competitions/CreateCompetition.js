import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {Redirect} from 'react-router-dom';
import axios from 'axios'
import {TextField,Snackbar,Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, CircularProgress} from '@material-ui/core';
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
      //width: 600,
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

var ageGroupData=[];
export var selectedAgeGroup;
class CreateCompetition extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      startDate: new Date(),
      endDate: new Date(),
      compType: "",
      redirect:false,
      onClickAge:false,
      time:"",
      ages:[],
      cmpTypes:[],
    };
  };

  async componentDidMount() {
    try{
    let gAgeGroup = await axios.get(baseURL+'api/cmp/viewAgeGroup/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });
    let ageGroups = []
    for(let i = 0; i<gAgeGroup.data.length ; i++) {
        ageGroups.push(gAgeGroup.data[i].AgeGroupName);
    }
    ageGroupData = gAgeGroup.data;
    if(gAgeGroup.data != "Redirect") {
      this.setState({ages:ageGroups});
    } else {
      this.setState({redirect:true})
    }
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
  }catch(err){this.props.history.push('/app/dashboard')}
  };

  displayAlertAgeGroups = () => {
    return (
      <React.Fragment>
       <Dialog open={this.state.redirect} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Age Groups have not been created for this year.
              You will be redirected to "Create Age Groups" page. </Typography>
            </DialogContentText>
            </DialogContent>
           <DialogActions>
            <Button onClick={()=>this.setState({onClickAge:true})} color="primary">
              OK
            </Button>
          </DialogActions>
       </Dialog>
      </React.Fragment>
    );
  };

  handleChange = event => {
    this.setState({compType:event.target.value})
    compInfo[0].type=event.target.value;
    document.getElementById("errType").style.display = "none";
  };

  handleCreate = () => {

    this.setState({time:document.getElementById('time').value})
    compInfo[0].time = document.getElementById('time').value;
    compInfo[0].time = compInfo[0].time+":00"
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
        axios.post(
        baseURL+'api/cmp/insertCmp/', {
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
            "competitionInfo":compInfo[0].info,
            "startDate":compInfo[0].start,
            "endDate":compInfo[0].end,
            "testDuration":compInfo[0].time,
            "competitionType":{
                "codeName":compInfo[0].type
		      }
	       },
	       "defaultBonusMarks":compInfo[0].bonus
            }
        ,{
            headers: {
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }
        ).then(response =>{
              this.props.history.push({
          pathname: "/app/competitions/create/2/",
          data: compInfo,
          fromPage: "createComp"
        });
        })
        .catch(function (response) {
            this.setState({openError:true})
        });
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

  handleChangeBonus = value => {
    if (value == "") {
      document.getElementById("errMarks").style.display = "block";
    } else {
      document.getElementById("errMarks").style.display = "none";
      compInfo[0].bonus = value
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
      if(value == ageGroupData[i].AgeGroupName) {
        selectedAgeGroup  = ageGroupData[i]
      }
    }
  };

  render() {

    const {classes} = this.props;

    return (
      <React.Fragment>
        {this.state.onClickAge? <Redirect to="/app/competitions/addGroups" /> : null}
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="h5" align="center">
              Enter Competition Details
            </Typography>
            <React.Fragment>
              <React.Fragment>
                <p />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      required
                      id="compName"
                      label="Competition Name"
                      onChange={e => this.handleChangeName(e.target.value)}
                      fullWidth />
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
                      />
                  </Grid>
                  <Grid item xs={6}>
                    End date:{" "}
                    <DateTimePicker
                      value={this.state.endDate}
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
                      onChange={this.handleChange}
                    >
                       {this.state.cmpTypes.map(typ => {return (
                      <MenuItem value={typ}>{typ}</MenuItem>
                       )})}
                    </Select>
                    <FormHelperText
                      id="errType"
                      style={{ color: "red", display: "none" }}
                    >
                      Select Type
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="time"
                      required
                      label="Duration(hh:mm)"
                      type="time"
                      defaultValue={this.state.time}
                      className={classes.textField}
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
                      placeholder=""
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
                    id="compName"
                    label="Additional Information (if any)"
                    onChange={e => this.handleChangeInfo(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <React.Fragment>
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleCreate}
                    className={classes.button}
                  >
                    Create
                  </Button>
                </div>
              </React.Fragment>
            </React.Fragment>
          </Paper>
        </main>
        {this.displayAlertAgeGroups()}
      </React.Fragment>
    );
  }
}

export default (withStyles)(useStyles)(CreateCompetition);
