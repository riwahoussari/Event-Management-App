import { useUser } from "@/context/UserContext";
import Lottie from "lottie-react";
import LoadingRippleLottie from "../../assets/loading-ripple.json";
import type { EventType, PromotionRequestType, UserType } from "@/types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserStats from "../Stats/UserStats";
import NotFoundPage from "../pages/NotFoundPage";
import OrganizerStats from "../Stats/OrganizerStats";

export default function SelfProfile() {
  const { user, loading } = useUser();

  if (loading) return <Lottie animationData={LoadingRippleLottie} />;

  if (user?.account_type === "regular") return <RegularSelfProfile />;
  if (user?.account_type === "organizer") return <OrganizerSelfProfile />;
  if (user?.account_type === "admin") return <NotFoundPage />;
}

function RegularSelfProfile() {
  const { user } = useUser();
  // fetch the events that the user is registered to
  const { data: registeredEvents } = useFetch<EventType[]>(
    `/api/events?registerId=${user?.id}&completed=none`
  );

  return (
    <main>
      {/* accout info */}
      <div className="flex flex-wrap flex-1 gap-20 justify-between">
        <UserProfileInfo />
        <PromotionRequestForm />
      </div>
      <div className="mt-20">
        <p className="text-2xl font-semibold mb-4 ">My Activity</p>
        {registeredEvents && <UserStats events={registeredEvents} />}
      </div>
    </main>
  );
}

function UserProfileInfo() {
  const { user } = useUser();

  // fetch profile info
  const {
    data: userInfo,
    loading,
    error,
  } = useFetch<UserType>(`/api/users/${user?.id}`);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Couldn't load profile info.");
    }
  }, [error]);

  // editing profile info
  const infoFormRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    gender: userInfo?.gender || null,
    phone_number: userInfo?.phone_number || null,
    birthday: userInfo?.birthday || null,
    profile_pic: userInfo?.profile_pic || null,
  });
  const [editing, setEditing] = useState(false);
  const {
    data: updateRes,
    error: updateErr,
    loading: savingChanges,
    refetch: updateUserInfo,
  } = useFetch<{ message?: string; error?: string }>(
    `/api/users/${user?.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    },
    false
  );

  // Show toast if there's an error
  useEffect(() => {
    if (updateErr) {
      toast.error("Couldn't update profile info.");
    }
  }, [updateErr]);

  // Show succes toast on update
  useEffect(() => {
    if (updateRes?.message) {
      toast.success("Profile Info Updated Successfully.");
    }
  }, [updateRes]);

  const handleEditClick = () => {
    setEditing((prev) => !prev);
    const formValues = infoFormRef.current && new FormData(infoFormRef.current);

    if (editing) {
      setFormData({
        phone_number: formValues?.get("phone_number") as string | null,
        birthday: formValues?.get("birthday") as string | null,
        gender: formValues?.get("gender") as "female" | "male" | null,
        profile_pic: formValues?.get("profile_pic") as string | null,
      });
    }
  };

  useEffect(() => {
    if (
      formData.birthday !== userInfo?.birthday ||
      formData.gender !== userInfo.gender ||
      formData.phone_number !== userInfo.phone_number ||
      formData.profile_pic !== userInfo.profile_pic
    ) {
      if (
        formData.birthday !== null ||
        formData.gender !== null ||
        formData.phone_number !== null ||
        formData.profile_pic !== null
      ) {
        updateUserInfo();
      }
    }
  }, [
    formData.birthday,
    formData.gender,
    formData.phone_number,
    formData.profile_pic,
  ]);

  if (!userInfo) return <Lottie animationData={LoadingRippleLottie} />;
  if (!loading && !error)
    return (
      <div className="flex flex-col gap-12 sm:min-w-[400px]">
        <p className="text-2xl font-semibold max-w-[400px]">
          Personal Informatoin
        </p>
        <img
          className="w-[200px] h-[200px] bg-foreground/20 rounded-xl bg-center bg-cover"
          style={{ backgroundImage: "url(/profile-pic-placeholder.png)" }}
          src={userInfo.profile_pic || ""}
          alt={userInfo.fullname + "profile picture."}
        />
        <form ref={infoFormRef} className="space-y-6 max-w-[400px]">
          <div className="space-y-1">
            <Label className="text-lg opacity-80">Full Name</Label>
            <Input
              name="fullname"
              className="text-lg! p-4"
              type="text"
              disabled
              defaultValue={userInfo.fullname}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-lg opacity-80">Email</Label>
            <Input
              name="email"
              className="text-lg! p-4"
              type="email"
              disabled
              defaultValue={userInfo.email}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-lg opacity-80">Phone Number</Label>
            <Input
              name="phone_number"
              className="text-lg! p-4"
              type="tel"
              disabled={!editing}
              defaultValue={userInfo.phone_number || ""}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-lg opacity-80">Gender</Label>
            <Select
              name="gender"
              disabled={!editing}
              defaultValue={userInfo.gender}
            >
              <SelectTrigger className="text-lg! p-4 ">
                <SelectValue
                  className="text-lg! p-4 "
                  placeholder="Gender"
                  defaultValue={userInfo.gender}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-lg! p-4 " value="male">
                  Male
                </SelectItem>
                <SelectItem className="text-lg! p-4 " value="female">
                  Female
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-lg opacity-80">Birthday</Label>
            <Input
              name="birthday"
              className="text-lg! p-4"
              type="date"
              disabled={!editing}
              defaultValue={userInfo.birthday || ""}
            />
          </div>
          <Button
            type="button"
            size={"lg"}
            variant={editing ? "default" : "outline"}
            className={editing ? "" : "bg-foreground! text-background!"}
            onClick={handleEditClick}
          >
            {savingChanges
              ? "Updating..."
              : editing
              ? "Save Changes"
              : "Edit Profile Info"}
          </Button>
        </form>
      </div>
    );
}

function PromotionRequestForm() {
  const { user } = useUser();

  // Submit Promotion Request
  let { data: pendingRequest } = useFetch<PromotionRequestType>(
    `/api/promotion-requests/${user?.id}`
  );
  const [whyMessage, setWhyMessage] = useState("");
  const [reqOrgName, setReqOrgName] = useState("");
  const {
    data: applyRes,
    error: applyErr,
    refetch: apply,
    loading: applyLoading,
  } = useFetch<{ message?: string; error?: string }>(
    "/api/promotion-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { why_message: whyMessage, requested_organizer_name: reqOrgName },
    },
    false
  );

  // Show toast if there's an error
  useEffect(() => {
    if (applyErr) {
      toast.error("Couldn't submit request.");
    }
  }, [applyErr]);

  // Show succes toast on update
  useEffect(() => {
    if (applyRes?.message) {
      toast.success("Profile Info Updated Successfully.");
      window.location.reload();
    }
  }, [applyRes]);

  return (
    <div className="flex flex-col gap-12  sm:min-w-[400px]">
      <p className="text-2xl font-semibold max-w-[400px]">
        Apply to become an Organizer
      </p>
      {pendingRequest?.why_message && (
        <p className="text-base font-normal opacity-80">
          You already have a pending promotion request
        </p>
      )}
      <form className="space-y-6 max-w-[400px]">
        <div className="space-y-1">
          <Label className="text-base font-normal opacity-80">
            Organizer Name
          </Label>
          <Input
            onChange={(e) => setReqOrgName(e.target.value)}
            value={pendingRequest?.requested_organizer_name || reqOrgName}
            className="text-lg! p-4"
            type="text"
            placeholder="request a name"
            name="requested_organizer_name"
            disabled={!!pendingRequest?.requested_organizer_name}
            defaultValue={pendingRequest?.requested_organizer_name || ""}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-base font-normal opacity-80">
            Tell us about you and why you want to become an event organizer.
          </Label>
          <Textarea
            onChange={(e) => setWhyMessage(e.target.value)}
            value={pendingRequest?.why_message || whyMessage}
            name="why_message"
            disabled={!!pendingRequest?.why_message}
            defaultValue={pendingRequest?.why_message || ""}
          />
        </div>
        {!pendingRequest?.why_message && (
          <Button
            type="button"
            variant={
              whyMessage == "" ||
              reqOrgName == "" ||
              whyMessage == null ||
              reqOrgName == null
                ? "outline"
                : "default"
            }
            onClick={apply}
            disabled={
              whyMessage == "" ||
              reqOrgName == "" ||
              whyMessage == null ||
              reqOrgName == null
            }
          >
            {applyLoading ? "Submitting..." : "Apply"}
          </Button>
        )}
      </form>
    </div>
  );
}

function OrganizerSelfProfile() {
  const { user } = useUser();
  // fetch the events that the user is registered to
  const { data: registeredEvents } = useFetch<EventType[]>(
    `/api/events?registerId=${user?.id}&completed=none`
  );

  const [selectedTab, setSelectedTab] = useState("regular");

  return (
    <main>
      {/* accout info */}
      <div className="flex flex-wrap gap-20 justify-between">
        <UserProfileInfo />
      </div>
      <div className="mt-20 space-y-8">
        <p className="text-2xl font-semibold ">My Activity As</p>

        <Tabs
          onValueChange={setSelectedTab}
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

        {registeredEvents && selectedTab === "regular" && (
          <UserStats events={registeredEvents} />
        )}
        {user && selectedTab === "organizer" && (
          <OrganizerStats userId={user.id} />
        )}
      </div>
    </main>
  );
}
