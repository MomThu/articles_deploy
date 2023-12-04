import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Article } from "./Article";

@Table({
    timestamps: true,
    tableName: "pdfs",
})
export class Pdf extends BaseModel {
    @ForeignKey(() => Article)
    @Column({type: DataType.INTEGER})
    article_id: number;

    @BelongsTo(() => Article)
    article: Article

    @Column({type: DataType.STRING})
    file_name: string;

    @Column({type: DataType.STRING})
    password: string;

}