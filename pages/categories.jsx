import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import classes from "../styles/Categories.module.scss";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

const Categories = ({ swal }) => {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  const saveCategory = async (ev) => {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || "");
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = async (category) => {
    swal
      .fire({
        title: "Jesteś pewien?",
        text: `Czy na pewno chcesz usunąć ${category.name}`,
        showCancelButton: true,
        cancelButtonText: "Anuluj",
        confirmButtonText: "Tak, Usuń",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id, { _id });
          fetchCategories();
        }
      });
  };

  const addProperty = () => {
    setProperties((prev) => [
      ...prev,
      { name: "", values: "", id: Date.now() },
    ]);
  };

  const handlePropertyNameChange = (index, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = (index, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Layout>
      <h1>Kategorie</h1>
      <label>
        {editedCategory
          ? `Edytuj kategorię ${editedCategory.name}`
          : "Stwórz nową kategorię"}
      </label>
      <form onSubmit={saveCategory}>
        <div className={classes.categories}>
          <input
            type="text"
            placeholder="Nazwa Kategorii"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">Brak kategorii nadrzędnej</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className={classes.categories__label}>
          <label className={classes.categories__prop}>Właściwości</label>
          <button
            onClick={addProperty}
            type="button"
            className={`btn-default ${classes.categories__button}`}
          >
            Dodaj nową właściwość
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className={classes.categories} key={property.id}>
                <input
                  className={classes.categories__input}
                  type="text"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, ev.target.value)
                  }
                  placeholder="nazwa właściwości (przykład: kolor)"
                />
                <input
                  className={classes.categories__input}
                  type="text"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, ev.target.value)
                  }
                  placeholder="wartości, oddzielone przecinkami"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Usuń
                </button>
              </div>
            ))}
        </div>
        <div className={classes.categories__div}>
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-primary"
            >
              Anuluj
            </button>
          )}
          <button type="submit" className="btn-primary">
            Zapisz
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className={`basic ${classes.categories__basic}`}>
          <thead>
            <tr>
              <td>Nazwa Kategorii</td>
              <td>Kategoria nadrzędna</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className={`btn-default ${classes.categories__btn}`}
                    >
                      Edycja
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

const CategoriesWithSwal = withSwal(({ swal }) => <Categories swal={swal} />);

export default CategoriesWithSwal;
export { Categories };
