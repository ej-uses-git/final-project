import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Item from "../components/Item";
import { getReq, uploadFile } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function EditItems(props) {
  const navigate = useNavigate();

  const { productId } = useParams();

  const localCache = useRef([]);

  const fileInput = useRef();

  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const cachedItems = localCache.current;
    if (cachedItems.length) return setDisplay(cachedItems);

    (async () => {
      const [data, error] = await getReq(`/products/${productId}/items`);
      if (error) return useError(error, navigate);
      setDisplay(data);
      localCache.current = data;
    })();
  }, []);

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
        `/products/${productId}/newphoto`,
        formData
      );
      if (error) throw error;
      alert("Upload succeeded!");
    } catch (error) {
      useError(error, navigate);
    }
  }, []);

  return (
    <>
      <form className="upload-form flex-col" onSubmit={handleSubmit}>
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

      <div className="items">
        {display.map(item => (
          <div className="no-dec" key={item.item_id}>
            <Link to={`${item.item_id}/upload`}>
              <Item
                itemId={item.item_id}
                color={item.item_color}
                cost={item.cost}
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="no-dec">
        <Link to="new">
          <button className="new-product-button button">Add New Item</button>
        </Link>
        <Link to="../edit">
          <button className="back-button button">Back To Products</button>
        </Link>
      </div>
    </>
  );
}

export default EditItems;
