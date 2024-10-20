import { PlusOutlined } from "@ant-design/icons";
import { Progress, Upload } from "antd";
import axios from "axios";
import React, { useState } from "react";
const FileUpload = () => {
  const [file, setFile] = useState();
  const [uploded, setUploaded] = useState(null);
  console.log(file);
  const handleClick = (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append("file", file);

    //********* HERE IS THE CHANGE ***********
    const formData = new FormData();

    for (let i = 0; i < file.length; i++) {
      formData.append("file", file[i]);
    }

    axios
      .post("http://localhost:4000/send-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setUploaded(Math.round((data.loaded / data.total) * 100));
        },
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
      <h1>FileUpload</h1>
      {uploded && (
        <>
          <Progress
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={uploded}
          />
          <Progress
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            percent={uploded}
            status="active"
            style={{
              width: "200px",
              margin: "0 auto",
              padding: "10px",
            }}
          />
          <Progress
            type="circle"
            percent={uploded}
            format={(uploded) => `${uploded}`}
          />
        </>
      )}

      <div>
        <input
          type="file"
          name="image"
          // onChange={(e) => setFile(e.target.files[0])}
          onChange={(e) => setFile(e.target.files)}
          multiple
        />

        <button onClick={handleClick}>Upload</button>

        <Upload
          action="http://localhost:4000/send-file"
          listType="picture-card"
          multiple
          beforeUpload={false}
        >
          <div>
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              Upload
            </div>
          </div>
        </Upload>
      </div>
    </div>
  );
};

export default FileUpload;
