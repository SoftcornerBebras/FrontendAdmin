import React from "react";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Alert from '@material-ui/lab/Alert'
import {Snackbar,Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, CircularProgress} from '@material-ui/core';
import Review,{quesInfo, quesString, options, answer } from "./Review";
import Background,{ setDataB, requiredBackground,toInsertAgeGroups,deletedAgeGroupQues } from "./Background";
import QuestionsForm,{ setDataQues } from "./QuestionsForm";
import AnswersForm,{ setDataAnswers, requiredAnswersForm } from "./AnswersForm";
import AnswerExplanation,{ setAnsExp } from "./AnswerExplanation";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';
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

export let domains=[],skills=[],
      quesLevels=[],
      ageGroups= [],
      ageGroupsID=[],csSkills=[],selectedAgeID="",quesType="";

var quesImgList=[],ansImgList=[]
class QuesUpdate extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state={
      dataX : this.props.location.data,
      activeStep:0,
      onClick:false,
      onClickAge:false,
      emailID : "",
      errorEmailID : false,
      open : false,
      isProcessing:false,
      uploadSuccess:false,
      rerender:false,
      openRerender:true,
      urlo1 : "",
      urlo2 : "",
      urlo3 : "",
      urlo4 : "",
      qimglist:[],
      url:'',
      openError:false
    };
  }

  async componentDidMount () {

    try {

      quesType=this.props.location.data.questionType

    this.clearData()

    let gDomain = await axios.get(baseURL+'api/com/getDomain/',{
        headers:{
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
       this.setState({openError:true})
    });

    domains.length=0;
    for(let i = 0; i<gDomain.data.length ; i++) {
        domains.push(gDomain.data[i].codeName);
    }

    let gSkills = await axios.get(baseURL+'api/com/getSkills/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });

    skills.length=0;
    for(let i = 0; i<gSkills.data.length ; i++) {
        skills.push(gSkills.data[i].codeName);
    }

    let gQuesLevel = await axios.get(baseURL+'api/com/getQuestionLevel/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
      this.setState({openError:true})
    });

    quesLevels.length=0;
    for(let i = 0; i<gQuesLevel.data.length ; i++) {
        quesLevels.push(gQuesLevel.data[i].codeName);
    }

    let gAgeGroup = await axios.get(baseURL+'api/cmp/viewAgeGroup/',{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
    }).catch(error => {
        this.setState({openError:true})
    });

    ageGroups.length=0;ageGroupsID.length=0;
    for(let i = 0; i<gAgeGroup.data.length ; i++) {
        ageGroups.push(gAgeGroup.data[i].AgeGroupName);
        ageGroupsID.push(gAgeGroup.data[i].AgeGroupID);
    }


     let ageGrpPresent = await axios.get(
            baseURL+'api/cmp/getAgeGroupsPerQues/'+this.state.dataX.questionID+'/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}}
            ).catch(error => {this.setState({openError:true})})

          let ageGrpName,queslevel,ageGrpID
         if(ageGrpPresent.data.length>0){
        ageGrpName = ageGrpPresent.data[0].AgeGroupID.AgeGroupName
        queslevel = ageGrpPresent.data[0].questionLevelCodeID.codeName
        ageGrpID = ageGrpPresent.data[0].AgeGroupID.AgeGroupID
        for(var i=1;i<ageGrpPresent.data.length;i++)
        {
           ageGrpName += ","+ageGrpPresent.data[i].AgeGroupID.AgeGroupName
           queslevel += ","+ageGrpPresent.data[i].questionLevelCodeID.codeName
           ageGrpID += ","+ageGrpPresent.data[i].AgeGroupID.AgeGroupID
        }
        }
    quesInfo[0].detail = this.state.dataX.caption;
    quesInfo[1].detail = this.state.dataX.identifier;
    csSkills = this.state.dataX.csSkills
    quesInfo[2].detail = this.state.dataX.csSkills.join();
    quesInfo[3].detail = this.state.dataX.domainName;

    quesString[0].question = this.state.dataX.background
    quesString[1].question = this.state.dataX.explanation

    quesInfo[4].detail = ageGrpName;
    quesInfo[5].detail = queslevel;
    selectedAgeID = ageGrpID;

    options[0].desc = this.state.dataX.option1;
    options[1].desc = this.state.dataX.option2;
    options[2].desc = this.state.dataX.option3;
    options[3].desc = this.state.dataX.option4;
    answer[0].price = this.state.dataX.correctOption;
    answer[1].desc = this.state.dataX.ansText;

     let gres = await axios.get(
       baseURL+'api/ques/getImages/'+this.state.dataX.questionID+'/', {
        headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
          }
       );

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

             options[0].oldName = gres.data.oimg1[0].uploadedFile
             options[1].oldName = gres.data.oimg2[0].uploadedFile
             options[2].oldName = gres.data.oimg3[0].uploadedFile
             options[3].oldName = gres.data.oimg4[0].uploadedFile
          }
      }

    options[0].imgURL = this.state.urlo1
    options[1].imgURL = this.state.urlo2
    options[2].imgURL = this.state.urlo3
    options[3].imgURL = this.state.urlo4

    this.setState({openRerender:false,rerender:true})

    }catch(error){
   this.props.history.push('/app/dashboard')
}

  }

  handleClose = (event,reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    this.setState({open:false,activeStep:4});
  };

  displayAlertAgeGroups = () => {
    return (
      <React.Fragment>
       <Dialog open={false} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Age Groups have not been created for this year.
              You will be redirected to "Create Age Groups" page. </Typography>
            </DialogContentText>
            </DialogContent>
           <DialogActions>
            <Button onClick={this.redirectToAgeGroups} color="primary">
              OK
            </Button>
          </DialogActions>
       </Dialog>
      </React.Fragment>
    );
  };

  rerenderDone = () => {
    this.setState({isProcessing:true})
    setTimeout(()=> {
      this.setState({openRerender:false,isProcessing:false})
    },3000);
  }

  displayLoadingQues = () => {
    return (
      <React.Fragment>
       <Dialog open={this.state.openRerender} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Loading Question Data. Please Wait... </Typography>
            </DialogContentText>
            </DialogContent>
       </Dialog>
      </React.Fragment>
    );
  };

  displayAlert = () => {
    return (
      <React.Fragment>
       <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" style={{backgroundColor:'rgba(0,0,0,0.5'}}>
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
            <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Do you really want to update the question?</Typography>
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

  insertQues = () => {
  this.setState({isProcessing:true})

  let blobImgQues=[],blobImgAns=[],blobImgQuesName=[],blobImgAnsName=[]

    var bodyFormData = new FormData();

      let content = quesString[0].question
      let imgs=content.match(/src/g)
      let total="",totalAns=""
      let replaceImg=[], sub1=[], sub2=[];
      let imgName=[], imgNameConcat="",uploadedURL="",imgType="";
      let imgNameAns=[], imgNameConcatAns="",uploadedURLAns="",imgTypeAns="";
      let imagesToUpload=[],imagesToUploadAns=[]
      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds();
      let finalDate = date + '_' + time;

      if(imgs== null) {
        total=content
      }
      else {
        let countOfImgs = imgs.length
        for(let i=0;i<countOfImgs;i++){
          if(i==0){
            sub1[0] = content.substring(0,content.search("src")+3);
            sub1[0] = sub1[0].substring(0,sub1[0].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[0].substring(sub1[0].search("img")+3,)
            
            let x = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1)
  
            if(!x.includes(baseURL)){
              var name= content.substring(content.search("alt")+5, content.substring("alt").indexOf(" ",content.indexOf("alt"))-1)
              var imgn = name.split(".");
              imgName[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
              imagesToUpload[i] = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1) // to keep quotes
              imgNameConcat = imgName[i];
              imgType = "imageQuestion";
              uploadedURL = imgName[i];
              replaceImg[0] = "=\""+baseURL+"media/images/"+imgName[i]+"\" "
              sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
              total = sub1[0]+replaceImg[0]
            
              blobImgQues.push(imagesToUpload[i])
              blobImgQuesName.push(imgName[i])
              // this.returnBLOB(imagesToUpload[i],imgName[i],bodyFormData)

            } else {
              imgName[i] = x.substring(x.indexOf('images/')+7,)
              imgNameConcat = imgName[i];
              imgType = "imageQuestion";
              uploadedURL = "-"
              sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
              total = sub1[0]+"=\""+x+"\""
            }
            
          }
          else {
            sub2[i] = sub2[i-1].substring(sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src")))
            sub1[i] =  sub2[i-1].substring(0,sub2[i-1].search("src")+5)
            sub1[i] = sub1[i].substring(0,sub1[i].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[i].substring(sub1[i].search("img")+3,)
            
            let x = sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
       
            if(!x.includes(baseURL)){
              imagesToUpload[i] =  sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
              var name= sub2[i].substring(sub2[i].search("alt")+5, sub2[i].substring("alt").indexOf(" ",sub2[i].indexOf("alt"))-1)
              var imgn = name.split(".");
              imgName[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
              imgNameConcat = imgNameConcat +","+imgName[i];
              imgType += ",imageQuestion";
              uploadedURL += ",media/images/"+ imgName[i];
              replaceImg[i] = baseURL+"media/images/"+imgName[i]+"\" "
              total += sub1[i] + replaceImg[i]
       
              blobImgQues.push(imagesToUpload[i])
              blobImgQuesName.push(imgName[i])
              // this.returnBLOB(imagesToUpload[i],imgName[i],bodyFormData)
            }else {
              imgName[i] = x.substring(x.indexOf('images/')+7,)
              imgNameConcat = imgNameConcat +","+imgName[i];
              imgType += ",imageQuestion";
              uploadedURL += ",-"
              total += sub1[i].substring(0,sub1[i].length-2)+"=\""+x+"\""
            }
          }
        }
        total = total+sub2[countOfImgs-1]
      }

      content = quesString[1].question
      imgs=quesString[1].question.match(/src/g)
      if(imgs==null) {
        totalAns=content
      }
      else {
        let countOfImgs = imgs.length
        for(let i=0;i<countOfImgs;i++){
          if(i==0){
            sub1[0] = content.substring(0,content.search("src")+3);
            sub1[0] = sub1[i].substring(0,sub1[0].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[0].substring(sub1[0].search("img")+3,)
            
            let x = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1)
            
            if(!x.includes(baseURL)){
              var name= content.substring(content.search("alt")+5, content.substring("alt").indexOf(" ",content.indexOf("alt"))-1)
              var imgn = name.split(".");
              imgNameAns[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
              imagesToUploadAns[i] = content.substring(content.search("src")+5,content.substring("src").indexOf(" ",content.indexOf("src"))-1) // to keep quotes
              imgNameConcatAns = imgNameAns[i];
              imgTypeAns = "imageAnsExplanation";
              uploadedURLAns = imgNameAns[i];
              replaceImg[0] = "=\""+baseURL+"media/images/"+imgNameAns[i]+"\" "
              sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
              totalAns = sub1[0]+replaceImg[0]
              blobImgAns.push(imagesToUploadAns[i])
              blobImgAnsName.push(imgNameAns[i])
              // this.returnBLOB(imagesToUploadAns[i],imgNameAns[i],bodyFormData)
            } else {
              imgNameAns[i] = x.substring(x.indexOf('images/')+7,)
              imgNameConcatAns = imgNameAns[i];
              imgTypeAns = "imageAnsExplanation";
              uploadedURLAns = "-"
              sub2[0] = content.substring(content.substring("src").indexOf(" ",content.indexOf("src")),)
              total = sub1[0]+"=\""+x+"\""
              
            }
          }
          else {
            sub2[i] = sub2[i-1].substring(sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src")))
            sub1[i] =  sub2[i-1].substring(0,sub2[i-1].search("src")+5)
            sub1[i] = sub1[i].substring(0,sub1[i].search("img")+3) + " style=\"max-height:100%;max-width:100%\"" + sub1[i].substring(sub1[i].search("img")+3,)
            let x = sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)

            if(!x.includes(baseURL)){
              imagesToUploadAns[i] =  sub2[i-1].substring(sub2[i-1].search("src")+5,sub2[i-1].substring("src").indexOf(" ",sub2[i-1].indexOf("src"))-1)
              var name= sub2[i].substring(sub2[i].search("alt")+5, sub2[i].substring("alt").indexOf(" ",sub2[i].indexOf("alt"))-1)
              var imgn = name.split(".");
              imgNameAns[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
              imgNameConcatAns = imgNameConcatAns +","+imgNameAns[i];
              uploadedURLAns += ",media/images/"+ imgNameAns[i];
              imgTypeAns += ",imageAnsExplanation";
              replaceImg[i] = baseURL+"media/images/"+imgNameAns[i]+"\" "
              totalAns += sub1[i] + replaceImg[i]
              blobImgAns.push(imagesToUploadAns[i])
              blobImgAnsName.push(imgNameAns[i])
              // this.returnBLOB(imagesToUploadAns[i],imgNameAns[i],bodyFormData)
            }else {
              total += sub1[i].substring(0,sub1[i].length-2)+"=\""+x+"\""
              imgNameAns[i] = x.substring(x.indexOf('images/')+7,)
              imgNameConcatAns = imgNameAns[i];
              imgTypeAns = "imageAnsExplanation";
              uploadedURLAns += ",-"
            }
          }
        }
        totalAns = totalAns+sub2[countOfImgs-1]
      }
     
      var correctOpt = ""

        if(answer[0].desc==""){
            correctOpt=""
        } else {
            correctOpt=options[answer[0].desc-1].desc
        }

      this.returnBLOB(blobImgQues,blobImgQuesName,bodyFormData)
      this.returnBLOB(blobImgAns,blobImgAnsName,bodyFormData)

      var body=""

      let imgNameOpt=[],pos=[],k=0;
      for(let i=0;i<options.length;i++){
        if( options[i].price != ""){
          var imgn = options[i].price.name.split(".");
          imgNameOpt[i] = imgn[0]+'_'+finalDate+'.'+imgn[1];
          pos[k]=i
          k=k+1
        }else{
          imgNameOpt[i]=""
        }
      }

        body = {
      "questionTranslationID":{
          "questionID":{
            "countryID": {
            "name" : this.state.dataX.countryName
            },
            "domainCodeID":{
              "codeName" : quesInfo[3].detail
            },
            "questionTypeCodeID":{
              "codeName" : this.state.dataX.questionType
            }
          },
          "languageCodeID":{
            "codeName" : this.state.dataX.language
          },
              "modified_by":localStorage.getItem('username'),
              "Identifier": quesInfo[1].detail,
          "translation":{
            "translation":{
              "caption" : quesInfo[0].detail,
              "background" : total,
              "explanation" : totalAns
            },
            "quesAgeID":{
              "quesData": toInsertAgeGroups,
              "DeletedQuesData": deletedAgeGroupQues
            },
        "quescsskills": quesInfo[2].detail,
        "imageID":{
              "ImageName":imgNameConcat,
              "ImageTypeCodeID":
              {
                "codeName":imgType
              },
              "uploadedFile":"media/images/"+uploadedURL
          },
           "imageAnsID":{
              "ImageName":imgNameConcatAns,
              "ImageTypeCodeID":
              {
                "codeName":imgTypeAns
              },
              "uploadedFile":"media/images/"+uploadedURLAns
          }
          }
        },
        "optionTranslationID":{
          "languageCodeID":{
            "codeName" : this.state.dataX.language
          },
          "translationO":{
            "translationO":
                {
                  "option1":{
                    "caption":{
                       "option":options[0].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[0],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[0]
                }
                  },
                  "option2":{
                    "caption":{
                       "option":options[1].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[1],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[1]
                }

                  },
                  "option3":{
                    "caption":{
                    "option":options[2].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[2],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[2]
                }

                  },
                  "option4":{
                    "caption":{
                    "option":options[3].desc,
                    },
                    "imageID":{
                  "ImageName":imgNameOpt[3],
                  "ImageTypeCodeID":
                  {
                    "codeName":"imageOption"
                  },
                  "uploadedFile":"media/images/"+imgNameOpt[3]
                }
                  },
              "correctOption":correctOpt,
      "ansText": answer[1].desc
            }

          }
        }
      }

      bodyFormData.append('data', JSON.stringify(body));
      for(let i=0;i<pos.length;i++){
        bodyFormData.append('image', options[pos[i]].price,imgNameOpt[pos[i]]);
      }

    setTimeout(()=>{
      axios.post(baseURL+'api/cmp/updateQuestion/'+this.state.dataX.quesTransID+"/",bodyFormData,{
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
        }).catch(error => {this.setState({openError:true,isProcessing:false,open:false,activeStep:4});});
      },10000)
    }

    async returnBLOB(imagesToUpload,imgName,bodyFormData){

      for(let i=0;i<imagesToUpload.length;i++){
        let img = await fetch(imagesToUpload[i]).then(r => r.blob());
        const contentType = 'image/'+imgName[i].split('.')[1]
        const file = new File([img],imgName[i],{type: contentType},{lastModified: Date.now()})
        bodyFormData.append('image', file,imgName[i]);
      }
    }

    clearData = () => {
      options[0].desc="";options[0].price="";options[0].imgURL="";
      options[1].desc="";options[1].price="";options[1].imgURL="";
      options[2].desc="";options[2].price="";options[2].imgURL="";
      options[3].desc="";options[3].price="";options[3].imgURL="";
      quesString[1].question=null;
      quesString[0].question=null;quesInfo[0].detail="";
      quesInfo[1].detail="";quesInfo[2].detail="";quesInfo[3].detail="";
      quesInfo[4].detail="";quesInfo[5].detail="";
      answer[1].desc="";answer[0].desc="";answer[0].price="";
      toInsertAgeGroups.length=0;deletedAgeGroupQues.length=0
    }

    handleNext = () => {

   switch (this.state.activeStep) {
     case 0:
        requiredBackground();
       if (errorArr[0].desc === "error") return;
       break;

     case 2:
        requiredAnswersForm();
       if (errorArr[2].desc === "error") return;
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

   redirectToAgeGroups = () => {
    this.setState({onClickAge:true})
   }

   handleAlertClose=() => {
    this.setState({openError:false})
   }

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
      {this.displayLoadingQues()}
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
                  Your question has been updated successfully.
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

QuesUpdate.propTypes= {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuesUpdate);
