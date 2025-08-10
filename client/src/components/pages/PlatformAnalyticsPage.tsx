import { useUser } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import NotFoundPage from "./NotFoundPage";
import Lottie from "lottie-react";
import LoadingRippleLottie from "../../assets/loading-ripple.json";
import { useEffect } from "react";
import { toast } from "sonner";
import type { PlatformStatsType } from "@/types";
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
import { getLastSixMonths } from "@/lib/utils";

export default function PlatformAnalyticsPage() {
  const { user } = useUser();
  if (user?.account_type !== "admin") return <NotFoundPage />;

  const {
    data: stats,
    loading,
    error,
  } = useFetch<PlatformStatsType>("/api/stats/platform");
  useEffect(() => {
    if (error) {
      toast.error("Couldn't load stats");
    }
  }, [error]);

  if (loading) return <Lottie animationData={LoadingRippleLottie} />;
  if (stats)
    return (
      <main >
        <div>
          <p className="text-xl font-semibold mb-10">Users Analytics</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-6 ">
              <Card className="w-[200px] ">
                <CardHeader className="items-center pb-0">
                  <CardDescription>Total Users</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    {stats.users_count}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="w-[200px] ">
                <CardHeader className="items-center pb-0">
                  <CardDescription>New Users This Month</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    {stats.new_users_this_month}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="w-[200px] ">
                <CardHeader className="items-center pb-0">
                  <CardDescription>Total Organizers</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    {stats.organizers_count}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <UsersTimelineLineChart usersPerMonth={stats.new_users_by_month} />
            <UsersGenderPieChart
              female={stats.female_users}
              male={stats.male_users}
            />
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold mb-10">Events Analytics</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-6 ">
              <Card className="w-[200px] ">
                <CardHeader className="items-center pb-0">
                  <CardDescription>Total Events</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    {stats.events_count}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="w-[200px] ">
                <CardHeader className="items-center pb-0">
                  <CardDescription>Events In The Next 30 Days</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    {stats.events_next_month}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            <div className="flex flex-col gap-6 ">
              <Card className="w-[200px] ">
                <CardHeader className="items-center pb-0">
                  <CardDescription>Total Registrations</CardDescription>
                  <CardTitle className="text-4xl font-bold">
                    {stats.registrations_count}
                  </CardTitle>
                </CardHeader>
              </Card>
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
                    {stats.attendance_rate}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <EventsByMonthBarChart
              eventsPerMonth={stats.events_count_per_month}
            />

            <EventsCategoryPieChart
              categories={stats.events_count_by_category}
            />
            <RegistrationsCategoryPieChart
              categories={stats.registrations_count_by_category}
            />
            <RegistrationsTimelineLineChart
              regPerMonth={stats.registrations_by_month}
            />
          </div>
        </div>
      </main>
    );
}

function UsersTimelineLineChart({
  usersPerMonth,
}: {
  usersPerMonth: { month: string; count: number }[];
}) {
  const last6Months = getLastSixMonths();
  const chartData = last6Months.map((month) => {
    return {
      month: month,
      users: 0,
    };
  });

  usersPerMonth.forEach((reg) => {
    if (reg.month) {
      const month = new Date(reg.month).toLocaleString("default", {
        month: "long",
      });

      // Find the matching month object in chartData
      const monthObj = chartData.find(
        (m) => m.month.toLowerCase() === month.toLowerCase()
      );
      if (monthObj) {
        monthObj.users = reg.count;
      }
    }
  });

  const chartConfig = {
    users: {
      label: "Users",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-[600px] ">
      <CardHeader>
        <CardDescription>New Users By Month</CardDescription>
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
              dataKey="users"
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

function UsersGenderPieChart({
  male,
  female,
}: {
  male: number;
  female: number;
}) {
  const chartData = [
    { gender: "male", users: male, fill: "#5BB5FF" },
    { gender: "female", users: female, fill: "#FFA3FD" },
  ];
  const chartConfig = {
    users: {
      label: "Users",
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
        <CardDescription>Users By Gender</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="users" label nameKey="gender" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EventsByMonthBarChart({
  eventsPerMonth,
}: {
  eventsPerMonth: {
    month: string;
    count: number;
  }[];
}) {
  const chartData = eventsPerMonth.map((event) => {
    return {
      count: event.count,
      month: new Date(event.month)
        .toLocaleString("default", {
          month: "long",
        })
        .slice(0, 3),
    };
  });
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardDescription>Events By Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              className="text-lg"
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EventsCategoryPieChart({
  categories,
}: {
  categories: { category_name: string; count: number }[];
}) {
  const chartData = categories.map((cat, i) => {
    return {
      category: cat.category_name,
      events: cat.count,
      fill: `var(--chart-${i + 1})`,
    };
  });
  const chartConfig: any = {
    events: {
      label: "Events",
    },
  };
  chartData.forEach((row) => {
    chartConfig[row.category] = {
      label: row.category,
    };
  });

  return (
    <Card className="flex flex-col w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardDescription>Events By Category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="events" label nameKey="category" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RegistrationsCategoryPieChart({
  categories,
}: {
  categories: { category_name: string; count: number }[];
}) {
  const chartData = categories.map((cat, i) => {
    return {
      category: cat.category_name,
      registrations: cat.count,
      fill: `var(--chart-${i + 1})`,
    };
  });
  const chartConfig: any = {
    registrations: {
      label: "Registrations",
    },
  };
  chartData.forEach((row) => {
    chartConfig[row.category] = {
      label: row.category,
    };
  });

  return (
    <Card className="flex flex-col w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardDescription>Registrations By Category</CardDescription>
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
              nameKey="category"
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
