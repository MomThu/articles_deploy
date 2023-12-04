import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import Customer from "./Customer";
import { Article } from "./Article";

@Table({
  timestamps: true,
  tableName: "orders",
})
export class Order extends BaseModel {
  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @ForeignKey(() => Article)
  @Column({ type: DataType.INTEGER })
  article_id: number;

  @BelongsTo(() => Article)
  article: Article;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column({ type: DataType.INTEGER })
  payment: number;
}
