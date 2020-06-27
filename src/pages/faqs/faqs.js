import React from 'react'
import { Typography,Paper,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails }
	from '@material-ui/core'

import {ExpandMore} from "@material-ui/icons";

import PageTitle from "../../components/PageTitle/PageTitle";

export default class FAQ extends React.PureComponent {

	render(){

		const paperStyle={
			padding:"5px",
		}

		const headingStyle={
			fontSize:"18px",
		}

		const listSpacing={
			padding:"10px 0px"
		}

		return (
			<>
				<PageTitle title=" The 'How Tos' of the Portal" />
				<Paper style={paperStyle}>
				<ul>

				<li style={listSpacing}><span style={headingStyle}>General Instructions:</span>
					<ul>
						<li>You'll be logged out after 10 hours automatically. This is a security feature that'll be
						implemented everytime you log in. When this happens, please log in again to continue your work.</li>
						<li>Please do not refresh the portal without coming back to the main modules or Dashboard.</li>
			            <li>Loading of data may take time. Please wait for few seconds and then try again.</li>
			            <li>The positioning of the tables is not maintained. You'll have to navigate to the particular
			            record again from the start of the table. Sorry for the inconvenience.</li>
			            <li>If any errors occur, you'll be redirected automatically to the main page.</li>

					</ul>
				</li>

				<li style={listSpacing}><span style={headingStyle}>User Module Instructions:</span>
					<ul>
						<li>In Update User's page:
	          		<br/>
	          		&nbsp; &nbsp; While updating the date, please erase the date given before and then choose new date.
	          		</li>
					</ul>
				</li>

				<li style={listSpacing}><span style={headingStyle}>Questions Module Instructions:</span>
					<ul>
						<li>Please select images carefully during inserting of a question. Images <b>cannot</b> be added or deleted later
						during updating of a question or adding its translations.</li>
						<li>For inserting translations of a question, please go to the details of the question and add
						it via the 'Translations' tab.</li>
						<li>Please keep the image names shorter than 45 letters.</li>
						<li>Please download the template given in the Settings page for uploading questions in bulk.
						<ul>
						<li>P.S. Currently bulk upload of questions can be done only for questions containing no images.
						</li>
						</ul>
						</li>
					</ul>
				</li>

				<li style={listSpacing}><span style={headingStyle}>Competitions Module Instructions:</span>
					<ul>
						<li>Please do not press the back button. Go till the end of the option chosen or
						select another menu option and come back to Competitions page.</li>
	          			<li>After a competition gets started, you cannot edit the competitions.
	          			The options will be disabled.</li>
	          			<li>Please insert <b>-</b> sign while entering incorrect marks</li>
					</ul>
				</li>

				<li style={listSpacing}><span style={headingStyle}>Settings Instructions:</span>
					<ul>
						<li>Upload of a template:
						<br/>
						&nbsp; &nbsp; Please check existing template and keep the tokens i.e. [Name],[Year] etc as it is.
	          		</li>
					</ul>
				</li>

				</ul>
				</Paper>
			</>
		);
	}
}
