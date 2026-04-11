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
        
            await sendEmail({
                to: email,
                subject: "Welcome to Perplexity.ai",
                html: `<p>Hi ${username},</p><p>Thank you for registering at Perplexity.ai! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p><p>Best regards,<br>The Perplexity.ai Team</p>` 
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