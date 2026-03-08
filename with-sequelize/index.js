require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const { getConnectionString } = require("./lib/lakebase");

async function main() {
  const connectionString = await getConnectionString();
  const sequelize = new Sequelize(connectionString);

  class User extends Model {}
  User.init(
    {
      username: DataTypes.STRING,
      birthday: DataTypes.DATE,
    },
    { sequelize, modelName: "user" }
  );

  try {
    await sequelize.sync();
    const res = await User.create({
      username: "janedoe",
      birthday: new Date(1980, 6, 20),
    });
    console.log(res.toJSON());
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
  process.exit(0);
}

main();
