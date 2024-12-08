import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);

  const { loading, data, fn } = useFetch(getLongUrl, id);

  useEffect(() => {
    if (!id) {
      setError("Invalid URL");
      return;
    }
    fn();
  }, [id]);

  useEffect(() => {
    if (!loading && data?.original_url) {
      storeClicks({
        id: data.id,
        originalUrl: data.original_url,
      });
    }
  }, [loading, data]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;
