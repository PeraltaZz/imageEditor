const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0";
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const setFilterValue = (filter, value) => {
  if (filter.id === "brightness") {
    brightness = value;
  } else if (filter.id === "saturation") {
    saturation = value;
  } else if (filter.id === "inversion") {
    inversion = value;
  } else {
    grayscale = value;
  }
};

const updateFilterView = (value) => {
  filterValue.innerText = `${value}%`;
};

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const handleFilterOptionClick = (option) => {
  document.querySelector(".active").classList.remove("active");
  option.classList.add("active");
  filterName.innerText = option.innerText;

  if (option.id === "brightness") {
    filterSlider.max = "200";
    filterSlider.value = brightness;
    updateFilterView(brightness);
  } else if (option.id === "saturation") {
    filterSlider.max = "200";
    filterSlider.value = saturation;
    updateFilterView(saturation);
  } else if (option.id === "inversion") {
    filterSlider.max = "100";
    filterSlider.value = inversion;
    updateFilterView(inversion);
  } else {
    filterSlider.max = "100";
    filterSlider.value = grayscale;
    updateFilterView(grayscale);
  }
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    handleFilterOptionClick(option);
  });
});

const updateFilter = () => {
  const selectedFilter = document.querySelector(".filter .active");
  const value = filterSlider.value;

  setFilterValue(selectedFilter, value);
  updateFilterView(value);
  applyFilters();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
