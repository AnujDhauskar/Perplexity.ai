import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res){
            const {username, email, password} = req.body;

            const isuserAlreadyExist = await userModel.findOne({ $or:[{email},{username}]})

            if(isuserAlreadyExist){
                return res.status(400).json(
                    {
                        message:"User with this email or username already exists",
                        success:false,
                        err:"user already exists"

                    }
                )
                
            }

            const user = await userModel.create({
                username,
                email,
                password

            })  

            const emailVarificationToken = jwt.sign({
                email:user.email,
            },process.env.JWT_SECRET, {expiresIn:"1d"})
        
            await sendEmail({
                to: email,
                subject: "Welcome to Perplexity.ai",
                html: `<p>Hi ${username},</p>
                <p>Thank you for registering at Perplexity.ai! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The Perplexity.ai Team</p>
                <p><a href="http://localhost:3000/verify-email?token=${emailVarificationToken}">Verify Email</a></p>
                <p>If you didn't register for an account, please ignore this email.</p>`
                
            })

            res.status(201).json({
                message:"User registered successfully",
                success:true,
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    
                }
            })


}


export async function verifyEmail(req, res){
    const {token} = req.query;
    if(!token){
        return res.status(400).json({
            message:"Token is required",
            success:false,
            err:"Token is required"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({email:decoded.email});

    if(!user){
        return res.status(400).json({
            message:"Invalid token",
            success:false,
            err:"User not found"
        })
    }

    user.varified = true;
    await user.save();

   const html = `
   <h1>Email verified successfully</h1>
   <p>Your email has been verified.</p>
    <p>You can now login to your account.</p>
    <a href="http://localhost:3000/login">Login</a>
   `

   res.send(html);

}
