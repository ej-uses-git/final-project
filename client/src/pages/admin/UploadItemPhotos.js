import React, { useCallback, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadFile } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function UploadItemPhotos(props) {
  const navigate = useNavigate();

  const { itemId } = useParams();

  const fileInput = useRef();

  const handleSubmit = useCallback(async (e) => {
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
      handleError(error, navigate);
    }
  }, []);

  return (
    <>
      <form className="flex-col" onSubmit={handleSubmit}>
        <div className="flex-col">
          <label
            className="fs-400 fw-bold ff-headings text-primary-600"
            htmlFor="file-input"
          >
            Select Image:
          </label>
          <input
            type="file"
            name="fileInput"
            id="file-input"
            ref={fileInput}
            accept=".jpg, .jpeg"
            className="fs-200 fw-regular ff-body text-primary-800"
          />
        </div>
        <button className="button" type="submit">
          Upload
        </button>
      </form>

      <div className="no-dec">
        <Link to="../">
          <button className="back-button button">Back to Product</button>
        </Link>
      </div>
    </>
  );
}

export default UploadItemPhotos;
