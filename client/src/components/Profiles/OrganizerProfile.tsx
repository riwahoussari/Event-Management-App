import { useUser } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import type { EventType, UserType } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import EventCard, { SkeletonCard } from "../events/EventCard";

export default function OrganizerProfile({ user }: { user: UserType }) {
  const { user: requester } = useUser();
  const {
    profile_pic,
    phone_number,
    email,
    fullname,
    organizer_name,
    id,
    account_type,
    account_status,
    gender,
    promotion_date,
    date_joined,
    birthday,
  } = user;

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
    <>
      {/* profile pic */}
      <div className="flex items-center gap-4">
        <img
          className="w-24 h-24 rounded-full bg-gray-400"
          src={profile_pic || "/profile-pic-placeholder.png"}
          alt={`profile picture of ${organizer_name}`}
        />
        <div>
          <p className="text-3xl font-bold mb-2">{organizer_name}</p>
          <p className="text-xl opacity-70">{phone_number}</p>
        </div>
      </div>

      {/* account info */}
      {requester?.account_type === "admin" && (
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
          {promotion_date && (
            <p>
              <span className="opacity-70 w-[150px] inline-block font-normal ">
                Promotion Date:{" "}
              </span>
              {promotion_date}
            </p>
          )}
        </div>
      )}

      {/* Events by Organizer */}
      <div>
        <p className="text-2xl mb-4 font-semibold">
          Events by {organizer_name}
        </p>

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
    </>
  );
}
