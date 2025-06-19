require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tossRoutes = require("./routes/toss");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/toss", tossRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})