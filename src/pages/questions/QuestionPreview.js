import React from 'react';
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { Typography , Box , TextField, Button} from '@material-ui/core';
import ArrowBack from "@material-ui/icons/ArrowBack";
import {baseURL} from '../constants'
export default class Preview extends React.PureComponent {

	constructor(props)
	{
		super(props);
		this.state = {
			urlo1 : "",
			urlo2 : "",
			urlo3 : "",
			urlo4 : "",
			background:"",
			opt1:"",
			opt2:"",
			opt3:"",
			opt4:"",
			backButton:false,
			fromPage:'',
			ageGroup:'',
			language:'',
			compID:'',
			compName:'',
			allData:'',
			selectedAgeGroup:''
		};
	}

	async componentDidMount () {
		
		var dataX

		try{

			if(this.props.fromPage == "QuestionDetails"){
				dataX = this.props.data
				this.setState({
					background:dataX.background,
					opt1:dataX.option1,
					opt2:dataX.option2,
					opt3:dataX.option3,
					opt4:dataX.option4,
					ansText:dataX.ansText
				})
			}
			else {
				this.setState({backButton:true,selectedAgeGroup:this.props.location.selectedAgeGroup})
				if(this.props.location.fromPage === "QuesTransPrev") {
					dataX = this.props.location.previewData
					this.setState({allData:this.props.location.allData,background:dataX.background,
						fromPage:"QuesTransPrev",
						opt1:dataX.opt1,
						opt2:dataX.opt2,
						opt3:dataX.opt3,
						opt4:dataX.opt4,
						ansText:dataX.ansText
					})

				}
				else {
					dataX = this.props.location.data.previewData
					this.setState({ageGroup:this.props.location.data.ageGroup,
						language:this.props.location.data.language,
						compID:this.props.location.compID,
						compName:this.props.location.compName,
						background:dataX.background,
						selectedAgeGroup:this.props.location.selectedAgeGroup,
						opt1:dataX.opt1,
						opt2:dataX.opt2,
						opt3:dataX.opt3,
						opt4:dataX.opt4,
						ansText:dataX.ansText
					})					
				}
			} 
         
            if(dataX.questionType=='Mcqs_With_Images')
            {
            	 let gres = await axios.get(
               baseURL+'api/ques/getImages/'+dataX.questionID+'/', {
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
                 }
                 }

                }
                 let x = new DOMParser().parseFromString(dataX.background,"text/html");
                 let y = x.documentElement.querySelectorAll("div")
                 let total = y[0].innerHTML.replace(/\n/g,"<br/>")
               document.getElementById("addHere").insertAdjacentHTML('beforeend', total);

      }catch(error){ return <Redirect to='/app/dashboard' />}

	};

	handleBack = () => {
		if(this.state.fromPage== "QuesTransPrev"){
			this.props.history.push({
		      pathname :"/app/question/details",
		      data : this.state.allData })
		}
		else {
		  this.props.history.push({
		      pathname : "/app/competitions/addQues",
		      ageGroup: this.state.ageGroup,
	          language: this.state.language,
	          fromPage: "previewQues",
	          compName: this.state.compName,
	          compID: this.state.compID,
	          initPage: this.state.fromPage,
	          selectedAgeGroup:this.state.selectedAgeGroup
		   })
		}
	}

	render() {
		
		const styles = {
			margin:'2%',
			transform: 'scale(0.8)'
		}
		const typo={
			textAlign:'center',
			fontFamily:'Arial',
			fontWeight:'bold'
		}
		return (
			<>
			{this.state.backButton ? <Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        		onClick={this.handleBack }><ArrowBack/> Back </Button> : null}
			<div style={{backgroundColor:'#fff', padding:'2%'}}>
			<div id="addHere" style={{marginLeft:'1%'}}>{}</div>
            {this.state.ansText==null ? (
            <>
            <Typography variant='h5' style={{marginTop:'40px'}}>Options : </Typography>
			<Box style={{display: 'flex' , flexDirection: 'column'}}>
			<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
				<Typography variant='h6' style={typo} >A. {this.state.opt1}</Typography>
				<img style={styles} src = {this.state.urlo1}  />
			</Box>
			<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
				<Typography variant='h6' style={typo}>B. {this.state.opt2}</Typography>
				<img style={styles} src = {this.state.urlo2} />
				</Box>
				<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
			<Typography variant='h6' style={typo}>C. {this.state.opt3}</Typography>
				<img style={styles} src = {this.state.urlo3} />
				</Box>
				<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
			<Typography variant='h6' style={typo}>D. {this.state.opt4}</Typography>
				<img style={styles} src = {this.state.urlo4} />
				</Box>
			</Box>
			</>
            ): (
            <>
            <br/>
            <br/>
            <TextField
            id="answer"
            name="answer"
            label="Answer"
            style={{width:'250px'}}
            variant="outlined"
            placeholder="Enter Answer Here" />
            </>
            )}
			</div>
			</>
		);
	}

}
