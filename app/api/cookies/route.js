import dbConnect from "@/libs/db";
import User from "@/models/users";
import { NextResponse } from "next/server";

/**
 * API route for user-cookie checking.
 * @api
 * @param {Object} req - HTTP request object.
 * @returns {String} - the message indicating whether the user is found.
 * @throws {Error} - the error thrown while trying to get the user.
 */
export async function POST(req){
    const data = await req.json();
    await dbConnect();
    const user = await User.findOne({username: data.username});

    if(!user){
        return NextResponse.json(
            {message: "Username not found"},
            {status: 404},
        );
    }

    if(data.role !== user.role){
        return NextResponse.json(
            {message: "You do not have access to that!"},
            {status: 404},
        )
    }

    return NextResponse.json(
        {message: "Username found"},
        {status: 200}
    );
}