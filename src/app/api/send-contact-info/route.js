import { sendError } from "@/server/global/sendError";
import { sendResponse } from "@/server/global/sendResponse";
import { EmailService } from "@/server/services/EmailService";
import { verifyCaptchaToken } from "@/server/utils/captcha";
import { httpCode } from "@/server/utils/httpCode";
import { NextResponse } from "next/server";


export async function POST(req){
    try {

        if(req.method !== 'POST'){
            return sendError(NextResponse, 'Method not allowed!' , null, httpCode.METHOD_NOT_ALLOWED)
        }

        const {firstName,lastName,email,phoneNumber,message,token} = await req.json()

        if(!token){
            return{
                success: false,
                message: "Token not found"
            }
        }

        await verifyCaptchaToken(token) //verify the captcha token

        if (!firstName || !lastName || !email || !phoneNumber || !message) {
            return sendError(NextResponse, 'Missing required fields.', null, httpCode.NOT_ACCEPTED)
        }

        const data = {
            firstName,
            lastName,
            email,
            phoneNumber,
            message
        }

        const emailResponse = await EmailService(data, 'CONTACT_FORM')

        console.log(emailResponse);

        if (emailResponse?.messageId) {
            return sendResponse(NextResponse, 'Email is sent successfully.', null, httpCode?.OK)
        } else {
            return sendError(
                NextResponse,
                'Email sending failed.',
                null,
                httpCode.INTERNAL_SERVER_ERROR
            )
        }
        
        
    } catch (error) {
        console.log('* ---> error:', error)
        return sendError(
            NextResponse,
            'Internal server error!',
            error,
            httpCode.INTERNAL_SERVER_ERROR
        )
    }
}