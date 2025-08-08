type navLink = { text: string; link: string };

const REGULAR_USER_LINKS: navLink[] = [
  { text: "Home", link: "/" },
  { text: "Favorites", link: "/favorites" },
  { text: "Registrations", link: "/registrations" },
];

const ORGANIZER_LINKS: navLink[] = [
  { text: "Home", link: "/" },
  { text: "Favorites", link: "/favorites" },
  { text: "Registrations", link: "/registrations" },
  { text: "My Events", link: "my-events" },
];

const ADMIN_LINKS: navLink[] = [
  { text: "Events", link: "/" },
  { text: "Users", link: "/all-users" },
  { text: "Categories", link: "/categories" },
  { text: "Platform Analytics", link: "/platfrom-analytics" },
];

export const GUEST_NAV_LINKS: navLink[] = [
  { text: "Register", link: "/register" },
  { text: "Login", link: "/login" },
];

export const USER_NAV_LINKS = {
  regular: REGULAR_USER_LINKS,
  organizer: ORGANIZER_LINKS,
  admin: ADMIN_LINKS,
};