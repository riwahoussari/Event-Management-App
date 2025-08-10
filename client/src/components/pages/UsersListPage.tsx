import { useUser } from "@/context/UserContext";
import NotFoundPage from "./NotFoundPage";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useFetch } from "@/hooks/useFetch";
import type { UserType } from "@/types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getAge } from "@/lib/utils";
import { Link } from "react-router-dom";

type FiltersType = {
  gender: string | null;
  max_age: number | string | null;
  min_age: number | string | null;
};

export default function UsersListPage() {
  const { user } = useUser();
  if (user?.account_type !== "admin") return <NotFoundPage />;

  // search
  const [searchValue, setSearchValue] = useState("");

  // sort
  const sortOptions = [
    "date_joined_most_recent",
    "date_joined_oldest",
    "alphabetical_a_z",
    "alphabetical_z_a",
    "age_oldest",
    "age_yougest",
  ];
  const [sortValue, setSortValue] = useState("date_joined_most_recent");

  // filter
  const [filters, setFilters] = useState<FiltersType>({
    gender: null,
    max_age: null,
    min_age: null,
  });
  const [popOpen, setPopOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const minAgeRef = useRef<HTMLInputElement>(null);
  const maxAgeRef = useRef<HTMLInputElement>(null);

  const applyFilters = () => {
    setFilters(() => {
      return {
        gender: selectRef.current?.value || null,
        min_age: minAgeRef.current?.value || null,
        max_age: maxAgeRef.current?.value || null,
      };
    });
    setPopOpen(false);
  };

  const clearFilters = () => {
    setFilters(() => {
      return {
        gender: null,
        min_age: null,
        max_age: null,
      };
    });
    setPopOpen(false);
  };

  // tabs
  const [role, setRole] = useState("regular");

  // fetch users
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    params.append("role", role);
    if (searchValue) params.append("search", searchValue);
    if (sortValue) params.append("sort", sortValue);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.max_age) params.append("max_age", filters.max_age.toString());
    if (filters.min_age) params.append("min_age", filters.min_age.toString());

    return `/api/users?${params.toString()}`;
  };

  const query = buildQueryParams();

  const { data, error } = useFetch<UserType[]>(query);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load users`, {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  return (
    <main>
      {/* search - filter - sort - categories */}
      <div>
        <div className="flex flex-wrap gap-4">
          {/* search bar */}
          <div>
            <Label>
              <p className="opacity-80 ms-1 mb-1">Search: </p>
            </Label>
            <Input
              onChange={(e) => setSearchValue(e.target.value)}
              className="max-w-96 w-full "
              name="search"
              placeholder={
                role === "regular"
                  ? "by fullname/phone/email"
                  : "by organizerName/fullname/phone/email"
              }
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {/* sort select */}
            <div>
              <Label>
                <p className="opacity-80 ms-1 mb-1">Sort:</p>
              </Label>
              <Select
                onValueChange={setSortValue}
                defaultValue="date_joined_most_recent"
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Sort"
                    defaultValue="date_joined_most_recent"
                  />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.split("_").join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* filter Dialog */}
            <div>
              <Label>
                <p className="opacity-80 ms-1 mb-1">Filter:</p>
              </Label>

              <Dialog open={popOpen} onOpenChange={setPopOpen}>
                <DialogTrigger>
                  <Button variant="outline" className="font-normal">
                    Select Filters
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* gender */}
                  <div className="mb-5">
                    <Label>
                      <p className="text-base mb-0.5 ms-1 font-normal ">
                        Gender
                      </p>
                    </Label>

                    <Select
                      name="gender"
                      defaultValue={filters.gender || ""}
                      ref={selectRef}
                    >
                      <SelectTrigger className="text-lg! p-4 ">
                        <SelectValue
                          className="text-lg! p-4 "
                          placeholder="Gender"
                          defaultValue={filters.gender || ""}
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

                  {/* min age */}
                  <div className="mb-5">
                    <Label>
                      <p className="text-base mb-0.5 ms-1 font-normal ">
                        Min Age
                      </p>
                    </Label>
                    <Input
                      ref={minAgeRef}
                      defaultValue={filters.min_age || 0}
                      placeholder="Min Age"
                      type="number"
                    />
                  </div>

                  {/* max age */}
                  <div className="mb-5">
                    <Label>
                      <p className="text-base mb-0.5 ms-1 font-normal ">
                        Max Age
                      </p>
                    </Label>
                    <Input
                      ref={maxAgeRef}
                      defaultValue={filters.max_age || 0}
                      placeholder="Max Age"
                      type="number"
                    />
                  </div>

                  <div className="flex gap-5">
                    <Button onClick={applyFilters}>Apply Filters</Button>
                    <Button onClick={clearFilters} variant={"outline"}>
                      Clear Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        onValueChange={setRole}
        defaultValue="regular"
        className="max-w-[400px] w-full"
      >
        <TabsList className="h-12">
          <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="regular">
            Regular
          </TabsTrigger>
          <TabsTrigger className="sm:text-lg sm:p-4 p-3" value="organizer">
            Organizer
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-10">
        {data && data.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </main>
  );
}

function UserCard({ user }: { user: UserType }) {
  const [accountStatus, setAccountStatus] = useState<
    "active" | "suspended" | null
  >(user.account_status || null);

  let fetchUrl = `/api/users/${user.id}/${
    accountStatus === "active" ? "suspend" : "activate"
  }`;

  const { data, loading, error, refetch } = useFetch<{ message?: string }>(
    fetchUrl,
    { method: "PATCH" },
    false
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to update account status`, {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  // Show toast on success
  useEffect(() => {
    if (data?.message) {
      toast.success(`Updated account status`);
      setAccountStatus((prev) => {
        if (prev === "active") return "suspended";
        else return "active";
      });
    }
  }, [data?.message]);

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <div className="flex gap-2 items-center text-xl">
          <img
            src={user.profile_pic || "/profile-pic-placeholder.png"}
            style={{
              backgroundImage: "url('/profile-pic-placeholder.png')",
            }}
            className="w-14 h-14 rounded-full bg-foreground/20 bg-center bg-cover"
          />
          <div>
            {user.account_type === "organizer" && (
              <CardTitle>{user.organizer_name}</CardTitle>
            )}
            {user.account_type === "regular" && (
              <CardTitle>{user.fullname}</CardTitle>
            )}
            <CardDescription
              className={
                accountStatus === "active" ? "text-green-500" : "text-red-500"
              }
            >
              {accountStatus}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2 flex-col text-base">
          {user.account_type === "organizer" && (
            <p>
              <span className="opacity-70">Fullname: </span>
              {user.fullname}
            </p>
          )}
          <p>
            <span className="opacity-70">Gender: </span>
            {user.gender}
          </p>
          <p>
            <span className="opacity-70">Phone: </span>
            {user.phone_number}
          </p>
          <p>
            <span className="opacity-70">Email: </span>
            {user.email}
          </p>
          <p>
            <span className="opacity-70">Age: </span>
            {user.birthday && getAge(user.birthday)}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex flex-col gap-2 w-full">
          <Link to={`/profile/${user.id}`}>
            <Button
              size="lg"
              className="bg-foreground! text-background! w-full"
            >
              Check Profile
            </Button>
          </Link>
          <Button onClick={refetch} size="lg" variant={"secondary"}>
            {loading
              ? "updating..."
              : accountStatus === "active"
              ? "Suspend Account"
              : "Reactivate Account"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
