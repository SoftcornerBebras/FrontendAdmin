import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PageTitle from "../../components/PageTitle/PageTitle";
import { Redirect} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert'
import {Paper, Snackbar, Typography, Box, Divider, AppBar, Tab, Tabs, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer,
        TableHead, TableRow, TableFooter, TablePagination} from '@material-ui/core';
import {baseURL} from '../constants'

const styles = theme => ({

   table: {
    minWidth: 500,
    height: 100
  },
  head:{
    text:'bold'
  }
});

class AgeGroups extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            openError:false,
            ageLevel:[],
        };
    }

    async componentDidMount(){

    try {
        let quesID = this.props.data
        let gresult;
        try {
            gresult = await axios.get(
            baseURL + 'api/cmp/getQuesUsage/'+quesID+'/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}}
            );
        }catch(error){this.setState({openError:true})}

        for(let i=0;i<gresult.data.length;i++)
        {
            this.setState(prev=>({ageLevel:[...prev.ageLevel,{
                cmpname: gresult.data[i].competitionAgeID.competitionID.competitionName,
                age: gresult.data[i].competitionAgeID.AgeGroupClassID.AgeGroupID.AgeGroupName,
                qlevel : gresult.data[i].questionLevelCodeID.codeName,
            }]}))
        }
       }catch(error){this.props.history.push('/app/dashboard')}
    }

    handleAlertClose=()=>{this.setState({openError:false})}

    render() {
        const { classes } = this.props;

        return (
            <>
             <Snackbar open={this.state.openError} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
                 onClose={this.handleAlertClose}>
                <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
                <b>Error Occured!</b>
                </Alert>
              </Snackbar>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead >
            <TableRow>
              <TableCell component="th" scope="row" width = '50%'className={classes.head}>Competition</TableCell>
              <TableCell component="th" scope="row" width = '50%'className={classes.head}>Age Group</TableCell>
              <TableCell component="th" scope="row" width = '50%'className={classes.head}>Question Level</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
             {this.state.ageLevel
                .map((row) => {
                return (
                <TableRow>
                  <TableCell align="left">{row.cmpname}</TableCell>
                  <TableCell align="left">{row.age}</TableCell>
                  <TableCell align="left">{row.qlevel}</TableCell>
                </TableRow>
             )})}
            </TableBody>
              </Table>
            </>
        );
    }
}

export default withStyles(styles)(AgeGroups);
