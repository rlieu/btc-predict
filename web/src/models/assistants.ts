import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

interface AssistantAttributes {
  id: CreationOptional<number>;
  openai_id: string;
  assistant_name: string;
}

export interface AssistantModel extends Model<InferAttributes<AssistantModel>, InferCreationAttributes<AssistantModel>>, AssistantAttributes {

}

export const initAssistants = (sequelize: Sequelize, Types: typeof DataTypes) => {
  const Assistant = sequelize.define<AssistantModel, AssistantAttributes>("Assistant", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    assistant_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openai_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "assistants",
    timestamps: false
  });

  return Assistant;
};
