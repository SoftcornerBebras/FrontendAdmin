import React,{Component, useEffect,useState} from "react";
import { Grid, InputAdornment, TextField, Button, CircularProgress,
  Menu, MenuItem, Box, Typography} from '@material-ui/core';
import PageTitle from "../../components/PageTitle/PageTitle";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Select from 'react-select'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from "@material-ui/core/FormHelperText";
import MUIDataTable from "mui-datatables";
import IconButton from '@material-ui/core/IconButton';
import {Edit, Visibility, ArrowDropDown, Search} from "@material-ui/icons"
import axios from 'axios'
import {baseURL} from '../constants'

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260",//warning
  declined: "#FF5C93", //secondary
};
const styles = theme => ({
  formControl: {
    minWidth: 120
  },
  input: {
    display: "none"
  }
});
const headerList=["Caption","Identifier","Domain","Type","Language","Country",
  {name:"CS Skills",options:{display:false,filter:false,viewColumns:false}},
  {name:"Background",options:{display:false,filter:false,viewColumns:false}},
  {name:"questionTranslationID",options:{display:false,filter:false,viewColumns:false}},
  {name:"questionID",options:{display:false,filter:false,viewColumns:false}},
  {name:"Explanation",options:{display:false,filter:false,viewColumns:false}},
  {name:"Option 1",options:{display:false,filter:false,viewColumns:false}},
  {name:"Option 2",options:{display:false,filter:false,viewColumns:false}},
  {name:"Option 3",options:{display:false,filter:false,viewColumns:false}},
  {name:"Option 4",options:{display:false,filter:false,viewColumns:false}},
  {name:"Correct Option",options:{display:false,filter:false,viewColumns:false}},
  {name:"Ans Text",options:{display:false,filter:false,viewColumns:false}}
];
var limit1=1, limit2=10 , constant= 10;
class Questions extends React.PureComponent{

    constructor(props)
    {
      super(props);
      this.state = {
        getValue:[],
        page:0,
        nextLinkQ:'',
        prevLinkQ:'',
        nextLinkO:'',
        prevLinkO:'',
        countRows:0,
        countRows2:0,
        pageSize:10,    //change page size here
        anchorEl:null,
        searchValue:"",
        isProcessing:false,
        file:"",
        open_error:false,
        open_success:false,
        years:[],
        getValue2:[],
        nextLink2:'',
        prevLink2:'',
        redirect:false,
        norecords:false,
      }
    };


  async componentDidMount ()
  {
    localStorage.setItem("countAQ",1);

    if(localStorage.getItem("insertStatus")=="Complete"){
        localStorage.setItem("insertStatus","")
        window.location.reload()
    }

    let k=0,cnt=0;
    try{

    let gresAll,gresOpt,gresSkills;
    let arr = [[]];


          gresAll = await axios.get(
          baseURL+'api/ques/viewQuestions/', {
               headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
          ).catch(error=>{this.setState({open_error:true})});

          let gResQues = gresAll.data.Questions.results
          let gResAns = gresAll.data.Options
          for(var i = 0; i<gResQues.length;i++)
          {
              let {questionTranslationID, optionTranslationID, ansText} = gResQues[i];

              let languageO , translationO , optID , optTransO;

              let cnt = 0;
              gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+gResQues[i].questionTranslationID.questionID.questionID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});
              let quesID = gResQues[i].questionTranslationID.questionID.questionID
              let arr = gResAns.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gResQues[i].questionTranslationID.languageCodeID.codeName)
               var correctOption
               if(optionTranslationID!= null)
               {
                  correctOption = optionTranslationID.translationO.option
               }
               else
               {
                   correctOption = ansText
               }
            if(arr.length!=0){
              this.setState(prevState => ({getValue:[...prevState.getValue, {
              questionID : gResQues[i].questionTranslationID.questionID.questionID,
              identifier: gResQues[i].questionTranslationID.Identifier,
              quesTransID:gResQues[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gResQues[i].questionTranslationID.translation.caption,
              background: gResQues[i].questionTranslationID.translation.background,
              explanation: gResQues[i].questionTranslationID.translation.explanation,
              countryName: gResQues[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gResQues[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gResQues[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gResQues[i].questionTranslationID.languageCodeID.codeName,
              option1:arr[0].translationO.option,
              option2:arr[1].translationO.option,
              option3:arr[2].translationO.option,
              option4:arr[3].translationO.option,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
            else {
              this.setState(prevState => ({getValue:[...prevState.getValue, {
              questionID : gResQues[i].questionTranslationID.questionID.questionID,
              identifier: gResQues[i].questionTranslationID.Identifier,
              quesTransID:gResQues[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gResQues[i].questionTranslationID.translation.caption,
              background: gResQues[i].questionTranslationID.translation.background,
              explanation: gResQues[i].questionTranslationID.translation.explanation,
              countryName: gResQues[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gResQues[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gResQues[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gResQues[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
          }
              this.setState({nextLinkQ:gresAll.data.Questions.links.next,pageSize:gresAll.data.Questions.page_size,prevLinkQ:gresAll.data.Questions.links.previous,countRows:gresAll.data.Questions.count})
              // this.setState({limit1:this.state.limit1+10,limit2:this.state.limit2+10})

      }catch(error){
        this.props.history.push('/app/dashboard')
      }
  }


handleClick = (event) => {
    Boolean(this.state.anchorEl) ? this.setState({anchorEl:null}) :
   this.setState({anchorEl:event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl:null, openBulk:false, isProcessing:false,file:""});
  };

    async handlePageChange() {
    let k=0,cnt=0;
    let gresAll,gresOpt,gresSkills;
    let arr = [[]];
    try{

       if(this.state.nextLinkQ!=null)  {
        gresAll = await axios.get(
          this.state.nextLinkQ, {
              headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
          ).catch(error=>{this.setState({open_error:true})});

          let gResQues = gresAll.data.Questions.results
          let gResAns = gresAll.data.Options

          for(var i = 0; i<gResQues.length;i++)
          {
              let {questionTranslationID, optionTranslationID, ansText} = gResQues[i];

              let languageO , translationO , optID , optTransO;

              let cnt = 0;
              gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+gResQues[i].questionTranslationID.questionID.questionID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});
              let quesID = gResQues[i].questionTranslationID.questionID.questionID
              let arr = gResAns.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gResQues[i].questionTranslationID.languageCodeID.codeName)
               var correctOption
               if(optionTranslationID!= null)
               {
                  correctOption = optionTranslationID.translationO.option
               }
               else
               {
                   correctOption = ansText
               }
            if(arr.length!=0){
              this.setState(prevState => ({getValue:[...prevState.getValue, {
              questionID : gResQues[i].questionTranslationID.questionID.questionID,
              identifier: gResQues[i].questionTranslationID.Identifier,
              quesTransID:gResQues[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gResQues[i].questionTranslationID.translation.caption,
              background: gResQues[i].questionTranslationID.translation.background,
              explanation: gResQues[i].questionTranslationID.translation.explanation,
              countryName: gResQues[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gResQues[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gResQues[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gResQues[i].questionTranslationID.languageCodeID.codeName,
              option1:arr[0].translationO.option,
              option2:arr[1].translationO.option,
              option3:arr[2].translationO.option,
              option4:arr[3].translationO.option,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
            else {
              this.setState(prevState => ({getValue:[...prevState.getValue, {
              questionID : gResQues[i].questionTranslationID.questionID.questionID,
              identifier: gResQues[i].questionTranslationID.Identifier,
              quesTransID:gResQues[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gResQues[i].questionTranslationID.translation.caption,
              background: gResQues[i].questionTranslationID.translation.background,
              explanation: gResQues[i].questionTranslationID.translation.explanation,
              countryName: gResQues[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gResQues[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gResQues[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gResQues[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
          }
              this.setState({nextLinkQ:gresAll.data.Questions.links.next,pageSize:gresAll.data.Questions.page_size,prevLinkQ:gresAll.data.Questions.links.previous,countRows:gresAll.data.Questions.count})

      }}catch(error){
        this.props.history.push('/app/dashboard')
      }
  }

 handleChange = event => {
    this.setState({file:event.target.files[0]});
    document.getElementById('errBulk').style.display = "none";
  }

  handleUpload = () => {
    if (this.state.file == "") {
      document.getElementById('errBulk').style.display = "block";
      return;
    }
    this.setState({isProcessing:true});
     var bodyFormData = new FormData();
     bodyFormData.append('data',JSON.stringify({"modified_by":localStorage.getItem('username')}) );
     bodyFormData.append('text', this.state.file);
    try{
    axios({
        method: 'post',
        url: baseURL+'api/cmp/bulkUploadQuestions/',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' ,Authorization:"Token "+localStorage.getItem('id_token')}
        })
        .then(response =>{
           if(response.data=='Redirect'){
               this.setState({redirect:true})
           }else {
          this.setState({open_success:true,isProcessing:false,file:""});
        setTimeout(()=>{
          this.setState({openBulk:false});
          window.location.reload()
        },2000);}
        })
        }catch(error) {
            axios.get(baseURL+'api/cmp/rollBackQuestion/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }).catch(error=>{})
            this.setState({open_error:true,isProcessing:false});
        }
  }

  handleAlertClose = () =>{
    this.setState({open_error:false,open_success:false,norecords:false});
  }

  handleChangeData = data => {
    this.setState({getValue2:[]})
    this.getSearchedData(data)
  }
  enterPressAlert = (e) => {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { //Enter keycode
     this.getSearchedData(e.target.value)
    }
  }

  handleSearchChange = newValue => {
    this.setState({searchValue:newValue,getValue2:[]})
  }

  async getSearchedData(data){
    let gResult = await axios.post(baseURL + 'api/ques/getQuesSearch/',{"feed":data},
      {headers: { Authorization:"Token "+localStorage.getItem('id_token')}}
      ).catch(error => {this.setState({open_error:true})})
      console.log(gResult)
    let gresSkills
    let gresAll = (gResult.data.Questions)
    let gresOpt = (gResult.data.Options)

    if(gresAll.length==0){
         this.setState({norecords:true})
         document.getElementById('QuestionSearch').style.display="none"
      }
      else{
       document.getElementById('QuestionSearch').style.display="block"
      }

     for(var i = 0; i<gresAll.length;i++)
          {
              let {questionTranslationID, optionTranslationID,ansText} = gresAll[i];

               let quesID = gresAll[i].questionTranslationID.questionID.questionID
                gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+quesID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});
              let arr=gresOpt.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gresAll[i].questionTranslationID.languageCodeID.codeName)
               var correctOption
               if(optionTranslationID!= null)
               {
                  correctOption = optionTranslationID.translationO.option
               }
               else
               {
                   correctOption = ansText
               }

            if(arr.length!=0){
              this.setState(prevState => ({getValue2:[...prevState.getValue2, {
              questionID : gresAll[i].questionTranslationID.questionID.questionID,
              identifier: gresAll[i].questionTranslationID.Identifier,
              quesTransID:gresAll[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll[i].questionTranslationID.translation.caption,
              background: gresAll[i].questionTranslationID.translation.background,
              explanation: gresAll[i].questionTranslationID.translation.explanation,
              countryName: gresAll[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll[i].questionTranslationID.languageCodeID.codeName,
              option1:arr[0].translationO.option,
              option2:arr[1].translationO.option,
              option3:arr[2].translationO.option,
              option4:arr[3].translationO.option,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
            else {
                 this.setState(prevState => ({getValue2:[...prevState.getValue2, {
              questionID : gresAll[i].questionTranslationID.questionID.questionID,
              identifier: gresAll[i].questionTranslationID.Identifier,
              quesTransID:gresAll[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll[i].questionTranslationID.translation.caption,
              background: gresAll[i].questionTranslationID.translation.background,
              explanation: gresAll[i].questionTranslationID.translation.explanation,
              countryName: gresAll[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
          }
             this.setState({page:0,pageSize:gresAll.page_size,countRow2:gresAll.count})
  }

  handleAlertRedirect=()=>{
     this.props.history.push('/app/competitions/addGroups')
  }

  render() {
    const { classes } = this.props;
  return (

    <>
      <PageTitle title="Questions" />

      <Grid item >
          <TextField
            placeholder='Search'
            onKeyPress={e => this.enterPressAlert(e)}
            className = {classes.root}
            style={{width:"300px",height:'20px', marginLeft:'30%',marginTop:'-3%',marginBottom: '-10px'}}
            value={this.state.searchValue}
            onChange={ e => this.handleSearchChange(e.target.value)}
            InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                  endAdornment:(
              <InputAdornment position="end">
                <IconButton
                  onClick={()=>this.handleChangeData(this.state.searchValue)}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            )
            }}
          />
        </Grid>

      <Snackbar open={this.state.open_error} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
        <b>Error Occured!</b>
        </Alert>
      </Snackbar>
       <Snackbar open={this.state.norecords} autoHideDuration={3000} onClose={this.handleAlertClose} anchorOrigin={{ vertical:'top', horizontal:'center'} }>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="warning">
          No Records found!
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.open_success} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="success">
        <b>Bulk Upload done successfully!</b>
        </Alert>
      </Snackbar>
      <Snackbar open={this.state.redirect} autoHideDuration={3000} anchorOrigin={{ vertical:'center', horizontal:'center'} }
         onClose={this.handleAlertRedirect}>
        <Alert onClose={this.handleAlertRedirect} variant="filled" severity="warning">
        <b>No age groups! You'll be redirected to Age Groups' page..</b>
        </Alert>
      </Snackbar>
     <Button color="primary" variant="contained" style={{ marginBottom: '10px',marginLeft:'90%',marginTop:'-8%' }}
      onClick={e=>this.handleClick(e)}>
      ADD <ArrowDropDown/></Button>
      <Menu
        id="simple-menu"
        anchorEl={this.state.anchorEl}
        keepMounted
        open={Boolean(this.state.anchorEl)}
        onClose={this.handleClose}
        style={{marginTop:'50px'}}
      >
        <MenuItem onClick={() => this.props.history.push("/app/question/add")}>Single Question</MenuItem>
        <MenuItem onClick={() => this.setState({openBulk:true})}>In Bulk</MenuItem>
      </Menu>
      <Grid container spacing={4}>
      {this.state.searchValue === "" ?
      <Grid item xs={12} id="QuestionList" style={{zIndex:"0"}}>
        <MUIDataTable
            title="Questions  List"
            data={this.state.getValue.map(item => {
              return [
                  item.caption,
                  item.identifier,
                  item.domainName,
                  item.questionType.toUpperCase(),
                  item.language.toUpperCase(),
                  item.countryName.toUpperCase(),
                  item.csSkills,
                  item.background,
                  item.quesTransID,
                  item.questionID,
                  item.explanation,
                  item.option1,
                  item.option2,
                  item.option3,
                  item.option4,
                  item.correctOption,
                  item.ansText
                  ]
          })}
           columns={headerList}
              options={{
               selectableRows:false,
               page:this.state.page,
               onRowClick:item=>func(item,this.props.history),
               rowsPerPage: this.state.pageSize,
               print:false,
               download:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRows ,
                onChangePage: () => this.handlePageChange(),
                textLabels: {
                  body: {
                      noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                  },
                },
             }}
              />

        </Grid> :
            <Grid item xs={12} id="QuestionSearch" style={{zIndex:"0",display:"none"}}>
        <MUIDataTable
            title="Questions  List"
            data={this.state.getValue2.map(item => {
              return [
                  item.caption,
                  item.identifier,
                  item.domainName,
                  item.questionType.toUpperCase(),
                  item.language.toUpperCase(),
                  item.countryName.toUpperCase(),
                  item.csSkills,
                  item.background,
                  item.quesTransID,
                  item.questionID,
                  item.explanation,
                  item.option1,
                  item.option2,
                  item.option3,
                  item.option4,
                  item.correctOption,
                  item.ansText
                  ]
          })}
           columns={headerList}
              options={{
               selectableRows:false,
               page:this.state.page,
               onRowClick:item=>func(item,this.props.history),
               rowsPerPage: this.state.pageSize,
               print:false,
               download:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRow2 ,
                textLabels: {
                  body: {
                      noMatch: <CircularProgress variant='indeterminate' style={{color:'primary'}}/>,
                  },
                },
             }}
              />

        </Grid>
        }

      </Grid>
      <>
      <Dialog open={this.state.openBulk} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Bulk Upload</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To upload questions in bulk, upload an excel file and make sure the file is in the given format.
            To check format, visit the FAQs page.
          </DialogContentText>
          <>
          <input
            className={classes.input}
            accept=".csv"
            id="contained-button-file"
            type="file"
            onChange={e => this.handleChange(e)} />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              float="left"
            >
              Choose File
            </Button>
          </label> {this.state.file.name}
          <FormHelperText
            id="errBulk"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
          </>
        </DialogContent>
        <DialogActions>
          {this.state.isProcessing ? (
          <CircularProgress size={26} />
        ) : (
          <Button onClick={this.handleUpload} color="primary">
            Upload
          </Button>
          )}
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      </>
    </>
  );
  }
}
Questions.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Questions);

function func(rowData,history)
{
  var data = [{
    questionID : rowData[9],
    identifier: rowData[1],
    quesTransID:rowData[8],
    csSkills : rowData[6],
    caption: rowData[0],
    background: rowData[7],
    explanation: rowData[10],
    countryName: rowData[5],
    domainName:rowData[2],
    questionType:rowData[3],
    language:rowData[4],
    option1:rowData[11],
    option2:rowData[12],
    option3:rowData[13],
    option4:rowData[14],
    correctOption:rowData[15],
    ansText:rowData[16]
  }]
  history.push({pathname:'/app/question/details',data:data[0]})
}
