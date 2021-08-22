import React, { useState, useEffect, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleTable from "../SimpleTable/SimpleTable";
import TextField from "@material-ui/core/TextField";

import UserContext from "../../Context/User/context";
import UsersForm from "../UsersForm/UsersForm";
import { Add, AddBox } from "@material-ui/icons";

function getPathApi(id) {
  return `/users`;
}

export default function Users() {
  const [usersList, setUsersList] = useState([]);

  const [user, setUser] = useState({
    name: "",
    branchs: [],
  });
  const { state } = useContext(UserContext);
  const [content, setContent] = useState("list");

  const pathApi = getPathApi(state.currentBranche.CompanyBranchId);

  useEffect(() => {
    api.get("/users").then(({ data }) => setUsersList(data));
    return () => {};
  }, []);

  const apiGet = () => {
    api.get(pathApi).then(({ data }) => {
      setUsersList(data);
    });
    handleChangeContent("list");
  };
  const handleChangeContent = (value) => {
    if (value === "list") {
      setUser({
        name: "",
        branchs: [],
      });
    }
    setContent(value);
  };

  const handleChangeUserSelected = (value) => {
    api.get(`users/${value}`).then(({ data }) => {
      setUser(data);
    });
  };

  const handleChangeContentEdit = (value) => {
    handleChangeUserSelected(value);
    handleChangeContent("edit");
  };
  const handleChangeContentDelete = (value) => {
    handleChangeUserSelected(value);
    handleChangeContent("delete");
  };

  const prodValidation = (value) => {
    const { name, categoryId, companyBranchId, minQuantity, quantity } = value;

    return true;
  };

  const apiCreate = (value) => {
    const dataIsValid = prodValidation(value);

    api
      .post(pathApi, {
        ...value,
        companyBranchId: value.categoryId,
        minQuantity: parseInt(value.minQuantity),
      })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"));
  };

  const apiEdit = (value) => {
    const dataIsValid = prodValidation(value);

    api
      .put(`users/${value.id}`, {
        name: value.name,
        branchs: value.branchs,
      })
      .then((res) => apiGet());
  };

  const apiDelete = () => {
    api.delete(`users/${user.id}`).then((res) => apiGet());
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <div style={{ marginBottom: "8px" }}>
            <SimpleTable
              list={usersList}
              handleChangeContentEdit={handleChangeContentEdit}
              handleChangeContentDelete={handleChangeContentDelete}
              colunmList={[
                { name: "Usuarios", key: "name" },
                { name: "AcessCode", key: "accessCode" },
              ]}
            />
          </div>
        );
        break;
      case "create":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <UsersForm
              user={null}
              handleOnClickActionSubmit={(value) => apiCreate(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Usuario"
              actionSubmitText="Criar"
            />
          </div>
        );
        break;
      case "edit":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <UsersForm
              user={user}
              handleOnClickActionSubmit={(value) => apiEdit(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Usuario"
              actionSubmitText="Editar"
            />
          </div>
        );
        break;
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar o usuario{" "}
              <b style={{ color: "#ff844c" }}>{user.name}</b> ?
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
          overflow: "hidden",
        }}
      >
        {!["create", "edit"].includes(content) && (
          <Typography
            variant="h5"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: content == "list" ? "flex-end" : "space-between",
              alignItems: "center",
              height: "50px",
            }}
          >
            {content !== "list" && "Usuarios"}
            {content === "list" ? (
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                size="medium"
                onClick={() => handleChangeContent("create")}
                startIcon={<AddBox />}
              >
                Criar
              </Button>
            ) : null}
          </Typography>
        )}
        {getContentComponent(content)}
      </div>
    </div>
  );
}
