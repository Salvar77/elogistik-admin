import mongooseConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";

const handle = async (req, res) => {
  await mongooseConnect();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Błąd podczas pobierania zamówień", error });
  }
};

export default handle;
