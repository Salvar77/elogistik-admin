import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";
import classes from "./ProductForm.module.scss";
import axios from "axios";
import Spinner from "./Spinner";

const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };

  if (goToProducts) {
    router.push("/products");
  }

  const uploadImages = async (ev) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  const setProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label className={classes.newp__label}>Nazwa Produktu</label>
      <input
        type="text"
        placeholder="nazwa produktu"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Kategoria</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Nieskategoryzowane</option>
        {categories.length > 0 &&
          categories.map((c) => <option value={c._id}>{c.name}</option>)}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div className={classes.newp__selectFill}>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Zdjęcia</label>

      <div className={classes.newp__img}>
        <ReactSortable
          list={images}
          className={classes.newp__sort}
          setList={updateImagesOrder}
        >
          {!!images.length &&
            images.map((link) => (
              <div key={link} className={classes.newp__photo}>
                <img src={link} alt="" className={classes.newp__photoUpload} />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className={classes.newp__photoSpinner}>
            <Spinner />
          </div>
        )}
        <label className={classes.newp__image}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={classes.newp__icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Dodaj zdjęcie</div>
          <input
            type="file"
            onChange={uploadImages}
            className={classes.newp__input}
          />
        </label>
        {!images?.length && <div>Brak zdjęć w tym produkcie</div>}
      </div>
      <label className={classes.newp__label}>Opis</label>
      <textarea
        placeholder="Opis"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label className={classes.newp__label}>Cena (in USD)</label>
      <input
        type="number"
        placeholder="Cena"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Zapisz
      </button>
    </form>
  );
};

export default ProductForm;
