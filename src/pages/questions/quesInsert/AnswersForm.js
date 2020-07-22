import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { quesInfo, answer, options } from "./Review";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from "@material-ui/core/FormHelperText";
import { errorArr } from "./Checkout";

export function setDataAnswers() {

  if(document.getElementById('ansText')== null){
    options[0].desc = document.getElementById('option1').value;
    options[0].price = img1;
    options[0].imgURL = imgSrc1;
    options[1].desc = document.getElementById('option2').value;
    options[1].price = img2;
    options[1].imgURL = imgSrc2;
    options[2].desc = document.getElementById('option3').value;
    options[2].price = img3;
    options[2].imgURL = imgSrc3;
    options[3].desc = document.getElementById('option4').value;
    options[3].price = img4;
    options[3].imgURL = imgSrc4;
    answer[0].desc = correctValue;
    answer[1].desc="";
    correctValue=""
  }else {
    answer[1].desc = document.getElementById('ansText').value;
    options[0].desc = options[0].price = options[0].imgURL = "";
    options[1].desc = options[1].price = options[1].imgURL = ""
    options[2].desc = options[2].price = options[2].imgURL = "";
    options[3].desc =  options[3].price = options[3].imgURL = "";
    answer[0].desc = "";
    correctValue=""
  }
}

const styles = theme => ({
  formControl: {
    minWidth: 120
  },
  input: {
    display: "none"
  }
});
let correctValue = "";
let correctAns = "";
let imgSrc1 = "";let img1="";
let imgSrc2 = "";let img2="";
let imgSrc3 = "";let img3="";
let imgSrc4 = "";let img4="";
let ansOrOpt="";

export function requiredAnswersForm() {
  var anythingEmpty = false;
  if(document.getElementById('ansText')== null) {
    if (document.getElementById('option1').value == "") {
      document.getElementById('errOption1').style.display = "block";
      anythingEmpty = true;
    }
    if (document.getElementById('option2').value == "") {
      document.getElementById('errOption2').style.display = "block";
      anythingEmpty = true;
    }
    if (document.getElementById('option3').value == "") {
      document.getElementById('errOption3').style.display = "block";
      anythingEmpty = true;
    }
    if (document.getElementById('option4').value == "") {
      document.getElementById('errOption4').style.display = "block";
      anythingEmpty = true;
    }
    if (correctValue == "") {
      document.getElementById('errCorrectAns').style.display = "block";
      anythingEmpty = true;
    }
  }
  else {
    if (document.getElementById('ansText').value == "") {
        document.getElementById('errAnsText').style.display = "block";
        anythingEmpty = true;
    }
  }
  if (anythingEmpty == true) {
    errorArr[2].desc = "error";
  }else {
    errorArr[2].desc = "";
  }
}

class AnswersForm extends React.PureComponent {

  state={
      CorrectValue:correctValue,
      openC:false,
      openA:false,
      AnsText:null,
      AnsTextValue:"Answer Text",
      file1:options[0].imgURL,
      file2:options[1].imgURL,
      file3:options[2].imgURL,
      file4:options[3].imgURL,
      imgValue:false,
      openError:false
  }

  componentDidMount(){
    if(quesInfo[5].detail == 'Mcqs')
    {
      this.setState({imgValue:false})
    }
    if(quesInfo[5].detail == 'Mcqs_With_Images')
    {
      this.setState({imgValue:true,AnsText:true,AnsTextValue:"Options"})
    }
    if(answer[1].desc!="" && answer[0].desc=="")
    {
      this.setState({AnsText:false,AnsTextValue:"Answer Text"});
    }
    else if(answer[1].desc=="" && (answer[0].desc!="" || answer[0].price!="" ) )
    {
      this.setState({AnsText:true,AnsTextValue:"Options"});
    }

    correctValue = answer[0].desc
    this.setState({CorrectValue:answer[0].desc})
  }

   handleChangeCorrect = event => {
    this.setState({CorrectValue:event.target.value});
    correctValue = event.target.value;
    if (event.target.value == null) {
      document.getElementById('errCorrectAns').style.display = "block";
    } else {
      document.getElementById('errCorrectAns').style.display = "none";
    }
  };

 handleCloseCorrect = () => {
    this.setState({openC:false});
  };

  handleOpenCorrect = () => {

    this.setState({openC:true});
  };

  handleChangeOption1 = event => {
    if(event.target.files[0].name.length<=45){
        this.setState({file1: URL.createObjectURL(event.target.files[0])});
        document.getElementById("optionImage1").style.display = "flex";
        imgSrc1 = URL.createObjectURL(event.target.files[0]);
        img1 =(event.target.files[0]);
    }else {this.setState({openError:true})}
  };
 handleChangeOption2 = event => {
    if(event.target.files[0].name.length<=45){
        this.setState({file2: URL.createObjectURL(event.target.files[0])});
        document.getElementById("optionImage2").style.display = "flex";
        imgSrc2 = URL.createObjectURL(event.target.files[0]);
        img2 = (event.target.files[0]);
    }else {this.setState({openError:true})}
  };
  handleChangeOption3 = event => {
    if(event.target.files[0].name.length<=45){
        this.setState({file3:URL.createObjectURL(event.target.files[0])});
        document.getElementById("optionImage3").style.display = "flex";
        imgSrc3 = URL.createObjectURL(event.target.files[0]);
        img3 = (event.target.files[0]);
    }else {this.setState({openError:true})}
  };
 handleChangeOption4 = event => {
    if(event.target.files[0].name.length<=45){
        this.setState({file4:URL.createObjectURL(event.target.files[0])});
        document.getElementById("optionImage4").style.display = "flex";
        imgSrc4 = URL.createObjectURL(event.target.files[0]);
        img4 = (event.target.files[0]);
     }else {this.setState({openError:true})}
  };
  handleChangeAnsTxt = event => {
    this.setState({AnsTextValue: event.target.value});
    event.target.value == "Answer Text" ?
    (
      this.setState({AnsText:false})
    ):(
      this.setState({AnsText:true})
    );
    this.setState({openA: false});
    this.handleAnsOpt();
  };

  handleAnsOpt () {
    if(this.state.AnsText==false){
      ansOrOpt="Ans";
      answer[0].desc="";

    }
    else  {
      ansOrOpt="Opt";
      answer[1].desc="";
      correctValue="";
    }
  }

  handleChangeAnsText = value => {
    if (value == "") {
      document.getElementById('errAnsText').style.display = "block";
    } else {
      document.getElementById('errAnsText').style.display = "none";
    }
  };
  handleCloseAns = () => {
    this.setState({openA: false});
  };
  handleOpenAns = event => {
    this.setState({openA: true});
  };
  handleChangeOpt1Text = value => {
    if (value == "") {
      document.getElementById('errOption1').style.display = "block";
    } else {
      document.getElementById('errOption1').style.display = "none";
    }
  };
   handleChangeOpt2Text = value => {
    if (value == "") {
      document.getElementById('errOption2').style.display = "block";
    } else {
      document.getElementById('errOption2').style.display = "none";
    }
  };
   handleChangeOpt3Text = value => {
    if (value == "") {
      document.getElementById('errOption3').style.display = "block";
    } else {
      document.getElementById('errOption3').style.display = "none";
    }
  };
   handleChangeOpt4Text = value => {
    if (value == "") {
      document.getElementById('errOption4').style.display = "block";
    } else {
      document.getElementById('errOption4').style.display = "none";
    }
  };
  handleAlertClose=()=>{this.setState({openError:false})}
render(){
    const { classes } = this.props;
  return (
    <React.Fragment>
     <Snackbar open={this.state.openError} autoHideDuration={4000} anchorOrigin={{ vertical:'top', horizontal:'center'} }
         onClose={this.handleAlertClose}>
        <Alert onClose={this.handleAlertClose} variant="filled" severity="warning">
        <b>Image Name should be Shorter!</b>
        </Alert>
      </Snackbar>
      <Typography variant="h6" gutterBottom>
        Answer details
      </Typography>
      { quesInfo[5].detail == "Mcqs" ?
      <FormControl
            className={classes.formControl}
            style={{ minWidth: 320 }}
          >
            <InputLabel id="demo-controlled-open-select-label">
              Select Type
            </InputLabel>
            <Select
              labelId="ansSelect"
              id="ansSelect"
              open={this.state.openA}
              onClose={this.handleCloseAns}
              onOpen={this.handleOpenAns}
              value={this.state.AnsTextValue}
              onChange={this.handleChangeAnsTxt}
            >
          <MenuItem value="Answer Text">Answer Text</MenuItem>
          <MenuItem value="Options">Options</MenuItem>
        </Select>
      </FormControl> : null}
      <Grid container spacing={3}>
        {!this.state.AnsText ? (<>
        <Grid item xs={12} md={6}>
          <TextField
            required
            onChange = {e=>this.handleChangeAnsText(e.target.value)}
            disabled = {this.state.AnsText}
            id="ansText"
            label="Answer Text"
            defaultValue={answer[1].desc}
            fullWidth
            style={{marginTop:"15px"}}
            InputProps={{
              readOnly : this.state.AnsText
            }} />
            <FormHelperText
            id="errAnsText"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
        <Grid item xs={12} sm={6}/> </>)
        : null}
        {this.state.AnsText ? (<>
        <Grid item xs={12} md={6}>
          <TextField
            required
            onChange = {e=>this.handleChangeOpt1Text(e.target.value)}
            disabled = {!this.state.AnsText}
            id="option1"
            label="Option 1"
            defaultValue={options[0].desc}
            style={{marginTop:"15px"}}
            fullWidth
            InputProps={{
              readOnly : !this.state.AnsText
            }}
          />
          <FormHelperText
            id="errOption1"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
          <p />
          { this.state.imgValue && this.state.AnsText ?
          <>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file1"
            type="file"
            onChange={this.handleChangeOption1}
          />
          <label htmlFor="contained-button-file1">
            <Button
              variant="contained"
              color="primary"
              component="span"
              float="left"
            >
              Choose image
            </Button>
          </label></>
          :null}
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage1"
            src={this.state.file1}
            height="95px"
            style={{ display: this.state.file1  === "" ? "none" : "flex" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            onChange = {e=>this.handleChangeOpt2Text(e.target.value)}
            disabled = {!this.state.AnsText}
            id="option2"
            label="Option 2"
            defaultValue={options[1].desc}
            fullWidth
            InputProps={{
              readOnly : !this.state.AnsText
            }}
          />
          <FormHelperText
            id="errOption2"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
          <p />
          { this.state.imgValue  && this.state.AnsText ?
          <>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file2"
            type="file"
            onChange={this.handleChangeOption2}
          />
          <label htmlFor="contained-button-file2">
            <Button
              variant="contained"
              color="primary"
              component="span"
              float="left"
            >
              Choose image
            </Button>
          </label></>
          :null}
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage2"
            src={this.state.file2}
            height="95px"
            style={{ display: this.state.file2  === "" ? "none" : "flex" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            onChange = {e=>this.handleChangeOpt3Text(e.target.value)}
            disabled = {!this.state.AnsText}
            id="option3"
            label="Option 3"
            defaultValue={options[2].desc}
            fullWidth
            InputProps={{
              readOnly : !this.state.AnsText
            }}
          />
          <FormHelperText
            id="errOption3"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
          <p/>
          { this.state.imgValue && this.state.AnsText ?
          <>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file3"
            type="file"
            onChange={this.handleChangeOption3}
          />
          <label htmlFor="contained-button-file3">
            <Button
              variant="contained"
              color="primary"
              component="span"
              float="left"
            >
              Choose image
            </Button>
          </label></>
          :null}
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage3"
            src={this.state.file3}
            height="95px"
            style={{ display: this.state.file3 === "" ? "none" : "flex" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            onChange = {e=>this.handleChangeOpt4Text(e.target.value)}
            disabled = {!this.state.AnsText}
            id="option4"
            label="Option 4"
            defaultValue={options[3].desc}
            fullWidth
            InputProps={{
              readOnly : !this.state.AnsText
            }}
          />
          <FormHelperText
            id="errOption4"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
          <p />
          { this.state.imgValue && this.state.AnsText ?
          <>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file4"
            type="file"
            onChange={this.handleChangeOption4}
          />
          <label htmlFor="contained-button-file4">
            <Button
              variant="contained"
              color="primary"
              component="span"
              float="left"
            >
              Choose image
            </Button>
          </label></>
          :null}
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage4"
            src={this.state.file4}
            height="100px"
            style={{ display: this.state.file4  === "" ? "none" : "flex" }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl
            className={classes.formControl}
            style={{ minWidth: 200 }}
          >
            <InputLabel id="demo-controlled-open-select-label">
              Correct answer
            </InputLabel>
            <Select
              disabled = {!this.state.AnsText}
              labelId="correctSelect"
              id="correctSelect"
              InputProps={{
              readOnly : !this.state.AnsText
            }}
              open={this.state.openC}
              onClose={this.handleCloseCorrect}
              onOpen={this.handleOpenCorrect}
              value={this.state.CorrectValue}
              onChange={this.handleChangeCorrect}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="1">Option 1</MenuItem>
              <MenuItem value="2">Option 2</MenuItem>
              <MenuItem value="3">Option 3</MenuItem>
              <MenuItem value="4">Option 4</MenuItem>
            </Select>
          </FormControl>
          <FormHelperText
            id="errCorrectAns"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid> </>)
        : null}
      </Grid>
    </React.Fragment>
  );
}
}

AnswersForm.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(AnswersForm);
