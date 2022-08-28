const express = require('express');
const chalk = require('chalk');
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')


const app = express();
app.use(cors())
const port = process.env.PORT || 8000

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
  console.log(chalk.green.bold.inverse(`server is running on port ${port}`))
})