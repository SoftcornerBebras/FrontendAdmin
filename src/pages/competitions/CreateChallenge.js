import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import axios from 'axios'
import {baseURL} from '../constants'
import {selectedAgeGroup} from './CreateCompetition'
import {selectedAgeGroupUpdate, selectedAgeGroupEdit} from './UpdateCompetition'


export var compInfo = [], quesComp=[], challengeInfo=[];

const tableColumns = [
  {
    name: "caption",
    label: "Caption",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "domain",
    label: "Domain",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "type",
    label: "Type",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "quesLevel",
    label: "Question Level",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "country",
    label: "Country",
    options: {
      filter: true,
      sort: true
    }
  }
];

var correctMarks=[], bonus="", classes="", deletedQuesList=[],prevQuesList=[];;
class Challenge extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      value:0,
      fromPage:"",
      language : "",
      compName:"",
      quesData: [],
      compData:[],
      compID:"",
      openError:false,
    }
  }

  async componentDidMount() {
     try{
       let gResultClass = ""
       if(this.props.location.fromPage == "createComp") {

         gResultClass = await axios.get(baseURL+'api/cmp/getClassAgeWise/'+selectedAgeGroup.AgeGroupID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }).catch(error => {
           this.setState({openError:true})
        });
           classes = gResultClass.data[0].ClassID.classNo
           for(let i=1;i< gResultClass.data.length;i++){
             classes+=","+gResultClass.data[i].ClassID.classNo
           }
        }
        if(this.props.location.fromPage == "addNewGroup") {
               gResultClass = await axios.get(baseURL+'api/cmp/getClassAgeWise/'+selectedAgeGroupUpdate.AgeGroupID+"/",{
               headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
                }
             }).catch(error => {
            this.setState({openError:true})
           });
           classes = gResultClass.data[0].ClassID.classNo
           for(let i=1;i< gResultClass.data.length;i++){
             classes+=","+gResultClass.data[i].ClassID.classNo
           }
        }

        if(this.props.location.fromPage == "editDetails") {
           gResultClass = await axios.get(baseURL+'api/cmp/getClassAgeWise/'+selectedAgeGroupEdit.AgeGroupID+"/",{
               headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
                }
             }).catch(error => {
            this.setState({openError:true})
           });
           classes = gResultClass.data[0].ClassID.classNo
           for(let i=1;i< gResultClass.data.length;i++){
             classes+=","+gResultClass.data[i].ClassID.classNo
           }
         }
        if(this.props.location.fromPage == "createComp" || this.props.location.fromPage == "addNewGroup"
          || this.props.location.fromPage == "editDetails" ) {

          quesComp.length = 0;
          challengeInfo.length = 0;
          deletedQuesList.length = 0;
          compInfo = this.props.location.data
          bonus = this.props.location.data[4].detail
          correctMarks = this.props.location.marks.correctMarks
          let ageLang = this.props.location.ageGroup.split("-")
          quesComp.push({ name: ageLang[0], lang: ageLang[1], ques:[]})
          challengeInfo.push({ name: ageLang[0], lang: ageLang[1], info : []})
          let levelA = 0 , levelB = 0, levelC = 0;
          this.setState({name: ageLang[0],
            language: ageLang[1],
            fromPage: this.props.location.fromPage,
            compName: this.props.location.compName,
            compID: this.props.location.compID
          })
          this.setChallengeData(ageLang[0], ageLang[1], levelA, levelB, levelC)

          if(this.props.location.fromPage == "editDetails"){
            this.getPrevQues(ageLang[0], ageLang[1], levelA, levelB, levelC).then(response => {
              levelA = response[0]
              levelB = response[1]
              levelC = response[2]
              this.setChallengeData(ageLang[0], ageLang[1], levelA, levelB, levelC)
            });
          }
        }

        if(this.props.location.fromPage == "quesPage") {

          this.setState({name: this.props.location.data.ageGroup,
            language: this.props.location.data.language,
            fromPage: this.props.location.data.initPage,
            compName: this.props.location.compName,
            compID: this.props.location.compID
          })

          let levelA = 0 , levelB = 0, levelC = 0;
          for(let j = 0 ; j < quesComp[0].ques.length ; j++) {
            if(quesComp[0].ques[j].quesLevel == 'A') {
              levelA = parseInt(levelA) + 1;
            }
            if(quesComp[0].ques[j].quesLevel == 'B') {
              levelB = parseInt(levelB) + 1;
            }
            if(quesComp[0].ques[j].quesLevel == 'C') {
              levelC = parseInt(levelC) + 1;
            }
          }
          let questions = this.props.location.data.ques
          let ques = quesComp[0].ques

          for(let j = 0 ; j < questions.length ; j++) {
            ques[ques.length] = questions[j]
            if(questions[j].quesLevel == 'A') {
              levelA = parseInt(levelA) + 1;
            }
            if(questions[j].quesLevel == 'B') {
              levelB = parseInt(levelB) + 1;
            }
            if(questions[j].quesLevel == 'C') {
              levelC = parseInt(levelC) + 1;
            }
          }
          quesComp[0].ques = ques
          this.setState({quesData: quesComp[0].ques })

          this.setChallengeData(this.props.location.data.ageGroup,this.props.location.data.language,
            levelA,levelB,levelC)
        }
        if(this.props.location.data===undefined)this.props.history.push('/app/dashboard')
      }
      catch(error){
        this.props.history.push('/app/dashboard')
      }
  }

  setChallengeData = (ageGroupName, language,levelA,levelB,levelC) => {

    let info=[]
    for(let i=0; i< challengeInfo.length ; i++) {
      if(challengeInfo[i].name == ageGroupName && challengeInfo[i].lang == language){

        let marks = parseInt(bonus) + parseInt(levelA)*parseInt(correctMarks[0]) +
                parseInt(levelB)*parseInt(correctMarks[1]) + parseInt(levelC)*parseInt(correctMarks[2])

        info.push({ name: "Name :", detail: ageGroupName})
        info.push({ name: "Language  :", detail: language })
        info.push({ name: "Classes  :", detail: classes })
        info.push({ name: "Marks  :", detail: marks })
        info.push({ name: "Level A  :", detail: levelA + " questions" })
        info.push({ name: "Level B  :", detail: levelB + " questions" })
        info.push({ name: "Level C  :", detail: levelC + " questions" })
        info.push({ name: "Total questions  :", detail: (levelA + levelB + levelC )+"  questions" })

        challengeInfo[i].info = info
        this.setState(({compData : info}))
        break
      }
    }
  };

  async getPrevQues(ageGrpName, language, levelA, levelB, levelC) {
    let ques = quesComp[0].ques;
    let gcmpQues = await axios.get(baseURL+'api/cmp/getCmpQues/'+selectedAgeGroupEdit.AgeGroupID+"&"+this.state.compID+"/",{
           headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
         }).catch(error => {
        this.setState({openError:true})
       });
    let apiData = gcmpQues.data
    let quesID = apiData.cmpQuesList
    let quesList = apiData.QuesTrans

    let quesIDs =[]
    for(let i=0; i< quesID.length; i++) {
      quesIDs.push({id:quesID[i].questionID, level : quesID[i].questionLevelCodeID.codeName})
    }

    for(let i =0; i< quesList.length ; i++) {
      for(let j=0; j<quesIDs.length;j++) {

        if(quesList[i].questionID.questionID == quesIDs[j].id &&
          quesList[i].languageCodeID.codeName == language ) {

          ques.push({
            questionID: quesList[i].questionID.questionID,
            questionTransID: quesList[i].questionTranslationID,
            country: quesList[i].questionID.countryID.nicename,
            caption: quesList[i].translation.caption,
            domain: quesList[i].questionID.domainCodeID.codeName,
            type: quesList[i].questionID.questionTypeCodeID.codeName,
            quesLevel: quesIDs[j].level
          })

          prevQuesList.push({
            questionID: quesList[i].questionID.questionID,
            questionTransID: quesList[i].questionTranslationID,
            country: quesList[i].questionID.countryID.nicename,
            caption: quesList[i].translation.caption,
            domain: quesList[i].questionID.domainCodeID.codeName,
            type: quesList[i].questionID.questionTypeCodeID.codeName,
            quesLevel: quesIDs[j].level
          })

          if(quesIDs[j].level == 'A') {
            levelA = parseInt(levelA) + 1;
          }
          if(quesIDs[j].level == 'B') {
            levelB = parseInt(levelB) + 1;
          }
          if(quesIDs[j].level == 'C') {
            levelC = parseInt(levelC) + 1;
          }
        }
      }
    }

    quesComp[0].ques = ques
    this.setState({quesData:ques})

    return [levelA,levelB,levelC]
  }

  deleteQues = (rowsDeleted) => {

  let levelA = 0 , levelB = 0, levelC = 0;
    for(let j = 0 ; j < quesComp[0].ques.length ; j++) {
      if(quesComp[0].ques[j].quesLevel == 'A') {
        levelA = parseInt(levelA) + 1;
      }
      if(quesComp[0].ques[j].quesLevel == 'B') {
        levelB = parseInt(levelB) + 1;
      }
      if(quesComp[0].ques[j].quesLevel == 'C') {
        levelC = parseInt(levelC) + 1;
      }
    }

    for(let j = rowsDeleted.data.length -1 ; j >=0 ; j-- ) {
      let lvl = quesComp[0].ques[rowsDeleted.data[j].index].quesLevel

      deletedQuesList.push({"questionID":quesComp[0].ques[rowsDeleted.data[j].index].questionID,
        "questionLevelCodeID":lvl})

      if(lvl == 'A') {
        levelA = parseInt(levelA) - 1;
      }
      if(lvl == 'B') {
        levelB = parseInt(levelB) - 1;
      }
      if(lvl == 'C') {
        levelC = parseInt(levelC) - 1;
      }
      quesComp[0].ques.splice(rowsDeleted.data[j].index,1)
    }
    this.setChallengeData(this.state.name,this.state.language,levelA,levelB,levelC)

  }

  onSubmit = () => {

    let quesList=[]
    if(this.state.fromPage=="editDetails") {

       let i=0,flag=0;
      while(i <quesComp[0].ques.length) {
        flag=0;
        for(let j=0;j<prevQuesList.length;j++){
          if(quesComp[0].ques[i].questionTransID == prevQuesList[j].questionTransID ) {
            quesComp[0].ques.splice(i,1)
            flag=1
            break
          }
        }
        if(flag==0) i++
      }
    }
     for(let i=0 ; i <quesComp[0].ques.length; i++ ) {
      quesList.push({"questionID":quesComp[0].ques[i].questionID,
        "questionLevelCodeID":quesComp[0].ques[i].quesLevel})
    }

    if(this.state.fromPage=="createComp") {
      axios.post(baseURL+'api/cmp/insertCmpQues/', {
        "AgeGroupID":selectedAgeGroup.AgeGroupID,
        "competitionName":this.state.compName,
        "startdate":compInfo[1].detail,
        "cmptype":compInfo[0].detail,
        "quesList":quesList
      },{
      headers: {
          'Content-Type' : 'application/json',
          Authorization: 'Token '+localStorage.getItem('id_token')
        }
      }).then( response => {
        this.props.history.push('/app/competition');
      }).catch(error => {
        this.setState({openError:true})
      })
    }
    if(this.state.fromPage=="addNewGroup") {

      axios.post(baseURL +'api/cmp/insertCmpQues/',  {
        "AgeGroupID":selectedAgeGroupUpdate.AgeGroupID,
        "competitionName":this.state.compName,
        "startdate":compInfo[1].detail,
        "cmptype":compInfo[0].detail,
        "quesList":quesList
      },{
      headers: {
            'Content-Type' : 'application/json',
            Authorization: 'Token '+localStorage.getItem('id_token')
          }
      }).then( response => {
        this.props.history.push('/app/competition');
      }).catch(error => {
        this.setState({openError:true})
      })

    }
    if(this.state.fromPage=="editDetails"){

      axios.post(baseURL +'api/cmp/updateCmp/',  {
         "CompetitionData":{
              "competitionName":this.state.compName,
              "competitionInfo":compInfo[5].detail,
              "startDate":compInfo[1].detail,
              "endDate":compInfo[2].detail,
              "testDuration":compInfo[3].detail,
              "competitionType":{
                  "codeName":compInfo[0].detail
              }
         },
         "CompetitionID":this.state.compID,
         "agedata":{
            "ageid":selectedAgeGroupEdit.AgeGroupID,
            "agename":selectedAgeGroupEdit.AgeGroupName
         },
         "DeletedData":deletedQuesList,
         "CmpQuesData":quesList
      },{
      headers: {
            'Content-Type' : 'application/json',
            Authorization: 'Token '+localStorage.getItem('id_token')
          }
      }).then( response => {
        this.props.history.push('/app/competition');
      }).catch(error => {
        this.setState({openError:true})
      })

    }
  }

    handleClose = () => {
        this.setState({openError:false})
    }

  render () {

    return (
      <>
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
        <Box
          display="flex"
          flexDirection="row"
          p={1}
          m={1}
          bgcolor="background.paper"
        >
          {/* Left box */}
          <Box
            display="flex"
            flexGrow={1}
            flexDirection="column"
            bgcolor="background.paper"
          >
            {/* Inside box left top */}
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
                {this.state.compData.map(info => (
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
              {/* Item 2 */}
              <AppBar position="static" color="white">
                <Tabs
                  value={0}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Questions" {...a11yProps(0)} />
                </Tabs>
              </AppBar>
                <TabPanel value={0} index={0}>
                  {/* Tab Item One */}
                  <MUIDataTable
                    data={this.state.quesData}
                    columns={tableColumns}
                    options={{
                      filterType: "checkbox",
                      rowsPerPage: 10,
                      rowsPerPageOptions: 10,
                      print: false,
                      download: false,
                      viewColumns: false,
                      textLabels: {
                        selectedRows: {
                          text: "question(s) selected",
                          delete: "Delete here",
                          deleteAria: "Delete Selected Rows"
                        }
                      },
                      onRowsDelete : rowsDeleted => this.deleteQues(rowsDeleted),
                      customToolbar: selectedRows => (
                        <Tooltip title="Add questions">
                          <IconButton
                            onClick={() => {
                              this.props.history.push({
                                pathname: '/app/competitions/addQues',
                                ageGroup: this.state.name,
                                language: this.state.language,
                                fromPage: this.state.fromPage,
                                compName: this.state.compName,
                                compID: this.state.compID,
                                compInfo:compInfo
                              });
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      )
                    }}
                  />
                </TabPanel>
            </Box>
          <Button color="primary" variant="contained" style={{ marginBottom: '10px',marginLeft:'90%',
            marginTop:"-2%", marginRight:"1%" }} onClick={this.onSubmit}
            >Done</Button>
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
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}
