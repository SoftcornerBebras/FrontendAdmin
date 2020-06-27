import React,{Component, useEffect,useState} from "react";
import Grid from '@material-ui/core/Grid';
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
import {Button, CircularProgress, Menu, MenuItem, Box, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import {Edit, Visibility, ArrowDropDown} from "@material-ui/icons"
import {Link} from 'react-router-dom';
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
const headerList=["Caption","Identifier","Domain","Type","Language","Country","Edit","Details"];
var limit1=1, limit2=10 , constant= 10;
class Questions extends React.PureComponent{

    constructor(props)
    {
      super(props);
      this.state = {
        getValue:[],
        nextLinkQ:'',
        prevLinkQ:'',
        nextLinkO:'',
        prevLinkO:'',
        countRows:0,
        countRows2:0,
        pageSize:10,    //change page size here
        anchorEl:null,
        limit1:1,
        limit2:10,
        isProcessing:false,
        file:"",
        open_error:false,
        open_success:false,
        years:[],
        selectedYear:"",
        getValue2:[],
        nextLink2:'',
        prevLink2:'',
        redirect:false,
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
    let gyear = await axios.get(baseURL+'api/cmp/getYears/',{
        headers:{
             'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
         }
     }).catch(error => {
        this.setState({open_error:true})
     });
     let yearData = gyear.data.data
    for(let i = 0 ; i < yearData.length ; i ++) {
      this.setState(prevState => ({years:[...prevState.years,{"label":yearData[yearData.length-1-i].substring(0,4),
      "value":yearData[yearData.length-1-i].substring(0,4)}]}))
    }
    let gresAll,gresOpt,gresSkills;
    let arr = [[]];


          gresAll = await axios.get(
          baseURL+'api/ques/viewQuestions/', {
               headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
          ).catch(error=>{this.setState({open_error:true})});
          gresOpt = await axios.get(
          baseURL+'api/ques/getOptions/'+this.state.limit1+'&'+this.state.limit2+'/', {
               headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
          ).catch(error=>{this.setState({open_error:true})});
          for(var i = 0; i<gresAll.data.results.length;i++)
          {
              let {questionTranslationID, optionTranslationID, ansText} = gresAll.data.results[i];

              let languageO , translationO , optID , optTransO;

              let cnt = 0;
              gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+gresAll.data.results[i].questionTranslationID.questionID.questionID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});
              let quesID = gresAll.data.results[i].questionTranslationID.questionID.questionID
              let arr;
              arr=gresOpt.data.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gresAll.data.results[i].questionTranslationID.languageCodeID.codeName)
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
              questionID : gresAll.data.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.data.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.data.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.data.results[i].questionTranslationID.translation.caption,
              background: gresAll.data.results[i].questionTranslationID.translation.background,
              explanation: gresAll.data.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.data.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.data.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.data.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.data.results[i].questionTranslationID.languageCodeID.codeName,
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
              questionID : gresAll.data.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.data.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.data.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.data.results[i].questionTranslationID.translation.caption,
              background: gresAll.data.results[i].questionTranslationID.translation.background,
              explanation: gresAll.data.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.data.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.data.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.data.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.data.results[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
          }
              this.setState({nextLinkQ:gresAll.data.links.next,pageSize:gresAll.data.page_size,prevLinkQ:gresAll.data.links.previous,countRows:gresAll.data.count})
              this.setState({limit1:this.state.limit1+10,limit2:this.state.limit2+10})

      }catch(error){this.props.history.push('/app/dashboard')}
  }


handleClick = (event) => {
    Boolean(this.state.anchorEl) ? this.setState({anchorEl:null}) :
   this.setState({anchorEl:event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl:null, openBulk:false});
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
          gresOpt = await axios.get(
          baseURL+'api/ques/getOptions/'+this.state.limit1+'&'+this.state.limit2+'/', {
               headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
          ).catch(error=>{this.setState({open_error:true})});

          for(var i = 0; i<gresAll.data.results.length;i++)
          {
              let {questionTranslationID, optionTranslationID,ansText} = gresAll.data.results[i];

              let languageO , translationO , optID , optTransO;

              let cnt = 0;
                 gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+gresAll.data.results[i].questionTranslationID.questionID.questionID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});

               let quesID = gresAll.data.results[i].questionTranslationID.questionID.questionID
              let arr;
              arr=gresOpt.data.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gresAll.data.results[i].questionTranslationID.languageCodeID.codeName)

              var correctOption
               if(optionTranslationID!= null)
               {
                  correctOption = optionTranslationID.translationO.option
               }
               else
               {
                   correctOption = ansText
               }

               if(arr.length!=0) {
              this.setState(prevState => ({getValue:[...prevState.getValue, {
              questionID : gresAll.data.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.data.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.data.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.data.results[i].questionTranslationID.translation.caption,
              background: gresAll.data.results[i].questionTranslationID.translation.background,
              explanation: gresAll.data.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.data.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.data.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.data.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.data.results[i].questionTranslationID.languageCodeID.codeName,
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
              questionID : gresAll.data.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.data.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.data.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.data.results[i].questionTranslationID.translation.caption,
              background: gresAll.data.results[i].questionTranslationID.translation.background,
              explanation: gresAll.data.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.data.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.data.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.data.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.data.results[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
            }
              this.setState({nextLinkQ:gresAll.data.links.next,pageSize:gresAll.data.page_size,prevLinkQ:gresAll.data.links.previous,countRows:gresAll.data.count})
              this.setState({limit1:this.state.limit1 +10,limit2:this.state.limit2+10})
    }
     }catch(error){ this.setState({open_error:true})};
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
    this.setState({open_error:false,open_success:false});
  }



   handleChangeYear = (year)=> {
    this.setState({selectedYear:year,getValue2:[]});
    this.getQuesYearWise(year)

  }

  async getQuesYearWise(year){
    let gResult = await axios.get(baseURL + 'api/ques/getQuesYearWise/'+year.value+'/',{headers: { Authorization:"Token "+localStorage.getItem('id_token')}}).catch(error => {this.setState({open_error:true})})
    let gresSkills
    let gresAll = (gResult.data.Questions)
    let gresOpt = (gResult.data.Options)

     for(var i = 0; i<gresAll.results.length;i++)
          {
              let {questionTranslationID, optionTranslationID,ansText} = gresAll.results[i];

               let quesID = gresAll.results[i].questionTranslationID.questionID.questionID
                gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+quesID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});
              let arr;
              arr=gresOpt.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gresAll.results[i].questionTranslationID.languageCodeID.codeName)
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
              questionID : gresAll.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.results[i].questionTranslationID.translation.caption,
              background: gresAll.results[i].questionTranslationID.translation.background,
              explanation: gresAll.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.results[i].questionTranslationID.languageCodeID.codeName,
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
              questionID : gresAll.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.results[i].questionTranslationID.translation.caption,
              background: gresAll.results[i].questionTranslationID.translation.background,
              explanation: gresAll.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.results[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
          }
              this.setState({nextLink2:gresAll.links.next,pageSize:gresAll.page_size,prevLink2:gresAll.links.previous,countRow2:gresAll.count})
  }

  async handlePageChange2() {

    let gresSkills,gresOpt,gresAll,gResult;

    try {
   if(this.state.nextLink2!=null ||this.state.nextLink2!=""){
    gResult = await axios.get(
          this.state.nextLink2, {
              headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
          ).catch(error=>{this.setState({open_error:true})});

    gresAll = (gResult.data.Questions)
    gresOpt = (gResult.data.Options)

     for(var i = 0; i<gresAll.results.length;i++)
          {
              let {questionTranslationID, optionTranslationID,ansText} = gresAll.results[i];

               let quesID = gresAll.results[i].questionTranslationID.questionID.questionID
                gresSkills = await axios.get(
                      baseURL+'api/ques/getQuesSkills/'+quesID+'/', {
                           headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
                        }
                      ).catch(error=>{this.setState({open_error:true})});
              let arr;
              arr=gresOpt.filter(elem => elem.optionID.questionID == quesID && elem.languageCodeID.codeName == gresAll.results[i].questionTranslationID.languageCodeID.codeName)
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
              questionID : gresAll.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.results[i].questionTranslationID.translation.caption,
              background: gresAll.results[i].questionTranslationID.translation.background,
              explanation: gresAll.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.results[i].questionTranslationID.languageCodeID.codeName,
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
              questionID : gresAll.results[i].questionTranslationID.questionID.questionID,
              identifier: gresAll.results[i].questionTranslationID.Identifier,
              quesTransID:gresAll.results[i].questionTranslationID.questionTranslationID,
              csSkills : gresSkills.data,
              caption: gresAll.results[i].questionTranslationID.translation.caption,
              background: gresAll.results[i].questionTranslationID.translation.background,
              explanation: gresAll.results[i].questionTranslationID.translation.explanation,
              countryName: gresAll.results[i].questionTranslationID.questionID.countryID.nicename,
              domainName:gresAll.results[i].questionTranslationID.questionID.domainCodeID.codeName,
              questionType:gresAll.results[i].questionTranslationID.questionID.questionTypeCodeID.codeName,
              language:gresAll.results[i].questionTranslationID.languageCodeID.codeName,
              option1:null,
              option2:null,
              option3:null,
              option4:null,
              correctOption: correctOption,
              ansText:ansText
            }]}));
            }
              this.setState({nextLink2:gresAll.links.next,pageSize:gresAll.page_size,prevLink2:gresAll.links.previous,countRow2:gresAll.count})
  }
    }
  }catch(error){}

  }
    handleAlertRedirect=()=>{
       this.props.history.push('/app/competitions/addGroups')
    }
  render() {
    const { classes } = this.props;
  return (

    <>
      <PageTitle title="Questions" />

      <Box style={{width : "200px", marginTop:"-3%",marginLeft:"20%",zIndex:"2000"}}>
      <Select style={{color:"red"}}
        value={this.selectedYear}
        onChange={this.handleChangeYear}
        options={this.state.years}
        placeholder="Select Year" />
      </Box>

      <Snackbar open={this.state.open_error} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
        <b>Error Occured!</b>
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
     <Button color="primary" variant="contained" style={{ marginBottom: '10px',marginLeft:'90%',marginTop:'-60px' }}
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
      {this.state.selectedYear == "" ?
      <Grid item xs={12} style={{zIndex:"0"}}>
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
                    <Link to={{
                        pathname :"/app/question/edit",
                        data : item
                   }}>
                    <IconButton >
                    <Edit />
                  </IconButton>
                  </Link>,
                  <Link to={{
                        pathname :"/app/question/details",
                        data : item
                   }}>
                    <IconButton >
                    <Visibility />
                  </IconButton>
                  </Link>
                  ]
          })}
           columns={headerList}
              options={{
               selectableRows:false,
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
            <Grid item xs={12} style={{zIndex:"0"}}>
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
                    <Link to={{
                        pathname :"/app/question/edit",
                        data : item
                   }}>
                    <IconButton >
                    <Edit />
                  </IconButton>
                  </Link>,
                  <Link to={{
                        pathname :"/app/question/details",
                        data : item
                   }}>
                    <IconButton >
                    <Visibility />
                  </IconButton>
                  </Link>
                  ]
          })}
           columns={headerList}
              options={{
               selectableRows:false,
               rowsPerPage: this.state.pageSize,
               print:false,
               download:false,
               serverSide: false,
                rowsPerPageOptions:[this.state.pageSize],
                count: this.state.countRow2 ,
                onChangePage: () => this.handlePageChange2(),
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
