import { useUser } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import type { EventType, UserType } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import EventCard, { SkeletonCard } from "../events/EventCard";
import UserStats from "../Stats/UserStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrganizerStats from "../Stats/OrganizerStats";
import { Link } from "react-router-dom";

export default function OrganizerFullProfile({ user }: { user: UserType }) {
  const [selectedType, setSelectedType] = useState("regular");

  // fetch the events that the user is registered to
  const { data: registeredEvents, error } = useFetch<EventType[]>(
    `/api/events?registerId=${user.id}&completed=none`
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
      {/* Account Type Tabs  */}
      <div>
        <p className="text-2xl mb-4 font-semibold ">View Activity As:</p>
        <Tabs
          onValueChange={setSelectedType}
          defaultValue="regular"
          className="max-w-[400px] w-full"
        >
          <TabsList className="h-12">
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="regular">
              Regular User
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="organizer">
              Organizer
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {selectedType === "regular" && registeredEvents && (
        <RegularView registeredEvents={registeredEvents} user={user} />
      )}

      {/* Events by Organizer */}
      {selectedType === "organizer" && registeredEvents && (
        <OrganizerView user={user} />
      )}
    </>
  );
}

function AccountInfo({ user }: { user: UserType }) {
  return (
    <>
      {/* profile pic */}
      <div className="flex items-center gap-4">
        <img
          className="w-24 h-24 rounded-full bg-gray-400"
          src={user.profile_pic || "/profile-pic-placeholder.png"}
          alt={`profile picture of ${user.organizer_name}`}
        />
        <div>
          <p className="text-3xl font-bold mb-2">{user.organizer_name}</p>
          <p className="text-xl opacity-70">{user.phone_number}</p>
        </div>
      </div>
      {/* account info */}
      <div className="text-lg space-y-2 font-medium">
        <p className="text-2xl mb-4 font-semibold">Account Info</p>
        {user.fullname && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Full Name:{" "}
            </span>
            {user.fullname}
          </p>
        )}
        {user.email && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Email:{" "}
            </span>
            {user.email}
          </p>
        )}
        {user.phone_number && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Phone Number:{" "}
            </span>
            {user.phone_number}
          </p>
        )}
        {user.gender && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Gender:{" "}
            </span>
            {user.gender}
          </p>
        )}
        {user.birthday && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Birthday:{" "}
            </span>
            {user.birthday}
          </p>
        )}
        {user.account_type && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Account Type:{" "}
            </span>
            {user.account_type}
          </p>
        )}
        {user.account_status && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Account Status:{" "}
            </span>
            {user.account_status}
          </p>
        )}
        {user.date_joined && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Date Joined:{" "}
            </span>
            {user.date_joined}
          </p>
        )}
        {user.promotion_date && (
          <p>
            <span className="opacity-70 w-[150px] inline-block font-normal ">
              Promotion Date:{" "}
            </span>
            {user.promotion_date}
          </p>
        )}
      </div>
    </>
  );
}

function EventsByOrganizer({ id, organizer_name }: EventType) {
  const { user: requester } = useUser();
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // Build query string based on selected tab
  const query = (() => {
    if (selectedTab === "complete")
      return `/api/events?owner=${id}&end_date=${yesterday}&completed=true`;
    if (selectedTab === "upcoming")
      return `/api/events?owner=${id}&start_date=${tomorrow}`;
    return `/api/events?owner=${id}&ongoing=true`; // ongoing
  })();

  const { data, error } = useFetch<EventType[]>(query);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load events", {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  return (
    <div>
      <p className="text-2xl mb-4 font-semibold">Events by {organizer_name}</p>

      {/* tabs */}
      <div className="my-8">
        <Tabs
          onValueChange={setSelectedTab}
          defaultValue="ongoing"
          className="max-w-[400px] w-full"
        >
          <TabsList className="h-12">
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="complete">
              Completed
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="ongoing">
              Ongoing
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="upcoming">
              Upcoming
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* cards */}
      <div className=" flex flex-wrap justify-start gap-16">
        <div className="flex flex-wrap justify-start gap-16">
          {requester && data
            ? data.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  event_banner={event.event_banner}
                  category={event.category_name}
                  status={event.status}
                  organizer_id={event.organizer_id}
                  organizer_name={event.organizer_name}
                  start_date={event.start_date}
                  end_date={event.end_date}
                  user={requester}
                  tags={event.tags}
                  isLikedByUser={event.isLikedByUser}
                  suspended={event.suspended}
                />
              ))
            : [1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}

function RegularView({
  user,
  registeredEvents,
}: {
  user: UserType;
  registeredEvents: EventType[];
}) {
  const [selectedTab, setSelectedTab] = useState("logs");

  return (
    <>
      <AccountInfo user={user} />

      {/* Tabs  */}
      <div>
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

      {/* registration logs */}
      {selectedTab === "logs" && (
        <div>
          <p className="text-2xl mb-4 font-semibold">
            All User's Registrations
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
                {registeredEvents &&
                  registeredEvents.map((event) => (
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

      {/* regular stats */}
      {selectedTab === "stats" && registeredEvents && (
        <UserStats events={registeredEvents} />
      )}
    </>
  );
}

function OrganizerView({ user }: { user: UserType }) {
  const [selectedTab, setSelectedTab] = useState("events");

  return (
    <>
      {/* Tabs  */}
      <div>
        <Tabs
          onValueChange={setSelectedTab}
          defaultValue="events"
          className="max-w-[400px] w-full"
        >
          <TabsList className="h-12">
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="events">
              Events
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="stats">
              Stats
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {selectedTab === "events" && (
        <EventsByOrganizer
          id={user.id}
          organizer_name={
            user.organizer_name === null ? undefined : user.organizer_name
          }
        />
      )}

      {selectedTab === "stats" && <OrganizerStats userId={user.id} />}
    </>
  );
}
