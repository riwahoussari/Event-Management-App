import { useEffect, useState } from "react";

interface FetchOptions extends RequestInit {
  body?: any;
}

const delay = 0;

export function useFetch<T>(
  url: string,
  options?: FetchOptions,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
        credentials: "include", // if you're using cookies
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "An error occurred");
      }

      setTimeout(() => {
        setData(result);
      }, delay);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setData(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  };

  useEffect(() => {
    if (immediate) fetchData();
  }, [url]);

  return { data, error, loading, refetch: fetchData };
}
