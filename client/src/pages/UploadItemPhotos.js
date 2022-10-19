import React, { useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadFile } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function UploadItemPhotos(props) {
  //TODO: send UPLOAD Item Photos
  // /items/:itemId/uploadphotos

  const navigate = useNavigate();

  const { itemId } = useParams();

  const fileInput = useRef();

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    try {
      const files = fileInput.current.files;
      const formData = new FormData();
      for (let file of files) {
        if (!file.name.includes(".jpeg") && !file.name.includes(".jpg")) return;
        formData.append("file", file);
        formData.append("type", "upload");
      }

      const [, error] = await uploadFile(
        `/items/${itemId}/uploadphotos`,
        formData
      );
      if (error) throw error;
      alert("Upload succeeded!");
    } catch (error) {
      useError(error, navigate);
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file-input">Select Image:</label>
          <input
            type="file"
            name="fileInput"
            id="file-input"
            ref={fileInput}
            accept=".jpg, .jpeg"
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadItemPhotos;
