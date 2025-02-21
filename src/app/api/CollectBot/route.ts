export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import {b} from "../../../baml_client"
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