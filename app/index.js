const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const Redis = require("ioredis");

const bodyParser = require("body-parser");
const redisClient = new Redis();

const connectToDB = require("./db.js");
const routes = require("./routes");

connectToDB();

const privateRouteCORS = {
  origin: (origin, callback) => {
    if (origin === "http://localhost:5173" || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(privateRouteCORS));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use("/api", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
