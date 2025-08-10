import { useFetch } from "@/hooks/useFetch";
import { useEffect } from "react";
import { toast } from "sonner";
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
import type {  OrganizerStatsType } from "@/types";

export default function ({ userId }: { userId: number }) {
  const {
    data: stats,
    error,
  } = useFetch<OrganizerStatsType>(`/api/users/${userId}/organizer-stats`);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load user's registrations", {
        description: error || "Something went wrong",
      });
    }
  }, [error]);

  if (!stats) return <>no stats available</>;

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-6">
        <Card className="w-[200px] ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Total Events</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {stats.total_events}
            </CardTitle>
          </CardHeader>
        </Card>
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
      </div>

      {stats.events_per_category && (
        <RegistrationsCategoryPieChart categories={stats.events_per_category} />
      )}

      <RegistrationsTypeBarChart
        total={stats.total_registrations}
        active={stats.total_active_registrations}
        cancelled={stats.total_cancelled_registrations}
        denied={stats.total_denied_registrations}
      />

      <div className="flex flex-col gap-6">
        <Card className="w-[200px] ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Avg Registrants Per Event</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {stats.avg_registrants_per_event}
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

      <RegistrationsGenderPieChart
        male={stats.male_registrations}
        female={stats.female_registrations}
      />

      <RegistrationsTimelineLineChart
        regPerMonth={stats.registrations_last_6_months}
      />

      <div className="flex flex-col gap-6">
        <Card className="w-[200px] ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Avg Attendants Per Event</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {stats.avg_attendants_per_event}
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
        <Card className="w-[200px] ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Total Attendants</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {stats.total_attendants}
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
