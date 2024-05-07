const express = require('express');
const db = require("./services/database");

const app = express();

app.use(express.json());
app.use(require('./routes/users'));
app.use(require('./routes/children'));
app.use(require('./routes/knownConditions'));

app.get("/", (req, res) => {
  res.send("Welcome to Yugto!");
})



app.listen(3000, () => console.log("Server started on port 3000"));


