export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import {b} from "../../../baml_client"
/**
 * Handles POST requests to query the model with the provided messages.
 * 
 * This function receives a request containing a JSON body with a list of messages,
 * queries the model using these messages, and returns the model's response as JSON.
 * 
 * Returns:
 * - A JSON response with a status of 200 and the model's response data if successful.
 * - A JSON response with a status of 500 and an error message if the query fails.
 * 
 * @param request - The incoming HTTP request object containing the message data.
 */

export async function POST(request:Request) {
    try {
        const data = await request.json();
        const response = await b.GetModelResponse(data.messages);
        return NextResponse.json({
            status: 200,
            data: response
        })
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Unable to query model",
            error: error
        })
    }
}