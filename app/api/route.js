import { NextResponse } from "next/server";
import conn from '../lib/db'

// To handle a GET request to /api
export async function GET(request) {
  console.log("request", request);
  const id = request.nextUrl.searchParams.get("sett_id");
  try {
    const res = await conn.query(`SELECT * FROM smoke.smoke_curfor WHERE commid='${id}'`);
    return NextResponse.json({ message: res.rows }, { status: 200 }); 
  } catch (error) {
    console.error(error);
  }

//   try {
//     console.log("req nom", req.body)
//     const query = "SELECT * FROM aqhi_cur_temp"
//     const values = [req.body.content]
//   const result = await conn.query(
//       query
//   );
//   console.log( "ttt", result );
//   return NextResponse.json({ message: result }, { status: 200 }); 
// } catch ( error ) {
//   console.log( error );
// }
  
}

// To handle a POST request to /api
export async function POST(request) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// Same logic to add a `PATCH`, `DELETE`...

async function retrieveData() {
  try {
    const res = await pool.query("SELECT * FROM aqhi_cur_temp");
    console.log(res.rows);
  } catch (error) {
    console.error(error);
  }
}