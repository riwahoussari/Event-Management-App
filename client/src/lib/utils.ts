import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLastSixMonths() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const result = [];
  const currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentDate.getMonth() - i + 12) % 12;
    result.unshift(monthNames[monthIndex]);
  }

  return result;
}

export function getAge(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;

  // Check if birthday has occurred this year yet
  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) {
    age--;
  }

  return age;
}

export function formatEventTime(
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string
) {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  const formatDate = (date: Date) => {
    return date
      .toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""); // Remove comma after day of week
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (start.toDateString() === end.toDateString()) {
    return `${formatDate(start)} →  ${formatTime(end)}`;
  } else {
    return `${formatDate(start)} →  ${formatDate(end)}`;
  }
}

export function hasPassed(dateStr: string) {
  // Parse the input date string into a Date object
  const inputDate = new Date(dateStr + "T00:00:00"); // Avoids timezone shift issues
  const today = new Date();

  // Set today to midnight to compare only the date, not time
  today.setHours(0, 0, 0, 0);

  // Return true if the input date is before today
  return inputDate < today;
}
