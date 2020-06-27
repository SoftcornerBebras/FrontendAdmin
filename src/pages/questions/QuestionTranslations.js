import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PageTitle from "../../components/PageTitle/PageTitle";
import {Redirect} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert'
import {Paper, Typography, Box, Divider, Snackbar, AppBar, Tab, Tabs, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer,
        TableHead, TableRow, TableFooter, TablePagination, Button} from '@material-ui/core';
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

class Translations extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            ansText:"",
            background:"",
            quesID:"",
            openError:false,
            trans:[],
        };
    }

    async componentDidMount(){

    try{
        let quesID = this.props.data
        this.setState({background:this.props.background,ansText:this.props.ansText,quesID:this.props.data})
        let gresult;
        try {
            gresult = await axios.get(
            baseURL+'api/ques/getTranslations/'+quesID+'/',
            {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}}
            );
        }catch(error){this.setState({openError:true})}

        for(let i=0;i<gresult.data.length;i++)
        {
            this.setState(prev=>({trans:[...prev.trans,{
                caption: gresult.data[i].translation.caption,
                languages : gresult.data[i].languageCodeID.codeName,
                modified_on: gresult.data[i].modified_on,
            }]}))
        }
        }catch(error){this.props.history.push('/app/dasboard')}
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
            <Button color="primary" variant="contained" style={{ marginBottom: '50px',marginLeft:'90%'}}
                 onClick={() => this.props.history.push({pathname:"/app/question/detail/add",state:{questionID:this.state.quesID,ansText:this.state.ansText,background:this.state.background}})}>
            Add</Button>
            <Table className={classes.table} aria-label="custom pagination table" style={{marginTop:'-10px'}}>
            <TableHead >
            <TableRow>
              <TableCell component="th" scope="row" width = '50%'className={classes.head}>Caption</TableCell>
              <TableCell component="th" scope="row" width = '25%'className={classes.head}>Languages</TableCell>
              <TableCell component="th" scope="row" width = '25%'className={classes.head}>Modified On</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
             {this.state.trans
                .map((row) => {
                return (
                <TableRow>
                  <TableCell align="left">{row.caption}</TableCell>
                  <TableCell align="left">{row.languages.toUpperCase()}</TableCell>
                  <TableCell align="left">{row.modified_on}</TableCell>
                </TableRow>
               )})}
            </TableBody>
              </Table>
            </>
        );
    }
}

export default withStyles(styles)(Translations);
