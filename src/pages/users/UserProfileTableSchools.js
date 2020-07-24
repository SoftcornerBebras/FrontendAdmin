import React from 'react';
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import {Grid, CircularProgress, Table, TableBody, TableCell, TableContainer,
        TableHead, TableRow, TableFooter, TablePagination} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {baseURL} from "../constants.js"
import { Redirect} from 'react-router-dom'

const headerList=["Date","Type","Description"];

const styles = theme => ({

   table: {
    minWidth: 500,
    height: 100
  },
  head:{
    text:'bold'
  }
});

class TableQuestions extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state={
            SchoolName:"",
            type:"Modified",
            date:"",
            getValue:[],
            SchoolID:"",
            count:1,
            pageSize:3,
            page: 0,
            rowsPerPage:3,
            dense:false,
            emptyRows:0
        };
    }

    async componentDidMount(){

        let gresult;
        try{
            gresult = await axios.get(
            baseURL+'api/com/userProfileSchool/'+localStorage.getItem('username')+'/', {
                headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
        );
        this.setState({count:gresult.data.length})
        for(let i = 0; i < gresult.data.length ; i++)
        {
            this.setState(prevState=>({getValue:[...prevState.getValue,
            {SchoolID:gresult.data[i].schoolID , date:gresult.data[i].modified_on,
            SchoolName:gresult.data[i].schoolName,
            emptyRows:( 3 - Math.min(3, gresult.data.length - this.state.page * 3))}]}));
        }
        }catch(error){return <Redirect to='/app/dashboard' />}
    }

    handleChangePage = (event, newPage) => {
        this.setState({page:newPage, emptyRows:( 3 - Math.min(3, this.state.getValue.length - (newPage* 3)))});
    };

    render() {
        const { classes } = this.props;

        return (
            <>
            <Table className={classes.table} aria-label="custom pagination table">
            <TableHead >
            <TableRow>
              <TableCell component="th" scope="row" width = '15%' className={classes.head}>Date</TableCell>
              <TableCell component="th" scope="row" width = '15%'className={classes.head}>Type</TableCell>
              <TableCell component="th" scope="row" width = '70%'className={classes.head}>Description</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
             {this.state.getValue
                .slice(this.state.page * this.state.pageSize, this.state.page * this.state.pageSize + this.state.pageSize)
                .map((row) => {
                return (
                <TableRow key={row.quesID}>
                  <TableCell align="left">{row.date.replace(/T|Z/g," ").substring(0,19)}</TableCell>
                  <TableCell align="left">{this.state.type}</TableCell>
                  <TableCell align="left">The {row.SchoolName} was modified on {row.date.replace(/T|Z/g," ").substring(0,19)}.</TableCell>
                </TableRow>
             )})}
             {this.state.emptyRows > 0 && (
                <TableRow style={{ height: (this.state.dense ? 33 : 53) * this.state.emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[3]}
                  count={this.state.count}
                  rowsPerPage={3}
                  onChangePage={this.handleChangePage}
                  page={this.state.page}
                />
              </TableRow>
            </TableFooter>
              </Table>
            </>
        );
    }
}

TableQuestions.propTypes = {
  classes: PropTypes.object.isRequired,
};

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export default withStyles(styles)(TableQuestions);

