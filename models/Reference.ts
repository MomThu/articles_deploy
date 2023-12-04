import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Article } from "./Article";

@Table({
    timestamps: true,
    tableName: "references",
})
export class Reference extends BaseModel {
    @ForeignKey(() => Article)
    @Column({type: DataType.INTEGER})
    article_id: number;

    @BelongsTo(() => Article)
    article: Article

    @ForeignKey(() => Article)
    @Column({type: DataType.INTEGER})
    cite_id: number;

    @BelongsTo(() => Article)
    article2: Article
}