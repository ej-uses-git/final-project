import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Item from "../../components/Item";
import { getReq, putReq, uploadFile } from "../../utilities/fetchUtils";
import useError from "../../utilities/useError";

function EditItems(props) {
  const navigate = useNavigate();

  const { productId } = useParams();

  const localCache = useRef([]);

  const fileInput = useRef();

  const productName = useRef();
  const productDescription = useRef();
  const cost = useRef();

  const [display, setDisplay] = useState([]);

  const handleEdit = useCallback(async e => {
    e.preventDefault();

    const [data, error] = await putReq(`/products/${productId}`, {
      productName: productName.current.value,
      description: productDescription.current.value,
      cost: cost.current.value
    });

    if (error) useError(error, navigate);
    if (!data) useError(new Error("something went wrong"), navigate);

    e.target.reset();
  }, []);

  useEffect(() => {
    const cachedItems = localCache.current;
    if (cachedItems.length) return setDisplay(cachedItems);

    (async () => {
      const [data, error] = await getReq(`/products/${productId}/items`);
      if (error) return useError(error, navigate);
      setDisplay(data);
      localCache.current = data;
      console.log("\n== data ==\n", data, "\n");
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
                productName={item.product_name}
                itemAmount={item.item_amount}
              />
            </Link>
          </div>
        ))}

        <form className="edit-form def-form flex-col" onSubmit={handleEdit}>
          <div className="container">
            <label
              className="ff-headings fs-400 fw-bold text-primary-600"
              htmlFor="product-name"
            >
              Enter new product name:
            </label>
            <input
              required
              type="text"
              name="productName"
              id="product-name"
              ref={productName}
              className="fs-200 fw-regular ff-body text-primary-800"
            />
          </div>
          <div className="container">
            <label
              className="ff-headings fs-400 fw-bold text-primary-600"
              htmlFor="product-description"
            >
              Enter new product description:
            </label>
            <textarea
              type="text"
              name="productDescription"
              id="product-description"
              ref={productDescription}
              className="fs-200 fw-regular ff-body text-primary-800"
            ></textarea>
          </div>

          <div className="container">
            <label
              className="ff-headings fs-400 fw-bold text-primary-600"
              htmlFor="cost"
            >
              Enter the product's cost:
            </label>
            <input
              required
              type="number"
              name="cost"
              id="cost"
              step="any"
              ref={cost}
            />
          </div>

          <button type="submit" className="button">
            EDIT
          </button>
        </form>
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
