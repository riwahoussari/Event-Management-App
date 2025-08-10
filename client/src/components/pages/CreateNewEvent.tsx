import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import NotFoundPage from "./NotFoundPage";
import type { CategoryType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { COUNTRIES } from "@/lib/constants";
import { Label } from "../ui/label";

// Edit Event Settings Tab
export function CreateEventPage() {
  const { user } = useUser();
  if (user?.account_type !== "organizer") return <NotFoundPage />;
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [eventBannerUrl, setEventBannerUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [registrationTime, setRegistrationTime] = useState("");
  const [cancellationDate, setCancellationDate] = useState("");
  const [cancellationTime, setCancellationTime] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const { data, loading, error, refetch } = useFetch<{ message?: string }>(
    `/api/events`,
    {
      method: "POST",
      body: {
        event_banner: eventBannerUrl,
        title,
        category,
        description,
        city,
        country,
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

  const { data: categories, error: catError } =
    useFetch<CategoryType[]>("/api/categories");

  useEffect(() => {
    if (error || catError) {
      toast.error(
        catError ? "couldn't load categories" : "Something Went Wrong!"
      );
    }
    if (data?.message) {
      toast.success("Event Created!");
      navigate("/my-events");
    }
  }, [error, data, catError]);

  async function handleSubmit() {
    try {
      // If a file is selected, upload to Cloudinary
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "my_unsigned_preset");

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/dlgft1vm9/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudRes.ok) throw new Error("Image upload failed");

        const cloudData = await cloudRes.json();
        setEventBannerUrl(cloudData.secure_url);
        refetch();
      }
    } catch (err) {
      toast.error("Couldn't upload Event Banner.");
    }
  }

  return (
    <main>
      <div className="space-y-14">
        <Button size={"lg"} onClick={handleSubmit}>
          {loading ? "Creating Event..." : "Create Event"}
        </Button>
        <div className="flex flex-wrap gap-10 justify-between">
          {/* col 1 */}
          <div className="flex flex-col gap-12 min-w-[300px] max-w-[600px] w-[28%]">
            <div className="space-y-1">
              <Label className="text-xl font-normal">Event Banner</Label>

              <Input
                className="bg-cover bg-center bg-foreground/20 w-full aspect-16/9 rounded-lg"
                name="profile_pic"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedImage(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-8">
              <div className="space-y-1 cursor-not-allowed">
                <Label className="text-xl font-normal">Category</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories &&
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.category_name}
                        </SelectItem>
                      ))}
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 cursor-not-allowed">
                <Label className="text-xl font-normal">Title</Label>
                <Input
                  className=" text-lg! py-5!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xl font-normal">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className=" text-base! py-2!"
                />
              </div>
            </div>
          </div>

          {/* col 2 */}
          <div className="flex flex-col gap-12 min-w-[300px] max-w-[600px] w-[28%]">
            <div className="flex flex-col gap-8">
              {/* location */}
              <div className="flex flex-col gap-4">
                <Label className="text-xl font-normal">Location</Label>

                <div className="flex gap-3 sm:gap-5">
                  <div className="space-y-1 cursor-not-allowed">
                    <Label className="text-base font-normal">Country</Label>
                    <Select onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 cursor-not-allowed">
                    <Label className="text-base font-normal">City</Label>
                    <Input
                      className=" text-lg! py-5!"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1 cursor-not-allowed">
                  <Label className="text-base font-normal">Full Address</Label>
                  <Input
                    className=" text-lg! py-5!"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
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
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      type="date"
                    />
                  </div>
                  <div className="space-y-1 cursor-not-allowed w-full">
                    <Label className="text-base font-normal">Start Time</Label>
                    <Input
                      className=" text-lg! py-5!"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                    />
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-5">
                  <div className="space-y-1 cursor-not-allowed w-full max-w-[45vw]">
                    <Label className="text-base font-normal">End Date</Label>
                    <Input
                      className=" text-lg! py-5!"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      type="date"
                    />
                  </div>
                  <div className="space-y-1 cursor-not-allowed w-full">
                    <Label className="text-base font-normal">End Time</Label>
                    <Input
                      className=" text-lg! py-5!"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      type="time"
                    />
                  </div>
                </div>
              </div>

              {/* tags */}
              <div className="flex flex-col gap-4">
                <Label className="text-xl font-normal">Tags</Label>
                <div className="flex gap-3 flex-wrap items-start">
                  {tags.map((tag, i) => (
                    <div
                      key={i}
                      className="flex capitalize gap-3 text-xl! rounded-full py-2 px-4  bg-foreground/20"
                    >
                      <p>{tag}</p>

                      <p
                        onClick={() => setTags(tags.filter((_, j) => j != i))}
                        className="w-8 h-8 text-center bg-foreground/20 rounded-full hover:bg-red-500 cursor-pointer"
                      >
                        X
                      </p>
                    </div>
                  ))}
                  {tags.length < 5 && (
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
          <div className="flex flex-col gap-12 min-w-[300px] max-w-[600px] w-[28%]">
            <div className="flex flex-col gap-8">
              {/* Max Capacity */}
              <div className="space-y-1 cursor-not-allowed">
                <Label className="text-xl font-normal">Max Capacity</Label>
                <Input
                  className=" text-lg! py-5!"
                  type="number"
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
                      value={registrationDate}
                      onChange={(e) => setRegistrationDate(e.target.value)}
                      type="date"
                    />
                  </div>
                  <div className="space-y-1 cursor-not-allowed w-full">
                    <Label className="text-base font-normal">Time</Label>
                    <Input
                      className=" text-lg! py-5!"
                      value={registrationTime}
                      onChange={(e) => setRegistrationTime(e.target.value)}
                      type="time"
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
                      value={cancellationDate}
                      onChange={(e) => setCancellationDate(e.target.value)}
                      type="date"
                    />
                  </div>
                  <div className="space-y-1 cursor-not-allowed w-full">
                    <Label className="text-base font-normal">Time</Label>
                    <Input
                      className=" text-lg! py-5!"
                      value={cancellationTime}
                      onChange={(e) => setCancellationTime(e.target.value)}
                      type="time"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
