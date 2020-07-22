import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../error/ErrorBoundary'
import {Button, Paper, Typography, ListItemText, List,ListItem, Box } from '@material-ui/core'
import axios from 'axios'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {baseURL} from '../constants'
import CompQuesPrev from "./CompQuesPrev"

const StyledListItem = withStyles({
  root: {
    "&$selected": {
      color:"#3F51B5"
    }
  },
  selected: {}
})(ListItem);

var prevAgeGroups,compInfo = [{ name: "", start: "", end: "", info: "", type:"", time:""}];
class CompetitionPreview extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state={
			quesDetail:[],
			count:0,
			curr:0,
			rerender:false,
			quesCaptionList:[],
			selectedIndex:0,
			compName:"",
			ageName:"",
			language:"",
            alertMsg:false,
		};
	}

	async componentDidMount() {

        try {

            prevAgeGroups = this.props.location.prevAgeGroups

            compInfo.push({ name: "Type :", detail: this.props.location.data[0].type })
            compInfo.push({ name: "Start date :", detail: this.props.location.data[0].start })
            compInfo.push({ name: "End date  :", detail: this.props.location.data[0].end })
            compInfo.push({ name: "Time Limit (hh:mm)  : ", detail: this.props.location.data[0].time })
            compInfo.push({ name: "Additional info  : ", detail: this.props.location.data[0].info })

            let ageID = this.props.location.ageGroupID
            let compID = this.props.location.compID
            let compName = this.props.location.compName
            let ageLang = this.props.location.ageGroupName.split("-")
            this.setState({ageName:ageLang[0], language:ageLang[1], compName})

            try{
                let cmpData = await axios.get(baseURL+'api/cmp/getCmpPreview/'+ageID+'&'+compID+"/",{
                headers:{
                    'Content-Type' : 'application/json',
                        Authorization: 'Token '+localStorage.getItem('id_token')
                }
               });


                let quesIDs = cmpData.data.cmpQuesList.map((elem) =>{return {quesID:elem.questionID,
                    quesLevel:elem.questionLevelCodeID.codeName}})

                let questions =[], options=[]

                for(let i=0; i< quesIDs.length; i++) {

                    let csSkills=""
                    for(let j=0;j<cmpData.data.skills.length;j++){
                        if(quesIDs[i].quesID == cmpData.data.skills[j].questionID) {
                            csSkills = cmpData.data.skills[j].skills[0]
                            for(let k=1;k<cmpData.data.skills[j].skills.length;k++){
                                csSkills += "," + cmpData.data.skills[j].skills[k]
                            }
                            break
                        }
                    }

                    let ansFlag = 0, corrOption = "" , ansText = null
                    for(let j=0; j< cmpData.data.QuesTrans.length; j++ ){
                        let elem = cmpData.data.QuesTrans[j]
                        let c,a;
                        if(elem.ansText == null){
                            c = elem.optionTranslationID.translationO.option
                        }
                        else if (elem.ansText != null) {
                            a= elem.ansText
                        }
                        if(quesIDs[i].quesID == elem.questionTranslationID.questionID.questionID) {
                            questions.push({
                                questype:elem.questionTranslationID.questionID.questionTypeCodeID.codeName,
                                questionID:elem.questionTranslationID.questionID.questionID,
                                quesLevel : quesIDs[i].quesLevel,
                                caption:elem.questionTranslationID.translation.caption,
                                domain:elem.questionTranslationID.questionID.domainCodeID.codeName,
                                background:elem.questionTranslationID.translation.background,
                                explanation:elem.questionTranslationID.translation.explanation,
                                countryN:elem.questionTranslationID.questionID.countryID.name,
                                csSkills: csSkills,
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
                        for(let j=0; j< cmpData.data.OptTrans.length; j++) {
                            let elem = cmpData.data.OptTrans[j]
                            if(quesIDs[i].quesID == elem.optionID.questionID) {
                                for(let k=0 ; k < cmpData.data.OptImages.length; k++) {
                                    if(cmpData.data.OptImages[k].ObjectID == elem.optionID.optionID ) {
                                        optionArray.push({optionID: elem.optionID.optionID, option: elem.translationO.option,
                                            imgURL : baseURL + cmpData.data.OptImages[k].uploadedFile})
                                        flag =1
                                        break
                                    }
                                }
                                if(flag ==0 ){
                                    optionArray.push({optionID: elem.optionID.optionID, option: elem.translationO.option, imgURL:"" })
                                }

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
                            questype:questions[i].quesType,
                            questionID:questions[i].questionID,
                            caption:questions[i].caption,
                            quesLevel : questions[i].quesLevel,
                            background:questions[i].background,
                            csSkills: questions[i].csSkills,
                            domain:questions[i].domain,
                            opt1:options[i][0].option,
                            urlo1:options[i][0].imgURL,
                            opt2:options[i][1].option,
                            urlo2:options[i][1].imgURL,
                            opt3:options[i][2].option,
                            urlo3:options[i][2].imgURL,
                            opt4:options[i][3].option,
                            urlo4:options[i][3].imgURL,
                            corrOpt: options[i][4].correctOption,
                            ansText: null
                        }]}))
                    }
                    else {

                        this.setState(prevState => ({quesDetail:[...prevState.quesDetail,{
                            questype:questions[i].quesType,
                            questionID:questions[i].questionID,
                            quesLevel : questions[i].quesLevel,
                            caption:questions[i].caption,
                            background:questions[i].background,
                            csSkills: questions[i].csSkills,
                            domain:questions[i].domain,
                            opt1:"",
                            urlo1:"",
                            opt2:"",
                            urlo2:"",
                            opt3:"",
                            urlo3:"",
                            opt4:"",
                            urlo4:"",
                            corrOpt: "",
                            ansText: options[i].ansText
                        }]}))
                    }
                    this.setState(prev=>({quesCaptionList:[...prev.quesCaptionList,questions[i].caption]}))
                }
                this.setState({count:questions.length})
            }catch(error){
                this.setState({alertMsg:true})
                setTimeout(()=>{this.handleBack()},2000)
            }
         }
         catch(error) {
            this.props.history.push('/app/dashboard')
         }
	}

	nextQues = () => {
		if(this.state.curr+1 < this.state.count) {
			this.setState({curr:this.state.curr+1,
				selectedIndex:this.state.curr+1})
		}
		else {
			this.props.history.push("/app/competition")
		}
	}

	prevQues =() => {
		if(this.state.curr-1 >=0) {
			this.setState({curr:this.state.curr-1,
				selectedIndex:this.state.curr-1})
		}
	}

	handleListItemClick = (event, selectedIndex) => {
		this.setState({selectedIndex, curr:selectedIndex})
	}

    handleBack =() => {

        var data=[]

        data.push({ name: "Type :", detail: compInfo[0].detail})
        data.push({ name: "Start date :",detail:compInfo[1].detail})
        data.push({ name: "End date  :", detail:compInfo[2].detail})
        data.push({ name: "Time Limit (hh:mm)  :", detail:compInfo[3].detail})
        data.push({ name: "Additional info  : ", detail:compInfo[5].detail })

        this.props.history.push({
          pathname:'/app/competitions/preview',
          data:data,
          compID:this.state.compID,
          compName:this.state.compName,
          prevAgeGroups:prevAgeGroups
        })
    }

	render() {

		const infoStyle ={
			backgroundColor:"#3F51B5",
			fontSize:"18px",
			color:"#fff",
			paddingLeft:"14px",
			paddingRight:"14px",
			marginTop:"-10px"
		}

		const heading = {
			color: "#3F51B5",
			textAlign:"center",
			paddingTop:"20px"
		}

		return (
			<ErrorBoundary>

            <Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        onClick={this.handleBack }><ArrowBack/> Back </Button>

            {this.state.alertMsg ? <Typography align="center" style={{color:"red"}} variant="h5">No Questions Added Yet!</Typography>:null}

			<Paper p={3} m={3} >
			{this.state.count != 0 ? (
				<>
				<div style={heading}>
					<Typography variant="h5">{this.state.compName} - {this.state.ageName} {this.state.language}</Typography>
				</div>

				<Box display="flex"
		          flexDirection="row"
		          p={1}
		          m={1}>
				<List component="nav" style={{width:"14%"}} >
				{this.state.quesCaptionList.map((caption, index) => {return (
			        <StyledListItem
			          button
			          selected={this.state.selectedIndex === index}
			          onClick={(event) => this.handleListItemClick(event, index)}
			        >
			          <ListItemText primary={caption} />
			        </StyledListItem>
			    )})}
			    </List>

			    <Box display="flex"
		          flexDirection="column"
		          p={1}
		          m={1} style = {{width:"86%"}}>
				<div style = {infoStyle}>
					<p>Domain : {this.state.quesDetail[this.state.curr].domain}
					<span style = {{float:"right"}}>Question Level : {this.state.quesDetail[this.state.curr].quesLevel}</span></p>
					<p>CS Skills : {this.state.quesDetail[this.state.curr].csSkills}</p>
				</div>

				<div style={{marginLeft:"2%", padding:"1%"}}>
					<CompQuesPrev data = {this.state.quesDetail[this.state.curr]} key={this.state.quesDetail[this.state.curr].questionID}/>
				</div>

				<Box flex="display" flexDirection="row">
				{this.state.curr == 0 ? (
				<Button color="primary" variant="contained" style={{margin:"1% 2% 1% 92%"}}
					onClick={()=>{this.nextQues()}}>
					{this.state.curr == this.state.count-1 ? <>Done</> : <>Next</>}
				</Button>
				) : (<>
				<Button color="primary" variant="contained" style={{margin:"1% 2% 1% 80%"}}
					onClick={()=>{this.prevQues()}}>Back</Button>
				<Button color="primary" variant="contained"
					onClick={()=>{this.nextQues()}}>
					{this.state.curr == this.state.count-1 ? <>Done</> : <>Next</>}
				</Button></>
				)}
				</Box>

				</Box>
			</Box>
			</>):null}
			</Paper>
			</ErrorBoundary>
		)
	}
}


export default (CompetitionPreview);
