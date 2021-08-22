import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleList from "../SimpleList/SimpleList";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";

export default function Branches({ handleBrancheList }) {
  const [brancheList, setBrancheList] = useState([]);
  const [branche, setBranche] = useState({ name: "" });
  const [name, setName] = useState("");
  const [content, setContent] = useState("list");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/branchs")
      .then(({ data }) => setBrancheList(data))
      .finally(() => setLoading(false));
    return () => {};
  }, []);

  const apiGet = () => {
    setLoading(true);
    api
      .get("/branchs")
      .then(({ data }) => {
        setBrancheList(data);
        handleBrancheList(
          data.map((e) => ({
            CompanyBranchId: e.id,
            CompanyBranchName: e.name,
          }))
        );
      })
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
    handleChangeContent("list");
  };
  const handleChangeContent = (value) => {
    if (value === "list") {
      setBranche({ name: "" });
    }
    setContent(value);
  };

  const handleChangeBrancheSelected = (value) => {
    setBranche(brancheList.find((e) => e.id === value));
  };

  const handleChangeContentEdit = (value) => {
    handleChangeBrancheSelected(value);
    handleChangeContent("edit");
  };
  const handleChangeContentDelete = (value) => {
    handleChangeBrancheSelected(value);
    handleChangeContent("delete");
  };
  const apiCreate = () => {
    const { name } = branche;
    if (!name || !name.length) return null;
    setLoading(true);
    api
      .post("/branchs", { name })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false)  );
  };

  const apiEdit = () => {
    const { name } = branche;
    if (!name || !name.length) return null;
    setLoading(true);
    api
      .put(`/branchs/${branche.id}`, { name: branche.name })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiDelete = () => {
    const { name } = branche;
    if (!name || !name.length) return null;
    setLoading(true);
    api
      .delete(`/branchs/${branche.id}`)
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <div style={{ marginBottom: "8px" }}>
            <SimpleList
              list={brancheList}
              handleChangeContentEdit={handleChangeContentEdit}
              handleChangeContentDelete={handleChangeContentDelete}
            />
          </div>
        );
        break;
      case "create":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <TextField
              value={branche.name}
              onChange={(e) =>
                setBranche((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
              id="standard-full-width"
              label="Nome"
              // style={{ margin: 8 }}
              placeholder="Nome"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                href="#contained-buttons"
                size="medium"
                onClick={() => handleChangeContent("list")}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                size="medium"
                onClick={() => apiCreate()}
              >
                Criar
              </Button>
            </div>
          </div>
        );
        break;
      case "edit":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <TextField
              value={branche.name}
              onChange={(e) =>
                setBranche((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
              id="standard-full-width"
              label="Nome"
              // style={{ margin: 8 }}
              placeholder="Nome"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                href="#contained-buttons"
                size="medium"
                onClick={() => handleChangeContent("list")}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                size="medium"
                onClick={() => apiEdit()}
              >
                Editar
              </Button>
            </div>
          </div>
        );
        break;
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar a filial{" "}
              <b style={{ color: "#ff844c" }}>{branche.name}</b> ?
            </Typography>

            <div>
              <Button
                variant="contained"
                color="secondary"
                href="#contained-buttons"
                size="medium"
                onClick={() => handleChangeContent("list")}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                size="medium"
                onClick={() => apiDelete()}
              >
                Confirmar
              </Button>
            </div>
          </div>
        );
        break;
      default:
        console.log("nada");
    }
    return component;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          margin: "24px",
        }}
      >
        {!loading ? (
          <>
            <Typography
              variant="h5"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                height: "50px",
              }}
            >
              Filiais
              {content === "list" ? (
                <Button
                  variant="contained"
                  color="primary"
                  href="#contained-buttons"
                  size="medium"
                  onClick={() => handleChangeContent("create")}
                >
                  Criar
                </Button>
              ) : null}
            </Typography>
            {getContentComponent(content)}{" "}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}
