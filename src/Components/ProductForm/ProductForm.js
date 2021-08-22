import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import api from "../../services/api";

import UserContext from "../../Context/User/context";

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8), 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

export default function SignUp({
  product,
  handleOnClickActionSubmit,
  handleOnClickActionCancel,
  title,
  actionSubmitText,
}) {
  const classes = useStyles();
  const { state } = React.useContext(UserContext);
  const [categoryList, setCategoryList] = useState([]);
  const [data, setData] = useState({
    name: "",
    categoryId: 0,
    quantity: 0,
    minQuantity: 0,
  });

  useEffect(() => {
    if (product) {
      setData(product);
    }
  }, [product]);

  useEffect(() => {
    api
      .get('categories')
      .then((res) => {
        setCategoryList(res.data);
        // if (!data.categoryId)
        // handleChangeData({ target: { id: "categoryId", value: res.data[0].id } });
      });
    return () => {};
  }, [state.currentBranche]);

  const handleChangeData = (e) => {    
    console.log("@@@produto e.target", e.target);
    setData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  };
  const handleChangeCategoryId = (e) => {    
    console.log("@@@produto e.target", e.target);
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  console.log("@@@produto", data);

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" style={{width: '100%'}}>
          {title}
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) =>{ e.preventDefault(); handleOnClickActionSubmit(data)}}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={data.name}
                onChange={handleChangeData}
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={data.minQuantity}
                onChange={handleChangeData}
                variant="outlined"
                required
                fullWidth
                id="minQuantity"
                label="Quantidade mínima"
                name="minQuantity"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Categoria
                </InputLabel>
                <Select
                  value={data.categoryId}
                  onChange={handleChangeCategoryId}
                  name="categoryId"
                  label="Cetegoria"
                >
                  {categoryList.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={handleOnClickActionCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {actionSubmitText}
            </Button>
          </div>
        </form>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
