import { initUsers } from "@/models/users";
import { initAssistants } from "@/models/assistants";
import { initThreads } from "@/models/threads";
import { initMessages } from "@/models/messages";
import { initRuns } from "@/models/runs";
import { DataTypes, Sequelize } from "sequelize";
import pg from 'pg';

// const sequelize = new Sequelize(process.env.POSTGRES_DB as string, process.env.POSTGRES_USER as string, process.env.POSTGRES_PASSWORD, {
//   dialect: 'postgres',
//   dialectModule: pg,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT)
// });

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialectModule: pg,
});

// Initialize models
const User = initUsers(sequelize, DataTypes);
const Assistant = initAssistants(sequelize, DataTypes);
const Thread = initThreads(sequelize, DataTypes);
const Message = initMessages(sequelize, DataTypes);
const Run = initRuns(sequelize, DataTypes);

// Define associations
User.hasMany(Thread, { foreignKey: 'user_id' });
Thread.belongsTo(User, { foreignKey: 'user_id' });

Thread.hasMany(Message, { foreignKey: 'thread_id' });
Message.belongsTo(Thread, { foreignKey: 'thread_id' });

Thread.hasMany(Run, { foreignKey: 'thread_id' });
Run.belongsTo(Thread, { foreignKey: 'thread_id' });

// Sync all models with the database
sequelize.sync()
  .then(() => console.log('Models synced with the database'))
  .catch((error: any) => console.error('Failed to sync models:', error));

export {
  User,
  Assistant,
  Thread,
  Message,
  Run
};

// export const Models = () => {
//   const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
//     dialectModule: pg,
//   });

//   const User = initUsers(sequelize, DataTypes);
//   const Assistant = initAssistants(sequelize, DataTypes);
//   const Thread = initThreads(sequelize, DataTypes);
//   const Message = initMessages(sequelize, DataTypes);
//   const Run = initRuns(sequelize, DataTypes);

//   (async () => await sequelize.sync());

//   return {
//     User,
//     Assistant,
//     Thread,
//     Message,
//     Run
//   };
// };
