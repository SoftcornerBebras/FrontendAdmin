import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard/Dashboard";
import UpdateUserC from "../../pages/users/UpdateUserC";
import Maps from "../../pages/maps/Maps";
import UsersC from "../../pages/users/UsersC";
import AddUser from "../../pages/users/AddUser";
import QuestionsC from "../../pages/questions/QuestionsC";
import Checkout from "../../pages/questions/quesInsert/Checkout";
import ViewQuestionDetails from "../../pages/questions/QuestionViewDetails";
import QuestionPreview from "../../pages/questions/QuestionPreview";
import UserProfile from "../../pages/users/UserProfile";
import Competition from "../../pages/competitions/Competitions";
import CreateChallenge from "../../pages/competitions/CreateChallenge";
import AddQuestions from "../../pages/competitions/AddQuestions";
import CompetitionPreview from '../../pages/competitions/CompetitionPreview'
import CompetitionMainPage from '../../pages/competitions/CompetitionMainPage'
import CompetitionPreviewInfo from '../../pages/competitions/CompetitionPreviewInfo'
import CreateCompetition from "../../pages/competitions/CreateCompetition";
import CreateCompMarks from "../../pages/competitions/CreateCompMarks";
import UpdateCompetition from "../../pages/competitions/UpdateCompetition";
import ChallengeResult from "../../pages/competitions/ChallengeResult";
import AnalysisPage from "../../pages/analysis/AnalysisPage";
import AddAgeGroups from "../../pages/competitions/AddAgeGroups";
import RemoveParticipants from "../../pages/competitions/RemoveParticipants";
import School from "../../pages/schools/School";
import SchoolDetail from "../../pages/schools/SchoolDetail";
import ContactInfo from "../../pages/schools/ContactInfo";
import RegisteredBy from "../../pages/schools/RegisteredBy";
import StudentsEnrolled from "../../pages/schools/StudentsEnrolled";
import Download from "../../pages/schools/Download";
import Checkouts from "../../pages/questions/quesTranslations/Checkouts";
import QuesUpdate from "../../pages/questions/quesUpdate/QuesUpdate";
import Directions from "../../pages/schools/Directions";
import Settings from "../../pages/Settings/Settings";
import UpdateAgeGroups from "../../pages/Settings/UpdateAgeGroups";
import Toppers from "../../pages/analysis/Toppers";
import ExportDocs from "../../pages/exports/ExportDocs";
import DownloadCertificate from "../../pages/exports/DownloadCertificate.js";
import FAQs from '../../pages/faqs/faqs'
import QuesAttr from '../../pages/quesAttributes'
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/users" component={UsersC} />
              <Route path="/app/user/add" component={AddUser} />
              <Route path="/app/user/update" component={UpdateUserC}/>
              <Route path="/app/questions" component={QuestionsC} />
              <Route path="/app/question/preview" component={QuestionPreview} />
              <Route path="/app/question/add" component={Checkout} />
              <Route path="/app/userProfile" component={UserProfile} />
              <Route path="/app/competition" component={Competition} />
              <Route path="/app/competitions/create/3/" component={CreateChallenge} />
              <Route path="/app/competitions/create/2/" component={CreateCompMarks} />
              <Route path="/app/competitions/create/1/" component={CreateCompetition} />
              <Route path="/app/competitions/info" component={CompetitionMainPage} />
              <Route path="/app/competitions/addQues" component={AddQuestions} />
               <Route path="/app/competitions/update/1/" component={UpdateCompetition} />
              <Route path="/app/competitions/update/2/" component={CreateCompMarks} />
              <Route path="/app/competitions/update/3/" component={CreateChallenge} />
              <Route path="/app/competitions/edit/1/" component={UpdateCompetition} />
              <Route path="/app/competitions/edit/2/" component={CreateCompMarks} />
              <Route path="/app/competitions/edit/3/" component={CreateChallenge} />
              <Route path="/app/competitions/preview" component={CompetitionPreviewInfo} />
              <Route path="/app/competitions/test" component={CompetitionPreview} />
              <Route path="/app/competitions/results" component={ChallengeResult} />
              <Route path="/app/competitions/removeParticipants" component={RemoveParticipants} />
              <Route path="/app/schools" component={School} />
              <Route path="/app/school/school-detail" component={SchoolDetail} />
              <Route path="/app/school/ContactInfo" component={ContactInfo} />
              <Route path="/app/school/RegisteredBy" component={RegisteredBy} />
              <Route path="/app/school/StudentDetails" component={StudentsEnrolled} />
              <Route path="/app/school/download" component={Download} />
              <Route path="/app/ui/maps" component={Maps} />
              <Route path="/app/question/details" component={ViewQuestionDetails} />
              <Route path="/app/competitions/addGroups" component={AddAgeGroups} />
              <Route path="/app/question/detail/add" component={Checkouts} />
              <Route path="/app/question/edit" component={QuesUpdate} />
              <Route path="/app/settings" component={Settings} />
              <Route path="/app/updateAgeGrps" component={UpdateAgeGroups} />
              <Route path="/app/toppers" component={Toppers}/>
              <Route path="/app/export" component={ExportDocs}/>
              <Route path="/app/certificate" component={DownloadCertificate}/>
              <Route path="/app/analysisPage" component={AnalysisPage}/>
               <Route path="/app/faqs" component={FAQs} />
              <Route path="/app/quesAttributes" component={QuesAttr} />
              <Route path="/app/school/directions" component={Directions} />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
