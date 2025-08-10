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
import type { EventType } from "@/types";

export default function UserStats({ events }: { events: EventType[] }) {
  const totalAttendance = events.filter(
    (event) => event.attendance === "true"
  ).length;
  const totalActiveRegistrations = events.filter(
    (event) => event.registration_status === "active"
  ).length;
  const attendanceRate = Math.round(
    (totalAttendance / totalActiveRegistrations) * 100
  );
  return (
    <div className="flex flex-wrap gap-6">
      <RegistrationsTypeBarChart events={events} />
      <RegistrationsCategoryPieChart events={events} />
      <div className="flex flex-col gap-6">
        <Card className="w-[200px] ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Total Attendance</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {totalAttendance}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-[200px] ">
          <CardHeader className="items-center pb-0">
            <CardDescription>Attendance Rate</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {attendanceRate}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <RegistrationsTimelineLineChart events={events} />
    </div>
  );
}

function RegistrationsTypeBarChart({ events }: { events: EventType[] }) {
  const data = {
    active: 0,
    cancelled: 0,
    denied: 0,
  };
  events.forEach((event) => {
    if (event.registration_status === "active") data.active = data.active + 1;
    if (event.registration_status === "cancelled")
      data.cancelled = data.cancelled + 1;
    if (event.registration_status === "denied") data.denied = data.denied + 1;
  });
  const chartData = [
    { status: "active", registrations: data.active },
    { status: "cancelled", registrations: data.cancelled },
    { status: "denied", registrations: data.denied },
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
        <CardTitle className="text-4xl font-bold">{events.length}</CardTitle>
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

function RegistrationsCategoryPieChart({ events }: { events: EventType[] }) {
  const data: any = {};
  events.forEach((event) => {
    if (event && event.category_name) {
      if (Object.keys(data).includes(event.category_name)) {
        data[event.category_name] = data[event.category_name] + 1;
      } else {
        data[event.category_name] = 1;
      }
    }
  });
  const chartData = Object.keys(data).map((key, i) => {
    return {
      category: key,
      registrations: data[key],
      fill: `var(--chart-${i + 1})`,
    };
  });
  const chartConfig = {
    registrations: {
      label: "Registrations",
    },
  };
  chartData.forEach((row, i) => {
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

function RegistrationsTimelineLineChart({ events }: { events: EventType[] }) {
  const last6Months = getLastSixMonths();
  const chartData = last6Months.map((month) => {
    return {
      month: month,
      registrations: 0,
    };
  });

  events.forEach((event) => {
    if (event.registration_date) {
      // Parse the month number (0-11)
      const eventDate = new Date(event.registration_date);
      const eventMonthName = eventDate.toLocaleString("default", {
        month: "long",
      });

      // Find the matching month object in chartData
      const monthObj = chartData.find(
        (m) => m.month.toLowerCase() === eventMonthName.toLowerCase()
      );
      if (monthObj) {
        monthObj.registrations++;
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
