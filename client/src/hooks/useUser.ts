import { useState, useEffect } from "react";

export function useUser() {
  const [userInfo, setUserInfo] = useState<{
    auth: boolean | null;
    user: any;
    isPending: boolean;
  }>({
    auth: null,
    user: null,
    isPending: true,
  });

  useEffect(() => {
    if (!("userInfo" in sessionStorage)) {
      fetch(`http://localhost:5000/api/auth/validate-user`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw Error("could not check user authentication");
          }
          if (res.status === 401 || res.status === 403) {
            setUserInfo({ auth: false, user: {}, isPending: false });
          } else if (res.status === 200) {
            setUserInfo({ auth: true, user: {}, isPending: false });
            sessionStorage.setItem(
              "userInfo",
              JSON.stringify({ auth: true, user: {} })
            );
          }
        })
        .catch((err) => {
          setUserInfo({ auth: null, user: null, isPending: false });
          console.log(err.message);
        });
    } else {
      let storedUserInfo = sessionStorage.getItem("userInfo");
      setUserInfo({ ...JSON.parse(storedUserInfo), isPending: false });
    }
  }, []);

  return userInfo;
}
