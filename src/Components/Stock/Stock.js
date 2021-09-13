import {
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import SaveIcon from "@material-ui/icons/Save";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { ErrorContext } from "../../Context/Error/context";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return (today = yyyy + "-" + mm + "-" + dd);
}

export default function Stock({
  isAdmin,
  branchs: branchsPermissions,
  IsCentralStockAdmin,
}) {
  const [branchList, setBranchList] = useState([]);
  const [items, setItems] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("list");
  const [colunms, setColunms] = useState([]);

  const { handleChangeErrorState } = React.useContext(ErrorContext);

  useEffect(() => {
    // console.log("@@@ branchsPermissions", branchsPermissions);
    // console.log("@@@ isAdmin", isAdmin);

    if (isAdmin) {
      setLoading(true);
      api
        .get("/branchs")
        .then(({ data }) => {
          setBranchList(data);
          setBranchId(data[0].id);
          api
            .get(
              `products/stock-daily?day=${todayDate()}&branchId=${data[0].id}`
            )
            .then(({ data }) => setItems(data))
            .catch((err) => console.log("@@@", err))
            .finally(() => setLoading(false));
        })
        .finally(() => setLoading(false));
    } else {
      console.log("@@@ ***", branchsPermissions);
      setBranchList(
        branchsPermissions.map((e) => ({
          name: e.CompanyBranchName,
          id: e.CompanyBranchId,
        }))
      );
      setBranchId(branchsPermissions[0].CompanyBranchId);
      setLoading(true);
      api
        .get(
          `products/stock-daily?day=${todayDate()}&branchId=${
            branchsPermissions[0].CompanyBranchId
          }`
        )
        .then(({ data }) => setItems(data))
        .catch((err) => console.log("@@@", err))
        .finally(() => setLoading(false));
    }
    return () => {};
  }, []);

  useEffect(() => {
    const colunmsAdmin = [
      { name: "Produto", key: "productName" },
      { name: "Quantidade de Entrada", key: "entryQuantity" },
      { name: "Quantidade Final", key: "finalQuantity" },
      { name: "Quantidade Faltando", key: "missingQuantity" },
      { name: "Quantidade Anterior", key: "previousQuantity" },
      { name: "Quantidade Minima", key: "productMinQuantity" },
    ];
    // const existingPermissions = ['ShowProductsToDelivery', 'UpdateFinalQuantity', 'UpdateEntryQuantity']
    if (isAdmin) return setColunms(colunmsAdmin);
    else if (IsCentralStockAdmin) {
      const colunms = [
        { name: "Produto", key: "productName" },
        { name: "Quantidade de Entrada", key: "entryQuantity" },
        { name: "Quantidade Final", key: "finalQuantity" },
      ];
      setColunms(colunms);
    }
    else {
      const colunms = [
        { name: "Produto", key: "productName" },
        { name: "Quantidade Final", key: "finalQuantity" },
      ];
      const colunmsMin = [{ name: "Produto", key: "productName" }];

      if (branchsPermissions[0].Permissions && branchsPermissions[0].Permissions.includes("ShowProductsToDelivery"))
        setColunms(colunms);
      else setColunms(colunmsMin);
    }

    console.log("@@@ branchsPermissions", branchsPermissions);
  }, [isAdmin, branchsPermissions]);

  //   const handleChangeItems = (e) => {
  //     const itemsState  = items;
  //     itemsState[e.target.id].finalQuantity = e.target.value;
  //     console.log("@@@ onChange", itemsState)
  //     // itemsState.splice(i, 1, {...itemsState[i], finalQuantity: e.target.value})
  //     setItems(itemsState);
  //     setContent('end_stock');
  // };

  const getContent = (value) => {
    if (value === "end_stock") {
      setItems((prevState) =>
        prevState.map((e) => ({
          ...e,
          error: false,
          confirmEntryQuantity: false,
        }))
      );
    }

    setContent(value);
  };

  const handleChangeBranchId = (e) => {
    const { value } = e.target;

    if (!isAdmin && !IsCentralStockAdmin) {
      const colunms = [
        { name: "Produto", key: "productName" },
        { name: "Quantidade Final", key: "finalQuantity" },
      ];
      const colunmsMin = [{ name: "Produto", key: "productName" }];
      if (
        branchsPermissions
          .find((e) => e.CompanyBranchId == value)
          .Permissions
          &&
        branchsPermissions
          .find((e) => e.CompanyBranchId == value)
          .Permissions.includes("ShowProductsToDelivery")
      )
        setColunms(colunms);
      else setColunms(colunmsMin);
    }

    setLoading(true);
    api
      .get(`products/stock-daily?day=${todayDate()}&branchId=${value}`)
      .then(({ data }) => setItems(data))
      .catch((err) => console.log("@@@", err))
      .finally(() => setLoading(false));
    setBranchId(value);
  };

  const validData = (value) => {
    return true;
  };

  const handleSave = () => {
    const isValid = validData();
    if (!isValid) return;

    setLoading(true);
    let data = {
      entryQuantity: product.entryQuantity,
      finalQuantity: product.finalQuantity,
      previusQuantity: product.previusQuantity,
    };
    // if (isAdmin) {
    //   data = {
    //     ...data,
    //     finalQuantity: product.finalQuantity,
    //     previusQuantity: product.previusQuantity,
    //   };
    // }
    api
      .put(`products/stock-daily/${product.id}?branchId=${branchId}`, data)
      .then(({ data }) => {
        getContent("list");
      })
      .catch((err) => console.log(err))
      .finally((err) => setLoading(false));
  };

  const validDataFinalSock = () => {
    // const errorList = items.map((e) => e.error);

    console.log("@@@ validedatafinalstock items", items);
    const listOfValidatedItems = items.map((item) => {
      let error = false;
      if (!item.finalQuantity || parseInt(item.finalQuantity) <= 0)
        error = true;
      return { ...item, error };
    });

    setItems(listOfValidatedItems);

    const errorList = listOfValidatedItems.map((e) => e.error);
    if (errorList.includes(true)) {
      const firstItemOnTheListInError = listOfValidatedItems.find(
        (item) => item.error
      );
      let messageError = "";
      if (!firstItemOnTheListInError.finalQuantity.length)
        messageError =
          "ATENÇÂO: O campo de quantidade final nao pode estar vazio";
      else if (parseInt(firstItemOnTheListInError.finalQuantity) <= 0)
        messageError =
          "ATENÇÂO: A campo de quantidade final deve ser maior que zero(0)";

      handleChangeErrorState({
        error: true,
        message: messageError,
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSaveFinalStock = () => {
    const isValid = validDataFinalSock();

    if (!isValid) return;

    setLoading(true);
    api
      .put(`products/stock-daily/close-day?branchId=${branchId}`, {
        finalQuantities: items.map((e) => ({
          id: e.id,
          finalQuantity: parseInt(e.finalQuantity),
          confirmEntryQuantity: e.confirmEntryQuantity
            ? e.confirmEntryQuantity
            : false,
        })),
      })
      .then(({ data }) => {
        getContent("list");
      })
      .catch((err) => console.log(err))
      .finally((err) => setLoading(false));
  };

  const lineButtonDenseTable = () => {
    if (isAdmin || IsCentralStockAdmin) return true;

    if (
      branchsPermissions.length &&
      branchsPermissions
        .find((e) => e.CompanyBranchId == branchId)
        .Permissions.includes("UpdateFinalQuantity")
    )
      return false;
  };

  console.log(
    "@@@ branchsPermissions",
    branchsPermissions,
    "branchId",
    branchId
  );
  const getContentComponent = (value) => {
    console.log("@@@ isAdmin", isAdmin);
    let component;
    switch (value) {
      case "list":
        component = (
          <Container
            maxWidth="lg"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <header
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: "250px", marginRight: "8px" }}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Filial
                  </InputLabel>
                  <Select
                    value={branchId}
                    name="branchId"
                    label="Produto"
                    value={branchId}
                    onChange={handleChangeBranchId}
                    name="product"
                    variant="outlined"
                    required
                    fullWidth
                    id="branchId"
                    label="Produto"
                    autoFocus
                  >
                    {branchList.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* branchsPermissions
                    .find((e) => e.CompanyBranchId == branchId)
                    .Permissions.includes("UpdateFinalQuantity") */}
              {(isAdmin ||
                (!IsCentralStockAdmin &&
                  branchsPermissions.length &&
                  branchId &&
                  branchsPermissions
                    .find((e) => e.CompanyBranchId == branchId)
                    .Permissions.includes("UpdateFinalQuantity"))) && (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    onClick={() => getContent("end_stock")}
                  >
                    Finalizar estoque
                  </Button>
                </div>
              )}
            </header>

            {colunms.length && items.length ? (
              <DenseTable
                colunms={colunms}
                rows={items}
                setRowSelected={setRowSelected}
                lineButton={lineButtonDenseTable()}
              />
            ) : null}
          </Container>
        );
        break;
      case "edit":
        component = (
          <Container component="main" maxWidth="sm">
            <Typography
              variant="h6"
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {product.productName}
            </Typography>
            <Grid container spaces={2}>
              {isAdmin ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      style={{ marginBottom: "16px" }}
                      type="number"
                      value={product.entryQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          entryQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fname"
                      name="entryQuantity"
                      variant="outlined"
                      required
                      fullWidth
                      id="entryQuantity"
                      label="Quantidade de Entrada"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      style={{ marginBottom: "16px" }}
                      type="number"
                      value={product.finalQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          finalQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fname"
                      name="finalQuantity"
                      variant="outlined"
                      required
                      fullWidth
                      id="finalQuantity"
                      label="Quantidade Final"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      value={product.previusQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          previusQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fname"
                      name="entryQuantity"
                      variant="outlined"
                      required
                      fullWidth
                      id="entryQuantity"
                      label="Quantidade Anterior"
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    style={{ marginBottom: "16px" }}
                    type="number"
                    value={product.entryQuantity}
                    onChange={(e) =>
                      setProduct((prevState) => ({
                        ...prevState,
                        entryQuantity: e.target.value,
                      }))
                    }
                    autoComplete="fname"
                    name="entryQuantity"
                    variant="outlined"
                    required
                    fullWidth
                    id="entryQuantity"
                    label="Quantidade de Entrada"
                    autoFocus
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  // className={classes.submit}
                  style={{ marginRight: "8px" }}
                  onClick={() => getContent("list")}
                >
                  Voltar
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "8px" }}
                  // className={classes.submit}
                  onClick={() => handleSave()}
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Container>
        );
        break;
      case "end_stock":
        component =
          items && items.length ? (
            <Container maxWidth="md" style={{ overflowY: "auto" }}>
              <Typography style={{ width: "100%" }} variant="h6">
                Finalizar Estoque
              </Typography>
              <Divider style={{ margin: "16px 0" }} />
              <div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "static",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: "8px" }}
                    startIcon={<KeyboardReturnIcon />}
                    onClick={() => getContent("list")}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "8px" }}
                    startIcon={<SaveIcon />}
                    onClick={handleSaveFinalStock}
                  >
                    Salvar
                  </Button>
                </div>
                <div
                  style={{ height: "calc(100% - 112px)", overflowY: "auto" }}
                >
                  {items.map((elem, i) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                        width: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginBottom: "16px" }}
                      >
                        {elem.productName}
                      </Typography>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        <TextField
                          type="number"
                          id={i}
                          error={elem.error}
                          style={{ maxWidth: "200px" }}
                          type="number"
                          value={elem.finalQuantity}
                          onChange={(e) =>
                            setItems((prevState) => {
                              let itemsState = [...prevState];

                              let error = true;
                              if (
                                e.target.value.length &&
                                parseInt(e.target.value) > 0
                              )
                                error = !error;

                              itemsState[e.target.id].error = error;
                              itemsState[e.target.id].finalQuantity =
                                e.target.value;

                              setItems(itemsState);
                            })
                          }
                          autoComplete="fname"
                          name="finalQuantity"
                          variant="standard"
                          required
                          fullWidth
                          // id="finalQuantity"
                          label="Quantidade de final"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={(e) =>
                                setItems((prevState) => {
                                  let itemsState = [...prevState];

                                  itemsState[e.target.id].confirmEntryQuantity =
                                    !prevState[e.target.id]
                                      .confirmEntryQuantity;
                                  setItems(itemsState);
                                })
                              }
                              checked={elem.confirmEntryQuantity}
                              // onChange={handleChange}
                              name="confirmEntryQuantity"
                              id={i}
                              color="primary"
                            />
                          }
                          label={`Confirmar quantidade entrada de ${elem.entryQuantity}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          ) : null;
        break;
      default:
        break;
    }

    return component;
  };

  const setRowSelected = (id) => {
    console.log("@@@ id", id);
    const format = (value) => (value == 0 ? "" : value);
    if(isAdmin){
      setLoading(true);
      api
        .get(`products/stock-daily/${id}?branchId=${branchId}`)
        .then(({ data }) =>
          setProduct({
            ...data,
            previusQuantity: format(data.previusQuantity),
            finalQuantity: format(data.finalQuantity),
            entryQuantity: format(data.entryQuantity),
          })
        )
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));

    }
    else {
      setProduct(items.find(e => e.id == id))
    }

    getContent("edit");
  };

  console.log("@@@ items", items);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "48px",
      }}
    >
      {!loading ? (
        // content == "end_stock" ? (
        //   <EndStock items={items} changeContent={() => getContent("list")} setItems={setItems} />
        // ) : (
        getContentComponent(content)
      ) : (
        // )
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

function DenseTable({ colunms, rows, setRowSelected, lineButton }) {
  const classes = useStyles();
  console.log("@@@ columns items", colunms, rows);
  return (
    <Container masWidth="lg" style={{ padding: "0", marginTop: "24px" }}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {colunms.map((e, i) => (
              <TableCell
                key={e.key}
                align={
                  i === 0
                    ? "left"
                    : i === colunms.length - 1
                    ? "right"
                    : "center"
                }
              >
                {e.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              button={lineButton}
              hover
              onClick={lineButton ? (e) => setRowSelected(row.id) : null}
              key={row.id}
            >
              {colunms.map((e, i) => (
                <TableCell
                  key={row[e.key]}
                  component="th"
                  scope="row"
                  align={
                    i === 0
                      ? "left"
                      : i === colunms.length - 1
                      ? "right"
                      : "center"
                  }
                >
                  {row[e.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
