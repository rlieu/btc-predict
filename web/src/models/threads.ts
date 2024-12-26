import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import { MessageModel } from "@/models/messages";

interface ThreadAttributes {
  id: CreationOptional<number>;
  thread_name: string;
  openai_id: string;
  user_id: number;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
  Messages?: MessageModel[];
}

export interface ThreadModel extends Model<InferAttributes<ThreadModel>, InferCreationAttributes<ThreadModel>>, ThreadAttributes {

}

export const initThreads = (sequelize: Sequelize, Types: typeof DataTypes) => {
  const Thread = sequelize.define<ThreadModel, ThreadAttributes>("Thread", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    thread_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openai_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: User,
      //   key: "id"
      // },
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
    tableName: "threads",
    timestamps: true
  });

  return Thread;
};
