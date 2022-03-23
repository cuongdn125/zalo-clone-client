import { useEffect, useState } from "react";
import axiosClient from "api/axiosClient";

export default function useFetchData(url) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let cancel = true;
    setLoading(true);
    axiosClient
      .get(url)
      .then((res) => {
        if (!cancel) return;
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        if (!cancel) return;
        setLoading(false);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      cancel = false;
    };
  }, [url]);

  return { data, loading, error };
}
