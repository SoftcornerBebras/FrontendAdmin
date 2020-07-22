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
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import {domains,skills,quesLevels,ageGroups,errorArr,ageGroupsID,selectedAgeID} from './QuesUpdate.js'

export function setDataB() {
  quesInfo[0].detail = document.getElementById('caption').value;
  quesInfo[1].detail = document.getElementById('identifier').value;
  quesInfo[4].detail = ageGroupValue;
  quesInfo[5].detail = quesLevelValue;

  if(quesInfo[4].detail !=null && quesInfo[5].detail != null){ ageGroupQuesLevels();}

  autoValue = []
  ageGroupValueX = []
  quesLevelValueX = []

  console.log(toInsertAgeGroups,deletedAgeGroupQues)

}

function ageGroupQuesLevels() {
  toInsertAgeGroups.length = 0
  toInsertAgeGroups = []

    let aG = quesInfo[4].detail.split(",")
    let qL = quesInfo[5].detail.split(",")

    console.log(aG,qL)

    for(let i=0;i<aG.length;i++){
      if(ageGroupIDValueX[i] !="" && ageGroupValueX[i]!="" && quesLevelValueX[i]!=""){
        toInsertAgeGroups.push({"ageID":ageGroupIDValueX[i],"ageGroup":aG[i],"quesLevel":qL[i]})
      }
    }
}

export let deletedAgeGroupQues=[], toInsertAgeGroups=[];

let ageQues = [];
let ageGroupIDValue="",ageGroupValue = quesInfo[4].detail;
let quesLevelValue = quesInfo[5].detail;
let ageGroupValueX = [];
let ageGroupIDValueX = [];
let quesLevelValueX = [];
let autoValue = [];
let count = 0;

const styles = theme => ({
  formControl: {
    minWidth: 120
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
});

export function requiredBackground() {
  var anythingEmpty = false;
  if (document.getElementById('caption').value == "") {
    document.getElementById('errCap').style.display = "block";
    anythingEmpty = true;
  }
  if (document.getElementById('identifier').value == "") {
    document.getElementById('errCap').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[3].detail == "") {
    document.getElementById('errDomain').style.display = "block";
    anythingEmpty = true;
  }
  if (quesInfo[2].detail == null) {
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
      AgeGroupValue:ageGroupValue,
      QuesLevelValue:quesLevelValue,
      open:false,
      openC:false,
      openD:false,
      countAQ:parseInt(localStorage.getItem("countAQ")),
      domains:domains,
      skills:skills,
      quesLevels:quesLevels,
      ageGroups:ageGroups,
      rerender: false,
    }
  }

  componentDidMount() {

    if(quesInfo[4].detail != null && quesInfo[5].detail != null) {
        ageGroupValue = quesInfo[4].detail;
        quesLevelValue = quesInfo[5].detail;
        ageGroupValueX = ageGroupValue.split(",");
        quesLevelValueX = quesLevelValue.split(",")
        if(ageGroupIDValue != "") {
        ageGroupIDValue = ageGroupIDValue.toString()
        if(ageGroupIDValue.includes(',')){
       ageGroupIDValueX = ageGroupIDValue.split(",")
       }else {ageGroupIDValueX[0] = ageGroupIDValue}
      } else if(selectedAgeID !=null){
      let ageID = selectedAgeID.toString()
      if(ageID.includes(',')){
       ageGroupIDValueX = ageID.split(",")
       }else ageGroupIDValueX[0]=ageID
      }
      else {
      ageGroupIDValueX = []
      }
      this.setState({countAQ:ageGroupValueX.length});
      this.addComponent();
      count = ageGroupValueX.length;

    }

    this.setState({rerender:true})
  }

    handleClose = () => {
        this.setState({open: false});
    }

  handleOpen = () => {
    this.setState({open: true});
  }

   handleChangeDomain = event => {
    this.setState({DomainValue:event.target.value});
    quesInfo[3].detail = event.target.value;
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

   handleChangeIdentifier = valueId => {
    if (valueId == "") {
      document.getElementById('errId').style.display = "block";
    } else {
      document.getElementById('errId').style.display = "none";
    }
  };

  handleChangeAuto = (event, value) => {
    autoValue = value;
    let str = value[0];
    for (let i = 1; i < value.length; i++) {
      str = str + "," + value[i];
    }
    quesInfo[2].detail = str;
    if (quesInfo[2].detail == "") {
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
    else {ageGroupValueX[id]=""; ageGroupIDValueX[id]="";}

    ageGroupValue=ageGroupValueX[0];
    ageGroupIDValue=ageGroupIDValueX[0];
    for (let i = 1; i < ageGroupValueX.length; i++) {
      ageGroupValue += "," + ageGroupValueX[i];
      ageGroupIDValue +=","+ageGroupIDValueX[i];
    }

    quesInfo[4].detail = ageGroupValue

  }
    handleChangeQuesLevel = (event, value) => {

    let string = (event.currentTarget.id), id=0;
    if( string.substring(0,1) == "m") { id = 0; }
    else {
      id=parseInt(string.substring(0,1));
    }

    if(value!=null)
      {quesLevelValueX[id]=(value);}
    else {quesLevelValueX[id]="";}

    quesLevelValue=quesLevelValueX[0];
    for (let i = 1; i < quesLevelValueX.length; i++) {
      quesLevelValue += "," + quesLevelValueX[i];
    }

    quesInfo[5].detail = quesLevelValue

  }

  increment = () => {
    let i = parseInt(localStorage.getItem("countAQ"));
    i+=1;
    localStorage.setItem("countAQ",i);
    this.setState({countAQ:this.state.countAQ+1});
    count = count + 1;
    if(ageGroupValueX.length == 0) {
      ageGroupValueX[0] = ""
    }
  };

  decrement = () => {
    localStorage.setItem("countAQ",parseInt(localStorage.getItem("countAQ")) - 1);
    this.setState({countAQ:this.state.countAQ-1})
    count = count -1
  };

  deleteRow = (id) => {

    if(ageGroupIDValueX[id] !="" && ageGroupValueX[id]!="" && quesLevelValueX[id]!=""){
      deletedAgeGroupQues.push({"ageID":ageGroupIDValueX[id],"ageGroup":ageGroupValueX[id],
        "quesLevel":quesLevelValueX[id]})
    }

    ageGroupValueX[id] = "";
    ageGroupIDValueX[id] = "";
    quesLevelValueX[id] = "";

    let ageGrp= [] , quesLvl = [], ageIDs=[];
    for(let i = 0 ; i < ageGroupValueX.length ; i ++ )
    {
      if(ageGroupValueX[i]!= "")
      {
        ageGrp.push(ageGroupValueX[i])
        ageIDs.push(ageGroupIDValueX[i])
        quesLvl.push(quesLevelValueX[i])
      }
    }

    ageGroupValueX.length = 0;
    ageGroupIDValueX.length = 0;
    quesLevelValueX.length = 0;
    for(let i = 0 ; i <ageGrp.length ; i++){
      ageGroupValueX[i] = ageGrp[i];
      ageGroupIDValueX[i] = ageIDs[i];
      quesLevelValueX[i] = quesLvl[i];
    }

    ageGroupIDValue=ageGroupIDValueX[0];
    for (let i = 1; i < ageGroupIDValueX.length; i++) {
      ageGroupIDValue += "," + ageGroupIDValueX[i];
    }

    ageGroupValue=ageGroupValueX[0];
    for (let i = 1; i < ageGroupValueX.length; i++) {
      ageGroupValue += "," + ageGroupValueX[i];
    }

    quesLevelValue=quesLevelValueX[0];
    for (let i = 1; i < quesLevelValueX.length; i++) {
      quesLevelValue += "," + quesLevelValueX[i];
    }
    this.decrement();
    this.setState({rerender: !this.state.rerender})

  };

  addComponent = () => {
    ageQues.length=0;
    for(let i=0;i<count;i++) {
      ageQues.push(<>
        <Grid item xs={10} sm={5}>
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
        <Grid item xs={10} sm={5}>
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
        { i==(count-1) ?
          <IconButton onClick={()=>this.deleteRow(i)}>
          <ClearIcon/>
          </IconButton>:null
        }
      </>);
    }
    return ageQues;
  }

render(){
  const { classes } = this.props;

  if(quesInfo[2].detail != undefined) {
    if(quesInfo[2].detail.includes(",") ) {
      autoValue =  quesInfo[2].detail.split(",");
    }
    else if (quesInfo[2].detail.length >0  ){
      autoValue[0] =  quesInfo[2].detail;
    }
  }

  return (
    <div style={{paddingLeft:"2%"}}>
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
            defaultValue={quesInfo[0].detail} />
          <FormHelperText
            id="errCap"
            style={{ color: "red", marginLeft: "13px", display: "none" }}
          >
            Required*
          </FormHelperText>
        </Grid>
        <Grid item xs={7}>
          <Tooltip classes={{ tooltip: classes.noMaxWidth }} title="Please include year in yyyy format at the start and language code at the end" arrow>
          <TextField
            id="identifier"
            name="identifier"
            label="Identifier"
            fullWidth
            autoComplete="cap"
            onChange={(e) => this.handleChangeIdentifier(e.target.value)}
            defaultValue={quesInfo[1].detail} />
            </Tooltip>
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
              value={quesInfo[3].detail}
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

        <Grid item xs={11}>
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
          {ageGroupValueX.length!=0?this.addComponent().map(row => {return row}):null}
          <Button onClick={()=>this.increment()}>{count!=0 ? <> Add </>
          : <>See</>} Age Groups</Button>
      </Grid>
    </div>
  );
 }
}

Background.propTypes= {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Background);
