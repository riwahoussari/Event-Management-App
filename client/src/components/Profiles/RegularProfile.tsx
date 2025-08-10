import type { EventType, UserType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

import UserStats from "../Stats/UserStats";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function RegularProfile({ user }: { user: UserType }) {
  const { user: requester } = useUser();
  const {
    id,
    account_type,
    account_status,
    date_joined,
    profile_pic,
    fullname,
    gender,
    email,
    phone_number,
    birthday,
  } = user;
  const [selectedTab, setSelectedTab] = useState("logs");

  // fetch the events that the user is registered to
  const { data, error } = useFetch<EventType[]>(
    `/api/events?registerId=${id}&completed=none`
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load user's registrations", {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  return (
    <>
      {/* profile pic */}
      <div className="flex items-center gap-4">
        <img
          className="w-24 h-24 rounded-full bg-gray-400"
          src={profile_pic || "/profile-pic-placeholder.png"}
          alt={`profile picture of ${fullname}`}
        />
        <div>
          <p className="text-3xl font-bold mb-2">{fullname}</p>
          <p className="text-xl opacity-70">{phone_number}</p>
        </div>
      </div>

      {/* account info */}
      <div className="text-lg space-y-2 font-medium">
        <p className="text-2xl mb-4 font-semibold">Account Info</p>
        {fullname && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Full Name:{" "}
            </span>
            {fullname}
          </p>
        )}
        {email && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Email:{" "}
            </span>
            {email}
          </p>
        )}
        {phone_number && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Phone Number:{" "}
            </span>
            {phone_number}
          </p>
        )}
        {gender && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Gender:{" "}
            </span>
            {gender}
          </p>
        )}
        {birthday && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Birthday:{" "}
            </span>
            {birthday}
          </p>
        )}
        {account_type && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Account Type:{" "}
            </span>
            {account_type}
          </p>
        )}
        {account_status && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Account Status:{" "}
            </span>
            {account_status}
          </p>
        )}
        {date_joined && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Date Joined:{" "}
            </span>
            {date_joined}
          </p>
        )}
      </div>

      {/* tabs */}
      {requester?.account_type === "admin" && (
        <div className="my-8">
          <Tabs
            onValueChange={setSelectedTab}
            defaultValue="logs"
            className="max-w-[400px] w-full"
          >
            <TabsList className="h-12">
              <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="logs">
                Logs
              </TabsTrigger>
              <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="stats">
                Stats
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Events the user is registered to */}
      {(selectedTab === "logs" || requester?.account_type !== "admin") && (
        <div>
          <p className="text-2xl mb-4 font-semibold">
            {requester?.account_type === "admin"
              ? "All User's Registrations"
              : "User's Registrations To My Events"}
          </p>

          <div>
            <Table>
              <TableHeader>
                <TableRow className="text-base font-medium">
                  <TableHead>Event Registrations</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Registration Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((event) => (
                    <TableRow key={event.id} className="text-base">
                      <TableCell>
                        <Link
                          to={`/event/${event.id}`}
                          className="hover:underline"
                        >
                          {event.title}
                        </Link>
                      </TableCell>
                      <TableCell>{event.category_name}</TableCell>
                      <TableCell>{event.start_date}</TableCell>
                      <TableCell>{event.registration_date}</TableCell>
                      <TableCell>
                        {event.attendance === "true"
                          ? "Attended"
                          : event.registration_status}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Stats */}
      {selectedTab === "stats" && requester?.account_type === "admin" && (
        <div>{data && <UserStats events={data} />}</div>
      )}
    </>
  );
}
