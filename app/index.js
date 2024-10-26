const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const Redis = require("ioredis");

const bodyParser = require("body-parser");
const redisClient = new Redis();

const connectToDB = require("./db.js");
const User = require("./models/user.models.js");
const AuthMiddleware = require("./middlewares/AuthMiddleware.js");

const userExists = require("./utils/userExists.js");

connectToDB();

const privateRouteCORS = {
  origin: (origin, callback) => {
    if (origin === "http://localhost:5173") {
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
      // non persistent cookie only expires in condition
      // where user exits their browser.
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hi from server");
});

app.get("/protected-resource", AuthMiddleware, (req, res) => {
  const { username } = req.session;

  try {
    if (!userExists(username)) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    res.status(200).json({ message: "Super protected resource only for you!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExistence = await userExists(username);
    if (!userExistence) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    const user = await User.findOne({ username });
    const passwordMatched = await user.comparePassword(password);
    if (!passwordMatched) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.username = username;
    res.status(200).json({ message: "Logged in", sessionID: req.sessionID });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/logout", AuthMiddleware, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.NewUser({ username, password });
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    const createdUser = new User(newUser);
    const result = await createdUser.save();
    if (!result) {
      throw new Error("Failed to create user");
    }
    res.status(200).json({ message: "Sign up successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
