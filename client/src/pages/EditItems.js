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

      {display.map(item => (
        <Link to={`${item.item_id}/upload`} key={item.item_id}>
          <Item itemId={item.item_id} color={item.item_color} />
        </Link>
      ))}

      <Link to="new">
        <button>Add New Item</button>
      </Link>

      <Link to="../edit">
        <button>Back To Products</button>
      </Link>
    </>
  );
}

export default EditItems;
