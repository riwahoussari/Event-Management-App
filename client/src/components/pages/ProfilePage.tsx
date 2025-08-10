import { useUser } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import type { UserType } from "@/types";
import Lottie from "lottie-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingRippleLottie from "../../assets/loading-ripple.json";

import OrganizerProfile from "../Profiles/OrganizerProfile";
import RegularProfile from "../Profiles/RegularProfile";
import OrganizerFullProfile from "../Profiles/OrganizerFullProfile";
import SelfProfile from "../Profiles/SelfProfile";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useUser();

  const { data, loading, error } = useFetch<UserType>(`/api/users/${id}`);

  // // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to user info", {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  return (
    <main >
      {user && id && user.id == parseInt(id) ? (
        <SelfProfile />
      ) : loading ? (
        <Lottie animationData={LoadingRippleLottie} />
      ) : data?.account_type === "organizer" &&
        user?.account_type === "admin" ? (
        <OrganizerFullProfile user={data} />
      ) : data?.account_type === "organizer" ? (
        <OrganizerProfile user={data} />
      ) : (
        data?.account_type === "regular" && <RegularProfile user={data} />
      )}
    </main>
  );
}

