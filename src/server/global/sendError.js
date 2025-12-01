import { NextResponse } from 'next/server'

export const sendError =  (res, message = '', error = null, statusCode = 500) => {
    return NextResponse.json(
        {
            success: false,
            statusCode: statusCode,
            message: message || error?.message || 'Unexpected error occured',
            error: error,
        },
        { status: statusCode }
    )
}