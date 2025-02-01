const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const userRoutes = require("./routes/user.route")
const productRoutes = require("./routes/products.route")
const partnerRoutes = require("./routes/partner.route")
const cookieParser = require("cookie-parser")
const app = express()
dotenv.config()


//middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())




app.use("/api/auth",userRoutes)
app.use("/api",productRoutes)
app.use("/api",partnerRoutes)

app.get("/",(req,res)=>{
    res.send("Test Route")
})



app.listen(process.env.PORT,() =>{
    console.log(`Server listening on PORT ${process.env.PORT}`)
})