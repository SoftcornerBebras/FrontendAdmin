import React from 'react';
import axios from 'axios'
import { Typography, Divider, Box, Paper, TextField, Radio, Snackbar, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import PageTitle from "../../components/PageTitle/PageTitle";

export default class Preview extends React.PureComponent {

	constructor(props)
	{
		super(props);
		this.state = {
			dataX : this.props.data,
			urlo1 : "",
			urlo2 : "",
			urlo3 : "",
			urlo4 : "",
			caption:"",
			background:"",
			opt1:"",
			opt2:"",
			opt3:"",
			opt4:"",
			corrOpt:"",
			ansText:"",
			selectedValue:-1,
			openError:false,
			openSuccess:false
		};
	}

	async componentDidMount () {

	    try {

            this.setState({
                caption:this.state.dataX.caption,
                background:this.state.dataX.background,
                opt1:this.state.dataX.opt1,
                opt2:this.state.dataX.opt2,
                opt3:this.state.dataX.opt3,
                opt4:this.state.dataX.opt4,
                urlo1:this.state.dataX.urlo1,
                urlo2:this.state.dataX.urlo2,
                urlo3:this.state.dataX.urlo3,
                urlo4:this.state.dataX.urlo4,
                corrOpt:this.state.dataX.corrOpt,
                ansText:this.state.dataX.ansText
            })

            if(this.state.dataX.background.includes("div")) {
                let x = new DOMParser().parseFromString(this.state.dataX.background,"text/html");
                 let y = x.documentElement.querySelectorAll("div")
                 let total = y[0].innerHTML.replace(/\n/g,"<br/>")
               document.getElementById("addHere").insertAdjacentHTML('beforeend', total);
            }
            else {
                let taskQues = this.state.dataX.background.match(new RegExp("Question:"))
                let task = this.state.dataX.background.substring(0,taskQues.index)
                let ques = this.state.dataX.background.substring(taskQues.index+9)
                this.setState({task,ques})
            }
        }
        catch(error){
            this.props.history.push('/app/dashboard')
        }
	};

	handleChange = (event) => {

		let optID = event.target.value

		this.setState({selectedValue:optID})

		if(optID == this.state.corrOpt ){
			this.setState({openSuccess:true})
		}
		else
		{
			this.setState({openError:true})
		}

	}

	handleClose = () => {
		this.setState({openError:false,openSuccess:false})
	}

	handleCheck = () => {
		let ans = document.getElementById("answer").value

		if(ans == this.state.ansText) {
			this.setState({openSuccess:true})
		}
		else
		{
			this.setState({openError:true})
		}
	}

	render() {

		const styles = {
		    transfrm: 'scale(0.8)',
			margin:'2%'
		}
		const typo={
			textAlign:'center',
			fontFamily:'Arial',
			fontWeight:'bold'
		}
		const quesStyle ={
			marginLeft:'1%',
			fontSize:"16px"
		}
		return (
			<>
			<Snackbar open={this.state.openError} autoHideDuration={1000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
	          onClose={this.handleClose}>
		        <Alert onClose={this.handleClose} variant="filled" severity="error">
		        <b>Incorrect Answer!</b>
	        	</Alert>
	        </Snackbar>

	        <Snackbar open={this.state.openSuccess} autoHideDuration={1000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
	          onClose={this.handleClose}>
		        <Alert onClose={this.handleClose} variant="filled" severity="success">
		        <b>Correct Answer!</b>
	        	</Alert>
	        </Snackbar>

			<Typography variant="h6" style={{margin:"10px 0px 10px 0px"}}>{this.state.caption}</Typography>

			{this.state.dataX.background.includes("div") ? <div id="addHere" style={quesStyle}></div>
            : <p style={{marginLeft:'1%'}}>{this.state.task}
                <br/>
                <h4>Question:</h4>
                {this.state.ques}
            </p> }
            {this.state.ansText==null ? (
            <>
            <Typography style={{marginTop:'20px',marginBottom:"10px"}}>
            	<b>Options : </b></Typography>
			<Box style={{display: 'flex' , flexDirection: 'column'}}>
			<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
				<Radio
			        checked={this.state.selectedValue === this.state.opt1}
			        onChange={this.handleChange}
			        value={this.state.opt1} color="primary"
			        inputProps={{ 'aria-label': 'A' }} />
				<Typography style={typo} >{this.state.opt1}</Typography>
				<img style={styles} src = {this.state.urlo1}  />
			</Box>
			<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
			    <Radio
			        checked={this.state.selectedValue === this.state.opt2}
			        onChange={this.handleChange}
			        value={this.state.opt2} color="primary"
			        inputProps={{ 'aria-label': 'B' }} />
				<Typography style={typo}>{this.state.opt2}</Typography>
				<img style={styles} src = {this.state.urlo2} />
			</Box>
			<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
				<Radio
			        checked={this.state.selectedValue === this.state.opt3}
			        onChange={this.handleChange}
			        value={this.state.opt3} color="primary"
			        inputProps={{ 'aria-label': 'C' }} />
				<Typography style={typo}>{this.state.opt3}</Typography>
				<img style={styles} src = {this.state.urlo3} />
			</Box>
			<Box style={{display: 'flex' , flexDirection: 'row',margin:'2%'}}>
				<Radio
			        checked={this.state.selectedValue === this.state.opt4}
			        onChange={this.handleChange}
			        value={this.state.opt4} color="primary"
			        inputProps={{ 'aria-label': 'D' }} />
				<Typography style={typo}>{this.state.opt4}</Typography>
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
	        <Button color="primary" variant="contained" style={{margin:"10px"}}
	        	onClick={()=> this.handleCheck()}>Check Answer</Button>
            </>
            )}
			</>
		);
	}

}
