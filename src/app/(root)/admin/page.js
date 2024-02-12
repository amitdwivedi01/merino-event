"use client"

import {useState,useEffect,useRef} from "react"
import { getUsers } from "@/app/server";
import { Scan } from "lucide-react";
import Link from "next/link";
// import { useDownloadExcel } from 'react-export-table-to-excel';
import { cache } from "react";
import UploadFlightTicket from "../UploadFlightTicket";
import PDFViewer from "../PDFViewer";


const Page =  () => {
  const [users, setUsers] = useState([]);
//   const tableRef = useRef(null);

//   const { onDownload } = useDownloadExcel({
//     currentTableRef: tableRef.current,
//     filename: 'Users table',
//     sheet: 'Users'
// })

  useEffect(() => {
    const fetchUsers = async () => {
      const limitedUsers = await getUsers()
      setUsers(limitedUsers)
    }
    fetchUsers();
  }, []);
 
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

          <button onClick={onDownload} className="btn btn-outline"> Export excel </button>
        </div>
      </header>
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="table" >
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Meal</th>
                <th>T-shirt</th>
                <th>Hotel</th>
                <th>Event</th>
                <th>Flight Ticket</th>
                <th className="hidden">aadhar back</th>
                <th className="hidden">aadhar front</th>
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
                  <td>{user.meal}</td>
                  <td>{user.tshirt}</td>                  
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
                  <td className="hidden">{user.aadhaar_back}</td>  
                  <td className="hidden">{user.aadhaar_front}</td>  
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
