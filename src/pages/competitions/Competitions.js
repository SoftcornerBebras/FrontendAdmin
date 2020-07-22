import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import PageTitle from "../../components/PageTitle/PageTitle";
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import axios from 'axios';
import {baseURL} from '../constants'


const useStyles = theme => ({
  table: {
    minWidth: 650
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class Competition extends React.PureComponent {

  constructor(props){
    super(props);
    this.state={
      compData:[],
      years:[],
      expanded:false,
      openError:false
    }
  }

  async componentDidMount() {

    localStorage.removeItem("created")
    localStorage.removeItem("getMarks")
    localStorage.removeItem("quesAdded")
    localStorage.removeItem("addedNewGrp")

    try{

   let gyear = await axios.get(baseURL+'api/cmp/getYears/',{
        headers:{
             'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
         }
     })
     let yearData = gyear.data.data
    for(let i = 0 ; i < yearData.length ; i ++) {
      this.setState(prevState => ({years:[...prevState.years,yearData[yearData.length-1-i].substring(0,4)]}))
    }
  }catch(error) {
        this.setState({openError:true})
  }

  }

handleClose = () => {
    this.setState({openError:false})
}
handleClick = (event, data) => {
    this.props.history.push({
      pathname:'/app/competitions/info',
      data:data
    });
    }

getCompDetails = (year,panel) =>  (event, isExpanded) => {

    this.setState({expanded: isExpanded ? panel : false})
    this.getData(year)

  }
async getData(year) {
  try{
  let gcmp = await axios.get(baseURL+'api/cmp/getCompetitionYearWise/'+year+"/",{
        headers:{
             'Content-Type' : 'application/json',
                 Authorization: 'Token '+localStorage.getItem('id_token')
         }
     }).catch(error => {
         this.setState({openError:true})
     })
     this.setState({compData:gcmp.data})
    }catch(error){}
};

  render () {

    return (
     <div>
        <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleClose}>
        <Alert onClose={this.handleClose} variant="filled" severity="error">
        <b>Error occured!</b>
        </Alert>
      </Snackbar>
        <PageTitle title="Competitions" />
        <Button color="primary" variant="contained" style={{ marginBottom:"10px", marginLeft:'90%',marginTop:'-60px' }}
        onClick={() => this.props.history.push("/app/competitions/create/1/")}

        >Create</Button>
        {this.state.years.length != 0 ? this.state.years.map((year,index) => {return (
          <ExpansionPanel expanded={this.state.expanded === index} onChange={this.getCompDetails(year,index)}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6" gutterBottom>
              {year} Challenges
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TableContainer component={Paper}>
              <Table style={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Challenge&nbsp;Name</TableCell>
                    <TableCell>Challenge&nbsp;Type</TableCell>
                    <TableCell align="center">Start&nbsp;date</TableCell>
                    <TableCell align="center">End&nbsp;date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {this.state.compData.map((row,index) => {return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, row)}
                    key={row.competitionID}
                  >
                    <TableCell component="th" scope="row">
                      {index+1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.competitionName}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.competitionType.codeName}
                    </TableCell>
                    <TableCell align="right">{row.startDate.replace(/T|Z/g," ")}</TableCell>
                    <TableCell align="right">{row.endDate.replace(/T|Z/g," ")}</TableCell>
                  </TableRow>
                )})}
                </TableBody>
              </Table>
            </TableContainer>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        )}) : <Typography align="center" style={{color:"red"}} variant="h6">No Competitions Created Yet!</Typography>}
      
      </div>
    );
  }
}

Competition.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default  withStyles(useStyles)(Competition);
