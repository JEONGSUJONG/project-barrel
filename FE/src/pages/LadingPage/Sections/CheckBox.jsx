import React from "react";

const CheckBox = ({ category, checkedCategory, onFilters }) => {
  const handleToggle = (categoryId) => {
    // currentCheckBox가 이미 누른 Check인지 체크
    const currentIndex = checkedCategory.indexOf(categoryId);
    const newChecked = [...checkedCategory]; // 불변성 유지

    if (currentIndex === -1) {
      newChecked.push(categoryId);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    onFilters(newChecked);
  };
  return (
    <div className="pl-14 my-8">
      <p className="px-3 pt-3 font-bold text-xl">CATEGORY</p>
      <hr className="w-10/12 my-4" />
      {category?.map((category) => (
        <div key={category._id}>
          <input
            type="checkbox"
            onChange={() => handleToggle(category._id)}
            checked={
              checkedCategory.indexOf(category._id) === -1 ? false : true
            }
          />{" "}
          <label>{category.name}</label>
        </div>
      ))}
    </div>
  );
};

export default CheckBox;
