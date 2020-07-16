import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import PageTitle from "../../components/PageTitle/PageTitle";
import Alert from '@material-ui/lab/Alert'
import {Paper, Typography, Box, Divider, AppBar, Tab, Tabs, Button, Snackbar} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import QuestionPreview from './QuestionPreview';
import QuestionExplanation from './QuestionExplanation'
import QuestionAgeGroup from './QuestionAgeGroup';
import QuestionCompetition from './QuestionCompetition';
import QuestionTranslations from './QuestionTranslations';
import {baseURL} from '../constants'
import ErrorBoundary from '../error/ErrorBoundary'

class ViewQuestionDetails extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            tabValue:0,
            dataX : "",
            csSkills:[],
            qimglist:[],
            url:'',
            explanation:"",
            openError:false
        }
    }

    async componentDidMount() {

    try {
        var dataX = this.props.location.data
        this.setState({dataX:this.props.location.data,explanation:dataX.explanation})

        for(let i=0;i<dataX.csSkills.length;i++)
        {
            this.state.csSkills.push(dataX.csSkills[i]);
        }

      	 let gres = await axios.get(
         baseURL+'api/ques/getImages/'+dataX.questionID+'/', {
          headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
            }
         ).catch(error=>{this.setState({openError:true})});
      	  if(gres.data.qimg.length>0)
           {
              for(var i=0; i < gres.data.qimg.length;i++)
             {
             	 this.setState({
             	 	url : baseURL + gres.data.qimg[i].uploadedFile,
             	 })
             	 this.setState(prev=>({qimglist:[...prev.qimglist,baseURL + gres.data.qimg[i].uploadedFile]}))
             }
           }
           }
           catch(error) {
            this.props.history.push('/app/dashboard')
           }
    }

    handleChange = (event, newValue) => {
        this.setState({tabValue:newValue});
    };

    handleEdit = (event) => {
        this.props.history.push({
            pathname:'/app/question/edit',
            data:this.state.dataX
        })
    }

    handleAlertClose=()=>{this.setState({openError:false})}

    render () {

        return (
        <ErrorBoundary>
         <Snackbar open={this.state.openError} autoHideDuration={2000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="error">
        <b>Error Occured!</b>
        </Alert>
      </Snackbar>
        <PageTitle title="Question Details" />
         <Button color="primary" variant="contained" style={{ marginLeft:'90%',marginTop:'-60px' }}
      onClick={e=>this.handleEdit(e)}>
      Edit <Edit/></Button>
            <Paper elevation={3} style={{marginRight:'10px',marginTop:'30px',marginLeft:'10px'}}>
            {this.state.dataX == "" ? null : <>
            <AppBar position="static">
            <Typography variant="h4" style={{marginLeft:'2%',marginTop:'1%',marginBottom:'1%'}}>{this.state.dataX.caption}</Typography>
            </AppBar>
            <Typography style={{marginLeft:'2%', marginBottom:'1%',marginTop:'2%'}}><b>Identifier: </b>{this.state.dataX.identifier}</Typography>
            <Typography style={{marginLeft:'2%', marginBottom:'1%'}}><b>Domain: </b>{this.state.dataX.domainName}</Typography>
            <Typography style={{marginLeft:'2%', marginBottom:'1%'}}><b>Question Type: </b>{this.state.dataX.questionType.toUpperCase()}</Typography>
            <Typography style={{marginLeft:'2%', marginBottom:'2%'}}><b>Country: </b>{this.state.dataX.countryName}</Typography>
            <Divider />
            <>
            <AppBar position="static" marginTop='1%'>
                <Tabs value={this.state.tabValue} onChange={this.handleChange}  aria-label="simple tabs">
                  <Tab label="Preview" indicatorColor="#fff" variant="fullWidth" {...a11yProps(0)} />
                  <Tab label="Explanation" indicatorColor="#fff" variant="fullWidth" {...a11yProps(1)}/>
                  <Tab label="Classification" indicatorColor="#fff" variant="fullWidth"{...a11yProps(2)}/>
                  <Tab label="Translations" indicatorColor="#fff" variant="fullWidth"{...a11yProps(3)}/>
                  <Tab label="Age Group" indicatorColor="#fff" variant="fullWidth"{...a11yProps(4)} />
                  <Tab label="Usage" indicatorColor="#fff" variant="fullWidth"{...a11yProps(5)} />
                </Tabs>
              </AppBar>
              <TabPanel value={this.state.tabValue} index={0}>
                <QuestionPreview data={this.state.dataX} fromPage="QuestionDetails" />
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={1}>
               <QuestionExplanation data={this.state.dataX}/>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={2}>
                The following are the {this.state.csSkills.length} skills :
                <br/>
                <React.Fragment style={{marginLeft:'2%'}}>
                {this.state.csSkills.map(i => {return <Typography>{i}</Typography> })}
                </React.Fragment>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={3}>
                <QuestionTranslations history={this.props.history} allData={this.state.dataX} />
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={4}>
                <QuestionAgeGroup data={this.state.dataX.questionID}/>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={5}>
               <QuestionCompetition data={this.state.dataX.questionID}/>
              </TabPanel>
              </>
              </>}
        </Paper>
        </ErrorBoundary>
        );
    }
}

ViewQuestionDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default (ViewQuestionDetails);

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    width: ' 25%'
  };
}


