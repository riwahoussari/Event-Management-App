import { useUser } from "@/context/UserContext";
import { type EventType } from "../../types";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import EventCard, { SkeletonCard } from "../events/EventCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotFoundPage from "./NotFoundPage";

export default function MyEventsPage() {
  const { user } = useUser();

  // admins and regular users don't have favorites page
  if (user?.account_type !== 'organizer') return <NotFoundPage />

  const [selectedTab, setSelectedTab] = useState("ongoing");

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // Build query string based on selected tab
  const query = (() => {
    if (selectedTab === "complete")
      return `/api/events?owned=true&end_date=${yesterday}&completed=true`;
    if (selectedTab === "upcoming")
      return `/api/events?owned=true&start_date=${tomorrow}`;
    return `/api/events?owned=true&ongoing=true`; // ongoing
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
    <main className="space-y-14 p-14">
      {/* tabs */}
      <div>
        <Tabs
          onValueChange={setSelectedTab}
          defaultValue="ongoing"
          className="w-[400px]"
        >
          <TabsList className="h-12">
            <TabsTrigger className="text-lg p-4" value="complete">
              Completed
            </TabsTrigger>
            <TabsTrigger className="text-lg p-4" value="ongoing">
              Ongoing
            </TabsTrigger>
            <TabsTrigger className="text-lg p-4" value="upcoming">
              Upcoming
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* cards */}
      <div className="flex flex-wrap justify-start gap-16">
        {user && data
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
                user={user}
                tags={event.tags}
                isLikedByUser={event.isLikedByUser}
              />
            ))
          : [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
      </div>
    </main>
  );
}
