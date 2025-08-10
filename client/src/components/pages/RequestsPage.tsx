import { useUser } from "@/context/UserContext";
import NotFoundPage from "./NotFoundPage";
import { useFetch } from "@/hooks/useFetch";
import type { PromotionRequestType } from "@/types";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Lottie from "lottie-react";
import LoadingRippleLottie from "../../assets/loading-ripple.json";

export default function RequestsPage() {
  const { user } = useUser();
  if (user?.account_type !== "admin") return <NotFoundPage />;

  const { data, loading, error, refetch } = useFetch<PromotionRequestType[]>(
    "/api/promotion-requests"
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load requests`, {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  return (
    <main >
      <p className="text-xl font-bold">Promotion Requests</p>
      <div className="flex flex-wrap gap-10">
        {loading && <Lottie animationData={LoadingRippleLottie} />}
        {data &&
          data.map((request) => (
            <RequestCard
              onSuccess={refetch}
              key={request.user_id}
              request={request}
            />
          ))}
      </div>
    </main>
  );
}

function RequestCard({
  request,
  onSuccess,
}: {
  request: PromotionRequestType;
  onSuccess: () => void;
}) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <div className="flex gap-2 items-center text-xl">
          <img
            src={request.profile_pic || "/profile-pic-placeholder.png"}
            style={{
              backgroundImage: "url('/profile-pic-placeholder.png')",
            }}
            className="w-14 h-14 rounded-full bg-foreground/20 bg-center bg-cover"
          />
          <div>
            <CardTitle>{request.fullname}</CardTitle>
            <CardDescription>
              requested on {request.request_date}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardFooter>
        <div className="flex flex-col gap-2 w-full">
          <DialogDemo onSuccess={onSuccess} request={request} />
          <Link to={`/profile/${request.user_id}`}>
            <Button
              size="lg"
              variant={"secondary"}
              className="bg-foreground! text-background! w-full"
            >
              Check Profile
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function DialogDemo({
  request,
  onSuccess,
}: {
  request: PromotionRequestType;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    data: accData,
    loading: accLoading,
    error: accError,
    refetch: accRefetch,
  } = useFetch<{ message?: string }>(
    `/api/promotion-requests/${request.user_id}/accept`, {method: "PATCH"}, false);
  const {
    data: rejData,
    loading: rejLoading,
    error: rejError,
    refetch: rejRefetch,
  } = useFetch<{ message?: string }>(
    `/api/promotion-requests/${request.user_id}/reject`, {method: "PATCH"}, false);

  // Show toast if there's an error
  useEffect(() => {
    if (accError || rejError) {
      toast.error(`Failed to load requests`, {
        description: accError || rejError || "Something went wrong",
      });
    }
  }, [accError, rejError]);

  // show toast and close dialog and refetch requests
  useEffect(() => {
    if (accData?.message) {
      toast.success("User Promoted ✅");
      setOpen(false);
      onSuccess();
    }
    if (rejData?.message) {
      toast.success("Request Rejected ❌");
      setOpen(false);
      onSuccess();
    }
  }, [accData, rejData]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="lg" variant={"secondary"}>
          View Request
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] space-y-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            New Promotion Request
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8">
          <div className="grid gap-2">
            <p className="text-xl font-semibold">Requested Organizer Name</p>
            <p className="text-base opacity-80">
              {request.requested_organizer_name}
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-xl font-semibold">Why Message</p>
            <p className="text-base opacity-80">{request.why_message}</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-[50%] bg-green-300! text-black! cursor-pointer hover:opacity-70"
            variant={"outline"}
            size="lg"
            onClick={accRefetch}
            disabled={accLoading || rejLoading}
          >
            {accLoading ? "Accepting..." : "Accept Request"}
          </Button>
          <Button
            className="w-[50%] bg-red-300! text-black! cursor-pointer hover:opacity-70"
            variant={"outline"}
            size="lg"
            onClick={rejRefetch}
            disabled={accLoading || rejLoading}
          >
            {rejLoading ? "Rejecting..." : "Reject Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
