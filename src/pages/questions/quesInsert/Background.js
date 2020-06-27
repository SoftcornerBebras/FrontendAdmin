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
import {domains,skills,types,quesLevels,ageGroups,ageGroupsID,languages,countries,errorArr} from './Checkout.js'

export function setDataB() {
  quesInfo[1].detail = document.getElementById('identifier').value;
  quesInfo[2].detail = document.getElementById('caption').value;
  quesInfo[6].detail = ageGroupValue;
  quesInfo[7].detail = quesLevelValue;

  autoValue = []
  ageGroupValueX = []
  quesLevelValueX = []
}


export let ageGroupIDValue=[];

let ageQues = [];
let ageGroupValue = "";
let quesLevelValue = "";
let ageGroupValueX = [];
let ageGroupIDValueX = [];
let quesLevelValueX = [];
let autoValue = [];
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
    document.getElementById('errCountry').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[4].detail == "") {
    document.getElementById('errDomain').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[5].detail == "") {
    document.getElementById('errType').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[8].detail == "") {
    document.getElementById('errLang').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[3].detail == "") {
    document.getElementById('errClassi').style.display = "block";
    anythingEmpty = true;
  }

  if (anythingEmpty == true) {
    errorArr[0].desc = "error";
  }
  else
    errorArr[0].desc = "";
}

class Background extends React.PureComponent {

  constructor(props)
  {
    super(props);
    this.state={
      Country:"",
      TypeValue:"",
      AgeGroupValue:ageGroupValue,
      QuesLevelValue:quesLevelValue,
      LangValue:"",
      open:false,
      openC:false,
      openD:false,
      openT:false,
      openA:false,
      openQ:false,
      openL:false,
      countAQ:parseInt(localStorage.getItem("countAQ")),
      countries:countries,
      domains:domains,
      skills:skills,
      types:types,
      quesLevels:quesLevels,
      ageGroups:ageGroups,
      languages:languages,
      rerender: false,
    }
  }

  componentDidMount() {

    ageGroupValue = quesInfo[6].detail;
    quesLevelValue = quesInfo[7].detail;
    ageGroupValueX = quesInfo[6].detail.split(",")
    quesLevelValueX = quesInfo[7].detail.split(",")
    this.setState({rerender:true})
  }

  handleChangeCountry = (event) => {
    this.setState({Country: event.target.value});
    quesInfo[0].detail = event.target.value;
    if (event.target.value == null) {
      document.getElementById('errCountry').style.display = "block";
    } else {
      document.getElementById('errCountry').style.display = "none";
    }
  }

  handleClose = () => {
    this.setState({open: false});
  }

   handleOpen = () => {

    this.setState({open: true});
  }

  handleCloseCountry = () => {
    this.setState({openC: false});
  }

   handleOpenCountry = () => {

    this.setState({openC: true});
  }

  handleChangeDomain = event => {
    this.setState({DomainValue:event.target.value});
    quesInfo[4].detail = event.target.value;
    if (event.target.value == null) {
      document.getElementById('errDomain').style.display = "block";
    } else {
      document.getElementById('errDomain').style.display = "none";
    }
  }

  handleCloseDomain = () => {
    this.setState({openD: false});
  }

   handleOpenDomain = () => {
    this.setState({openD: true});
  }

   handleChangeType = event => {
    this.setState({TypeValue:event.target.value});
    quesInfo[5].detail = event.target.value;
    if (event.target.value == null) {
      document.getElementById('errType').style.display = "block";
    } else {
      document.getElementById('errType').style.display = "none";
    }
  }

  handleCloseType = () => {
    this.setState({openT: false});

  }

  handleOpenType = () => {
    this.setState({openT: true});
  }

  handleChangeLang = event => {
    this.setState({LangValue:event.target.value});
    quesInfo[8].detail = event.target.value;
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

  handleChangeAuto = (event, value) => {
    autoValue = value;
    let str = value[0];
    for (let i = 1; i < value.length; i++) {
      str = str + "," + value[i];
    }
    quesInfo[3].detail = str;
    if (value == "") {
      document.getElementById('errClassi').style.display = "block";
    } else {
      document.getElementById('errClassi').style.display = "none";
    }
  }

  handleChangeCaption = valueCaption => {
    if (valueCaption == "") {
      document.getElementById('errCap').style.display = "block";
    } else {
      document.getElementById('errCap').style.display = "none";
    }
  };

  handleChangeIdentifier = valueId => {
    if (valueId == "") {
      document.getElementById('errId').style.display = "block";
    } else {
      document.getElementById('errId').style.display = "none";
    }
  };

  handleChangeAgeGroup = (event,value) => {

    let string = (event.currentTarget.id), id=0;
    if( string.substring(0,1) == "m") { id = 0; }
    else {
      id=parseInt(string.substring(0,1));
    }
    if(value!=null)
    {ageGroupValueX[id]=(value);

      for(let i=0;i<ageGroups.length;i++)
      {
        if(value==ageGroups[i])
        {
          ageGroupIDValueX[id]=ageGroupsID[i];
          break;
        }
      }
    }
    else {
      ageGroupValueX[id]="";
      ageGroupIDValueX[id]="";
    }
    ageGroupValue=ageGroupValueX[0];
    ageGroupIDValue=ageGroupIDValueX[0];
    for (let i = 1; i < ageGroupValueX.length; i++) {
      ageGroupValue += "," + ageGroupValueX[i];
      ageGroupIDValue += "," + ageGroupIDValueX[i]
    }
    quesInfo[6].detail = ageGroupValue

  }

  handleChangeQuesLevel = (event, value) => {

    let string = (event.currentTarget.id), id=0;
    if( string.substring(0,1) == "m") { id = 0; }
    else {
      id=parseInt(string.substring(0,1));
    }

    if(value!=null)
    {
      quesLevelValueX[id]=(value);
    }
    else {
      quesLevelValueX[id]="";
    }
    quesLevelValue=quesLevelValueX[0];
    for (let i = 1; i < quesLevelValueX.length; i++) {
      quesLevelValue += "," + quesLevelValueX[i];
    }
   quesInfo[7].detail = quesLevelValue

  }

  increment =() => {
    let i = parseInt(localStorage.getItem("countAQ"));
    i+=1;
    localStorage.setItem("countAQ",i);
    this.setState({countAQ:this.state.countAQ+1});
  };

  addComponent = () => {
    ageQues.length=0;
    for(let i=0;i<this.state.countAQ;i++) {
      ageQues.push(<>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id={i}
            options={this.state.ageGroups}
            getOptionLabel={option => option}
            defaultValue={ageGroupValueX[i]}
            onChange={this.handleChangeAgeGroup}
            renderInput={params => (
              <TextField
                {...params}
                variant="standard"
                id="mul"
                label="Age Group"
                placeholder=""
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id={i}
            options={this.state.quesLevels}
            getOptionLabel={option => option}
            defaultValue={quesLevelValueX[i]}
            onChange={this.handleChangeQuesLevel}
            renderInput={params => (
              <TextField
                {...params}
                variant="standard"
                id="mul"
                label="Question Level"
                placeholder=""
                fullWidth
              />
            )}
          />
        </Grid>
      </>);
    }
    return ageQues;
  }

render(){

  const { classes } = this.props;
  if(quesInfo[3].detail != undefined) {
    if(quesInfo[3].detail.includes(",") ) {
      autoValue =  quesInfo[3].detail.split(",");
    }
    else
    {
       if(quesInfo[3].detail.length >0  ){
      autoValue[0] =  quesInfo[3].detail;
    }
    }
  }

  ageGroupValueX = quesInfo[6].detail.split(",")
  quesLevelValueX = quesInfo[7].detail.split(",")

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="caption"
            name="caption"
            label="Caption"
            fullWidth
            autoComplete="cap"
            onChange={(e) => this.handleChangeCaption(e.target.value)}
            defaultValue={quesInfo[2].detail} />
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
            autoComplete="cap"
            onChange={(e) => this.handleChangeIdentifier(e.target.value)}
            defaultValue={quesInfo[1].detail} />
          <FormHelperText
            id="errId"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
        <Grid item xs={5} >
          <FormControl
            className={classes.formControl}
            style={{ minWidth: 320 }}
          >
            <InputLabel id="demo-controlled-open-select-label">
              Country
            </InputLabel>
            <Select
              labelId="countrySelect"
              id="country"
              open={this.state.openC}
              onClose={this.handleCloseCountry}
              onOpen={this.handleOpenCountry}
              value={quesInfo[0].detail}
              onChange={this.handleChangeCountry}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.countries.map(cntry => {return (
                <MenuItem value={cntry}>{cntry}</MenuItem>
              )})}
            </Select>
          </FormControl>
          <FormHelperText
            id="errCountry"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
        <Grid item xs={5} >
          <FormControl
            className={classes.formControl}
            style={{ minWidth: 300 }}
          >
            <InputLabel id="demo-controlled-open-select-label">
              Domain
            </InputLabel>
            <Select
              labelId="domSelect"
              id="domValue"
              open={this.state.openD}
              onClose={this.handleCloseDomain}
              onOpen={this.handleOpenDomain}
              value={quesInfo[4].detail}
              onChange={this.handleChangeDomain}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.domains.map(dom => {return (
                <MenuItem value={dom}>{dom}</MenuItem>
              )})}
            </Select>
          </FormControl>
          <FormHelperText
            id="errDomain"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>

        <Grid item xs={3} >
          <FormControl
            className={classes.formControl}
            style={{ minWidth: 200 }}
          >
            <InputLabel id="demo-controlled-open-select-label">Type</InputLabel>
            <Select
              labelId="typeSelect"
              id="typeValue"
              open={this.state.openT}
              onClose={this.handleCloseType}
              onOpen={this.handleOpenType}
              value={quesInfo[5].detail}
              onChange={this.handleChangeType}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.types.map(type=>{return(
                <MenuItem value={type}>{type.toUpperCase()}</MenuItem>
              )})}
            </Select>
          </FormControl>
          <FormHelperText
            id="errType"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
         <Grid item xs={4}>
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
              value={quesInfo[8].detail}
              onChange={this.handleChangeLang}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.languages.map(lang=> {return (
                <MenuItem value={lang}>{lang.toUpperCase()}</MenuItem>
              )})}
            </Select>
          </FormControl>
          <FormHelperText
            id="errLang"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="autoMul"
            options={this.state.skills}
            getOptionLabel={option => option}
            defaultValue={autoValue}
            onChange={this.handleChangeAuto}
            renderInput={params => (
              <TextField
                {...params}
                variant="standard"
                id="classiValue"
                label="Classification"
                placeholder=""
                fullWidth
              />
            )}
          />
          <FormHelperText
            id="errClassi"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
         {this.addComponent().map(row => {return row })}
        <Button onClick={()=>this.increment()}>Add Age Groups</Button>
      </Grid>
    </React.Fragment>
  );
 }
}

Background.propTypes= {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Background);
