import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { answer, options } from "./Review";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from "@material-ui/core/FormHelperText";
import { errorArr } from "./QuesUpdate";

export function setDataAnswers() {
  if(document.getElementById('ansText') == null){
    options[0].desc = document.getElementById('option1').value;
    options[1].desc = document.getElementById('option2').value;
    options[2].desc = document.getElementById('option3').value;
    options[3].desc = document.getElementById('option4').value;
    answer[1].desc="";
  }
  else {
    answer[1].desc = document.getElementById('ansText').value;
    options[0].desc = "";
    options[1].desc = ""
    options[2].desc = "";
    options[3].desc = "";
    answer[0].desc = "";
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
let correctValue = answer[0].desc;
let correctAns = "";
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
  }
  else
    errorArr[2].desc = "";
}

class AnswersForm extends React.PureComponent {

  state={
      CorrectValue:answer[0].desc,
      openC:false,
      openA:false,
      AnsText:null,
      AnsTextValue:"",
      file1:options[0].imgURL,
      file2:options[1].imgURL,
      file3:options[2].imgURL,
      file4:options[3].imgURL,
  }

  componentDidMount(){
    if(answer[1].desc != null || answer[1].desc != "") {
      this.setState({AnsText:false,AnsTextValue:"Answer Text"})
      ansOrOpt="Ans"
    }
    if(answer[1].desc == null || answer[1].desc == "") {
      this.setState({AnsText:true,AnsTextValue:"Options"})
      ansOrOpt="Opt"
    }
    for(let i = 0 ; i < options.length ; i++)
    {
      if(answer[0].price == options[i].desc) {
        answer[0].desc = correctValue = (i+1)
        this.setState({CorrectValue:i+1})
      }
    }
  }

   handleChangeCorrect = event => {
    this.setState({CorrectValue:event.target.value});
    answer[0].desc = correctValue = event.target.value;
    if (event.target.value == null) {
      document.getElementById('errCorrectAns').style.display = "block";
    } else {
      document.getElementById('errCorrectAns').style.display = "none";
    }
    if(options[parseInt(answer[0].desc - 1)]!= null) {
        answer[0].price = options[parseInt(answer[0].desc - 1)].desc ;
    }
  };

 handleCloseCorrect = () => {
    this.setState({openC:false});
  };

  handleOpenCorrect = () => {

    this.setState({openC:true});
  };

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
  handleChangeExp = value => {
    if (value == "") {
      document.getElementById('err').style.display = "block";
    } else {
      document.getElementById('err').style.display = "none";
    }
  };

render(){
    const { classes } = this.props;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Answer details
      </Typography>
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
            disabled = {!this.state.AnsText}
            onChange = {e=>this.handleChangeOpt1Text(e.target.value)}
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage1"
            src={options[0].imgURL}
            height="95px"
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage2"
            src={options[1].imgURL}
            height="95px"
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage3"
            src={options[2].imgURL}
            height="95px"
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            id="optionImage4"
            src={options[3].imgURL}
            height="100px"
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
