import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import Customer from "./Customer";
import { Article } from "./Article";

@Table({
    timestamps: true,
    tableName: "carts",
})
export class Cart extends BaseModel {
    @ForeignKey(() => Customer)
    @Column({type: DataType.INTEGER})
    customer_id: string;

    @BelongsTo(() => Customer)
    customer: Customer

    @ForeignKey(() => Article)
    @Column({type: DataType.INTEGER})
    article_id: string;

    @BelongsTo(() => Article)
    article: Article

    @Column({type: DataType.DATE})
    date: Date;
}