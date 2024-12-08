import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Delete, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const Linkcard = ({ url, fetchUrls }) => {
  const downloadImage = async () => {
    try {
      const response = await fetch(url.qr); // Fetch the image
      const blob = await response.blob(); // Convert to a Blob
      const urlBlob = URL.createObjectURL(blob); // Create a blob URL

      const anchor = document.createElement("a");
      anchor.href = urlBlob;
      anchor.download = `${url.title || "download"}.png`; // Add file extension
      anchor.click();

      URL.revokeObjectURL(urlBlob); // Cleanup the blob URL
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  //Base URL : It will be the URL of the server where the app is hosted
  const baseUrl = import.meta.env.VITE_BASE_URL;

  return (
    <div className=" flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="QR-code"
        className="h-32 object-contain ring ring-blue-500 self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer truncate">
          {baseUrl}/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer truncate">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-2">
        <Button
          onClick={() =>
            navigator.clipboard.writeText(`${baseUrl}/${url?.short_url}`)
          }
        >
          <Copy />
        </Button>
        <Button onClick={downloadImage}>
          <Download />
        </Button>
        <Button onClick={() => fnDelete().then(() => fetchUrls())}>
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default Linkcard;
