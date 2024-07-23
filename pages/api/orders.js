import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/order";


export default async function handler(req, res) {
  await mongooseConnect();

  switch (req.method) {
    case 'GET':
      try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener órdenes' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método ${req.method} no permitido`);
      break;
  }
}
