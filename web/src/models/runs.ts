import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

interface RunAttributes {
  id: CreationOptional<number>;
  openai_id: string;
  thread_id: number;
  assistant_id: number;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export interface RunModel extends Model<InferAttributes<RunModel>, InferCreationAttributes<RunModel>>, RunAttributes {

}

export const initRuns = (sequelize: Sequelize, Types: typeof DataTypes) => {
  const Run = sequelize.define<RunModel, RunAttributes>("Run", {
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
    assistant_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Assistant,
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
    tableName: "runs",
    timestamps: true
  });

  return Run;
};
