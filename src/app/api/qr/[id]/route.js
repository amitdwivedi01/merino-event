import dbConnect from "@/config/db";
import User from "@/modal/user";
import { NextResponse } from "next/server";

/**@param {import("next").NextApiRequest} request */
export async function GET(_request, context) {
  let { id } = context.params;
  id = id.split(".")[0];
  await dbConnect();

  const user = await User.findById(id);
  // console.log({ user });
  const [type, data] = user.qrCode.split(",");
  const contentTypeRegex = /^data:([a-zA-Z]+)\/([a-zA-Z]+);base64/;
  const contentType = type.match(contentTypeRegex);
  const response = new NextResponse(Buffer.from(data, "base64"));

  response.headers.set("content-type", `${contentType[1]}/${contentType[2]}`);
  // response.headers.set("Content-Disposition", "inline");
  return response;
}
