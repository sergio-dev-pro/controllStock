import React from "react";
import api from "../../services/api";

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
        Quantidade em cada filial
      </h4>
      <ul
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          overflowX: "scroll",
          listStyle: "none",
          padding: "8px 0",
          margin: "none",
        }}
      >
        {data.map((v) => (
          <li
            style={{
              display: "flex",
              marginRight: "24px",
              alignItems: "center",
              border: "0.8px solid lightgrey",
              borderRadius: "8px",
            }}
            key={v.branchId}
          >
            <span style={{ width: "max-content", marginLeft: "8px" }}>
              {v.branchName}
            </span>{" "}
            <span
              style={{
                marginLeft: "16px",
                height: "100%",
                background: "lightgrey",
                padding: "8px 16px",
                borderRadius: "0px 4px 4px 0",
              }}
            >
              {v.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductQuantityInAllBranches;
