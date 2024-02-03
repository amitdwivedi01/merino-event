import User from "@/modal/user";
import { Scan } from "lucide-react";
import Link from "next/link";
import { cache } from "react";
import UploadFlightTicket from "../UploadFlightTicket";
import PDFViewer from "../PDFViewer";

const getUsers = cache(async () => {
  const users = await User.find();
  return users;
});

const Page = async () => {
  const users = await getUsers();
  return (
    <div className="container mx-auto">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">Admin</h1>
        <div className="flex gap-1">
          <Link href={"/scanner/hotelCheckedIn"}>
            <button className="btn btn-outline">
              <Scan /> Scan QR at hotel
            </button>
          </Link>
          <Link href={"/scanner/eventCheckedIn"}>
            <button className="btn btn-outline">
              <Scan /> Scan QR at Event
            </button>
          </Link>
        </div>
      </header>
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Aadhaar Front</th>
                <th>Aadhaar Back</th>
                <th>Hotel</th>
                <th>Event</th>
                <th>Flight Ticket</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {users.map((user, index) => (
                <tr>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <PDFViewer url={user.aadhaar_front} />
                  </td>
                  <td>
                    <PDFViewer url={user.aadhaar_back} />
                  </td>
                  <td>
                    {user.hotelCheckedIn ? (
                      <span className=" text-green-500">Checked-in</span>
                    ) : (
                      <span className=" text-red-500">Not Checked-in</span>
                    )}
                  </td>
                  <td>
                    {user.eventCheckedIn ? (
                      <span className=" text-green-500">Checked-in</span>
                    ) : (
                      <span className=" text-red-500">Not Checked-in</span>
                    )}
                  </td>
                  <td className="mx-2 flex items-center gap-4">
                    {user?.flightTicket && (
                      <PDFViewer url={user.flightTicket} />
                    )}
                    <div>
                      <UploadFlightTicket id={user?._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Page;
