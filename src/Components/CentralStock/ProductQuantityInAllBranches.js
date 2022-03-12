import React from "react";
import api from "../../services/api";
import { Divider } from "@material-ui/core";

export const ProductQuantityInAllBranches = (props) => {
  const { productId } = props;

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const getQuantityOfAProductInAllBranches = async () => {
      const res = await api.get(`/products/branchs?productId=${productId}`);
      setData(res.data);
    };

    productId && getQuantityOfAProductInAllBranches();
  }, [productId]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <h4
        style={{
          marginBottom: "8px",
        }}
      >
        Estoque Central:
      </h4>
      <ul
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          listStyle: "none",
          padding: "8px 0",
          margin: "0",
        }}
      >
        {data.map((v) => (
          <>
            <li style={{padding: '3.5px 0'}} key={v.branchId}>
              Loja {v.branchName}: {v.quantity}
            </li>
            <Divider />
          </>
        ))}
      </ul>
    </div>
  );
};

export default ProductQuantityInAllBranches;
