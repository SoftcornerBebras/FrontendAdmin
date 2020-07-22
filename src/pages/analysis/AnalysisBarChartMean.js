import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios'
import {baseURL} from '../constants'
import ErrorBoundary from '../error/ErrorBoundary'

class AnalysisBarChart extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      ageGrpID:0,
      compID:0
    }
  }

  async componentDidMount() {

    try{

    let ageGrpID = this.props.ageID
    let compID = this.props.compID

    if(this.state.ageGrpID != ageGrpID) {
      let gMean = await axios.get(baseURL+'api/cmp/getStateWiseMean/'+this.props.ageID+"&"+this.props.compID+"/",{
        headers:{
            'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
        }
       })
      let data = gMean.data
      this.setState({ageGrpID, compID,data})
      }
    }catch(error) {
        this.props.history.push('/app/dashboard')
    }
  }

  render () {
    return (
        <ErrorBoundary>
      <ResponsiveContainer width="95%" height={400}>
      <BarChart width={600} height={300} data={this.state.data}
          barCategoryGap={10}  margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <CartesianGrid strokeDasharray="3 3"/>
       <XAxis dataKey="state"/>
       <YAxis/>
       <Tooltip/>
       <Legend />
       <Bar dataKey="MeanMarks" fill="#8884d8" />
      </BarChart>
      </ResponsiveContainer>
      </ErrorBoundary>
    );
  }
}

export default AnalysisBarChart;
