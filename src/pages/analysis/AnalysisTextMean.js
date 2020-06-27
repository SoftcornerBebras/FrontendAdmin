import React, { PureComponent } from 'react';
import {Typography} from '@material-ui/core';
import axios from 'axios'
import {baseURL} from '../constants'
import ErrorBoundary from '../error/ErrorBoundary'

var statesList=""
class AnalysisText extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      ageGrpID:0,
      compID:0,
      stateMarks:[],
    }
  }

  async componentDidMount() {

    try{
        let ageGrpID = this.props.ageID
        let compID = this.props.compID

        if(ageGrpID != this.state.ageGrpID) {
           let gMean = await axios.get(baseURL+'api/cmp/getStateWiseMean/'+this.props.ageID+"&"+this.props.compID+"/",{
            headers:{
                'Content-Type' : 'application/json',
                    Authorization: 'Token '+localStorage.getItem('id_token')
            }
           })
          let data = gMean.data
        this.setState({ageGrpID, compID})

          for(let i=0;i<data.length;i++) {
            if(i==0){
                statesList=data[0].state
            }else {
                statesList +=", " + data[i].state
            }
            this.setState(prev=>({stateMarks:[...prev.stateMarks,{
              state:data[i].state,
              meanMarks:data[i].MeanMarks
            }]}))
          }
        }
       }catch(error) {
            this.props.history.push('/app/dashboard')
        }
  }

  render () {

    return (
    <ErrorBoundary>
      <p style={{fontSize:"20px"}}>
        The states that participated in this competition are {statesList}.
        <br/>
        According to the results of students from the above states, the mean score obtained of the students per state are as follows:
        <br/>
        <ul>
        {this.state.stateMarks.map(row => {
          return (
            <li>
              {row.state} has a mean score of {row.meanMarks}
              <br/>
            </li>
        )})}
        </ul>
      </p>
      </ErrorBoundary>
    );
  }
}

export default AnalysisText;
