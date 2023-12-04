import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Author } from "./Author";
import { Article } from "./Article";

@Table({
    timestamps: true,
    tableName: "article_author",
})
export class ArticleAuthor extends BaseModel {
    @ForeignKey(() => Author)
    @Column({type: DataType.INTEGER})
    author_id: number;

    @BelongsTo(() => Author)
    author: Author

    @ForeignKey(() => Article)
    @Column({type: DataType.INTEGER})
    article_id: number;

    @BelongsTo(() => Article)
    article: Article

}