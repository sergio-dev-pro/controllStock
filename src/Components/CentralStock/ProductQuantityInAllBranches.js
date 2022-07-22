import React from "react";
import api from "../../services/api";
import { Divider } from "@material-ui/core";

export const ProductQuantityInAllBranches = (props) => {
  const { productId, startDate, endDate } = props;

  const [data, setData] = React.useState([]);
  const [totalEntryQuantities, setTotalEntryQuantities] = React.useState(0);

  React.useEffect(() => {
    const getQuantityOfAProductInAllBranches = async () => {
      let path = `/products/branchs?productId=${productId}`;
      if(startDate)
        path += `&StartDate=${startDate}`;

      if(endDate)
        path += `&EndDate=${endDate}`;

      const res = await api.get(path);
      setData(res.data);
      let entryQuantities = 0;
      res.data.forEach(element => entryQuantities += element.entryQuantity);
      setTotalEntryQuantities(entryQuantities);
    };

    productId && getQuantityOfAProductInAllBranches();
  }, [productId]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
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
        <li style={{padding: '3.5px 0', marginLeft: '8px'}}>
                      Total de Entradas: {totalEntryQuantities}
         </li>
            <Divider />

        {data.map((v) => (
          <>
            <li style={{padding: '3.5px 0', marginLeft: '8px'}} key={v.branchId}>
              Loja {v.branchName} | Disponível: {v.quantity}  | Entradas: {v.entryQuantity}
            </li>
            <Divider />
          </>
        ))}
      </ul>
    </div>
  );
};

export default ProductQuantityInAllBranches;
