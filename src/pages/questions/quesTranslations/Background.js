import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { quesInfo } from "./Review";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import {languages,errorArr, BackgroundData} from './Checkouts.js'

export function setDataB() {
  quesInfo[1].detail = document.getElementById('caption').value;
  quesInfo[2].detail = document.getElementById('identifier').value;
}

let langValue = "",cnt=0;

const styles = theme => ({
  formControl: {
    minWidth: 120
  }
});

export function requiredBackground() {

  var anythingEmpty = false;
  if (document.getElementById('caption').value == "") {
    document.getElementById('errCap').style.display = "block";
    anythingEmpty = true;
  }
  if (document.getElementById('identifier').value == "") {
    document.getElementById('errId').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[0].detail == "") {
    document.getElementById('errLang').style.display = "block";
    anythingEmpty = true;
  }
  if (anythingEmpty == true) {
    errorArr[0].desc = "error";
  }
  else
    errorArr[0].desc = "";
}

localStorage.setItem("countAQ",0);
class QuestionsForm extends React.PureComponent {

  state={
      LangValue:langValue,
      openA:false,
      openQ:false,
      openL:false,
      countAQ:0,
      imgValue:false,
      languages:languages
  }

  handleChangeLang = event => {
    this.setState({LangValue:event.target.value});
    quesInfo[0].detail = langValue = event.target.value;
    if (event.target.value == null) {
      document.getElementById('errLang').style.display = "block";
    } else {
      document.getElementById('errLang').style.display = "none";
    }
  }

   handleCloseLang = () => {
    this.setState({openL: false});
  }
   handleOpenLang = () => {
    this.setState({openL: true});
  }

  handleChangeCaption = valueCaption => {
    if (valueCaption == "") {
      document.getElementById('errCap').style.display = "block";
    } else {
      document.getElementById('errCap').style.display = "none";
    }
  };
  handleChangeIdentifier = value => {
    if (value == "") {
      document.getElementById('errId').style.display = "block";
    } else {
      document.getElementById('errId').style.display = "none";
    }
  };

render(){
  const { classes } = this.props;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom />
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <TextField
            id="caption"
            name="caption"
            label="Caption"
            fullWidth
            autoComplete="cap"
            onChange={(e) => this.handleChangeCaption(e.target.value)}
            defaultValue={quesInfo[1].detail} />
          <FormHelperText
            id="errCap"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
        <Grid item xs={7}>
          <TextField
            id="identifier"
            name="identifier"
            label="Identifier"
            fullWidth
            onChange={(e) => this.handleChangeIdentifier(e.target.value)}
            defaultValue={quesInfo[2].detail} />
          <FormHelperText
            id="errId"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
         <Grid item xs={5}>
          <FormControl
            className={classes.formControl}
            style={{ minWidth: 250 }}
          >
            <InputLabel id="demo-controlled-open-select-label">
              Language
            </InputLabel>
            <Select
              labelId="langSelect"
              id="langValue"
              open={this.state.openL}
              onClose={this.handleCloseLang}
              onOpen={this.handleOpenLang}
              value={quesInfo[0].detail}
              onChange={this.handleChangeLang}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {languages.map(lang=> {return (
                <MenuItem value={lang}>{lang.toUpperCase()}</MenuItem>
              )}) }
            </Select>
          </FormControl>
          <FormHelperText
            id="errLang"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
         </Grid>
    </React.Fragment>
  );
 }
}

QuestionsForm.propTypes= {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(QuestionsForm);
