import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
// import { sendError } from '../global/sendError';
import { httpCode } from '../utils/httpCode';


const emailTemplates = {
    CONTACT_FORM: {
        title: 'Contact Form',
        html: (data) => `
            <div style="background:#fff3f8; padding:20px;">
                <h2 style="text-decoration:underline">Contact Form :</h2>
                <p><span style="font-size:16px; font-weight:semi-bold">First Name:</span> 
                    <span style="font-size:14px">${data?.firstName}</span></p>
                <p><span style="font-size:16px; font-weight:semi-bold">Last Name:</span> 
                    <span style="font-size:14px">${data?.lastName}</span></p>
                <p><span style="font-size:16px; font-weight:semi-bold">Email:</span> 
                    <span style="font-size:14px">${data?.email}</span></p>
                <p><span style="font-size:16px; font-weight:semi-bold">Phone Number:</span> 
                    <span style="font-size:14px">${data?.phoneNumber}</span></p>
                <p><span style="font-size:16px; font-weight:semi-bold">Message:</span> 
                    <span style="font-size:14px">${data?.message}</span></p>
            </div>
        `,
    },

  
};

export const EmailService = async (data, mode = '')=>{
    const template = emailTemplates[mode];

    if (!template) {
        return sendError(NextResponse, 'Invalid mode provided', null, httpCode.BAD_REQUEST);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587, // Use port 465 for secure SMTP, 587 for TLS/STARTTLS
        secure: false, // Set to true if using port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions= {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Message from ${data?.firstName }`,
        replyTo: data?.email,
        html: template.html(data)
    }

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('* ---> Email sending failed:', error);
        return sendError(NextResponse, 'Internal server error!', error, httpCode.INTERNAL_SERVER_ERROR);
        
    }

}