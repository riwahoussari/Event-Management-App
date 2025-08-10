import { useUser } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import {
  formatDate,
  type EventStatsType,
  type EventType,
  type RegistrationType,
} from "@/types";
import { Link, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import LoadingRippleLottie from "../../assets/loading-ripple.json";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatEventTime, getLastSixMonths, hasPassed } from "@/lib/utils";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Line,
  LineChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function EventPage() {
  const { id } = useParams();
  const { user } = useUser();

  const {
    data: event,
    error,
    refetch,
  } = useFetch<EventType>(`/api/events/${id}`);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong");
    }
  }, [error]);

  if (!event) return <Lottie animationData={LoadingRippleLottie} />;

  if (user?.account_type === "admin") {
    return <AdminEventView refetchEvent={refetch} event={event} />;
  }
  if (user?.account_type === "organizer" && user.id === event?.organizer_id) {
    return <OrganizerEventView event={event} refetchEvent={refetch} />;
  }
  return (
    <main >
      <RegularEventView refetchEvent={refetch} event={event} />
    </main>
  );
}

function RegularEventView({
  event,
  refetchEvent,
}: {
  event: EventType;
  refetchEvent: () => void;
}) {
  const { user } = useUser();
  const isAdmin = user && user.account_type === "admin";
  const isOwner = user && event.organizer_id === user.id;
  const isComplete = event.end_date && hasPassed(event.end_date);
  const isCancelled = event.status && event.status === "cancelled";
  const isSuspended = event.suspended === "true";
  const isRegDeadlineOver =
    event.registration_deadline_date &&
    hasPassed(event.registration_deadline_date);
  const isCancellationOver =
    event.cancellation_deadline_date &&
    hasPassed(event.cancellation_deadline_date);
  const isRegistered =
    event.user_registration_status &&
    event.user_registration_status === "active";
  const isRegDenied =
    event.user_registration_status &&
    event.user_registration_status === "denied";

  // Register / Cancel actions
  const {
    data: regData,
    loading: regLoading,
    error: regError,
    refetch: regRefetch,
  } = useFetch<{ message?: string }>(
    `/api/events/${event.id}/register`,
    { method: "POST" },
    false
  );
  const {
    data: cnclData,
    loading: cnclLoading,
    error: cnclError,
    refetch: cnclRefetch,
  } = useFetch<{ message?: string }>(
    `/api/events/${event.id}/register`,
    { method: "DELETE" },
    false
  );
  const {
    data: suspendData,
    loading: suspendLoading,
    error: suspendError,
    refetch: suspendRefetch,
  } = useFetch<{ message?: string }>(
    `/api/events/${event.id}`,
    { method: "PATCH", body: { suspended: isSuspended ? "false" : "true" } },
    false
  );

  // Show toast if there's an error
  useEffect(() => {
    if (regError) {
      toast.error("Counldn't register you for this event :( ");
    }
    if (cnclError) {
      toast.error("Counldn't cancel your registration :( ");
    }
    if (suspendError) {
      toast.error("Counldn't update event status. ");
    }
  }, [regError, cnclError, suspendError]);

  // on success show success toast and refetch event data
  useEffect(() => {
    if (regData?.message) {
      toast.success("Registration Successful!");
      refetchEvent();
    }
    if (cnclData?.message) {
      toast.success("Cancellation Successful!");
      refetchEvent();
    }
    if (suspendData?.message) {
      toast.success("Updated Successfully!");
      refetchEvent();
    }
  }, [regData, cnclData, suspendData]);

  return (
    <>
      {!isOwner && isRegistered && (
        <div className="space-y-2">
          <p className="text-xl font-semibold">
            You're Registered For This Event ✅
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-10">
        {/* image and tags */}
        <div className="flex flex-col gap-5 flex-1 max-w-[700px] min-w-full sm:min-w-[400px]">
          {/* image & category */}
          <div className="relative  aspect-16/9!  rounded-2xl overflow-hidden">
            <img
              src={event.event_banner || "/event-banner-placeholder.png"}
              className="bg-foreground/20 bg-cover bg-center w-full h-full object-cover relative z-0"
              style={{
                backgroundImage: "url('/event-banner-placeholder.png')",
              }}
            />
            <p className="absolute z-2 bg-black uppercase font-medium md:text-xl text-lg text-white md:bottom-4 md:left-4 bottom-2.5 left-2.5 md:py-2 md:px-5 py-1 px-3 shadow-black/50 md:shadow-xl shadow-lg rounded-full ">
              {event.category_name}
            </p>

            {/* event status - conditional */}
            {(isCancelled || isComplete || isSuspended) && (
              <>
                <div
                  style={{
                    backgroundColor:
                      isCancelled || isSuspended
                        ? "var(--color-red-300)"
                        : "var(--color-green-300)",
                  }}
                  className=" absolute z-2 shadow-black/50 top-0 left-0 right-0 md:p-2 p-1 md:text-xl text-lg font-medium bg-red-300 text-black text-center"
                >
                  <p>
                    {isSuspended
                      ? "Suspended"
                      : isCancelled
                      ? "Cancelled"
                      : "Complete"}
                  </p>
                </div>

                {/* img overlay */}
                <div className="absolute z-1 bg-black/50 top-0 right-0 left-0 bottom-0 backdrop-blur-xs"></div>
              </>
            )}
          </div>

          {/* tags */}
          <div className="flex md:gap-3 gap-2 flex-wrap">
            {event.tags?.split(",").map((tag, i) => (
              <p
                key={i}
                className=" bg-foreground/10 md:text-xl text-lg font-medium text-foreground  md:py-2 md:px-5 py-1 px-3 rounded-full capitalize "
              >
                {tag}
              </p>
            ))}
          </div>
        </div>

        {/* info and action buttons */}
        <div className="flex flex-col gap-5 flex-1 max-w-[700px] min-w-full sm:min-w-[400px]">
          {/* title & description */}
          <div className="space-y-2.5">
            <h2 className="font-black text-3xl leading-[1]">{event.title}</h2>
            <p className="text-lg opacity-80 leading-[1.3]">
              {event.description}
            </p>
          </div>

          {/* Organizer profile */}
          <div className="flex items-center gap-2">
            <img
              className="h-10 w-10 bg-foreground/20 bg-cover bg-center rounded-full"
              src={
                event.organizer_profile_pic || "/profile-pic-placeholder.png"
              }
              style={{ backgroundImage: "url('/profile-pic-placeholder.png')" }}
            />
            <Link
              to={`/profile/${event.organizer_id}`}
              className="opacity-80 font-semibold hover:underline text-xl"
            >
              {event.organizer_name}
            </Link>
          </div>

          {/* divider */}
          <div className="w-full bg-foreground/50 h-[1px]" />

          {/* date - time - location */}
          <div className="space-y-3.5">
            {event.start_date &&
              event.end_date &&
              event.start_time &&
              event.end_time && (
                <p className="text-xl xl:text-2xl font-medium">
                  {formatEventTime(
                    event.start_date,
                    event.end_date,
                    event.start_time,
                    event.end_time
                  )}
                </p>
              )}
            <p className="text-xl xl:text-2xl font-medium">
              {event.city}, {event.country}
            </p>
          </div>

          {!isOwner && isRegDenied && (
            <>
              <div className="w-full bg-foreground/50 h-[1px]" />
              <p className="text-red-500">
                You can't register. You have been denied from this event.
              </p>
            </>
          )}

          {!isAdmin &&
            !isOwner &&
            !isComplete &&
            !isCancelled &&
            !isRegDenied && (
              <>
                {/* divider */}
                <div className="w-full bg-foreground/50 h-[1px]" />

                {!isRegistered && !isRegDeadlineOver && (
                  <>
                    <Button
                      className="bg-green-300 cursor-pointer text-black text-xl  py-6!"
                      size="lg"
                      variant={"secondary"}
                      disabled={regLoading}
                      onClick={regRefetch}
                    >
                      {regLoading ? "Registring..." : "Register Now"}
                    </Button>
                    {event.registration_deadline_date && (
                      <p className="capitalize opacity-80 text-lg">
                        registration deadline:{" "}
                        {formatDate(event.registration_deadline_date, "MMM DD")}
                      </p>
                    )}
                  </>
                )}
                {!isRegistered && isRegDeadlineOver && (
                  <p className="text-red-300">Registration Deadline Passed.</p>
                )}

                {isRegistered && !isCancellationOver && (
                  <>
                    <Button
                      className=" text-xl cursor-pointer py-6!"
                      size="lg"
                      variant={"secondary"}
                      disabled={cnclLoading}
                      onClick={cnclRefetch}
                    >
                      {cnclLoading
                        ? "Cancelling Registration..."
                        : "Cancel Registration"}
                    </Button>
                    {event.cancellation_deadline_date && (
                      <p className="capitalize opacity-80 text-lg">
                        cancellation deadline:{" "}
                        {formatDate(event.cancellation_deadline_date, "MMM DD")}
                      </p>
                    )}
                  </>
                )}
                {isRegistered && isCancellationOver && (
                  <p className="text-red-300">Cancellation Deadline Passed.</p>
                )}
              </>
            )}

          {isAdmin && !isComplete && (
            <>
              {/* divider */}
              <div className="w-full bg-foreground/50 h-[1px]" />

              <Button
                className={
                  isSuspended
                    ? "bg-green-300 cursor-pointer text-black text-xl  py-6!"
                    : "bg-red-300 cursor-pointer text-black text-xl  py-6!"
                }
                size="lg"
                variant={"secondary"}
                disabled={suspendLoading}
                onClick={suspendRefetch}
              >
                {suspendLoading
                  ? "Updating..."
                  : isSuspended
                  ? "Reactivate Event"
                  : "Suspend Event"}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function OrganizerEventView({
  event,
  refetchEvent,
}: {
  event: EventType;
  refetchEvent: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState("preview");
  const isComplete = event.end_date && hasPassed(event.end_date);

  return (
    <main >
      {/* tabs */}
      <div>
        <Tabs
          onValueChange={setSelectedTab}
          defaultValue="preview"
          className="max-w-[400px] w-full "
        >
          <TabsList className="h-12 max-sm:flex-wrap max-sm:h-auto">
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="preview">
              Preview
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="edit">
              {isComplete ? "View Settings" : "Edit Settings"}
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="registrations">
              Registrations
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="stats">
              Stats
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {selectedTab === "preview" && (
        <RegularEventView event={event} refetchEvent={refetchEvent} />
      )}

      {selectedTab === "edit" && (
        <EditEventSettings event={event} refetchEvent={refetchEvent} />
      )}

      {selectedTab === "registrations" && (
        <EventRegistrations event={event} isOwner={true} />
      )}

      {selectedTab === "stats" && <EventStats event={event} />}
    </main>
  );
}

function AdminEventView({
  event,
  refetchEvent,
}: {
  event: EventType;
  refetchEvent: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState("details");

  return (
    <main >
      {/* tabs */}
      <div>
        <Tabs
          onValueChange={setSelectedTab}
          defaultValue="details"
          className="max-w-[400px] w-full "
        >
          <TabsList className="h-12 max-sm:flex-wrap max-sm:h-auto">
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="details">
              Event Details
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="registrations">
              Registrations
            </TabsTrigger>
            <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="stats">
              Stats
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {selectedTab === "details" && (
        <RegularEventView event={event} refetchEvent={refetchEvent} />
      )}

      {selectedTab === "registrations" && (
        <EventRegistrations event={event} isOwner={false} />
      )}

      {selectedTab === "stats" && <EventStats event={event} />}
    </main>
  );
}

// Edit Event Settings Tab
function EditEventSettings({
  event,
  refetchEvent,
}: {
  event: EventType;
  refetchEvent: () => void;
}) {
  const isComplete = !!(event.end_date && hasPassed(event.end_date));
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(event.description || "");
  const [city, setCity] = useState(event.city || "");
  const [fullAddress, setFullAddress] = useState(event.full_address || "");
  const [startDate, setStartDate] = useState(event.start_date || "");
  const [startTime, setStartTime] = useState(event.start_time || "");
  const [endDate, setEndDate] = useState(event.end_date || "");
  const [endTime, setEndTime] = useState(event.end_time || "");
  const [maxCapacity, setMaxCapacity] = useState(event.max_capacity || "");
  const [registrationDate, setRegistrationDate] = useState(
    event.registration_deadline_date || ""
  );
  const [registrationTime, setRegistrationTime] = useState(
    event.registration_deadline_time || ""
  );
  const [cancellationDate, setCancellationDate] = useState(
    event.cancellation_deadline_date || ""
  );
  const [cancellationTime, setCancellationTime] = useState(
    event.cancellation_deadline_time || ""
  );
  const [tags, setTags] = useState(event.tags?.split(",") || []);
  const [newTag, setNewTag] = useState("");

  const { data, loading, error, refetch } = useFetch<{ message?: string }>(
    `/api/events/${event.id}`,
    {
      method: "PATCH",
      body: {
        description,
        suspended: true,
        city,
        full_address: fullAddress,
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
        tags: tags.join(","),
        max_capacity: maxCapacity,
        registration_deadline_date: registrationDate,
        registration_deadline_time: registrationTime,
        cancellation_deadline_date: cancellationDate,
        cancellation_deadline_time: cancellationTime,
      },
    },
    false
  );

  const {
    data: cnclData,
    error: cnclError,
    refetch: cnclRefetch,
  } = useFetch<{ message?: string }>(
    `/api/events/${event.id}`,
    {
      method: "PATCH",
      body: {
        status: event.status === "active" ? "cancelled" : "active",
      },
    },
    false
  );

  const handleClick = () => {
    if (editing) {
      refetch();
    }
    setEditing((p) => !p);
  };

  useEffect(() => {
    if (error) {
      toast.error("Something Went Wrong!");
    }
    if (data?.message) {
      toast.success("Event settings updated!");
      refetchEvent();
    }
    if (cnclError) {
      toast.error("Something Went Wrong!");
    }
    if (cnclData?.message) {
      toast.success("Event status updated!");
      refetchEvent();
    }
  }, [error, data, cnclError, cnclData]);

  return (
    <div className="space-y-14">
      {!isComplete && (
        <div className=" space-x-4">
          <Button
            disabled={loading}
            size="lg"
            onClick={handleClick}
            className="cursor-pointer bg-foreground! text-background! hover:opacity-70"
          >
            {loading
              ? "Updating..."
              : editing
              ? "Save Changes"
              : "Edit Settings"}
          </Button>
          <Button
            disabled={loading}
            size="lg"
            variant={"destructive"}
            className={
              event.status === "active"
                ? "cursor-pointer hover:opacity-70"
                : "bg-green-300! text-black! hover:opacity-70 cursor-pointer"
            }
            onClick={cnclRefetch}
          >
            {event.status === "active" ? "Cancel Event" : "Activate Event"}
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-10 justify-between">
        {/* col 1 */}
        <div className="flex flex-col gap-12 min-w-full sm:min-w-[330px] max-w-[600px] w-[28%]">
          <div className="space-y-1">
            <Label className="text-xl font-normal">Event Banner</Label>
            <img
              src={event.event_banner || "/event-banner-placeholder.png"}
              className="bg-cover bg-center bg-foreground/20 w-full aspect-16/9 rounded-lg"
              style={{
                backgroundImage: "url('/event-banner-placeholder.png')",
              }}
            />
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-1 cursor-not-allowed">
              <Label className="text-xl font-normal">Category</Label>
              <Input
                className=" text-lg! py-5!"
                disabled
                value={event.category_name}
              />
            </div>
            <div className="space-y-1 cursor-not-allowed">
              <Label className="text-xl font-normal">Title</Label>
              <Input className=" text-lg! py-5!" disabled value={event.title} />
            </div>
            <div className="space-y-1">
              <Label className="text-xl font-normal">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className=" text-base! py-2!"
                disabled={!editing || isComplete}
                defaultValue={event.description}
              />
            </div>
          </div>
        </div>

        {/* col 2 */}
        <div className="flex flex-col gap-12 min-w-full sm:min-w-[330px] max-w-[600px] w-[28%]">
          <div className="flex flex-col gap-8">
            {/* location */}
            <div className="flex flex-col gap-4">
              <Label className="text-xl font-normal">Location</Label>

              <div className="flex gap-3 sm:gap-5">
                <div className="space-y-1 cursor-not-allowed">
                  <Label className="text-base font-normal">Country</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled
                    value={event.country}
                  />
                </div>
                <div className="space-y-1 cursor-not-allowed">
                  <Label className="text-base font-normal">City</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    defaultValue={event.city}
                  />
                </div>
              </div>
              <div className="space-y-1 cursor-not-allowed">
                <Label className="text-base font-normal">Full Address</Label>
                <Input
                  className=" text-lg! py-5!"
                  disabled={!editing || isComplete}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  defaultValue={event.full_address}
                />
              </div>
            </div>

            {/* timing */}
            <div className="flex flex-col gap-4">
              <Label className="text-xl font-normal">Timing</Label>
              <div className="flex gap-3 sm:gap-5">
                <div className="space-y-1 cursor-not-allowed w-full max-w-[45vw]">
                  <Label className="text-base font-normal">Start Date</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    defaultValue={event.start_date}
                  />
                </div>
                <div className="space-y-1 cursor-not-allowed w-full">
                  <Label className="text-base font-normal">Start Time</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                    defaultValue={event.start_time}
                  />
                </div>
              </div>
              <div className="flex gap-3 sm:gap-5">
                <div className="space-y-1 cursor-not-allowed w-full max-w-[45vw]">
                  <Label className="text-base font-normal">End Date</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                    defaultValue={event.end_date}
                  />
                </div>
                <div className="space-y-1 cursor-not-allowed w-full">
                  <Label className="text-base font-normal">End Time</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                    defaultValue={event.end_time}
                  />
                </div>
              </div>
            </div>

            {/* tags */}
            <div className="flex flex-col gap-4">
              <Label className="text-xl font-normal">Tags</Label>
              <div className="flex gap-3 flex-wrap items-start">
                {tags.map((tag, i) => (
                  <div key={i} className="flex capitalize gap-3 text-xl! rounded-full py-2 px-4  bg-foreground/20">
                    <p>{tag}</p>
                    {editing && !isComplete && (
                      <p
                        onClick={() => setTags(tags.filter((_, j) => j != i))}
                        className="w-8 h-8 text-center bg-foreground/20 rounded-full hover:bg-red-500 cursor-pointer"
                      >
                        X
                      </p>
                    )}
                  </div>
                ))}
                {editing && !isComplete && tags.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      type="text"
                      placeholder="add new tag"
                    />
                    <Button
                      onClick={() => {
                        setTags([...tags, newTag]);
                        setNewTag("");
                      }}
                      variant={"outline"}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* col 3 */}
        <div className="flex flex-col gap-12 min-w-full sm:min-w-[330px] max-w-[600px] w-[28%]">
          <div className="flex flex-col gap-8">
            {/* Max Capacity */}
            <div className="space-y-1 cursor-not-allowed">
              <Label className="text-xl font-normal">Max Capacity</Label>
              <Input
                className=" text-lg! py-5!"
                disabled={!editing || isComplete}
                type="number"
                defaultValue={event.max_capacity}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
            </div>

            {/* Registration */}
            <div className="flex flex-col gap-4">
              <Label className="text-xl font-normal">
                Registration Deadline
              </Label>
              <div className="flex gap-3 sm:gap-5">
                <div className="space-y-1 cursor-not-allowed w-full max-w-[45vw]">
                  <Label className="text-base font-normal">Date</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={registrationDate}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    type="date"
                    defaultValue={event.registration_deadline_date}
                  />
                </div>
                <div className="space-y-1 cursor-not-allowed w-full">
                  <Label className="text-base font-normal">Time</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={registrationTime}
                    onChange={(e) => setRegistrationTime(e.target.value)}
                    type="time"
                    defaultValue={event.registration_deadline_time}
                  />
                </div>
              </div>
            </div>

            {/* Cancellation */}
            <div className="flex flex-col gap-4">
              <Label className="text-xl font-normal">
                Cancellation Deadline
              </Label>
              <div className="flex gap-3 sm:gap-5">
                <div className="space-y-1 cursor-not-allowed w-full max-w-[45vw]">
                  <Label className="text-base font-normal">Date</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={cancellationDate}
                    onChange={(e) => setCancellationDate(e.target.value)}
                    type="date"
                    defaultValue={event.cancellation_deadline_date}
                  />
                </div>
                <div className="space-y-1 cursor-not-allowed w-full">
                  <Label className="text-base font-normal">Time</Label>
                  <Input
                    className=" text-lg! py-5!"
                    disabled={!editing || isComplete}
                    value={cancellationTime}
                    onChange={(e) => setCancellationTime(e.target.value)}
                    type="time"
                    defaultValue={event.cancellation_deadline_time}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Tab
function EventStats({ event }: { event: EventType }) {
  const {
    data: stats,
    loading,
    error,
  } = useFetch<EventStatsType>(`/api/events/${event.id}/stats`);

  useEffect(() => {
    if (error) {
      toast.error("Couldn't load Stats.");
    }
  }, [error]);

  if (loading) return <Lottie animationData={LoadingRippleLottie} />;
  if (stats)
    return (
      <div className="flex flex-wrap gap-6">
        {/* Status */}
        <RegistrationsTypeBarChart
          total={stats.total_registrations}
          active={stats.total_active_registrations}
          denied={stats.total_denied_registrations}
          cancelled={stats.total_cancelled_registrations}
        />
        {/* Gender */}
        <RegistrationsGenderPieChart
          female={stats.female_registrations}
          male={stats.male_registrations}
        />
        {/* Attendance */}
        <div className="flex flex-col gap-6">
          <Card className="w-[200px] ">
            <CardHeader className="items-center pb-0">
              <CardDescription>Total Attendants</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.total_attendants}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="w-[200px] ">
            <CardHeader className="items-center pb-0">
              <CardDescription>Attendance Rate</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.attendance_rate}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        {/* By Month */}
        <RegistrationsTimelineLineChart
          regPerMonth={stats.registrations_last_6_months}
        />
        {/* Likes - Views - Conversion */}
        <div className="flex flex-col gap-6">
          <Card className="w-[200px] ">
            <CardHeader className="items-center pb-0">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.total_views}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="w-[200px] ">
            <CardHeader className="items-center pb-0">
              <CardDescription>Total Likes</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.total_likes}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="w-[200px] ">
            <CardHeader className="items-center pb-0">
              <CardDescription>Conversion Rate</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.conversion_rate}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
}

function RegistrationsTypeBarChart({
  total,
  active,
  cancelled,
  denied,
}: {
  total: number;
  active: number;
  cancelled: number;
  denied: number;
}) {
  const chartData = [
    { status: "active", registrations: active },
    { status: "cancelled", registrations: cancelled },
    { status: "denied", registrations: denied },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardDescription>Total Registrations</CardDescription>
        <CardTitle className="text-4xl font-bold">{total}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              className="text-lg"
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="registrations"
              fill="var(--color-desktop)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RegistrationsGenderPieChart({
  male,
  female,
}: {
  male: number;
  female: number;
}) {
  const chartData = [
    { gender: "male", registrations: male, fill: "#5BB5FF" },
    { gender: "female", registrations: female, fill: "#FFA3FD" },
  ];
  const chartConfig = {
    registrations: {
      label: "Registrations",
    },
    male: {
      label: "Male",
    },
    female: {
      label: "Female",
    },
  };

  return (
    <Card className="flex flex-col w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardDescription>Registrations By Gender</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="registrations"
              label
              nameKey="gender"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RegistrationsTimelineLineChart({
  regPerMonth,
}: {
  regPerMonth: { month: string; count: number }[];
}) {
  const last6Months = getLastSixMonths();
  const chartData = last6Months.map((month) => {
    return {
      month: month,
      registrations: 0,
    };
  });

  regPerMonth.forEach((reg) => {
    if (reg.month) {
      const month = new Date(reg.month).toLocaleString("default", {
        month: "long",
      });

      // Find the matching month object in chartData
      const monthObj = chartData.find(
        (m) => m.month.toLowerCase() === month.toLowerCase()
      );
      if (monthObj) {
        monthObj.registrations = reg.count;
      }
    }
  });

  const chartConfig = {
    registrations: {
      label: "Registrations",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-[600px] ">
      <CardHeader>
        <CardDescription>Registrations By Month</CardDescription>
        <CardTitle>
          {last6Months[0]} - {last6Months[5]} {new Date().getFullYear()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="registrations"
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Registrations Tab
function EventRegistrations({
  event,
  isOwner,
}: {
  event: EventType;
  isOwner: boolean;
}) {
  const isCancelled = event.status && event.status === "cancelled";
  const isComplete = event.end_date && hasPassed(event.end_date);
  const isSuspended = event.suspended && event.suspended === "true";

  const { data, loading, error } = useFetch<RegistrationType[]>(
    `/api/events/${event.id}/registrations`
  );

  useEffect(() => {
    if (error) {
      toast.error("Couldn't load Registrations");
    }
  }, [error]);

  if (loading) return <Lottie animationData={LoadingRippleLottie} />;
  if (data)
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow className="text-base font-medium">
              <TableHead>
                Registrants ({data.length}/{event.max_capacity})
              </TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Registration Status</TableHead>
              {!isSuspended && !isCancelled && isComplete && isOwner && (
                <TableHead>Attendance Status</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((reg) => (
                <TableRow key={reg.id} className="text-base">
                  <TableCell>
                    <Link
                      to={`/profile/${reg.user_id}`}
                      className="hover:underline"
                    >
                      {reg.fullname}
                    </Link>
                  </TableCell>
                  <TableCell>{reg.phone_number}</TableCell>
                  <TableCell>{reg.registration_date}</TableCell>
                  {!(!isCancelled && !isSuspended && !isComplete) && (
                    <TableCell>{reg.status}</TableCell>
                  )}
                  {!isCancelled && !isSuspended && isComplete && isOwner && (
                    <AttendanceCheckbox key={reg.id} reg={reg} />
                  )}
                  {!isCancelled && !isSuspended && !isComplete && isOwner && (
                    <RegStatusCheckbox key={reg.id} reg={reg} />
                  )}
                  {!isOwner && (
                    <TableCell>
                      {reg.attendance === "true"
                        ? "Attended"
                        : reg.attendance === "false"
                        ? "Did Not Attend"
                        : reg.status}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
}

function AttendanceCheckbox({ reg }: { reg: RegistrationType }) {
  const [attendance, setAttendance] = useState(reg.attendance);
  const [canFetch, setCanFetch] = useState(false);

  const { data, loading, error, refetch } = useFetch<{ message?: string }>(
    `/api/events/${reg.event_id}/register`,
    { method: "PATCH", body: { user_id: reg.user_id, attendance } },
    false
  );

  const handleChange = (checked: boolean) => {
    setAttendance(checked ? "true" : "false");
    setCanFetch(true);
  };

  useEffect(() => {
    if (canFetch) {
      refetch();
    }
  }, [attendance, canFetch]);

  useEffect(() => {
    if (error) {
      toast.error("Counldn't update attandence.");
    }
    if (data?.message) {
      toast.success("Attendance Updated");
    }
  }, [error, data]);

  return (
    <TableCell>
      <Checkbox
        disabled={loading}
        checked={attendance === "true"}
        onCheckedChange={handleChange}
      />
    </TableCell>
  );
}

function RegStatusCheckbox({ reg }: { reg: RegistrationType }) {
  const [status, setStatus] = useState(reg.status);
  const [canFetch, setCanFetch] = useState(false);

  const { data, loading, error, refetch } = useFetch<{ message?: string }>(
    `/api/events/${reg.event_id}/register`,
    { method: "PATCH", body: { user_id: reg.user_id, status } },
    false
  );

  const handleChange = (checked: boolean) => {
    setStatus(checked ? "denied" : "active");
    setCanFetch(true);
  };

  useEffect(() => {
    if (canFetch) {
      refetch();
    }
  }, [status, canFetch]);

  useEffect(() => {
    if (error) {
      toast.error("Counldn't update attandence.");
    }
    if (data?.message) {
      toast.success("Status Updated");
    }
  }, [error, data]);

  return (
    <>
      <TableCell>{status}</TableCell>
      <TableCell>
        {reg.status !== "cancelled" &&
          (status !== "denied" ? (
            <Button
              disabled={loading}
              onClick={() => handleChange(true)}
              variant={"destructive"}
            >
              {loading ? "Updating..." : "Deny Registration"}
            </Button>
          ) : (
            <Button
              disabled={loading}
              onClick={() => handleChange(false)}
              variant={"outline"}
            >
              {loading ? "Updating..." : "Activate Registration"}
            </Button>
          ))}
      </TableCell>
    </>
  );
}
