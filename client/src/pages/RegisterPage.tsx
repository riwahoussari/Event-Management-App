import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const fullnameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    formRef.current?.addEventListener("submit", (e) => {
      e.preventDefault();

      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullname: fullnameRef.current?.value,
          email: emailRef.current?.value,
          password: emailRef.current?.value,
          gender: "female",
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw Error("Server response not ok. Please try again");
          } else if (res.status === 201) {
            sessionStorage.setItem(
              "userInfo",
              JSON.stringify({ auth: true, user: {} })
            );
            navigate("../", { replace: true });
          }
          return res.json();
        })
        .then(({ error }) => {
          console.log(error);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  return (
    <>
      <h1>Register</h1>
      <form ref={formRef}>
        <input ref={fullnameRef} type="text" placeholder="fullname" />
        <input ref={emailRef} type="email" placeholder="email" />
        <input ref={passRef} type="text" placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
