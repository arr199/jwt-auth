import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import * as z from "zod" 
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"


dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 3200

app.use(express.json())
app.use(cors({ origin : ["http://localhost:5173"] , credentials : true}))

app.use(cookieParser())
app.post("/login",  (req , res) => {
    const { name , password } = req.body
 
    if (!name.length || !password.length  ) {
        return res.json({ error : "Empty credentials" })
    }
    
    const result = userSchema.safeParse({name , password})
    if (result.success){
        const {name , password } = result.data
     
        if (name === "ad" && password === "ad") {
           
           const token =  jwt.sign({ name , password} , process.env.JWT_SECRET! , { expiresIn : 10 } )
           console.log(token)
           res.cookie("jwt-token" , `${token}` , { httpOnly : true , expires : new Date(Date.now() + 100000) })
           return res.json(token)
           
        }
        else{
            return res.json({ errors : {  user : ["Invalid user or password"] } })
        }
    }else
    {
        res.json({errors : result.error.flatten().fieldErrors  } )
    }
  
})
app.get("/" , (req,res) => {
    res.send("Welcome to the express server")
})

app.get("/secret" , (req , res) => {

})


app.listen(PORT , () => {
    console.log(`Server running at http://localhost:${PORT}`)
})


const userSchema = z.object({
    name : z.string().transform(e => e.replace(/\s+/g, "")).pipe(z.string().min(1 , { message : "Empty Credentials" }).regex(/[a-z,A-Z]+$/g , { message : "only letters please" }) ), 
    password : z.string().transform(e => e.replace(/\s+/g, "")).pipe(z.string().min(1 , { message : "Empty Credentials" }).regex(/[a-z,A-Z]+$/g , { message : "only letters please" }) ), 
})