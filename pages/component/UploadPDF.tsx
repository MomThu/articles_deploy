import { Col, Input, Row, notification } from "antd";
import axios from "axios";
import { get } from "lodash";
import { useState } from "react";

const FileUpload = ({ setFileName, reload }) => {
  const [file, setFile] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
    } else {
      setFileName("")
    }
  };

  const uploadToServer = async (event) => {
    event.preventDefault();
    const body = new FormData();
    body.append("file", file);

    try {
      const response = await axios.post("/api/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response && get(response, "data.data", "")) {
        setFileName(get(response, "data.data.data", ""));
        notification.success({ message: "Upload successful!" });
      }
    } catch (err) {
      notification.error({ message: err?.message || "Upload Failed hihi" });
    }
  };

  return (
    <div>
      <div>
        <h4>Select PDF File</h4>
        <div className="flex flex-row gap-5">
          <input type="file" onChange={uploadToClient} />

          <button
            className="btn btn-primary"
            type="submit"
            onClick={uploadToServer}
          >
            Upload file
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
