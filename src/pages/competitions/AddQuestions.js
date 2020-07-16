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
import {Link} from 'react-router-dom';
import axios from 'axios'
import {baseURL} from '../constants'


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

let finalData=[],selectedAgeGroup;
export default class AddQuestions extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      ageGroup:"",
      language:"",
      fromPage:"",
      compName:"",
      compID:"",
      openError:false,
    }
  }

  async componentDidMount() {
    try{

        selectedAgeGroup = this.props.location.selectedAgeGroup

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
        console.log(gAddQues)
        let ques = gAddQues.data.QuesAge
        let quesTrans = gAddQues.data.Questions
        let opt = gAddQues.data.Options
        console.log(opt)
        let quesIDs =[], questions=[],options=[]
        for(let i=0; i< ques.length; i++) {
          quesIDs.push({quesID:ques[i].questionID, quesLevel : ques[i].questionLevelCodeID.codeName})
        }
       console.log(quesIDs)
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
              console.log(elem.questionTranslationID.questionID.questionID)
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
         console.log(questions)
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
       console.log(options)
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
      console.log(error)
      // this.props.history.push('/app/dashboard')
    }
  }

  handleClose = () => {
    this.setState({openError:false})
  }

  handleBack = () => {
  this.props.history.push({
    pathname :"/app/competitions/create/3/",
    data : {
      ageGroup : this.state.ageGroup,
      language : this.state.language,
      ques: [],
      initPage:this.state.fromPage,
    },
    compName: this.state.compName,
    selectedAgeGroup:selectedAgeGroup,
    compID: this.state.compID,
    fromPage: "quesPage"})
  }

  rowClick = (rowData) => {
  console.log(rowData)
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
      data : {
        ageGroup : this.state.ageGroup,
        language : this.state.language,
        previewData:data[0]
      },
      compName: this.state.compName,
      selectedAgeGroup:selectedAgeGroup,
      compID: this.state.compID,
      fromPage: this.state.fromPage,
    })
  }

  render() {
console.log(this.state.data)
    return (
      <div className="App">
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        onClick={this.handleBack }><ArrowBack/> Back </Button>
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
            onRowClick: item => this.rowClick(item),
            textLabels: {
                body: {
                    noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                },
            },
            customToolbarSelect: selectedRows => (
              <Tooltip title="Add to Competition">
                <IconButton
                  onClick={() => {
                    finalData.length=0;
                    for(let i = 0 ; i < selectedRows.data.length ; i++ ) {
                      finalData.push(this.state.data[selectedRows.data[i].index])
                    }
                  }}
                >
                { this.state.fromPage === "createComp" ?
                <Link to={{
                        pathname :"/app/competitions/create/3/",
                        data : {
                          ageGroup : this.state.ageGroup,
                          language : this.state.language,
                          ques: finalData,
                          initPage:this.state.fromPage,
                        },
                        compName: this.state.compName,
                        compID: this.state.compID,
                        fromPage: "quesPage"
                   }}>
                  <AddIcon />
                </Link> : (
                this.state.fromPage === "addNewGroup" ?
                <Link to={{
                        pathname :"/app/competitions/update/3/",
                        data : {
                          ageGroup : this.state.ageGroup,
                          language : this.state.language,
                          ques: finalData,
                          initPage:this.state.fromPage
                        },
                        compName: this.state.compName,
                        compID: this.state.compID,
                        fromPage: "quesPage"
                   }}>
                  <AddIcon />
                </Link>
                :
                <Link to={{
                        pathname :"/app/competitions/edit/3/",
                        data : {
                          ageGroup : this.state.ageGroup,
                          language : this.state.language,
                          ques: finalData,
                          initPage:this.state.fromPage
                        },
                        compName: this.state.compName,
                        compID: this.state.compID,
                        fromPage: "quesPage"
                   }}>
                  <AddIcon />
                </Link>
                )}
                </IconButton>
              </Tooltip>
            )
          }}
        />
      </div>
    );
  }
}

