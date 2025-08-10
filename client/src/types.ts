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
  registration_status?: "active" | "cancelled" | "denied";
  registration_date?: string;
  attendance?: null | "true" | "false";
  user_registration_status?: null | "active" | "cancelled" | "denied";
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
  total_registrations?: number;
  total_events?: number;
};

export type OrganizerStatsType = {
  attendance_rate: number;
  avg_attendants_per_event: number;
  avg_registrants_per_event: number;
  conversion_rate: number;
  events_per_category: { category_name: string; count: number }[];
  registrations_last_6_months: { month: string; count: number }[];
  total_active_registrations: number;
  total_attendants: number;
  total_cancelled_registrations: number;
  total_denied_registrations: number;
  total_events: number;
  total_likes: number;
  total_registrations: number;
  total_views: number;
  female_registrations: number;
  male_registrations: number;
};

export type EventStatsType = {
  attendance_rate: number;
  conversion_rate: number;
  registrations_last_6_months: { month: string; count: number }[];
  total_registrations: number;
  total_active_registrations: number;
  total_cancelled_registrations: number;
  total_denied_registrations: number;
  total_attendants: number;
  total_likes: number;
  total_views: number;
  female_registrations: number;
  male_registrations: number;
};

export type PlatformStatsType = {
  users_count: number;
  new_users_this_month: number;
  organizers_count: number;
  new_users_by_month: {
    month: string;
    count: number;
  }[];
  female_users: number;
  male_users: number;
  events_count: number;
  events_next_month: number;
  registrations_count: number;
  total_attendants: number;
  attendance_rate: number;
  events_count_per_month: [
    {
      month: string;
      count: number;
    }
  ];
  events_count_by_category: [
    {
      category_name: string;
      count: number;
    }
  ];
  registrations_count_by_category: [
    {
      category_name: string;
      count: number;
    }
  ];
  registrations_by_month: [
    {
      month: string;
      count: number;
    }
  ];
};

export type PromotionRequestType = {
  fullname?: string;
  profile_pic?: string;
  user_id?: number;
  status?: "pending" | "accepted" | "rejected";
  request_date?: string;
  requested_organizer_name?: string;
  why_message?: string;
};

export type RegistrationType = {
  user_id?: number;
  event_id?: number;
  registration_date?: string;
  status?: "cancelled" | "active" | "denied";
  attendance?: "true" | "false" | null;
  id?: number;
  fullname?: string;
  email?: string;
  phone_number?: string;
  profile_pic?: string;
};
