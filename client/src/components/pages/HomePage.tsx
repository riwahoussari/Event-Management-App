import { useUser } from "@/context/UserContext";
import { type CategoryType, type EventType } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import EventCard, { SkeletonCard } from "../events/EventCard";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "../ui/skeleton";

type FiltersType = {
  city: string | null;
  start_date: string | null;
  end_date: string | null;
};

export default function HomePage() {
  // fetch categories
  const { data: categories, error: catError } =
    useFetch<CategoryType[]>("/api/categories");

  // fetch posts
  const { user } = useUser();
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("closest");
  const [catFilter, setCatFilter] = useState<string[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    city: null,
    start_date: null,
    end_date: null,
  });
  const [popOpen, setPopOpen] = useState(false);
  const cityRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const applyFilters = () => {
    setFilters(() => {
      return {
        city: cityRef.current?.value || null,
        start_date: startDateRef.current?.value || null,
        end_date: endDateRef.current?.value || null,
      };
    });
    setPopOpen(false);
  };

  const clearFilters = () => {
    setFilters(() => {
      return {
        city: null,
        start_date: null,
        end_date: null,
      };
    });
    setPopOpen(false);
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (searchValue) params.append("search", searchValue);
    if (sortValue) params.append("sort", sortValue);
    if (filters.city) params.append("city", filters.city);
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (catFilter.length > 0) params.append("categories", catFilter.join(","));

    // show completed events only for admin
    if (user?.account_type === "admin") params.append("completed", "none");

    return `/api/events?${params.toString()}`;
  };

  const query = buildQueryParams();

  const { data, error } = useFetch<EventType[]>(query);

  // Show toast if there's an error
  useEffect(() => {
    if (error || catError) {
      toast.error(`Failed to load ${error ? "events" : "categories"}`, {
        description: error || catError || "Something went wrong",
      });
    }
  }, [error, catError]);

  return (
    <main>
      {/* search - filter - sort - categories */}
      <div>
        <div className="flex flex-wrap gap-4">
          {/* search bar */}
          <div className="w-full">
            <Label>
              <p className="opacity-80 ms-1 mb-1">Search: </p>
            </Label>
            <Input
              onChange={(e) => setSearchValue(e.target.value)}
              className="max-w-96 w-full "
              name="search"
              placeholder="by title or organizer name"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
          {/* sort select */}
            <div>
              <Label>
                <p className="opacity-80 ms-1 mb-1">Sort:</p>
              </Label>
              <Select onValueChange={setSortValue} defaultValue="closest">
                <SelectTrigger>
                  <SelectValue placeholder="Sort" defaultValue="closest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="closest">Nearest Date</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="deadline">Nearset Deadline</SelectItem>
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
                  {/* city */}
                  <div className="mb-5">
                    <Label>
                      <p className="text-base mb-0.5 ms-1 font-normal ">City</p>
                    </Label>
                    <Input
                      ref={cityRef}
                      defaultValue={filters.city || ""}
                      placeholder="city"
                      type="text"
                    />
                  </div>
                  {/* start date */}
                  <div className="mb-5">
                    <Label>
                      <p className="text-base mb-0.5 ms-1 font-normal ">
                        Starts After
                      </p>
                    </Label>
                    <Input
                      ref={startDateRef}
                      defaultValue={filters.start_date || ""}
                      placeholder="city"
                      type="date"
                    />
                  </div>
                  {/* end date */}
                  <div className="mb-5">
                    <Label>
                      <p className="text-base mb-0.5 ms-1 font-normal ">
                        Ends Before
                      </p>
                    </Label>
                    <Input
                      ref={endDateRef}
                      defaultValue={filters.end_date || ""}
                      placeholder="city"
                      type="date"
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

        {/* categories */}
        <ToggleGroup
          onValueChange={setCatFilter}
          type="multiple"
          className="mt-6 flex-wrap "
        >
          {categories ? (
            categories.map((cat) => (
              <ToggleGroupItem
                variant="outline"
                className="rounded-full! capitalize font-medium text-foreground/80 px-6 min-w-[110px]! max-w-[110px] border-2! text-base sm:text-lg m-1.5 cursor-pointer"
                key={cat.id}
                value={cat.id.toString()}
              >
                {cat.category_name}
              </ToggleGroupItem>
            ))
          ) : (
            <Skeleton className="h-8 w-20 rounded-full" />
          )}
        </ToggleGroup>
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
                suspended={
                  user.account_type !== "regular" ? event.suspended : undefined
                }
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
