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
import ArrowBack from "@material-ui/icons/ArrowBack";
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import axios from 'axios'
import {baseURL} from '../constants'

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
const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});

var correctMarks=[], bonus="", classes="", deletedQuesList=[],prevQuesList=[],selectedAgeGroup;
var ageGrpsPrev, compInfo = [], quesComp=[], challengeInfo=[];
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
      openprogress:false,
    }
  }

  async componentDidMount() {

    this.setState({openprogress:true})

     try{

        this.setState({compID:this.props.location.compID})

        selectedAgeGroup = this.props.location.selectedAgeGroup
        ageGrpsPrev = this.props.location.ageGrpsPrev

       let gResultClass = await axios.get(baseURL+'api/cmp/getClassAgeWise/'+selectedAgeGroup.AgeGroupID+"/",{
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

        quesComp.length = 0;
        challengeInfo.length = 0;
        compInfo.length = 0

        compInfo.push({ name: "Type :", detail: this.props.location.data[0].detail })
        compInfo.push({ name: "Start date :", detail: this.props.location.data[1].detail })
        compInfo.push({ name: "End date  :", detail: this.props.location.data[2].detail })
        compInfo.push({ name: "Time Limit (hh:mm)  : ", detail: this.props.location.data[3].detail })
        compInfo.push({ name: "Bonus Marks  : ", detail: this.props.location.data[4].detail })
        compInfo.push({ name: "Additional info  : ", detail: this.props.location.data[5].detail })

        bonus = this.props.location.data[4].detail
        correctMarks = this.props.location.marks
        let ageLang = selectedAgeGroup.AgeGroupName.split("-")
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

        if(this.props.location.fromPage == "editDetails" || localStorage.getItem("quesAdded")==="true"){
          this.getPrevQues(ageLang[0], ageLang[1], levelA, levelB, levelC).then(response => {
            levelA = response[0]
            levelB = response[1]
            levelC = response[2]
            // this.setChallengeData(ageLang[0], ageLang[1], levelA, levelB, levelC)
            this.calculateLevels(this.state.quesData)
          });
        }

        if(this.props.location.fromPage == "quesPage") {

          let ageName = selectedAgeGroup.AgeGroupName.split("-")

          this.setState({name: ageName[0],
            language: this.props.location.language,
            fromPage: this.props.location.initPage,
            compName: this.props.location.compName,
            compID: this.props.location.compID
          })
          let questions = this.props.location.ques

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

          this.setChallengeData(ageName[0],this.props.location.data.language,
            levelA,levelB,levelC)

          this.onSubmit(questions)
        }

        if(this.props.location.data===undefined)this.props.history.push('/app/dashboard')

          this.setState({openprogress:false})

      }catch(error){
        this.setState({openprogress:false})
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
    let gcmpQues = await axios.get(baseURL+'api/cmp/getCmpQues/'+selectedAgeGroup.AgeGroupID+"&"+this.state.compID+"/",{
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

  sortIdInAsc = (rows) => {

    for(let i=0;i<rows.data.length;i++){
      for(let j=0;j<rows.data.length - i -1;j++){
        if (rows.data[j].dataIndex > rows.data[j+1].dataIndex) 
        { 
           let temp = rows.data[j]
           rows.data[j]=rows.data[j+1]
           rows.data[j+1]=temp
        } 
      }
    }
    return rows
  }

  deleteQues = (rowsDeleted) => {


    let ques=[...this.state.quesData]
    rowsDeleted = this.sortIdInAsc(rowsDeleted)


  let levelA = 0 , levelB = 0, levelC = 0;
    for(let j = 0 ; j <ques.length ; j++) {
      if(ques[j].quesLevel == 'A') {
        levelA = parseInt(levelA) + 1;
      }
      if(ques[j].quesLevel == 'B') {
        levelB = parseInt(levelB) + 1;
      }
      if(ques[j].quesLevel == 'C') {
        levelC = parseInt(levelC) + 1;
      }
    }

    deletedQuesList.length=0

    for(let j = rowsDeleted.data.length -1 ; j >=0 ; j-- ) {

      let lvl =ques[rowsDeleted.data[j].dataIndex].quesLevel

      deletedQuesList.push({"questionID":ques[rowsDeleted.data[j].dataIndex].questionID,
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

      ques.splice(rowsDeleted.data[j].dataIndex,1)
    }
    this.setChallengeData(this.state.name,this.state.language,levelA,levelB,levelC)

    this.setState({quesData:ques})

     axios.post(baseURL+'api/cmp/deleteCmpQues/',{
      "CompetitionID":this.state.compID,
      "agedata":{
         "ageid":selectedAgeGroup.AgeGroupID,
         "agename":selectedAgeGroup.AgeGroupName
      },
      "DeletedData":deletedQuesList
     },{
       headers: {
           'Content-Type' : 'application/json',
           Authorization: 'Token '+localStorage.getItem('id_token')
         }
       }).catch(err=>{
     });
  }

  onSubmit = (questions) => {

    localStorage.setItem("quesAdded","true")

    let quesList=[]
     for(let i=0 ; i <questions.length; i++ ) {
      quesList.push({"questionID":questions[i].questionID,
        "questionLevelCodeID":questions[i].quesLevel})
    }

     axios.post(baseURL+'api/cmp/addCmpQues/',{
        "CompetitionID":this.state.compID,
        "agedata":{
           "ageid":selectedAgeGroup.AgeGroupID,
           "agename":selectedAgeGroup.AgeGroupName
        },
        "CmpQuesData":quesList
     },{
       headers: {
           'Content-Type' : 'application/json',
           Authorization: 'Token '+localStorage.getItem('id_token')
         }
       }).catch(err=> {
     });
  }

    handleClose = () => {
        this.setState({openError:false})
    }

    handleBack =() => {

      var data=[{
        ageGroup:selectedAgeGroup.AgeGroupName,
        type:compInfo[0].detail,
        time:compInfo[3].detail,
        start:compInfo[1].detail,
        end:compInfo[2].detail,
        bonus:compInfo[4].detail,
        info:compInfo[5].detail,
        name:this.state.compName
      }]

      if(this.state.fromPage === "createComp"){
        this.props.history.push({
          pathname:'/app/competitions/create/2/',
          selectedAgeGroup:selectedAgeGroup,
          ageGrpsPrev:ageGrpsPrev,
          fromPage:this.state.fromPage,
          compID:this.state.compID,
          data:data
        })
      }
      if(this.state.fromPage === "editDetails"){
        this.props.history.push({
          pathname:'/app/competitions/edit/2/',
          selectedAgeGroup:selectedAgeGroup,
          ageGrpsPrev:ageGrpsPrev,
          fromPage:this.state.fromPage,
          compID:this.state.compID,
          data:data
        })
      }
      if(this.state.fromPage === "addNewGroup"){
        this.props.history.push({
          pathname:'/app/competitions/update/2/',
          selectedAgeGroup:selectedAgeGroup,
          ageGrpsPrev:ageGrpsPrev,
          fromPage:this.state.fromPage,
          compID:this.state.compID,
          data:data
        })
      }
    }

    onDone = () => {
      this.props.history.push('/app/competition');
      localStorage.removeItem("created")
      localStorage.removeItem("getMarks")
      localStorage.removeItem("quesAdded")
      localStorage.removeItem("goBackToAdd")
    }

    calculateLevels =()=>{

      let ques = this.state.quesData
      let levelA = 0 , levelB = 0, levelC = 0;
      for(let j = 0 ; j < ques.length ; j++) {
        if(ques[j].quesLevel == 'A') {
          levelA = parseInt(levelA) + 1;
        }
        if(ques[j].quesLevel == 'B') {
          levelB = parseInt(levelB) + 1;
        }
        if(ques[j].quesLevel == 'C') {
          levelC = parseInt(levelC) + 1;
        }
      }
      this.setChallengeData(this.state.name,this.state.language,levelA,levelB,levelC)
    }

  render () {

    const {classes} = this.props;

    return (
      <>
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>

      <Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        onClick={this.handleBack }><ArrowBack/> Back </Button>

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
                                language: this.state.language,
                                fromPage: this.state.fromPage,
                                compName: this.state.compName,
                                compID: this.state.compID,
                                data:compInfo,
                                marks:correctMarks,
                                selectedAgeGroup:selectedAgeGroup,
                                ageGrpsPrev:ageGrpsPrev
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
            marginTop:"-2%", marginRight:"1%" }} onClick={this.onDone}
            >Done</Button>
        </Box>
        </Box>
        <Backdrop className={classes.backdrop}  open={this.state.openprogress}  >
          <CircularProgress  color="primary" />
          <Typography component="h1" style={{color:"black"}}><b> Please Wait..</b></Typography>
        </Backdrop>
      </>
    );
  }
}

Challenge.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Challenge);


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
