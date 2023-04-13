const express = require('express');

const app = express();

const productTypeRouter = require('./routes/productTypeRoutes')
const medicalProductRouter = require('./routes/medicalProductRoutes')
const userRouter = require('./routes/userRoutes')  

app.use(express.json())

app.use('/api/v1/productTypes',productTypeRouter)
app.use('/api/v1/products',medicalProductRouter)
app.use('/api/v1/users',userRouter)

module.exports = app;