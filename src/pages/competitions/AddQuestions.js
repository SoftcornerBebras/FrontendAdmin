import React from "react";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import {baseURL} from '../constants'

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});

const columns = [
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
      sort: true
    }
  },
  {
    name: "country",
    label: "Country",
    options: {
      filter: true,
      sort: true
    }
  },
  {name: "background",options: {filter: false,display:false,sort: false}},
  {name: "questionID",options: {filter: false,display:false,sort: false}},
  {name: "Option 1",options: {filter: false,display:false,sort: false}},
  {name: "Option 2",options: {filter: false,display:false,sort: false}},
  {name: "Option 3",options: {filter: false,display:false,sort: false}},
  {name: "Option 4",options: {filter: false,display:false,sort: false}}
];

let finalData=[],selectedRows=[],selectedAgeGroup="",ageGrpsPrev,compInfo=[],marks=[];
class AddQuestions extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      ageGroup:"",
      noDataAlert:false,
      language:"",
      fromPage:"",
      compName:"",
      compID:"",
      openError:false,
      openprogress:false,
    }
  }

  async componentDidMount() {

    this.setState({openprogress:true})

    selectedRows.length=0

    localStorage.setItem("quesAdded","true")

    try{

        selectedAgeGroup = this.props.location.selectedAgeGroup
        ageGrpsPrev = this.props.location.ageGrpsPrev

        marks = [...this.props.location.marks]

        compInfo.length = 0
        compInfo.push({ name: "Type :", detail: this.props.location.data[0].detail })
        compInfo.push({ name: "Start date :", detail: this.props.location.data[1].detail })
        compInfo.push({ name: "End date  :", detail: this.props.location.data[2].detail })
        compInfo.push({ name: "Time Limit (hh:mm)  : ", detail: this.props.location.data[3].detail })
        compInfo.push({ name: "Bonus Marks  : ", detail: this.props.location.data[4].detail })
        compInfo.push({ name: "Additional info  : ", detail: this.props.location.data[5].detail })

        this.setState({ageGroup:this.props.location.ageGroup,
          language:this.props.location.language,
          fromPage:this.props.location.fromPage,
          compName: this.props.location.compName,
          compID:this.props.location.compID
        })

        let gAddQues = ""

        if(this.props.location.fromPage === "createComp" || this.props.location.fromPage === "addNewGroup") {
             gAddQues = await axios.get(baseURL+'api/cmp/getQuesAgeAll/'+selectedAgeGroup.AgeGroupID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
          }).catch(error => {
                this.setState({openError:true})
          });
          this.setState({selectedAgeGroup:selectedAgeGroup})
        }
         if(this.props.location.fromPage === "editDetails") {

            gAddQues = await axios.get(baseURL+'api/cmp/getQuesAge/'+selectedAgeGroup.AgeGroupID+"&"+this.props.location.compID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
          }).catch(error => {
                this.setState({openError:true})
          });
          this.setState({selectedAgeGroup:selectedAgeGroup})
        }
        if(this.props.location.fromPage === "previewQues") {

            gAddQues = await axios.get(baseURL+'api/cmp/getQuesAge/'+this.props.location.selectedAgeGroup.AgeGroupID+"&"+this.props.location.compID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
          }).catch(error => {
                this.setState({openError:true})
          });
          this.setState({selectedAgeGroup:selectedAgeGroup,fromPage:this.props.location.initPage})
        }

        if(gAddQues.data.QuesAge.length === 0){
          this.setState({openEmpty:true})
          this.setState({openprogress:true})
          return
        }

        let ques = gAddQues.data.QuesAge
        let quesTrans = gAddQues.data.Questions
        let opt = gAddQues.data.Options
        let quesIDs =[], questions=[],options=[]
        for(let i=0; i< ques.length; i++) {
          quesIDs.push({quesID:ques[i].questionID, quesLevel : ques[i].questionLevelCodeID.codeName})
        }
        for(let i=0; i< quesIDs.length; i++) {

          let ansFlag = 0, corrOption = "" , ansText = null
          for(let j=0; j< quesTrans.length; j++ ){
              let elem = quesTrans[j]
              let c,a;
              if(elem.ansText == null){
                  c = elem.optionTranslationID.translationO.option
              }
              else if (elem.ansText != null) {
                  a= elem.ansText
              }
              if(quesIDs[i].quesID == elem.questionTranslationID.questionID.questionID) {
                  questions.push({
                      quesType:elem.questionTranslationID.questionID.questionTypeCodeID.codeName,
                      questionID:elem.questionTranslationID.questionID.questionID,
                      quesLevel : quesIDs[i].quesLevel,
                      caption:elem.questionTranslationID.translation.caption,
                      domain:elem.questionTranslationID.questionID.domainCodeID.codeName,
                      background:elem.questionTranslationID.translation.background,
                      explanation:elem.questionTranslationID.translation.explanation,
                      countryN:elem.questionTranslationID.questionID.countryID.nicename,
                      correctOption: c,
                      ansText : a
                  })
                  corrOption = c
                  ansText = a
                  if(elem.ansText != null) {
                      ansFlag = 1
                  }
                  break
              }
          }
          let cnt=0, flag = 0, optionArray=[];
          if(ansFlag == 0) {
              optionArray.length=0
              for(let j=0; j< opt.length; j++) {
                  let elem = opt[j]
                  if(quesIDs[i].quesID == elem.optionID.questionID) {
                      optionArray.push({optionID: elem.optionID.optionID, option: elem.translationO.option})
                      cnt++
                      if(cnt==4){
                          optionArray.push({correctOption: corrOption})
                          break
                      }
                  }
              }
              options.push(optionArray)
          }
          else
          {
              options.push({ansText:ansText})
          }
      }
      for(let i=0; i< questions.length ; i++) {

          if(!options[i].hasOwnProperty("ansText")) {

              this.setState(prevState => ({data:[...prevState.data,{
                  type:questions[i].quesType,
                  questionID:questions[i].questionID,
                  caption:questions[i].caption,
                  quesLevel : questions[i].quesLevel,
                  background:questions[i].background,
                  domain:questions[i].domain,
                  country: questions[i].countryN,
                  opt1:options[i][0].option,
                  opt2:options[i][1].option,
                  opt3:options[i][2].option,
                  opt4:options[i][3].option,
                  corrOpt: options[i][4].correctOption,
                  ansText: null
              }]}))
          }
          else {
              this.setState(prevState => ({data:[...prevState.data,{
                  type:questions[i].quesType,
                  questionID:questions[i].questionID,
                  quesLevel : questions[i].quesLevel,
                  caption:questions[i].caption,
                  background:questions[i].background,
                  domain:questions[i].domain,
                  country: questions[i].countryN,
                  opt1:"",
                  opt2:"",
                  opt3:"",
                  opt4:"",
                  corrOpt: "",
                  ansText: options[i].ansText
              }]}))
          }
      }
    }
    catch(error){
      this.props.history.push('/app/dashboard')
    }
    this.setState({openprogress:true})
  }

  handleClose = () => {
    this.setState({openError:false,noDataAlert:false,openEmpty:false})
  }

  handleBack = () => {

  let path=''
  if(this.state.fromPage == "createComp"){
    path="/app/competitions/create/3/"
  }
  if(this.state.fromPage == "editDetails"){
    path="/app/competitions/edit/3/"
  }
  if(this.state.fromPage == "addNewGroup"){
    path="/app/competitions/update/3/"
  }

  this.props.history.push({
    pathname :path,
    language : this.state.language,
    ques: [],
    initPage:this.state.fromPage,
    data:compInfo,
    compName: this.state.compName,
    marks:marks,
    selectedAgeGroup:selectedAgeGroup,
    ageGrpsPrev:ageGrpsPrev,
    compID: this.state.compID,
    fromPage: "quesPage"})
  }

  rowClick = (rowData) => {
    var data = [{
      questionType:rowData[2],
      background:rowData[5],
      questionID:rowData[6],
      opt1:rowData[7],
      opt2:rowData[8],
      opt3:rowData[9],
      opt4:rowData[10]
    }]
    this.props.history.push({
      pathname :"/app/question/preview",
      language : this.state.language,
      previewData:data[0],
      data:compInfo,
      marks:marks,
      compName: this.state.compName,
      selectedAgeGroup:selectedAgeGroup,
      compID: this.state.compID,
      fromPage: this.state.fromPage,
      ageGrpsPrev:ageGrpsPrev
    })
  }

  onSelectRows = (rows) => {

    try{
      if(rows.length > 1 ){
        selectedRows.length=0
        for(let i=0; i<rows.length;i++){
          selectedRows.push(rows[i].dataIndex)
        }
      }else{
        let deleteData = false;
        for(let i=0; i<selectedRows.length;i++){
          if(selectedRows[i]==rows[0].dataIndex){
            deleteData = true
            selectedRows.splice(i,1)
            break
          }
        }
        if(deleteData == false){
          selectedRows.push(rows[0].dataIndex)
        }
      }
    }catch(error){selectedRows.length=0}
  }

  addToComp = () => {

    if(selectedRows.length == 0) {
      return
    }

    finalData.length=0;
    for(let i = 0 ; i < selectedRows.length ; i++ ) {
      finalData.push(this.state.data[selectedRows[i]])
    }

    this.state.fromPage === "createComp" ?
    this.props.history.push({
            pathname :"/app/competitions/create/3/",
            language : this.state.language,
            ques: finalData,
            initPage:this.state.fromPage,
            data:compInfo,
            compName: this.state.compName,
            selectedAgeGroup:selectedAgeGroup,
            compID: this.state.compID,
            marks:marks,
            fromPage: "quesPage",
            ageGrpsPrev:ageGrpsPrev
       }): (
    this.state.fromPage === "addNewGroup" ?
    this.props.history.push({
            pathname :"/app/competitions/update/3/",
            language : this.state.language,
            ques: finalData,
            initPage:this.state.fromPage,
            data:compInfo,
            compName: this.state.compName,
            marks:marks,
            compID: this.state.compID,
            selectedAgeGroup:selectedAgeGroup,
            fromPage: "quesPage",
            ageGrpsPrev:ageGrpsPrev
       })
    :
    this.props.history.push({
            pathname :"/app/competitions/edit/3/",
            language : this.state.language,
            ques: finalData,
            initPage:this.state.fromPage,
            data:compInfo,
            compName: this.state.compName,
            compID: this.state.compID,
            marks:marks,
            selectedAgeGroup:selectedAgeGroup,
            fromPage: "quesPage",
            ageGrpsPrev:ageGrpsPrev
       })
    )
  }

  render() {

    const {classes} = this.props

    return (
      <div className="App">
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.openEmpty} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="info">
        <b>No Questions Present in this Category!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.noDataAlert} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>No Question Selected!</b>
        </Alert>
      </Snackbar>

      <Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        onClick={this.handleBack }><ArrowBack/> Back </Button>
        <Button color="primary" variant="contained" style={{marginTop:'-62px',marginBottom:'15px', marginLeft:'80%'}}
        onClick={this.addToComp }>Add Question </Button>
        <MUIDataTable
          title={"Select questions"}
          data={this.state.data.map(item => {return [
            item.caption,
            item.domain,
            item.type,
            item.quesLevel,
            item.country,
            item.background,
            item.questionID,
            item.opt1,
            item.opt2,
            item.opt3,
            item.opt4,
          ]})}
          columns={columns}
          options={{
            filterType: "checkbox",
            print: false,
            download: false,
            viewColumns: false,
            onRowsSelect: selectedRows => this.onSelectRows(selectedRows),
            onRowClick: item => this.rowClick(item),
            textLabels: {
                body: {
                    noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                },
            },
            customToolbarSelect: selectedRows => null
          }} />
        {/*<Backdrop className={classes.backdrop}  open={this.state.openprogress}  >
          <CircularProgress  color="primary" />
          <Typography component="h1" style={{color:"black"}}><b> Please Wait..</b></Typography>
        </Backdrop>*/}
      </div>
    );
  }
}

export default withStyles(styles)(AddQuestions)