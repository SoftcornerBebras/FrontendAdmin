import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DescriptionIcon from '@material-ui/icons/Description';
import PieChartIcon from '@material-ui/icons/PieChart';
import {prevAgeGroups} from './CompetitionMainPage';
import AnalysisBarChart from '../analysis/AnalysisBarChartMean'
import AnalysisText from '../analysis/AnalysisTextMean'
import axios from 'axios'
import {baseURL} from '../constants'

const resultOnlyScore = [
  {
    name: "studentName",
    label: "Student Name",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "className",
    label: "Class",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "schoolName",
    label: "School",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "state",
    label: "State",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "bonus",
    label: "Bonus",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "total",
    label: "Total",
    options: {
      filter: true,
      sort: true
    }
  }
];
const StyledListItem = withStyles({
  root: {
    "&$selected": {
      color:"#3F51B5"
    }
  },
  selected: {}
})(ListItem);

var challengeData=[];
class Challenge extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      value:0,
      ageGroups:[],
      name : "",
      language : "",
      time : "",
      studentResult:[],
      challengeInfo:[],
      classes:"",
      totalCount:0,
      alignmentR:"text",
      compID:"",
      ageGrpID:""
    }
  }

 async componentDidMount() {

    try{
    if(this.props.location != undefined)  {

      let name = this.props.location.ageGroupName
      let language = this.props.location.language
      let ageList = this.props.location.ageGroupList
      let ageID = ""
      let cmpID = this.props.location.compID

      let count = 0
      for(let i = 0; i< ageList.length; i++) {
        count += ageList[i].lang.length
        challengeData.push({ name: ageList[i].name, lang: ageList[i].lang, info : []})
      }
      for(let i=0; i < prevAgeGroups.length ; i++) {
      if(prevAgeGroups[i].AgeGroupName.includes(name) &&
        prevAgeGroups[i].AgeGroupName.includes(language)) {
          ageID = prevAgeGroups[i].AgeGroupID
        }
      }
      this.getClasses(name, language, cmpID, ageID)

      this.setState({ageGroups: ageList, totalCount: count,
        compID:cmpID, ageGrpID:ageID })
    }
    }catch(error){this.props.history.push('/app/dashboard')}
  }

  async getClasses(ageGroupName, language, compID, ageGroupID) {

      let gAgeGrp = await axios.get(baseURL+'api/cmp/getStudentsAgeGrpWise/'+ageGroupID+"&"+compID+"/",{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        
    });
      let dataResult = gAgeGrp.data

      let studResults = []
      for(let i=0; i < dataResult.length; i++) {
        studResults.push({
          studentName: dataResult[i].userID.username ,
          className: dataResult[i].schoolClassID.classNumber,
          schoolName: dataResult[i].schoolClassID.schoolID.schoolName,
          state: dataResult[i].schoolClassID.schoolID.addressID.stateID.name,
          bonus: dataResult[i].bonusMarks,
          total: dataResult[i].score + dataResult[i].bonusMarks
        })
      }

      this.setState({ name: ageGroupName, language, studentResult:studResults})
      this.setChallengeData(ageGroupName, language);
  }

  handleListItemClick = (event, index, name, language) => {
    this.setState({selectedIndex:index});

    let id = ""
    for(let i=0; i < prevAgeGroups.length ; i++) {
      if(prevAgeGroups[i].AgeGroupName.includes(name) &&
        prevAgeGroups[i].AgeGroupName.includes(language)) {
          id = prevAgeGroups[i].AgeGroupID
      }
    }

    this.setState({name:name, language:language, ageGrpID:id})

    this.getClasses(name, language, this.state.compID, id)
  };

  setChallengeData = (ageGroupName, language) => {

    let info=[], flag=0;
    for(let i=0; i < challengeData.length ; i++) {
      for(let j=0; j < challengeData[i].lang.length; j++) {
        if(challengeData[i].name == ageGroupName && challengeData[i].lang[j] == language){

          info.push({ name: "Name :", detail: ageGroupName})
          info.push({ name: "Language  :", detail: language })

          flag=1
          challengeData[i].info = info
          this.setState({challengeInfo : info})
          break
        }
      }
      if(flag==1) break
    }
  };

  handleChange = (event, newValue) => {
    this.setState({value:newValue});
  };

  handleAlignmentR = (event, newAlignment) => {
    this.setState({alignmentR:newAlignment});
  };

  render () {

    return (
      <>
      <Box
          display="flex"
          flexDirection="row"
          p={1}
          m={1}
          bgcolor="background.paper"
        >
          <Box
            display="flex"
            flexGrow={1}
            flexDirection="column"
            bgcolor="background.paper"
          >
            <Box p={1} flexGrow={1} m={1} bgcolor="#2196f3">
              <Typography
                variant="h6"
                style={{ color: "white" }}
                gutterBottom
                align="center"
              >
                {this.state.name} - {this.state.language} group
              </Typography>
            </Box>
            <Box p={1} flexGrow={1} m={1} bgcolor="background.paper">
              <Grid container>
                {this.state.challengeInfo.map(info => (
                  <React.Fragment key={info.name}>
                    <Grid item xs={3}>
                      <Typography paddingRight="10px" align="center" gutterBottom>
                        {info.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography gutterBottom>{info.detail}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              <br />
            </Box>
            <Box p={1} flexGrow={1} m={1} bgcolor="background.paper">
              <AppBar position="static" color="white">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Results" {...a11yProps(0)} />
                  <Tab label="Analytics" {...a11yProps(1)} />
                </Tabs>
              </AppBar>
                <TabPanel value={this.state.value} index={0}>
                  <MUIDataTable
                    data={this.state.studentResult}
                    columns={resultOnlyScore}
                    options={{
                      filterType: "checkbox",
                      selectableRows: false,
                      viewColumns:false,
                      print:false,
                      download:false
                    }} />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <ToggleButtonGroup
                      value={this.state.alignmentR}
                      exclusive
                      onChange={this.handleAlignmentR}
                      style={{marginLeft:'86%'}}
                      size="large"
                    >
                      <ToggleButton value="text" >
                        <DescriptionIcon/>
                      </ToggleButton>
                      <ToggleButton value="graph" >
                        <PieChartIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <br/><br/>
                    {this.state.alignmentR == "text" ?
                    <AnalysisText ageID={this.state.ageGrpID} compID={this.state.compID} />
                    : <AnalysisBarChart ageID={this.state.ageGrpID} compID={this.state.compID}/>}
                </TabPanel>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            p={1}
            m={1}
            bgcolor="grey.100"
            css={{ minWidth: "20%" }}
          >
            <List
              component="nav"
              aria-label="main mailbox folders"
            >
              {this.state.ageGroups.map(({name,lang}, i) => (
                <div>
                  <StyledListItem key={i}>
                  <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                 <ListItemText primary={name} />
               </StyledListItem>
               {lang.map((lang, j) => (
                 <StyledListItem
                   key={j}
                   button
                   selected = {this.state.language === lang && this.state.name === name}
                   onClick={event => this.handleListItemClick(event, (i+j), name, lang)}
                 >
                 <ListItemText primary={lang} />
               </StyledListItem>
               ))}
               </div>
              ))}
            </List>
          </Box>
        </Box>
      </>
    );
  }
}

Challenge.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (Challenge);


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}
