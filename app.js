import express from "express"
import { sendMail } from "./controllers/sendMail.js";
import cors from "cors"
import { configDotenv } from "dotenv";
import { sendMailForConfirmation } from "./controllers/PaperSubmissionMail.js";
import { sendCopyrightFormEmail } from "./controllers/sendCopyrightFormMail.js";
import multer from "multer";
import { sendCopyrightFormEmailFromAdminPanel } from "./controllers/sendCopyrightFormEmailFromAdminPanel.js";


const app=express();
let port = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors())
app.get("/",(req,res)=>{
    res.send("I am server");
})

app.post("/sendemail",sendMail)  
app.post("/paperSubmission",sendMailForConfirmation)


app.post("/sendCopyrightFormEmail",upload.single('pdfFile'),sendCopyrightFormEmail)

app.post("/sendCopyrightFormEmailFromAdminPanel",sendCopyrightFormEmailFromAdminPanel)


const start=async()=>{
    try {
        app.listen(port,()=>{
            console.log(`server is started in port ${port}`);
        })
    } catch (error) {
        console.log("error in running"+error);
    }
}
start();