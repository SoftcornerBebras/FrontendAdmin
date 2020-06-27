import React from 'react';
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { Typography , Box , TextField} from '@material-ui/core';
import {baseURL} from '../constants'
export default class Preview extends React.PureComponent {

	constructor(props)
	{
		super(props);
		this.state = {
			dataX : this.props.data,
			url:'',
			questype:"",
			ObjectID :"",
			urlo1 : "",
			urlo2 : "",
			urlo3 : "",
			urlo4 : "",
			qimglist:[],
			caption:"",
			background:"",
			exp:"",
			countryN:"",
			opt1:"",
			opt2:"",
			opt3:"",
			opt4:"",
			task:"",
			ques:""
		};
	}

	async componentDidMount () {
		this.setState({
				questype:this.state.dataX.questionType,
				ObjectID:this.state.dataX.questionID,
				caption:this.state.dataX.caption,
				background:this.state.dataX.background,
				exp:this.state.dataX.explanation,
				countryN:this.state.dataX.countryName,
				opt1:this.state.dataX.option1,
				opt2:this.state.dataX.option2,
				opt3:this.state.dataX.option3,
				opt4:this.state.dataX.option4,
				ansText:this.state.dataX.ansText
			})
		try{
         
            if(this.state.dataX.questionType=='Mcqs_With_Images')
            {
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
                 }
                 }

                }
                 let x = new DOMParser().parseFromString(this.state.dataX.background,"text/html");
                 let y = x.documentElement.querySelectorAll("div")
                 let total = y[0].innerHTML.replace(/\n/g,"<br/>")
               document.getElementById("addHere").insertAdjacentHTML('beforeend', total);

      }catch(error){ return <Redirect to='/app/dashboard' />}

	};

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
			{this.state.dataX.background.includes("div") ? <div id="addHere" style={{marginLeft:'1%'}}>{}</div>
            : <p style={{marginLeft:'1%'}}>{this.state.task}
                <br/>
                <h4>Question:</h4>
                {this.state.ques}
            </p> }
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
			</>
		);
	}

}
