import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List, Tooltip } from "@material-ui/core";
import {
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SystemUpdateAlt as SystemUpdate,
  AccountBalance as AccountBalanceIcon,
  LaptopChromebook as LaptopChromebookIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  BlurOn
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  { id: 0, label: "Dashboard", link: "/app/dashboard",
    icon: <Tooltip title="Dashboard" arrow placement="right"><DashboardIcon /></Tooltip> },
  {
    id: 1,
    label: "Users",
    link: "/app/users",
    icon: <Tooltip title="Users" arrow placement="right"><PeopleIcon /></Tooltip>,
  },
  { id: 2, label: "Schools", link: "/app/schools",
      icon: <Tooltip title="School Details" arrow placement="right"><AccountBalanceIcon/></Tooltip>,
      children: [
        { label: "School Details", link: "/app/schools" },

        { label: "Map", link: "/app/ui/maps" },
      ]
  },
  {
    id: 3,
    label: "Questions",
    link: "/app/questions",
    icon: <Tooltip title="Questions" arrow placement="right"><ListAltIcon /></Tooltip>,
  },
  {
    id: 4,
    label: "Competitions",
    link: "/app/competition",
    icon: <Tooltip title="Competitions" arrow placement="right"><LaptopChromebookIcon /></Tooltip>,
  },
  {
    id: 5,
    label: "Miscellaneous",
    icon: <Tooltip title="Miscellaneous" arrow placement="right"><BlurOn/></Tooltip>,
    children: [
        {label:"Remove Participants",link:"/app/competitions/removeParticipants"},
        {label: "Lists",link:"/app/quesAttributes"}
    ]
  },
  { id: 6, label: "Analysis", link: "/app/analysisPage",
    icon: <Tooltip title="Analysis" arrow placement="right"><BarChartIcon /></Tooltip> },
  { id: 7, label: "Export", link: "/app/export",
    icon: <Tooltip title="Export" arrow placement="right"><SystemUpdate /></Tooltip> },
  { id: 8, type: "divider" },
    {
    id: 9,
    label: "Settings",
    link: "/app/settings",
    icon: <Tooltip title="Settings" arrow placement="right"><SettingsIcon /></Tooltip>,
  },
  { id: 10, label: "FAQ", link: "/app/faqs",
    icon: <Tooltip title="Help" arrow placement="right"><FAQIcon /></Tooltip> },

];


function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }} />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link} />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
