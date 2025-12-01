import { NextResponse } from 'next/server'

export const sendResponse = (res, message, data, statusCode) => {
    return NextResponse.json(
        {
            success: true,
            statusCode: statusCode,
            message: message,
            data: data ,
        },
        { status: statusCode }
    )
}