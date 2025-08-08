export type UserType = {
  id: number;
  account_type: "regular" | "organizer" | "admin";
  account_status?: "active" | "suspended";
  date_joined?: string; // format 'YYYY-MM-DD'
  profile_pic?: string | null;
  fullname?: string;
  gender?: "female" | "male";
  email?: string;
  phone_number?: string | null;
  birthday?: string | null; // format 'YYYY-MM-DD'
  organizer_name?: string | null;
  promotion_date?: string | null; // format 'YYYY-MM-DD'
};

export function isValidDateString(value: string): boolean {
  // Check format: YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) return false;

  // Check if it's a real date
  const date = new Date(value);
  const [year, month, day] = value.split("-").map(Number);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

export type EventType = {
  id: number;
  organizer_id?: number;
  organizer_name?: string;
  organizer_profile_pic?: string;
  date_created?: string;
  event_banner?: string;
  category?: string;
  category_name?: string;
  title?: string;
  description?: string;
  country?: string;
  city?: string;
  full_address?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  tags?: string;
  max_capacity?: number;
  registration_deadline_date?: string;
  registration_deadline_time?: string;
  cancellation_deadline_date?: string;
  cancellation_deadline_time?: string;
  views_count?: number;
  status?: "active" | "cancelled" | "deleted";
  suspended?: "true" | "false";
  isLikedByUser?: boolean;
  registration_status?: "active" | "canceled" | "denied";
};

const monthsMMM = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

// date format 'YYYY-MM-DD'
export function formatDate(date: string, format: "MMM DD") {
  if (format === "MMM DD") {
    const splitDate = date.split("-");
    const month = monthsMMM[parseInt(splitDate[1]) - 1];
    const day = splitDate[2];

    return `${month} ${day}`;
  }
}

export type CategoryType = {
  id: number;
  category_name: string;
  date_created?: string;
};
