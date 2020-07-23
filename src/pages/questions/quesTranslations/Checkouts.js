import React from "react";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import QuestionsForm,{ setDataQues } from "./QuestionsForm";
import AnswersForm,{ setDataAnswers, requiredAnswers } from "./AnswersForm";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert'
import Background,{ setDataB, requiredBackground  } from "./Background";
import {Snackbar,Dialog, DialogTitle, DialogActions,
        DialogContent, DialogContentText, CircularProgress} from '@material-ui/core';
import Review,{quesInfo, quesString, options, answer } from './Review'
import AnswerExplanation,{ setAnsExp } from "./AnswerExplanation"

import axios from 'axios'
import {baseURL} from '../../constants'

export const errorArr = [
  { name: "Step1", desc: ""},
  { name: "Step2", desc: ""},
  { name: "Step3", desc: ""},
  { name: "Step4", desc: ""}
];

const styles =theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      //width: 600,
      marginLeft: "160px",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      width:'900px',
      marginTop: theme.spacing(6),
      marginLeft: "2%",
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
});

const steps = [
  "Question Details",  //0
  "Question Explanation",   //1
  "Answers Details",        //2
  "Answer Explanation",     //3
  "Review Question"     //4
];

function getStepContent(step) {
   switch (step) {
    case 0:
      return <Background />;
    case 1:
      return <QuestionsForm />
    case 2:
      return <AnswersForm />;
    case 3:
      return <AnswerExplanation />;
    case 4:
      return <Review />;
  }
}

export let languages=[],imgsOpt=[], AnsText, BackgroundData;
class CheckOut extends React.PureComponent {

  state={
    activeStep:0,
    onClick:false,
    ansText:"",
    quesID:"",
    urlo1 : "",
    urlo2 : "",
    urlo3 : "",
    urlo4 : "",
    qimglist:[],
    url:'',
    rerender:false,
    openError:false,
  }

  async componentDidMount(){

    try {

    languages=[];
    this.clearData()

    AnsText = this.props.location.state.ansText;
    this.setState({ansText:this.props.location.state.ansText,
                    quesID:this.props.location.state.questionID})

    let gLanguage = await axios.get(baseURL + 'api/com/getLanguage/',{
        headers:{
            Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });
    for(let i = 0; i<gLanguage.data.length ; i++) {
        languages.push(gLanguage.data[i].codeName);
    }
      let x = new DOMParser().parseFromString(this.props.location.state.background,"text/html");
      let imgs = x.documentElement.querySelectorAll("img")
      for(let i=0;i<imgs.length;i++){
        quesString[0].imgs.push(imgs[i].outerHTML)
      }

       let gres = await axios.get(
        baseURL+'api/ques/getImages/'+this.state.quesID+'/', {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
        ).catch(error => {
        this.setState({openError:true})
    });
        quesString[1].imgs.length=0
        if(gres.data.qimg.length>0)
         {
            for(var i=0; i < gres.data.qimg.length;i++)
           {
             this.setState({
              url : baseURL + gres.data.qimg[i].uploadedFile,
             })
             this.setState(prev=>({qimglist:[...prev.qimglist,baseURL + gres.data.qimg[i].uploadedFile]}))
             let imgDiv = "<div><img src = \""+(baseURL + gres.data.qimg[i].uploadedFile)+"\" style=\"max-height:100%;max-width:100%;min-height:0px;min-width:0px\" /></div>"
             let img = new DOMParser().parseFromString(imgDiv,"text/html").documentElement.querySelectorAll("div")[0].innerHTML;
             quesString[1].imgs.push(img)
           }
         }
        if(gres.data.oimg1!="empty")
        {
          if(gres.data.oimg1.length>0 && gres.data.oimg2.length>0 && gres.data.oimg3.length>0 && gres.data.oimg4.length>0)
          {
            this.setState({
              urlo1 : baseURL + gres.data.oimg1[0].uploadedFile,
              urlo2 : baseURL + gres.data.oimg2[0].uploadedFile,
              urlo3 : baseURL + gres.data.oimg3[0].uploadedFile,
              urlo4 : baseURL + gres.data.oimg4[0].uploadedFile,
              opt1:"",opt2:"",opt3:"",opt4:""
            });
          }
        }

    options[0].imgURL = this.state.urlo1
    options[1].imgURL = this.state.urlo2
    options[2].imgURL = this.state.urlo3
    options[3].imgURL = this.state.urlo4

    this.setState({rerender:true})

    }catch(error){
        this.props.history.push('/app/dashboard')
     }
  }

  displayAlert = () => {
    return (
      <React.Fragment>
       <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Do you really want to add the question?</Typography>
            </DialogContentText>
            </DialogContent>
           <DialogActions>
            {this.state.isProcessing ? (
            <CircularProgress size={26} />
            ) : (<>
            <Button onClick={this.insertQues} color="primary">
              Yes
            </Button>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            </>
            )}
          </DialogActions>
       </Dialog>
      </React.Fragment>
    );
  };

  handleClose = () => {
    this.setState({open:false,activeStep:4});
  };

  clearData = () => {

    options[0].desc="";options[0].price="";options[0].imgURL="";
    options[1].desc="";options[1].price="";options[1].imgURL="";
    options[2].desc="";options[2].price="";options[2].imgURL="";
    options[3].desc="";options[3].price="";options[3].imgURL="";
    quesString[0].question=null;quesString[1].question=null;quesString[0].imgs=[];
    quesInfo[0].detail="";quesInfo[1].detail="";quesInfo[2].detail="";quesString[1].imgs=[]
    answer[0].desc="";answer[1].desc="";answer[0].price="";

  };

  insertQues = () => {

    this.setState({isProcessing:true});
    var body="";
    var correctOpt = ""

    if(answer[0].desc==""){
        correctOpt=""
    } else {
        correctOpt=options[answer[0].desc-1].desc
    }
    body = {"questionTranslationID":{
    "questionID":this.state.quesID,
    "languageCodeID":{
      "codeName" : quesInfo[0].detail
    },
    "modified_by": localStorage.getItem('username'),
    "Identifier": quesInfo[2].detail,
    "translation":{
      "translation":{
        "caption" : quesInfo[1].detail,
        "background" : quesString[0].question,
        "explanation" : quesString[1].question
        }
    }
  },
  "optionTranslationID":{
    "languageCodeID":{
      "codeName" : quesInfo[0].detail
    },
    "translationO": {
      "translationO":
      {
      "option1":{
          "caption":
          {
            "option":options[0].desc
          }
        },
        "option2":{
          "caption":
           {
             "option":options[1].desc
           }
        },
        "option3":{
          "caption":
           {
             "option":options[2].desc
           }
        },
        "option4":{
          "caption":
            {
             "option":options[3].desc
            }
        },
        "correctOption": correctOpt,
        "ansText": answer[1].desc
        }
    }
    }
   }

    axios.post(baseURL+'api/cmp/insertTranslation/',body,{
            headers: {
                 'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }).then(response =>{
          this.clearData();
           setTimeout(()=>{
           this.setState({uploadSuccess:true,isProcessing:false,open:false,activeStep:5});
          },2000);
          setTimeout(()=>{
            this.redirect();
          },2000);
        }).catch(error => {
            axios.get(baseURL+'api/cmp/rollBackQuestionTranslation/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }).catch(error=>{})
            this.setState({openError:true,isProcessing:false,open:false,activeStep:4});});

  };

   handleNext = () => {

    switch (this.state.activeStep) {
    case 0:
        requiredBackground();
        if (errorArr[0].desc === "error") return;
        break;
      case 2:
        requiredAnswers();
        if (errorArr[1].desc === "error") return;
        break;
    }

    this.setState({activeStep:this.state.activeStep + 1});
    switch (this.state.activeStep) {
      case 0:
        return setDataB();
      case 1:
        return setDataQues();
      case 2:
        return setDataAnswers();
      case 3:
        return setAnsExp();
      case 4:
        return this.setState({open:true});
      case 5: return;
    }
  };

   handleBack = () => {
    this.setState({activeStep:this.state.activeStep - 1});
  };

   redirect = () => {
    setTimeout(()=>{this.setState({onClick:true})},2000)
   }

   handleAlertClose=()=>{ this.setState({openError:false})}

  render(){
    const { classes } = this.props;
  return (

    <React.Fragment>
      <Snackbar open={this.state.open_error} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
        <b>Error Occured!</b>
        </Alert>
      </Snackbar>
      {this.state.onClick? <Redirect to="/app/questions" /> : null}
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Question
          </Typography>
          <Stepper
            activeStep={this.state.activeStep}
            className={classes.stepper}
            alternativeLabel
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {this.state.activeStep === steps.length ? (
              <React.Fragment>
                {this.state.open ? (
                <Typography style={{marginLeft:'30%'}} variant="h5" gutterBottom>
                  Processing...
                </Typography>
                ) : (
                <Typography style={{marginLeft:'30%'}} variant="h5" gutterBottom>
                  Your question has been added successfully.
                </Typography>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.state.rerender ? getStepContent(this.state.activeStep) : null}
                <div className={classes.buttons}>
                  {this.state.activeStep !== 0 && (
                    <Button onClick={this.handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {this.state.activeStep === steps.length - 1
                      ? "Confirm question"
                      : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
          {this.displayAlert()}
        </Paper>
      </main>
    </React.Fragment>
  );
}
}

CheckOut.propTypes= {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckOut);
