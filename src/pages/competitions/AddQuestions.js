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
import {selectedAgeGroup} from './CreateCompetition'
import {selectedAgeGroupUpdate, selectedAgeGroupEdit} from './UpdateCompetition'


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
  }
];

let finalData=[];
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
      openError:false
    }
  }

  async componentDidMount() {
    try{
        this.setState({ageGroup:this.props.location.ageGroup,
          language:this.props.location.language,
          fromPage:this.props.location.fromPage,
          compName: this.props.location.compName,
          compID:this.props.location.compID
        })
        let gAddQues = ""
        if(this.props.location.fromPage === "createComp") {
             gAddQues = await axios.get(baseURL+'api/cmp/getQuesAgeAll/'+selectedAgeGroup.AgeGroupID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
          }).catch(error => {
                this.setState({openError:true})
          });
        }
         if(this.props.location.fromPage === "addNewGroup") {
            gAddQues = await axios.get(baseURL+'api/cmp/getQuesAgeAll/'+selectedAgeGroupUpdate.AgeGroupID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
          }).catch(error => {
                this.setState({openError:true})
          });
         }
         if(this.props.location.fromPage === "editDetails") {

            gAddQues = await axios.get(baseURL+'api/cmp/getQuesAge/'+selectedAgeGroupEdit.AgeGroupID+"&"+this.props.location.compID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
          }).catch(error => {
                this.setState({openError:true})
          });
        }

        let apiData = gAddQues.data
        let ques = apiData.QuesAge
        let quesTrans = apiData.QuesTrans

        let quesIDs =[]
        for(let i=0; i< ques.length; i++) {
          quesIDs.push({id:ques[i].questionID, level : ques[i].questionLevelCodeID.codeName})
        }

        for(let j=0;j<quesTrans.length;j++) {
          for(let i=0; i<quesIDs.length;i++){
            if(quesTrans[j].questionID.questionID === quesIDs[i].id && 
              quesTrans[j].languageCodeID.codeName === this.props.location.language ) {
             this.setState(prevState => ({data:[...prevState.data,{
                questionID: quesTrans[j].questionID.questionID,
                questionTransID: quesTrans[j].questionTranslationID,
                country: quesTrans[j].questionID.countryID.nicename,
                caption: quesTrans[j].translation.caption,
                domain: quesTrans[j].questionID.domainCodeID.codeName,
                type: quesTrans[j].questionID.questionTypeCodeID.codeName,
                quesLevel: quesIDs[i].level
              }]}))
            }
          }
        }
    }
    catch(error){
      this.props.history.push('/app/dashboard')
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
    compID: this.state.compID,
    fromPage: "quesPage"})
  }

  render() {

    return (
      <div className="App">
      <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
      <Button color="primary" variant="contained" style={{marginBottom:'2px'}}onClick={this.handleBack }><ArrowBack/> Back </Button>
        <MUIDataTable
          title={"Select questions"}
          data={this.state.data}
          columns={columns}
          options={{
            filterType: "checkbox",
            print: false,
            download: false,
            viewColumns: false,
            onRowClick: rowData => this.rowClick(rowData),
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

