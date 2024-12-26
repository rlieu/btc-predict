import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

interface MessageAttributes {
  id: CreationOptional<number>;
  openai_id: string;
  thread_id: number;
  role: string;
  assistant_id: number;
  content: string;
  run_id?: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export interface MessageModel extends Model<InferAttributes<MessageModel>, InferCreationAttributes<MessageModel>>, MessageAttributes {

}

export const initMessages = (sequelize: Sequelize, Types: typeof DataTypes) => {  
  const Message = sequelize.define<MessageModel, MessageAttributes>("Message", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    openai_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thread_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Thread,
      //   key: "id"
      // },
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assistant_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Assistant,
      //   key: "id"
      // },
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    run_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Run,
      //   key: "id"
      // },
      allowNull: true
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
    tableName: "messages",
    timestamps: true
  });

  return Message;
};
