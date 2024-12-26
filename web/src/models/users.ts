import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

interface UserAttributes {
  id: CreationOptional<number>;
  username: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>, UserAttributes {

}

export const initUsers = (sequelize: Sequelize, Types: typeof DataTypes) => {
  const User = sequelize.define<UserModel, UserAttributes>("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: "users",
    timestamps: true
  });

  return User;
};
