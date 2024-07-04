import Layout from "@/components/Layout";
import axios from "axios";
import classes from "../styles/Orders.module.scss";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleString("pl-PL", options);
  };

  return (
    <Layout>
      <div className={classes.ordersPage}>
        <h1>Zamówienia</h1>
        <div className={classes.tableContainer}>
          <table className={classes.basic}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Zapłacone</th>
                <th>Odbiorca</th>
                <th>Produkty</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{formatDate(order.createdAt)}</td>
                    <td
                      className={
                        order.paid ? classes.textGreen : classes.textRed
                      }
                    >
                      {order.paid ? "TAK" : "NIE"}
                    </td>
                    <td>
                      <div className={classes.overflowText}>
                        {order.name} {order.email} <br />
                        {order.city} {order.postalCode} {order.country} <br />
                        {order.streetAddress}
                      </div>
                    </td>
                    <td>
                      <div className={classes.overflowText}>
                        {order.line_items.map((l, index) => (
                          <div key={index}>
                            {l.price_data?.product_data.name} x{l.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
