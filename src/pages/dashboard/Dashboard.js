import React, { Component } from 'react';
import image from "../../images/online exam.jpg";
import {Link} from 'react-router-dom';
import CardMedia from '@material-ui/core/CardMedia';
import { Card, CardContent } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

class Dashboard extends Component {

  changeBackground(e) {
    e.target.style.background = '#536DFE';
  }
  originalBackground(e) {
    e.target.style.background = 'transparent';
  }

  render(){


    return (


      <Card style={{  height: '92vh',
                  width: '100vw',margin:'-30px'}}>
      <div >
          <CardContent style={{margin:'-10px'}} >
            <div style={{position: 'relative'}} >
              <CardMedia
                  component="img"
                  style={{

                  objectFit: 'cover',
                  alignItems: 'left',
          }}
                  image={image}
              />
              <div style={{
                position: 'absolute',

                top: 40,
                left: '50%',
                transform: 'translateX(-50%)'
              }} ><h1 style={{fontSize:"80px",color:"black"}} >Bebras India Administration</h1></div>

<div style={{
                position: 'absolute',

                top: 380,
                left: '50%',
                transform: 'translateX(-50%)'
              }} >
 <ButtonGroup size="large" variant="contained"  aria-label="contained primary button group">
 <Link to="/app/users" style={{textDecoration: 'none',color:"black"}}> <Button  style={{backgroundColor:"transparent",color:"black",height:"100px",width:"100px"}} onMouseOver={this.changeBackground} onMouseOut={this.originalBackground} ><b>USERS</b></Button></Link>
 <Link to="/app/schools" style={{textDecoration: 'none',color:"black"}}> <Button  style={{backgroundColor:"transparent",color:"black",height:"100px",width:"100px"}} onMouseOver={this.changeBackground} onMouseOut={this.originalBackground}><b>SCHOOLS</b></Button></Link>

 <Link to="/app/questions" style={{textDecoration: 'none',color:"black"}}> <Button  style={{backgroundColor:"transparent",color:"black",height:"100px"}} onMouseOver={this.changeBackground} onMouseOut={this.originalBackground}><b>QUESTIONS</b></Button></Link>

   <Link to="/app/competition" style={{textDecoration: 'none',color:"black"}}> <Button  style={{backgroundColor:"transparent",color:"black",height:"100px"}} onMouseOver={this.changeBackground} onMouseOut={this.originalBackground}><b>COMPETITIONS</b></Button></Link>
  <Link to="/app/analysisPage" style={{textDecoration: 'none',color:"black"}}>  <Button  style={{backgroundColor:"transparent",color:"black",height:"100px"}} onMouseOver={this.changeBackground} onMouseOut={this.originalBackground}><b>ANALYSIS</b></Button></Link>
  <Link to="/app/export" style={{textDecoration: 'none',color:"black"}}><Button  style={{backgroundColor:"transparent",color:"black",height:"100px"}} onMouseOver={this.changeBackground} onMouseOut={this.originalBackground}><b>EXPORT</b></Button></Link>
</ButtonGroup>
</div>
            </div>
          </CardContent>
      </div>
  </Card>

    );
  }
}

export default Dashboard;
