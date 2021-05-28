const express = require("express");
const { Readable } = require("stream");
const knex = require("knex");
const cors = require("cors");
const bcrypt = require("bcrypt");
const expressFileUpload = require("express-fileupload");
const csv = require("csv-parser");
const validator = require("email-validator");
const register = require("./controllers/register");
const login = require("./controllers/login");
const newClass = require("./controllers/newClass");
const { handleStudentFileUpload } = require("./controllers/studentFileUpload");

const PORT = process.env.PORT || 4000;
const SALT_ROUNDS = 10;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressFileUpload());
app.use(cors());

// Heroku connection
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });

// Localhost connection
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "admin",
    database: "postgres",
  },
});

app.post(
  "/register",
  register.handleRegister(db, bcrypt, SALT_ROUNDS, validator)
);

app.post("/login", login.handleLogin(db, bcrypt));

app.post("/createNewClass", newClass.create(db));

app.post("/upload/studentFile", handleStudentFileUpload(db, Readable, csv));

app.post("/upload/attendanceFile", (req, res) => {
  console.log(req.files.attendanceFile.data.toString());
  console.log(req.body);
  console.log(JSON.parse(req.body.user));
  return res.json({ message: "work in progress" });
});

// If users request route that doesn't exist
app.use((req, res, next) => {
  const error = {
    message: "Not Found",
  };

  return res.status(404).json(error);
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
