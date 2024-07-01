import Layout from "@/components/Layout";
import classes from "../../../styles/Delete.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DeleteProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [productInfo, setProductInfo] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/products?id=" + id)
      .then((response) => setProductInfo(response.data));
  }, [id]);

  const goBack = () => {
    router.push("/products");
  };

  const deleteProduct = async () => {
    await axios.delete("/api/products?id=" + id);
    goBack();
  };

  return (
    <Layout>
      <h2 className={classes.delete__h2}>
        Czy na pewno chcesz usunąć "{productInfo?.title}"?
      </h2>
      <div className={classes.delete}>
        <button onClick={deleteProduct} className="btn-red">
          Tak
        </button>
        <button className="btn-default" onClick={goBack}>
          Nie
        </button>
      </div>
    </Layout>
  );
};

export default DeleteProductPage;
