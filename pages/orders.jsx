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
      <h1>Zamówienia</h1>
      <table className="basic">
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
                  className={order.paid ? classes.textGreen : classes.textRed}
                >
                  {order.paid ? "TAK" : "NIE"}
                </td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.postalCode} {order.country} <br />
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x{l.quantity}
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrdersPage;
