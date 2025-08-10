import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useFetch } from "@/hooks/useFetch";
import { formatDate, type EventType, type UserType } from "@/types";
import { Link } from "react-router-dom";

export default function EventCard({
  id,
  event_banner,
  title,
  category,
  status,
  suspended,
  organizer_name,
  organizer_id,
  organizer_profile_pic,
  start_date,
  tags,
  end_date,
  isLikedByUser,
  user,
  registration_status,
}: EventType & { user: UserType }) {
  const today = new Date().toISOString().split("T")[0];
  const hasPassed = end_date && today >= end_date;
  const isSuspended = suspended && suspended === "true";
  const isCancelled = status && status === "cancelled";
  const isRegistrationDenied =
    registration_status && registration_status === "denied";

  return (
    <div className="sm:rounded-2xl rounded-lg w-full max-w-[500px]">
      {/* image wrapper */}
      <div className=" relative sm:rounded-2xl rounded-lg border-1 overflow-hidden border-foreground/50 shadow-foreground/10 shadow-md ">
        {/* event banner */}
        <div className="relative z-0  aspect-16/9">
          <img
            className="w-full h-full object-cover"
            src={event_banner || "/event-banner-placeholder.png"}
            alt=""
          />
        </div>

        {/* event status - conditional */}
        {(isCancelled || hasPassed || isSuspended || isRegistrationDenied) && (
          <>
            <div
              style={{
                backgroundColor:
                  isSuspended || isCancelled || isRegistrationDenied
                    ? "var(--color-red-300)"
                    : "var(--color-green-300)",
              }}
              className=" absolute z-2 shadow-black/50 top-0 left-0 right-0 sm:p-2 p-1 sm:text-xl text-base font-medium bg-red-300 text-black text-center"
            >
              <p>
                {isSuspended
                  ? "Suspended"
                  : isCancelled
                  ? "Cancelled"
                  : isRegistrationDenied
                  ? "Registration Denied"
                  : "Completed"}
              </p>
            </div>

            {/* img overlay */}
            <div className="absolute z-1 bg-black/50 top-0 right-0 left-0 bottom-0 backdrop-blur-xs"></div>
          </>
        )}

        {/* category */}
        <p className="absolute z-2 bg-black uppercase font-medium sm:text-lg text-white bottom-2 left-2 sm:py-1 sm:px-4 py-0.5 px-3 shadow-black/50 sm:shadow-xl shadow-lg rounded-full ">
          {category}
        </p>

        {/* like button */}
        {user.account_type !== "admin" && (
          <div>
            <LikeButton initialLiked={!!isLikedByUser} eventId={id} />
          </div>
        )}
      </div>

      {/* text content wrapper */}
      <div className="flex sm:gap-4 gap-3 mt-4 flex-col">
        {/* title */}
        <Link
          to={`/event/${id}`}
          className="hover:underline sm:text-3xl text-2xl  leading-[0.9] font-black"
        >
          {title}
        </Link>

        {/* organizer & date */}
        <div className="sm:text-lg font-medium  flex items-center sm:gap-6 gap-4 text-foreground/60">
          <div className="flex gap-2 items-center">
            <img
              src={organizer_profile_pic}
              alt=""
              className="sm:w-10 sm:h-10 w-8 h-8 rounded-full bg-gray-400"
            />
            <Link
              to={`/profile/${organizer_id}`}
              className="hover:underline hover:text-primary duration-200 ease-in-out "
            >
              {organizer_name}
            </Link>
          </div>
          <p>|</p>
          <p>{start_date ? formatDate(start_date, "MMM DD") : "TBA"}</p>
        </div>

        {/* tags */}
        <div className="flex sm:gap-3 gap-1.5 flex-wrap">
          {tags?.split(",").map((tag, i) => (
            <p
              key={i}
              className=" bg-foreground/10 sm:text-lg font-medium text-foreground bottom-2 left-2 sm:py-1 py-0.5 sm:px-4 px-3 rounded-full capitalize "
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function LikeButton({
  initialLiked = false,
  eventId,
}: {
  initialLiked?: boolean;
  eventId: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const { refetch: likePost } = useFetch(
    `/api/events/${eventId}/like`,
    {
      method: "POST",
    },
    false
  );
  const { refetch: unlikePost } = useFetch(
    `/api/events/${eventId}/like`,
    {
      method: "DELETE",
    },
    false
  );

  const handleClick = () => {
    if (liked) {
      unlikePost();
    } else {
      likePost();
    }
    setLiked((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute z-2 h-11 w-11 rounded-lg  bg-black bottom-2 right-2 shadow-black/50 shadow-xl flex items-center justify-center"
    >
      <svg
        className="w-6"
        viewBox="0 0 20 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.2383 0C12.4233 0 10.8343 0.780469 9.84375 2.09971C8.85322 0.780469 7.26416 0 5.44922 0C4.0045 0.00162838 2.61941 0.576264 1.59784 1.59784C0.576265 2.61941 0.00162934 4.0045 9.53674e-07 5.44922C9.53674e-07 11.6016 9.12217 16.5814 9.51065 16.7871C9.61304 16.8422 9.72749 16.871 9.84375 16.871C9.96002 16.871 10.0745 16.8422 10.1769 16.7871C10.5653 16.5814 19.6875 11.6016 19.6875 5.44922C19.6859 4.0045 19.1112 2.61941 18.0897 1.59784C17.0681 0.576264 15.683 0.00162838 14.2383 0Z"
          fill={liked ? "var(--primary)" : "transparent"}
        />
        <path
          d="M14.2383 0C12.4233 0 10.8343 0.780469 9.84375 2.09971C8.85322 0.780469 7.26416 0 5.44922 0C4.0045 0.00162838 2.61941 0.576264 1.59784 1.59784C0.576264 2.61941 0.00162838 4.0045 0 5.44922C0 11.6016 9.12217 16.5814 9.51064 16.7871C9.61303 16.8422 9.72748 16.871 9.84375 16.871C9.96002 16.871 10.0745 16.8422 10.1769 16.7871C10.5653 16.5814 19.6875 11.6016 19.6875 5.44922C19.6859 4.0045 19.1112 2.61941 18.0897 1.59784C17.0681 0.576264 15.683 0.00162838 14.2383 0ZM9.84375 15.3633C8.23887 14.4281 1.40625 10.1681 1.40625 5.44922C1.40765 4.37739 1.83405 3.34985 2.59195 2.59195C3.34985 1.83405 4.37739 1.40765 5.44922 1.40625C7.15869 1.40625 8.59395 2.3168 9.19336 3.7793C9.24633 3.90826 9.33645 4.01856 9.45226 4.09619C9.56806 4.17381 9.70433 4.21526 9.84375 4.21526C9.98317 4.21526 10.1194 4.17381 10.2352 4.09619C10.3511 4.01856 10.4412 3.90826 10.4941 3.7793C11.0936 2.31416 12.5288 1.40625 14.2383 1.40625C15.3101 1.40765 16.3376 1.83405 17.0956 2.59195C17.8535 3.34985 18.2799 4.37739 18.2812 5.44922C18.2812 10.161 11.4469 14.4272 9.84375 15.3633Z"
          fill={liked ? "var(--primary)" : "white"}
        />
      </svg>
    </button>
  );
}

export function SkeletonCard() {
  return (
    <div className="sm:rounded-2xl rounded-lg w-full max-w-[500px] ">
      {/* image wrapper */}
      <div className="relative sm:rounded-2xl rounded-lg border-1 overflow-hidden border-foreground/50 shadow-foreground/10 shadow-md ">
        <Skeleton className="aspect-16/9" />
      </div>

      {/* text content wrapper */}
      <div className="flex gap-4 mt-4 flex-col">
        <Skeleton className="h-8" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-8 w-1/2" />
        </div>

        {/* tags */}
        <div className="flex gap-3">
          <Skeleton className="w-20 h-9 rounded-full" />
          <Skeleton className="w-20 h-9 rounded-full" />
          <Skeleton className="w-20 h-9 rounded-full" />
          <Skeleton className="w-20 h-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
