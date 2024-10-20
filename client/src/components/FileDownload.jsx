import axios from "axios";

import React from "react";

const FileDownloads = () => {
  const handleClick = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:4000/file-download", {
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <h1>File Download Page</h1>
      <button onClick={handleClick}>Download</button>
    </div>
  );
};

export default FileDownloads;
