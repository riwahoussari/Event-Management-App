import { useUser } from "@/context/UserContext";
import NotFoundPage from "./NotFoundPage";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CategoryType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function CategoriesPage() {
  const { user } = useUser();

  if (user?.account_type !== "admin") return <NotFoundPage />;

  const {
    data: categories,
    loading,
    error,
  } = useFetch<CategoryType[]>("/api/categories?detailed=true");

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Couldn't load categories.");
    }
  }, [error]);

  // Create new Category
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const {
    refetch: createNewCategory,
    data,
    error: catError,
    loading: creating,
  } = useFetch<CategoryType>(
    "/api/categories",
    { method: "POST", body: { category_name: inputValue } },
    false
  );

  const handleSubmit = () => {
    createNewCategory();
    setOpen(false);
    setInputValue("");
  };

  useEffect(() => {
    if (catError) {
      toast.error("Couldn't create category.");
    }
  }, [catError]);

  if (data && data.id) {
    window.location.reload();
  }

  return (
    <main>
      {/* title and button */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <p className="text-xl font-bold">All Categories</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="cursor-pointer" variant="default">
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-4">
            <div>
              <Label className="mb-2 text-base">Category Name</Label>
              <Input
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                type="text"
                placeholder="category name"
              />
            </div>
            <Button className="cursor-pointer" onClick={handleSubmit}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* table */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className="text-base font-medium">
              <TableHead>Category</TableHead>
              <TableHead>Total Events</TableHead>
              <TableHead>Total Registrations</TableHead>
              <TableHead>Creation Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories &&
              categories.map((cat) => (
                <TableRow key={cat.id} className="text-base">
                  <TableCell className="capitalize">
                    {cat.category_name}
                  </TableCell>
                  <TableCell>{cat.total_events}</TableCell>
                  <TableCell>{cat.total_registrations}</TableCell>
                  <TableCell>{cat.date_created}</TableCell>
                </TableRow>
              ))}
            {loading &&
              [1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
