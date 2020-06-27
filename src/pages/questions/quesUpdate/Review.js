import React from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

export const options = [
  { name: "Option 1", desc: "", price: "", imgURL:"" },
  { name: "Option 2", desc: "", price: "", imgURL:"" },
  { name: "Option 3", desc: "", price: "", imgURL:"" },
  { name: "Option 4", desc: "", price: "", imgURL:"" },
];

export const answer = [{ name: "Correct answer", desc: "", price: "" },
                       { name: "Answer Text", desc: ""}];

export const quesString = [{ name:"Question", question: "" },
                          { name:"Answer Explanation", question: "" }];

export const quesInfo = [
  { name: "Caption", detail: "" },  //0
  { name: "Identifier", detail: ""},  //1
  { name: "Classification", detail: "" }, //2
  { name: "Domain", detail: "" },   //3
  { name: "Age Group", detail: "" },  //4
  { name: "Question Level", detail: "" }, //5
];

const styles = theme => ({
  listItem: {
    padding: theme.spacing(1, 0)
  },
  total: {
    fontWeight: "700"
  },
  title: {
    marginTop: theme.spacing(2)
  }
});

class Review extends React.PureComponent {

  componentDidMount() {
    if(quesString[0].question != null){
      let x = new DOMParser().parseFromString(quesString[0].question,"text/html");
      let y = x.documentElement.querySelectorAll("div")
      document.getElementById("boxToAppend").insertAdjacentHTML('beforeend', y[0].innerHTML);
    }
  }

  render(){
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Questions summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom>{quesInfo[0].detail}</Typography>
            <Box display="flex" flexDirection="row" p={1} m={1}  id="boxToAppend" >
          </Box>
          </Grid>
        </Grid>
        {answer[1].desc === "" ? (
        <List disablePadding>
          {options.map(product => (
            <ListItem className={classes.listItem} key={product.name}>
              <ListItemText primary={product.name} secondary={product.desc} />
              <img
                id="optionImageX"
                alt=""
                src={product.imgURL}
                height="95px"
                style={{ display: product.imgURL === "" ? "none" : "flex" }}
              />
            </ListItem>
          ))}
            <ListItem className={classes.listItem} >
              <ListItemText
                style={{ whiteSpace: "pre" }}
                primary="Correct Answer"
                secondary={
                  "Option:" +
                  answer[0].desc +
                  "\n" +
                  options[parseInt(answer[0].desc - 1)].desc
                }/>
              <img
                id="optionImage"
                src={options[parseInt(answer[0].desc - 1)].imgURL}
                height="95px"
                alt=""
                style={{
                  display:
                    options[parseInt(answer[0].desc - 1)].imgURL === ""
                      ? "none"
                      : "flex"
                }}
              />
            </ListItem>
        </List>
        ) :
        (<>
          <Grid item xs={6}>
            <Typography gutterBottom><b>Answer Text</b></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography gutterBottom>{answer[1].desc}</Typography>
          </Grid></>
        )}
        <Grid item container direction="column" xs={12}>
          <Typography gutterBottom className={classes.title}>
            <b>Background details</b>
          </Typography>
          <Grid container>
            {quesInfo.map(info => (
              <React.Fragment key={info.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{info.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{info.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
};

 export default withStyles(styles)(Review);
