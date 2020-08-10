import React from 'react'
import PageTitle from "../components/PageTitle/PageTitle";
import Alert from '@material-ui/lab/Alert'
import {Typography,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails,
	Snackbar, Grid, TextField }
	from '@material-ui/core'
import {ExpandMore, Search} from "@material-ui/icons";
import axios from 'axios'
import {baseURL} from './constants'
import Autocomplete from '@material-ui/lab/Autocomplete';

export default class Lists extends React.PureComponent {

	constructor(props){
		super(props);
		this.state={
			domains:[],
			csSkills:[],
			ageGroups:[],
			quesLevels:[],
			countries:[],
			typesOfQues:[],
			languages:[],
			masterList:[],
			openError:false
		}
	}

	async componentDidMount() {

		try{
			let gCountries = await axios.get(baseURL+'api/com/getCountry/',{
	        headers:{
	          'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
		   }).catch(error => {
		      this.setState({openError:true});
		   });
		   for(let i = 0; i<gCountries.data.length ; i++) {
		    	this.setState(prevState=>({countries:[...prevState.countries,gCountries.data[i].nicename]}))
		    	this.setState(prevState=>({masterList:[...prevState.masterList,gCountries.data[i].nicename]}))
		   }

		   let gDomain = await axios.get(baseURL+'api/com/getDomain/',{
	        headers:{
	          'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
	    }).catch(error => {
	        this.setState({openError:true});
	    });
	    for(let i = 0; i<gDomain.data.length ; i++) {
	    	this.setState(prevState=>({domains:[...prevState.domains,gDomain.data[i].codeName]}))
	    }

	    let gSkills = await axios.get(baseURL+'api/com/getSkills/',{
	        headers:{
	          'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
	    }).catch(error => {
	        this.setState({openError:true});
	    });
	    for(let i = 0; i<gSkills.data.length ; i++) {
	    	this.setState(prevState=>({csSkills:[...prevState.csSkills,gSkills.data[i].codeName]}))
	    	this.setState(prevState=>({masterList:[...prevState.masterList,gSkills.data[i].codeName]}))
	    }

	    let gType = await axios.get(baseURL+'api/com/getQuestionType/',{
	        headers:{
	          'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
	    }).catch(error => {
	        this.setState({openError:true});
	    });
	    for(let i = 0; i<gType.data.length ; i++) {
	    	this.setState(prevState=>({typesOfQues:[...prevState.typesOfQues,gType.data[i].codeName]}))
	    	this.setState(prevState=>({masterList:[...prevState.masterList,gType.data[i].codeName]}))
	    }

	    let gQuesLevel = await axios.get(baseURL+'api/com/getQuestionLevel/',{
	        headers:{
	          'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
	    }).catch(error => {
	        this.setState({openError:true});
	    });
	    for(let i = 0; i<gQuesLevel.data.length ; i++) {
	    	this.setState(prevState=>({quesLevels:[...prevState.quesLevels,gQuesLevel.data[i].codeName]}))
	    	this.setState(prevState=>({masterList:[...prevState.masterList,gQuesLevel.data[i].codeName]}))
	    }

	    let gLanguage = await axios.get(baseURL+'api/com/getLanguage/',{
	        headers:{
	         'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
	    }).catch(error => {
	        this.setState({openError:true});
	    });
	    for(let i = 0; i<gLanguage.data.length ; i++) {
	    	this.setState(prevState=>({languages:[...prevState.languages,gLanguage.data[i].codeName]}))
	    	this.setState(prevState=>({masterList:[...prevState.masterList,gLanguage.data[i].codeName]}))
	    }

	    let gAgeGroup = await axios.get(baseURL+'api/cmp/viewAgeGroup/',{
	        headers:{
	          'Content-Type' : 'application/json',
	          Authorization: 'Token '+localStorage.getItem('id_token')
	        }
	    }).catch(error => {
	        this.setState({openError:true});
	    });
	    for(let i = 0; i<gAgeGroup.data.length ; i++) {
	    	this.setState(prevState=>({ageGroups:[...prevState.ageGroups,gAgeGroup.data[i].AgeGroupName]}))
	    	this.setState(prevState=>({masterList:[...prevState.masterList,gAgeGroup.data[i].AgeGroupName]}))
	    }
	  }catch(error){this.setState({openError:true})}
	}

	handleAlertClose = () => {
		this.setState({openError:false})
	}

	openClose = (panel) =>  (event, isExpanded) => {
		this.setState({expanded: isExpanded ? panel : false})
  }

	render(){
		return (
			<>
				<PageTitle title="Question Attributes" />
				<Snackbar open={this.state.openError} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
	        onClose={this.handleAlertClose}>
	        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
	        <b>Error Occured!</b>
	        </Alert>
			  </Snackbar>
			  <Grid container spacing={1} alignItems="flex-end" style={{marginLeft:'50%',marginTop:'-6%'}}>
		          <Grid item>
		            <Search />
		          </Grid>
		          <Grid item style={{width:'60%'}}>
			          <Autocomplete
				        id="search"
				        options={this.state.masterList.map((option) => option)}
				        renderInput={(params) => (
				          <TextField
				            {...params}
				            label="Search from All Lists"
				            margin="normal"
				            style={{width:'60%'}}
				            InputProps={{ ...params.InputProps, type: 'search' }}
				            />
				        )} />
					</Grid>
		        </Grid>
			  <ExpansionPanel expanded={this.state.expanded === 1} onChange={this.openClose(1)} style={{marginTop:"20px"}}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel1-content"
	            id="panel1-header"
	          >
	            <Typography >
	              List of Countries
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	          <ul>
	          	{this.state.countries.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>

	        <ExpansionPanel expanded={this.state.expanded === 2} onChange={this.openClose(2)}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel2-content"
	            id="panel2-header"
	          >
	            <Typography >
	              List of Languages
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	          <ul>
	          	{this.state.languages.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>

	        <ExpansionPanel expanded={this.state.expanded === 3} onChange={this.openClose(3)}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel3-content"
	            id="panel3-header"
	          >
	            <Typography >
	              List of Domains
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	            <ul>
	          	{this.state.domains.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>

	        <ExpansionPanel expanded={this.state.expanded === 4} onChange={this.openClose(4)}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel4-content"
	            id="panel4-header"
	          >
	            <Typography >
	              List of Computational Skills
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	            <ul>
	          	{this.state.csSkills.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>

	        <ExpansionPanel expanded={this.state.expanded === 5} onChange={this.openClose(5)}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel5-content"
	            id="panel5-header"
	          >
	            <Typography >
	              List of Types of Questions
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	            <ul>
	          	{this.state.typesOfQues.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>

	        <ExpansionPanel expanded={this.state.expanded === 6} onChange={this.openClose(6)}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel6-content"
	            id="panel6-header"
	          >
	            <Typography >
	              List of Age Groups
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	            <ul>
	          	{this.state.ageGroups.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>

	        <ExpansionPanel expanded={this.state.expanded === 7} onChange={this.openClose(7)}>
	          <ExpansionPanelSummary
	            expandIcon={<ExpandMore />}
	            aria-controls="panel7-content"
	            id="panel7-header"
	          >
	            <Typography >
	              List of Question Levels
	            </Typography>
	          </ExpansionPanelSummary>
	          <ExpansionPanelDetails>
	            <ul>
	          	{this.state.quesLevels.map(row=>{
	          		return <li>{row}</li>
	          	})}
	          </ul>
	          </ExpansionPanelDetails>
	        </ExpansionPanel>
			</>
		);
	}
}
