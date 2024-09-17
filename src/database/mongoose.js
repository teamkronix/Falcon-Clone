const mongoose = require("mongoose");
const { log, success, error } = require("../helpers/Logger");
const { config } = require("@root/config");
mongoose.set("strictQuery", true);

module.exports = {
  async initializeMongoose() {
    log(`snoww. (falcon) >>> Connecting to MongoDb...`);

    try {
      await mongoose.connect("mongodb+srv://arjunn:premiumop123@cluster0.dpw1dmi.mongodb.net/?retryWrites=true&w=majority");

      success("snoww. (falcon) >>> Mongoose: Database connection established");

      return mongoose.connection;
    } catch (err) {
      error("snoww. (falcon) >>> Mongoose: Failed to connect to database", err);
      process.exit(1);
    }
  },

  schemas: {
    Giveaways: require("./schemas/Giveaways"),
    Guild: require("./schemas/Guild"),
    Member: require("./schemas/Member"),
    ReactionRoles: require("./schemas/ReactionRoles").model,
    ModLog: require("./schemas/ModLog").model,
    TranslateLog: require("./schemas/TranslateLog").model,
    User: require("./schemas/User"),
    Suggestions: require("./schemas/Suggestions").model,
  },
};
