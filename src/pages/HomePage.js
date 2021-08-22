import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import CategoryIcon from "@material-ui/icons/Category";
import BusinessIcon from "@material-ui/icons/Business";
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import LinearProgress from '@material-ui/core/LinearProgress';

import useMediaQuery from "@material-ui/core/useMediaQuery";

import UserContext from "../Context/User/context";
import Branches from "../Components/Branche/Branche";
import Category from "../Components/Category/Category";
import Products from "../Components/Products/Products";
import Users from "../Components/Users/Users";

import "./HomePage.css";

import { getToken, parseJwt } from "../services/auth";
import { formatUserData } from "../services/format";
import { ArrowRightRounded } from "@material-ui/icons";
import { IconButton, Typography } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    // overflowX: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    margin: "0px",
  },
  fixedHeight: {
    height: 240,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "200px",
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

const useStylesHeader = makeStyles((theme) => ({
  root: {
    margin: "0px",
    height: "85px",
    padding: "0px",
    paddingTop: "10px",
  },
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  title: {
    // flexGrow: 1,
    color: "rgba(0, 0, 0, 0.67)",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0.00938em",
  },
}));

function AppBarBranche({
  branche,
  brancheList,
  setBranche,
  buttonMenu,
  buttonMenuAction,
}) {
  const classes = useStylesHeader();

  const handleChangeBranche = (e) => {
    setBranche(brancheList.find((b) => b.CompanyBranchId === e.target.value));
  };
  return (
    <AppBar
      className={classes.root}
      position="static"
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "none",
      }}
    >
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {/* <Typography variant="h5" className={classes.title}>
              <BusinessIcon
                style={{
                  marginLeft: "4px",
                  marginRight: "4px",
                  // color: "#ff844c",
                  height: "30px",
                  width: "40px",
                }}
              />
              {branche.CompanyBranchName}
            </Typography> */}
          <div>
            {/* <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{
                width: "200px",
                zIndex: "1000",
                position: "absolut",
              }}
            >
              <InputLabel>Selecione a filial</InputLabel>
              <Select
                value={branche.CompanyBranchId}
                onChange={handleChangeBranche}
                // style={{ color: "#ff844c" }}
                label="Selecione a filial"
                inputProps={{
                  name: "age",
                  id: "outlined-age-native-simple",
                }}
              >
                {brancheList.map((b, i) => (
                  <MenuItem key={i} value={b.CompanyBranchId}>
                    {b.CompanyBranchName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <Typography variant='h5' color='secondary' style={{color: 'rgba(0, 0, 0, 0.87)'}}>
            Brutos Controle de Estoque
            </Typography >
          </div>
        </Toolbar>

        {buttonMenu && (
          <IconButton size='medium' onClick={buttonMenuAction}>
            <MenuOpenIcon style={{width: '40px', height: '40px'}}></MenuOpenIcon>
          </IconButton>
        )}
      </Container>
    </AppBar>
  );
}

const MENU_LIST = ["branches", "products", "users", "categorys"];

export default function HomePage() {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:600px)");

  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openDrawerMobile, setOpenDrawerMobile] = React.useState(true);
  const [userConfig, setUserConfig] = React.useState(false);
  const {
    handleChangeState,
    handleChangeBranches: handleChangeBranchesContext,
  } = React.useContext(UserContext);
  const [menu, setMenu] = React.useState(MENU_LIST[0]);
  const [category, setCategory] = React.useState([]);

  React.useEffect(() => {
    handleChangeUserConfig(formatUserData(parseJwt(getToken())));
  }, []);

  const handleChangeDrawerOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChangeBranche = (value) => {
    setUserConfig((prevState) => ({ ...prevState, currentBranche: value }));
    handleChangeState({ ...userConfig, currentBranche: value });
  };

  const handleChangeBranches = (value) => {
    setUserConfig((prevState) => ({ ...prevState, branches: value }));
    handleChangeBranchesContext(value);
  };

  const handleChangeCategory = (value) => {
    console.log("@@@ category", value);
    setCategory(value);
    // handleChangeBranchesContext(value);
  };

  const handleChangeUserConfig = (value) => {
    setUserConfig(value);
    handleChangeState(value);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={() => setOpenDrawerMobile(false)}
      onKeyDown={() => setOpenDrawerMobile(false)}
    >
      <List>
        <MainListItems selected={menu} setSelected={setMenu} />
      </List>
    </div>
  );

  const getContentComponent = () => {
    if (menu === MENU_LIST[0]) {
      return <Branches handleBrancheList={handleChangeBranches} />;
    } else if (menu === MENU_LIST[3]) {
      return <Category handleCategory={handleChangeCategory} />;
    } else if (menu === MENU_LIST[1]) {
      return <Products />;
    } else if (menu === MENU_LIST[2]) {
      return <Users />;
    }
  };

  if (!userConfig.isAdmin) return <div>User is not admin</div>;

  return (
    <div className={classes.root}>
      {matches ? (
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !open && classes.drawerPaperClose,
              classes.paper
            ),
          }}
          open={matches}
        >
          <div className={classes.toolbarIcon}></div>
          <Divider />
          <List style={{ marginTop: "32px" }}>
            <MainListItems selected={menu} setSelected={setMenu} />
          </List>
        </Drawer>
      ) : null}

      {!matches && openDrawerMobile ? (
        <Drawer
          open={openDrawerMobile}
          onClose={() => setOpenDrawerMobile(false)}
        >
          {list("right")}
        </Drawer>
      ) : null}
      <div
        style={{
          display: "flex",
          aignItems: "space-beetwen",
          width: !matches ? "100%" : "calc(100% - 240px)",
          height: "100vh",
          boxSizing: "border-box",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <AppBarBranche
          branche={userConfig.currentBranche}
          brancheList={userConfig.branches}
          setBranche={handleChangeBranche}
          buttonMenu={!openDrawerMobile && !matches}
          buttonMenuAction={()=> setOpenDrawerMobile(true)}
        />
        {loading && <LinearProgress />}
        <main className={classes.content} style={{ overflow: "auto" }}>
          <Container
            maxWidth="lg"
            className={classes.container}
            style={{ padding: "8px", height: "calc(100% - 85px)" }}
          >
            {getContentComponent()}
          </Container>
        </main>
      </div>
    </div>
  );
}

export const MainListItems = ({ selected, setSelected }) => (
  <div>
    <ListItem
      button
      selected={selected === MENU_LIST[0]}
      onClick={() => setSelected(MENU_LIST[0])}
    >
      <ListItemIcon>
        <BusinessIcon />
      </ListItemIcon>
      <ListItemText primary="Filiais" />
    </ListItem>
    <ListItem
      button
      selected={selected === MENU_LIST[1]}
      onClick={() => setSelected(MENU_LIST[1])}
    >
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Produtos" />
    </ListItem>
    <ListItem
      button
      selected={selected === MENU_LIST[2]}
      onClick={() => setSelected(MENU_LIST[2])}
    >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Usuários" />
    </ListItem>
    <ListItem
      button
      selected={selected === MENU_LIST[3]}
      onClick={() => setSelected(MENU_LIST[3])}
    >
      <ListItemIcon>
        <CategoryIcon />
      </ListItemIcon>
      <ListItemText primary="Categorias" />
    </ListItem>
  </div>
);
