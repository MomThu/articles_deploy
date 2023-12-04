import { QueryTypes } from "sequelize";
import { Order } from "../connectDB";

export class OrderRepository extends Order {
  public static getOrdersByCusId = async (cusId: number) => {
    const orders = Order.findAll({ where: { customer_id: cusId } });
    return orders;
  };

  public static getArticlesByOrder = async (orderId: number) => {
    const articles = await this.sequelize.query(
      `SELECT * FROM orders_detail JOIN articles ON orders_detail.article_id = articles.id WHERE orders_detail.order_id = ${orderId}`,
      { type: QueryTypes.SELECT }
    );
    return articles;
  };
}
