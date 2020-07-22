import React from 'react'
import ErrorBoundary from '../error/ErrorBoundary'
import {Typography, Grid,ListItemIcon, ListItemText, List,ListItem, Paper, Button} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import ArrowBack from '@material-ui/icons/ArrowBack'


const StyledListItem = withStyles({
  root: {
    "&$selected": {
      color:"#3F51B5"
    }
  },
  selected: {}
})(ListItem);

const styles =theme => ({
  paper: {
      width:'70%',
      marginLeft: "15%"
  }
});

var compInfo = [{ name: "", start: "", end: "", info: "", type:"", time:""}], prevAgeGroups;
class CompInfo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state={
			compName:"",
			compID:"",
			ageList:[],
			selectedIndex:-1
		}
	}

	componentDidMount() {

        try {

        	prevAgeGroups = this.props.location.prevAgeGroups

        	compInfo[0].name = this.props.location.compName
	        compInfo[0].info = this.props.location.data[4].detail
	        compInfo[0].type = this.props.location.data[0].detail
	        compInfo[0].time = this.props.location.data[3].detail
	        compInfo[0].start = this.props.location.data[1].detail
	        compInfo[0].end = this.props.location.data[2].detail

            for(let i = 0 ; i< prevAgeGroups.length; i++) {
                this.setState(prev=>({ageList:[...prev.ageList,prevAgeGroups[i].AgeGroupName]}))
            }
            this.setState({compID:this.props.location.compID,compName:this.props.location.compName})
          }
        catch(error) {
        	console.log(error)
            // this.props.history.push('/app/dashboard')
        }
	}

	handleListItemClick = (event, index,ageGroup) => {
	   this.setState({selectedIndex:index})

	   let ageID
	   for(let i=0; i< prevAgeGroups.length; i++) {
	   		if(ageGroup == prevAgeGroups[i].AgeGroupName) {
	   			ageID = prevAgeGroups[i].AgeGroupID
	   			break
	   		}
	   }

	   this.props.history.push({
		   	pathname:"/app/competitions/test",
		   	ageGroupID:ageID,
		   	compID:this.state.compID,
		   	compName: this.state.compName,
		   	ageGroupName:ageGroup,
		   	data:compInfo,
	        prevAgeGroups:prevAgeGroups
		})
  };


  	handleBack = () => {
  		var data=[{
	      competitionID: this.state.compID,
	      competitionInfo: compInfo[0].info,
	      competitionName: compInfo[0].name,
	      competitionType:{
	        codeName: compInfo[0].type},
	      endDate: compInfo[0].end,
	      startDate: compInfo[0].start,
	      testDuration: compInfo[0].time+":00",
	    }]

	    this.props.history.push({
	      pathname:'/app/competitions/info',
	      data:data[0]
	    })
  	}

	render() {

		const {classes} = this.props;

		const headerStyle ={
			backgroundColor: "#3F51B5",
			color:"#fff",
			height:"50px",
			padding:"10px"
		}

		return (
			<ErrorBoundary>
			<Button color="primary" variant="contained" style={{marginBottom:'15px'}}
        onClick={this.handleBack }><ArrowBack/> Back </Button>
				<Paper p={3} m={3}  align="center" className={classes.paper}>
				<div style={headerStyle} >
					<Typography variant="h6" align="center"> {this.state.compName}	</Typography>
				</div>
	        <div style={{margin:"10px"}}>
	        <Typography><b>Age Group List</b></Typography>
	        <List component="nav"  >
				{this.state.ageList.map((AgeGroupName, index) => {return (
			        <StyledListItem
			          button
			          selected={this.state.selectedIndex === index}
			          onClick={(event) => this.handleListItemClick(event, index, AgeGroupName)}
			        >
			          <ListItemText align="center" primary={AgeGroupName} />
			        </StyledListItem>
			    )})}
			    </List>
            </div>
            </Paper>
			</ErrorBoundary>
		);
	}
}

CompInfo.propTypes= {
  classes: PropTypes.object.isRequired,
};

export default  withStyles(styles)(CompInfo)
