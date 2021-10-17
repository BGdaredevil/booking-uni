module.exports = {
  development: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "27017",
    appPort: process.env.APP_PORT || "3030",
    table: process.env.DB_TABLE || "VideoTutorials",
    dBaseUrl: `mongodb://${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "27017"}/${
      process.env.DB_TABLE || "VideoTutorials"
    }`,
    saltRounds: 5,
    cookie_name: "videoTut",
    secret: "pesho believes that gosho is something else entirely",
    tokenExpDate: "1h",
  },
  production: {},
};
