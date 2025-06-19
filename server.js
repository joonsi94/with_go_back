const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tossRouter = require("./routes/toss");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/toss", tossRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})