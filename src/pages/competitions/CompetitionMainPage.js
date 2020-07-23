import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Expand from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {Menu, MenuItem} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import {baseURL} from '../constants'
import ErrorBoundary from '../error/ErrorBoundary'

export var compInfo = [], quesComp=[], challengeInfo=[];
export const ageGrps = [],prevAgeGroups=[];

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});

class SelectAges extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      compName:"",
      compID:"",
      ages:[],
      anchorEl:null,
      openError:false,
      compStarted:false,
      openprogress:false,
    };
  }

  async componentDidMount() {

    this.setState({openprogress:true})

    try {

    compInfo.length=0;
    quesComp.length=0;
    challengeInfo.length=0;
    ageGrps.length = 0;
    let time = this.props.location.data.testDuration.substring(0, this.props.location.data.testDuration.length-3)
    compInfo.push({ name: "Type :", detail: this.props.location.data.competitionType.codeName})
    compInfo.push({ name: "Start date :", detail: this.props.location.data.startDate.replace(/T|Z/g," ") })
    compInfo.push({ name: "End date  :", detail: this.props.location.data.endDate.replace(/T|Z/g," ") })
    compInfo.push({ name: "Time Limit (hh:mm)  : ", detail: time })
    compInfo.push({ name: "Additional info  : ", detail: this.props.location.data.competitionInfo })

    let today = new Date()

    let timer = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " "
     + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let endTime = new Date(compInfo[1].detail)
    let currTime = new Date(timer)

    if(currTime >= endTime && compInfo[0].detail=='Main Challenge') {
      this.setState({compStarted:true})
    }

    let gAgeGrp = await axios.get(baseURL+'api/cmp/getAgeCmpWise/'+this.props.location.data.competitionID+"/",{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });
     let ages =gAgeGrp.data.AgeGrp;
     let marks = gAgeGrp.data.BonusList;
     prevAgeGroups.length=0;
     for(let i=0; i < ages.length; i++) {
      prevAgeGroups.push({AgeGroupID:ages[i].AgeGroupID,AgeGroupName:ages[i].AgeGroupName,
          created_on:ages[i].created_on, bonus:marks[i]})
    }
    for(let i=0; i< prevAgeGroups.length ; i++) {
      let x = prevAgeGroups[i].AgeGroupName.split("-")
      let flag = 0;
      for(let i=0;i<ageGrps.length;i++) {
        if(x[0] === ageGrps[i].name) {
          let languages = ageGrps[i].lang
          languages.push(x[1])
          ageGrps[i].lang = languages
          flag=1;
        }
      }
      if(flag===0) {
        ageGrps.push({ name: x[0], lang: [x[1]] })
      }
      quesComp.push({ name: x[0], lang: x[1], ques:[]})
      challengeInfo.push({ name: x[0], lang: x[1], info : []})
    }
    this.setState({compID:this.props.location.data.competitionID,compName:this.props.location.data.competitionName})
    }
    catch(error) {
        this.props.history.push('/app/dashboard')
    }
    this.setState({openprogress:false})
  }

 handleListItemClick = (event, i,j) => {

    let endDate = new Date(compInfo[2].detail)
   if(compInfo[0].detail!=="Practice Challenge" && endDate<=Date.now()) {

      this.props.history.push({
        pathname:'/app/competitions/results',
        ageGroupName:ageGrps[i].name,
        language:ageGrps[i].lang[j],
        ageGroupList: ageGrps,
        compID:this.state.compID,
        data: compInfo,
        compName: this.state.compName
      })
    }

  };
  handleClick = (event) => {
    Boolean(this.state.anchorEl) ? this.setState({anchorEl:null}) :
   this.setState({anchorEl:event.currentTarget});
  };
  handleClose = () => {
    this.setState({anchorEl:null,openError:false});
  };

   compPrev = () => {
    this.props.history.push({
      pathname: "/app/competitions/preview",
      data: compInfo,
      compName: this.state.compName,
      compID: this.state.compID,
      ageGrps: this.state.ages,
      prevAgeGroups:prevAgeGroups
    });
  }
  addNewGroup =() => {
    this.props.history.push({
      pathname: "/app/competitions/update/1/",
      data: compInfo,
      compName: this.state.compName,
      compID: this.state.compID,
      fromPage: "addNewGroup",
      prevAges: prevAgeGroups
    });
  }

  editDetails = () => {
    this.props.history.push({
      pathname: "/app/competitions/edit/1/",
      data: compInfo,
      compName: this.state.compName,
      compID: this.state.compID,
      fromPage: "editDetails",
      prevAges: prevAgeGroups
    });
  }

  render() {

    const {classes} = this.props

    return (
      <ErrorBoundary>
      <Paper>
       <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <div className="App">
      <Box p={1} m={1} display="flex" flexDirection="row">
        <Box p={1} flexGrow={1} m={1} bgcolor="#2196f3" style={{marginRight:"2%"}}>
          <Typography
            variant="h6"
            style={{ color: "white" }}
            gutterBottom
            align="center"
          >
            {this.state.compName}
          </Typography>
        </Box>
        <IconButton style={{height:"60px"}} onClick={e=>this.handleClick(e)}>
          <Expand style={{fontSize:"40px"}}/>
        </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={this.state.anchorEl}
        keepMounted
        open={Boolean(this.state.anchorEl)}
        onClose={this.handleClose}
        style={{marginTop:'50px'}}
      >
        <MenuItem disabled={this.state.compStarted} onClick={this.editDetails}>Edit Details</MenuItem>
        <MenuItem disabled={this.state.compStarted} onClick={this.addNewGroup}>Add Group</MenuItem>
        <MenuItem onClick={this.compPrev}>Take Test</MenuItem>
      </Menu>

        </Box>
        <Grid container spacing={1}>
          {compInfo.map(info => (
            <React.Fragment key={info.name}>
              <Grid item xs={6}>
                <Typography align="right" gutterBottom>
                  {info.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="left">
                  {info.detail}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Grid container spacing={1} alignItems="stretch">
          {ageGrps.map(({ name, lang }, i) => (
            <Grid item xs={4}>
              <Box flexGrow={1} m={1} height="30px" bgcolor="#2196f3">
                <Typography style={{ color: "white" }}variant="h6" gutterBottom align="center">
                  {name}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                p={1}
                m={1}
                css={{ minWidth: "20%" }}
              >
                <List component="nav" aria-label="main mailbox folders" align="center">
                  {lang.map((lan, j) => (
                    <ListItem
                      align="center"
                      key={j}
                      button
                      onClick={event => this.handleListItemClick(event,i,j)}
                    >
                      <ListItemText align="center" primary={lan} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      </Paper>
      <Backdrop className={classes.backdrop}  open={this.state.openprogress}  >
        <CircularProgress  color="primary" />
        <Typography component="h1" style={{color:"black"}}><b> Please Wait..</b></Typography>
      </Backdrop>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(SelectAges);
