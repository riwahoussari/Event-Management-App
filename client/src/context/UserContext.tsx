import type { UserType } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const delay = 200;

const UserContext = createContext<{
  user: UserType | null;
  loading: boolean | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>> | null;
}>({ user: null, loading: null, setUser: null });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/validate-user", {
      credentials: "include", // ensure cookies are sent
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, delay);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
