
const {json} = require("express");
const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes');


const { PORT = 3000 } = process.env;

const app = express();


mongoose.connect("mongodb://127.0.0.1:27017/mestodb");


app.use(json());
app.use((req, res, next) => {
  req.user = {
    _id: '657ec3ef46c8d88d9103fa5d' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(router);








app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
