import React from 'react'
import {Redirect} from 'react-dom'

export default class QuestionExplanation extends React.PureComponent {

	componentDidMount(){
		try {
			if(this.props.data.explanation.includes("div")) {
		        let x = new DOMParser().parseFromString(this.props.data.explanation,"text/html");
		        let y = x.documentElement.querySelectorAll("div")
                 let total = y[0].innerHTML.replace(/\n/g,"<br/>")
		       	document.getElementById("addExplanationHere").insertAdjacentHTML('beforeend', total);
	       }
		}catch(error){return <Redirect to="/app/dashboard" />}
	}
	render(){
		return(
			<div id="addExplanationHere" style={{marginLeft:'1%',padding:"10px"}}>{}</div>
		)
	}
}
