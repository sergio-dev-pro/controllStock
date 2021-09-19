import React, { useState, useEffect } from "react";
import { Container, Divider, Typography } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AddBox, Search } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { VisibilityOutlined } from "@material-ui/icons";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";

import { ErrorContext } from "../../Context/Error/context";

import api from "../../services/api";

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return (today = yyyy + "-" + mm + "-" + dd);
}

function todayDateSumeOne(value, operation) {
  var date = new Date(value);
  if (operation && operation === "sub") date.setDate(date.getDate() - 2);
  else date.setDate(date.getDate() + 2);

  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = date.getFullYear();

  return yyyy + "-" + mm + "-" + dd;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    width: "100%",
  },
}));

function SimpleTable({
  list,
  colunmList,
  hasDeletebutton,
  handleOnClickButtonDelete,
}) {
  const classes = useStyles();
  // const [checked, setChecked] = React.useState([0]);
  console.log("@@@ list", list);

  if (!list || !list.length) return null;
  console.log("@@@ SimpleTable");
  return (
    <TableContainer
      component={Paper}
      style={{ width: "100%", paddingLeft: "0px", margin: "10px 0px" }}
    >
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {colunmList.map((e, i) => (
              <TableCell
                align={
                  i === 0
                    ? "left"
                    : i === colunmList.length - 1
                    ? "right"
                    : "center"
                }
              >
                <Typography variant="subtitle1">{e.name}</Typography>
              </TableCell>
            ))}
            {hasDeletebutton && (
              <TableCell align="right">
                <Typography variant="subtitle1">Deletar</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item, i) => (
            <TableRow key={item.name}>
              {colunmList.map((elem, i) => (
                <TableCell
                  align={
                    i === 0
                      ? "left"
                      : i === colunmList.length - 1
                      ? "right"
                      : "center"
                  }
                  component="th"
                  scope="row"
                >
                  <Typography variant="subtitle1">{item[elem.key]}</Typography>
                </TableCell>
              ))}
              {hasDeletebutton && (
                <TableCell align="right" component="th" scope="row">
                  <IconButton
                    onClick={() => handleOnClickButtonDelete(i)}
                    edge="end"
                    aria-label="comments"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Grades({ isAdmin }) {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [noteProductsList, setNoteProductsList] = useState([]);
  const [showAddNoteProductForm, setShowAddNoteProductForm] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [productId, setProductId] = useState("");
  const [valueSpended, setvalueSpended] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState(todayDate());
  const [endDate, setEndDate] = useState(todayDateSumeOne(todayDate()));
  const [noteDescription, setNoteDescription] = useState("");
  const [content, setContent] = useState("list");
  const [noteId, setNoteId] = useState("list");
  const { handleChangeErrorState } = React.useContext(ErrorContext);
  const [note, setNote] = useState({
    products: [],
  });

  React.useEffect(() => {
    loadNotes();
  }, []);

  const loadProducts = () =>
    api
      .get("products")
      .then(({ data }) => {
        setProductsList(data);
        setProductId(data[0].id);
      })
      .catch((err) => console.log("@@@ err", err))
      .finally(() => setLoading(false));

  const handleChangeStartDate = (e) => {
    // console.log("@@@ todayDateSumeOne", todayDateSumeOne(e.target.value));console.log("@@@ endDate", endDate);
    setStartDate(e.target.value);

    if (endDate && Date.parse(e.target.value) >= Date.parse(endDate))
      return setEndDate(todayDateSumeOne(e.target.value));
  };

  const handleChangeEndDate = (e) => {
    // console.log("@@@ todayDateSumeOne", todayDateSumeOne(e.target.value));console.log("@@@ endDate", endDate);
    setEndDate(e.target.value);

    if (startDate && Date.parse(e.target.value) <= Date.parse(startDate))
      return setStartDate(todayDateSumeOne(e.target.value, "sub"));
  };

  const searchNote = (_) => {
    setLoading(true);
    loadNotes();
  };

  const handleCreateNote = () => {
    setLoading(true);
    api
      .post("/notes", {
        description: noteDescription,
        items: noteProductsList,
      })
      .then(() => {
        handleChangeContent("list");
        setNoteProductsList([]);
        setNoteDescription("");
      })
      .catch(() => {
        handleChangeContent("list");
      })
      .finally(() => setLoading(false));
  };

  const handleChangeContent = (value) => {
    if (value === "list") {
      setNote({
        descripton: "",
        products: [],
      });

      setLoading(true);
      loadNotes();
    }

    setContent(value);
  };

  const handleDeleteNote = (index) => {
    setLoading(true);
    api
      .delete(`/notes/${notesList.find((_, i) => i == index).id}`)
      .then(async (res) => {
        if (res.status && res.status === 400) {
          const { errors: message } = await res.json();
          return handleChangeErrorState({
            error: true,
            message,
            type: "error",
          });
        }
        handleChangeContent("list");
      })
      .catch(() => {
        handleChangeContent("list");
      })
      .finally(() => setLoading(false));
  };

  const loadNotes = () => {
    api
      .get(
        `notes?StartDate=${todayDate()}&EndDate=${todayDateSumeOne(
          todayDate()
        )}`
      )
      .then(({ data }) => {
        setNotesList(data);
      })
      .catch((err) => console.log("@@@ err", err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateNoteProduct = () => {
    setLoading(true);
    loadProducts();
    setQuantity("");
    setvalueSpended("");
    setShowAddNoteProductForm(true);
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <SimpleTable
            colunmList={[
              { name: "Descrição", key: "description" },
              { name: "Itens", key: "viewItems" },
              { name: "Total", key: "total" },
            ]}
            list={
              notesList.length
                ? notesList.map((note) => ({
                    ...note,
                    total: JSON.parse(note.items)
                      .map((item) => parseFloat(item.ValueSpended))
                      .reduce(
                        (previusValue, currentValue) =>
                          previusValue + currentValue
                      )
                      .toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      }),
                    viewItems: (
                      <IconButton
                        onClick={() => {
                          setNoteId(note.id);
                          setContent("view_items");
                        }}
                      >
                        {" "}
                        <VisibilityOutlined />{" "}
                      </IconButton>
                    ),
                  }))
                : []
            }
            hasDeletebutton={isAdmin}
            handleOnClickButtonDelete={handleDeleteNote}
          />
        );
        break;
      case "create":
        component = (
          <Container component="main" maxWidth="sm">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography component="h1" variant="h5" style={{ width: "100%" }}>
                Criar Nota
              </Typography>
              <form
                style={{ width: "100%", marginTop: "24px" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateNote();
                }}
                noValidate
              >
                <Grid container spacing={2}>
                  {!showAddNoteProductForm ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          value={noteDescription}
                          onChange={(e) => setNoteDescription(e.target.value)}
                          autoComplete="fname"
                          name="description"
                          variant="outlined"
                          required
                          fullWidth
                          id="description"
                          label="Descrição"
                          autoFocus
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Produtos:</h4>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          href="#contained-buttons"
                          size="medium"
                          startIcon={<AddBox />}
                          onClick={() => handleCreateNoteProduct()}
                          style={{
                            width: "fit-content",
                          }}
                        >
                          Add Mercadoria
                        </Button>
                      </Grid>
                      <SimpleTable
                        colunmList={[
                          { name: "Nome", key: "productName" },
                          { name: "Quantidade", key: "quantity" },
                          { name: "Total gasto", key: "valueSpended" },
                        ]}
                        list={noteProductsList}
                        hasDeletebutton
                        handleOnClickButtonDelete={(index) =>
                          setNoteProductsList((prevState) =>
                            prevState.filter((_, i) => i != index)
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">
                              Produto
                            </InputLabel>
                            <Select
                              value={productId}
                              name="productId"
                              label="Produto"
                              value={productId}
                              onChange={(e) => {
                                setProductId(e.target.value);
                              }}
                              name="product"
                              variant="outlined"
                              required
                              fullWidth
                              id="productId"
                              label="Produto"
                              autoFocus
                            >
                              {productsList.map((e) => (
                                <MenuItem key={e.id} value={e.id}>
                                  {e.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            autoComplete="fname"
                            name="quantity"
                            variant="outlined"
                            required
                            fullWidth
                            id="quantity"
                            label="Quantidade"
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="number"
                            value={valueSpended}
                            onChange={(e) => setvalueSpended(e.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                            id="valueSpended"
                            label="Valor gasto"
                            name="valueSpended"
                            autoComplete="lname"
                          />
                        </Grid>
                      </Grid>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="secondary"
                          style={{ marginTop: "16px" }}
                          onClick={() => setShowAddNoteProductForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => {
                            addNoteProduct();
                            setShowAddNoteProductForm(false);
                          }}
                          fullWidth
                          variant="contained"
                          color="primary"
                          style={{ marginTop: "16px" }}
                        >
                          Adicionar mercadoria
                        </Button>
                      </div>
                    </>
                  )}
                </Grid>
                <div
                  style={{
                    display: showAddNoteProductForm ? "none" : "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "16px" }}
                    onClick={() => handleChangeContent("list")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px" }}
                  >
                    Criar Nota
                  </Button>
                </div>
              </form>
            </div>
            <Box mt={5}></Box>
          </Container>
        );
        break;
      case "view_items":
        component = (
          <div
            style={{ display: "flex", width: "100%", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: "8px" }}
                startIcon={<KeyboardReturnIcon />}
                onClick={() => setContent("list")}
              >
                Voltar
              </Button>
            </div>
            <SimpleTable
              colunmList={[
                { name: "Nome", key: "ProductName" },
                { name: "Quantidade", key: "Quantity" },
                { name: "Valor gasto", key: "ValueSpended" },
              ]}
              list={JSON.parse(notesList.find((e) => e.id === noteId).items)}
            />
          </div>
        );
        break;
      case "delete":
        component = {};
        break;
      default:
        console.log("nada");
    }
    return component;
  };

  const addNoteProduct = () => {
    const productName = productsList.find((p) => p.id === productId).name;
    noteProductsList.push({ productId, valueSpended, quantity, productName });
    setNoteProductsList(noteProductsList);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        margin: "24px 0",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      {!loading ? (
        <>
          {content === "list" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {/* {!merchandiseList.length ? null : ( */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // marginBottom: '8px',
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    value={startDate}
                    onChange={handleChangeStartDate}
                    variant="outlined"
                    required
                    id="date"
                    label="Data Inicial"
                    type="date"
                    defaultValue="2017-05-24"
                    // className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: "8px", paddingBottom: "16px" }}
                  />
                  <TextField
                    value={endDate}
                    onChange={handleChangeEndDate}
                    variant="outlined"
                    required
                    id="date"
                    label="Data Final"
                    type="date"
                    defaultValue="2017-05-24"
                    // className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: "8px", paddingBottom: "16px" }}
                  />
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: "16px" }}
                    onClick={searchNote}
                    startIcon={<Search />}
                  >
                    Buscar
                  </Button>
                </div>
                {/* )} */}

                <Button
                  variant="contained"
                  color="primary"
                  href="#contained-buttons"
                  size="medium"
                  startIcon={<AddBox />}
                  onClick={() => handleChangeContent("create")}
                  style={{
                    width: "fit-content",
                  }}
                >
                  Add Nota
                </Button>
              </div>
              {/* {!merchandiseList.length && (
                    <Typography
                      variant="subtitle1"
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50px",
                        marginBottom: "8px",
                        color: "#ff844c",
                      }}
                    >
                      Adicione a primeira mercadoria
                    </Typography>
                  )} */}
            </>
          ) : null}
          {getContentComponent(content)}
        </>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
