const express = require("express");

const path = require('path');

var cors = require('cors');

const user = require ("./routes/user/user");

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
// app.use(express.static('files'))

app.use("/user", user);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
