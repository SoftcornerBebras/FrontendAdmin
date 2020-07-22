import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PageTitle from "../../components/PageTitle/PageTitle";
import {Redirect} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert'
import {Paper, Typography, Box, Divider, Snackbar, AppBar, Tab, Tabs, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer,
        TableHead, TableRow, TableFooter, TablePagination, Button} from '@material-ui/core';
import {baseURL} from '../constants'

const styles = theme => ({

   table: {
    minWidth: 500,
    height: 100
  },
  head:{
    text:'bold'
  }
});

class Translations extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            ansText:"",
            background:"",
            quesID:"",
            openError:false,
            quesDetail:[],
            allData:"",
            history:null
        };
    }

    async componentDidMount(){

    try{
        let quesID = this.props.allData.questionID

        this.setState({allData:this.props.allData,ansText:this.props.allData.ansText,
          background:this.props.allData.background,quesID:this.props.allData.questionID,
          history:this.props.history})
        let gresult;
        try {
            gresult = await axios.get(
            baseURL+'api/ques/getTranslations/'+quesID+'/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}}
            );
        }catch(error){this.setState({openError:true})}

        let gResQues = gresult.data.Questions
        let gResOpt = gresult.data.Options
        let questions =[], options=[]

        let ansFlag = 0, corrOption = "" , ansText = null

        let quesLang = gResQues.map((elem) =>{return (elem.questionTranslationID.languageCodeID.codeName)})
     for(let i=0;i<quesLang.length;i++){

            let elem = gResQues[i]
            let c,a;
            if(elem.ansText == null){
                c = elem.optionTranslationID.translationO.option
            }
            else if (elem.ansText != null) {
                a= elem.ansText
            }
            questions.push({
                caption:elem.questionTranslationID.translation.caption,
                language:elem.questionTranslationID.languageCodeID.codeName,
                identifier:elem.questionTranslationID.Identifier,
                questype:elem.questionTranslationID.questionID.questionTypeCodeID.codeName,
                background:elem.questionTranslationID.translation.background,
                correctOption: c,
                ansText : a
            })
            corrOption = c
            ansText = a
            if(elem.ansText != null) {
                ansFlag = 1
            }

          let cnt=0, flag = 0, optionArray=[];
          if(ansFlag == 0) {
              optionArray.length=0
              for(let j=0; j< gResOpt.length; j++) {
                  let elem = gResOpt[j]
                  if(quesLang[i] == elem.languageCodeID.codeName) {
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

            this.setState(prevState => ({quesDetail:[...prevState.quesDetail,{
              questionID:quesID,
                questionType:questions[i].questype,
                caption:questions[i].caption,
                language:questions[i].language,
                identifier:questions[i].identifier,
                background:questions[i].background,
                opt1:options[i][0].option,
                opt2:options[i][1].option,
                opt3:options[i][2].option,
                opt4:options[i][3].option,
                corrOpt: options[i][4].correctOption,
                ansText: null
            }]}))
        }
        else {

            this.setState(prevState => ({quesDetail:[...prevState.quesDetail,{
              questionID:quesID,
                questionType:questions[i].questype,
                caption:questions[i].caption,
                language:questions[i].language,
                identifier:questions[i].identifier,
                background:questions[i].background,
                opt1:"",
                opt2:"",
                opt3:"",
                opt4:"",
                corrOpt: "",
                ansText: options[i].ansText
            }]}))
        }
      }
    }catch(error){this.state.history.push('/app/dasboard')
    }
    }

    handleAlertClose=()=>{this.setState({openError:false})}

    goToPreview = (e,row) => {
      this.state.history.push({
        pathname:'/app/question/preview',
        allData:this.state.allData,
        fromPage:'QuesTransPrev',
        previewData:row
      })
    }

    render() {
        const { classes } = this.props;

        return (
            <>
             <Snackbar open={this.state.openError} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
                 onClose={this.handleAlertClose}>
                <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
                <b>Error Occured!</b>
                </Alert>
              </Snackbar>
            <Button color="primary" variant="contained" style={{ marginBottom: '50px',marginLeft:'90%'}}
                 onClick={() => this.props.history.push({pathname:"/app/question/detail/add",state:{questionID:this.state.quesID,ansText:this.state.ansText,background:this.state.background}})}>
            Add</Button>
            <Table className={classes.table} aria-label="custom pagination table" style={{marginTop:'-10px'}}>
            <TableHead >
            <TableRow>
              <TableCell component="th" scope="row" width = '50%'className={classes.head}>Caption</TableCell>
              <TableCell component="th" scope="row" width = '25%'className={classes.head}>Identifier</TableCell>
              <TableCell component="th" scope="row" width = '25%'className={classes.head}>Languages</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
             {this.state.quesDetail
                .map((row) => {
                return (
                <TableRow onClick={e=>this.goToPreview(e,row)} >
                  <TableCell align="left">{row.caption}</TableCell>
                  <TableCell align="left">{row.identifier}</TableCell>
                  <TableCell align="left">{row.language.toUpperCase()}</TableCell>
                </TableRow>
               )})}
            </TableBody>
              </Table>
            </>
        );
    }
}

export default withStyles(styles)(Translations);
