import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function HomePage() {
  const { auth } = useUser();
  const navigate = useNavigate();
  function logout() {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Server response not ok. Please try again");
        } else if (res.status === 200) {
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify({ auth: false, user: {} })
          );
          navigate("./", { replace: true });
        }
        return res.json();
      })
      .then(({ error }) => {
        console.log(error);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return auth ? (
    <nav>
      <button onClick={logout}>Logout</button>
    </nav>
  ) : (
    <nav>
      <Link to="/register">Register</Link>
      <Link to="login">Login</Link>
    </nav>
  );
}
