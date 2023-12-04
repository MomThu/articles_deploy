import { Column, DataType, Model, Table } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";

@Table({
    timestamps: true,
    tableName: "customers",
})
class Customer extends Model {
    @Column({type: DataType.STRING})
    email: string;

    @Column({type: DataType.STRING})
    password: string;

    @Column({type: DataType.STRING})
    full_name: string;

    @Column({type: DataType.STRING})
    phone: string;

    @Column({type: DataType.INTEGER})
    role: number;

    @Column({type: DataType.STRING})
    reset: string;
}

export default Customer