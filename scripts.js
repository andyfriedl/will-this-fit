const d = new Date(); // Set the current year in the car data
let carDimensions = {};
let selectedCargoWidth, selectedCargoHeight, selectedCargoDepth;

// Car image urls
const imageUrls = [
  "images/YQAAOTVzRJAEpGh-IcK9D.png",
  "images/cgq21xNFhcyjS_Avbq2CAw1.png",
  "images/38u_VKoJQcMz4AZXjrap0.png",
  "images/jeBxrAkADPZMEQzTO6zrk.png",
  "images/lzsFHQAq5UXvNk2k2gBir.png",
  "images/IAEIWXrM5l-4B3nMlXOVc.png",
  "images/5WjmH0NSM2zasezOQ3pw5.png",
  "images/zr2xtR1etHptX2H_0PW01.png",
  "images/Rt34c7EfssvUwBxrhuqy3.png",
  "images/8o4zJp0Qr-NQQIOczglCP.png",
  "images/Ei5cp7eAVVm9I_aZtKiVt.png",
  "images/yHkElSRS711NusxLjqehq.png",
  "images/V7Fu5gSzLckakf3ZkoQYp.png",
  "images/yeLNBYtnUvssUNDkV8-5y.png",
  "images/Fe2NbKaxVIv9t42gIV.png",
  "images/rjDOs9CftfqJ4y4cwAilO.png",
  "images/2D1NdRVRa4emq_0-NC2a-.png"
];

// -------------------- Display a random car image on page load because it's fun
const displayRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  const carImage = document.getElementById("car-image");
  carImage.src = imageUrls[randomIndex];
}
displayRandomImage();


// Temp vehicle test data
const vehicleData = {
  currentYear: d.getFullYear(),
  makes: {
    Jeep: ["Wrangler", "Wrangler Unlimited"],
    Ford: ["F-150", "Mustang"],
    Dodge: ["Charger", "Dart"],
    Subaru: ["Crosstrek"],
  },
  cargoDimensions: {
    Wrangler: {
      "2007-2018": { width: 31.7, height: 22.7, depth: 11.7 },
      "2019-current": { width: 32.0, height: 22.0, depth: 12.0 },
    },
    "Wrangler Unlimited": {
      "2007-2018": { width: 33.7, height: 24.7, depth: 13.7 },
      "2019-current": { width: 34.0, height: 25.0, depth: 14.0 },
    },
    "F-150": {
      "2015-2020": { width: 52.8, height: 32.0, depth: 18.0 },
      "2021-current": { width: 53.0, height: 32.5, depth: 18.5 },
    },
    Mustang: {
      "2015-2020": { width: 48.5, height: 22.0, depth: 15.0 },
      "2021-current": { width: 49.0, height: 22.5, depth: 15.5 },
    },
    Charger: {
      "2011-2020": { width: 46.5, height: 21.0, depth: 16.0 },
      "2021-current": { width: 47.0, height: 21.5, depth: 16.5 },
    },
    Dart: {
      "2010-2018": { width: 27.5, height: 22.5, depth: 19.0 },
      "2019-current": { width: 28.0, height: 23.0, depth: 19.5 },
    },
    Crosstrek: {
      "2012-2016": { width: 41, height: 20, depth: 22 },
      "2016-current": { width: 41, height: 23.0, depth: 19.5 },
    },
  },
};

const { makes, cargoDimensions } = vehicleData;

// This function updates the model options based on the selected make,
// initializes form elements, and manages the state of the year input field.
const updateModels = () => {
  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const selectedMake = makeSelect.value;

  // Initialize the selects and inputs with default values and states on page load
  document.getElementById("productSearch").disabled = true;
  document.getElementById("year").disabled = true;
  document.getElementById("year").value = "";
  document.getElementById("error").textContent = "";
  document.getElementById("dimensions").innerHTML =
    '<div class="dimensions-placeholder">Make Model cargo area = {"width":...,"height":...,"depth":...}</div>';
  modelSelect.innerHTML = '<option value="">Model</option>';

  // Populate model select after make select
  if (selectedMake) {
    makes[selectedMake].forEach((model) => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });

    // Enable year input if there is a valid model value
    modelSelect.addEventListener("change", () => {
      const yearInput = document.getElementById("year");
      yearInput.disabled = modelSelect.value === "";
      if (!yearInput.disabled) yearInput.value = "";
    });
  }
};


// -------------------- Error function
const showError = (message) => {
  return `<div> <i class='box_error fas fa-exclamation-triangle'></i> Error: ${message}</div>`;
};

// -------------------- Validates selected year and displays cargo dimensions for the chosen car model.
const updateDimensions = () => {
  const modelSelect = document.getElementById("model");
  const makeSelect = document.getElementById("make");
  const yearInput = document.getElementById("year");
  const dimensionsDiv = document.getElementById("dimensions");
  const { value: selectedModel } = modelSelect;
  const { value: selectedMake } = makeSelect;
  const { value: selectedYearString } = yearInput;

  // Check year is a valid 4-digit number
  if (!/^(19|20)\d{2}$/.test(selectedYearString)) {
    dimensionsDiv.textContent = "";
    dimensionsDiv.innerHTML += showError("Please enter a valid 4-digit year");

    yearInput.value = ""; // Clear the input field
    yearInput.focus(); // Set focus back to the input field
    document.getElementById("productSearch").disabled = true;
    return; // Exit if invalid
  }

  const selectedYear = parseInt(selectedYearString); 
  dimensionsDiv.textContent = "";

  document.getElementById("productSearch").disabled = true;

  if (selectedModel && selectedYear) {
    const modelDimensions = cargoDimensions[selectedModel];
    let makeModelFound = false;

    for (const range in modelDimensions) {

      // Parses year range string into startYear and endYear, handling "current" year values.
      let [startYear, endYear] = range.split("-").map((year) => 
        year === "current" ? vehicleData.currentYear : parseInt(year)
      );

      // If valid year, display cargo dimensions
      if (selectedYear >= startYear && selectedYear <= endYear) {
        const dimensions = modelDimensions[range];

        dimensionsDiv.innerHTML =
        ` <div> <i class='box_success fas fa-check box_success fa-lg'></i> ${selectedMake} ${selectedModel}  cargo area = ${JSON.stringify(modelDimensions[range])}</div>`; // Display dimensions as JSON for clarity

        setCarDimensions(selectedMake, selectedModel, dimensions.height, dimensions.width, dimensions.depth);

        makeModelFound = true;
        break;
      }
    }

    // If year selected is not in a valid range of car data, show an error
    if (!makeModelFound) {
      dimensionsDiv.innerHTML += showError(" Error: Selected year is out of range.");
      document.getElementById("productSearch").disabled = true;
    } else {
      document.getElementById("productSearch").disabled = false;
    }
  }
};

// Populate makes on page load and call updateModels
document.addEventListener("DOMContentLoaded", () => {
  const makeSelect = document.getElementById("make");

  Object.keys(makes).forEach((make) => {
    makeSelect.innerHTML += `<option value="${make}">${make}</option>`;
  });
  updateModels(); 
});

// -------------------- Simulate Enter Key for the year search button
const simulateEnterKey = () => {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    charCode: 13,
  });
  document.dispatchEvent(event);
};

// Temp box/product test data
const boxes = [
  {
    product_id: 66666666,
    product_name: "test",
    width: 50.25,
    height: 2.75,
    depth: 41.25,
  },
  {
    product_id: 60470408,
    product_name: "NYSJÖN",
    width: 20.25,
    height: 2.75,
    depth: 31.25,
  },
  {
    product_id: 20400323,
    product_name: "SALJEN",
    width: 10.75,
    height: 2,
    depth: 11.25,
  },
  {
    product_id: 50311066,
    product_name: "FRIHETEN",
    width: 32.75,
    height: 16.5,
    depth: 55,
  },
  {
    product_id: 40104294,
    product_name: "LACK",
    width: 11.25,
    height: 2.5,
    depth: 12.75,
  },
  {
    product_id: 20470047,
    product_name: "TIPHEDE",
    width: 16.75,
    height: 3.5,
    depth: 18.75,
  },
  {
    product_id: 10545500,
    product_name: "TRÅDFRI",
    width: 2,
    height: 2,
    depth: 4.5,
  },
  {
    product_id: 10423184,
    product_name: "BERGPALM",
    width: 7.25,
    height: 4.5,
    depth: 11,
  },
];
// -------------------- Auto populate product search results when typing in the product search input
const populateProductSearchResults = (query) => {
  const resultsDiv = document.getElementById("productSearchResults");
  resultsDiv.innerHTML = "";

  if (!query) {
    return;
  }

  // Normalize the query by removing periods and converting special characters to their base equivalents
  const normalizedQuery = query.replace(/\./g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filter box search results based on normalized product name or id
  const filteredBoxes = boxes.filter((box) => {
    const normalizedProductName = box.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return (
      normalizedProductName.includes(normalizedQuery) ||
      box.product_id.toString().includes(normalizedQuery)
    );
  });

  // Display error if no product found in search
  if (filteredBoxes.length === 0) {
    resultsDiv.innerHTML += showError(" No products found");
    return;
  }

  const fragment = document.createDocumentFragment();

  // Create and display product search results, add click handling for selection and clearing input
  filteredBoxes.forEach((box) => {
    const div = document.createElement("div");
    div.textContent = `${box.product_name} (${box.product_id})`;
    div.className = "search-result-item";
    div.dataset.boxId = box.product_id;
    div.addEventListener("click", () => {
      addProduct(box);
      resultsDiv.innerHTML = ""; // Clear results after selection
      document.getElementById("productSearch").value = ""; // Clear input field
    });
    fragment.appendChild(div);
  });

  resultsDiv.prepend(fragment);
};

// -------------------- Set the car's make, model, and available dimensions (height, width, depth)
const setCarDimensions = (make, model, height, width, depth) => {
  carDimensions = {
    make: make,
    model: model,
    remainingHeight: height,
    remainingWidth: width,
    remainingDepth: depth,
  };
};

// -------------------- Add a product to the selected list with fit status, and include a button for removal
const addProduct = (box) => {
  const selectedProducts = document.getElementById("selectedProducts");
  const fitResult = checkFit(box); // returns fit status: fits, hangs out, does not fit
  const item = document.createElement("li"); // Create User selected products

  // Build selected product html data element
  item.innerHTML = `${box.product_name} ${box.product_id} = {width: "${box.width}", height: "${box.height}", depth: "${box.depth}"}`;
  item.dataset.boxId = box.product_id;
  item.classList.add("product-search-item");

  // Add the correct prepended class to the selected product element
  if (fitResult.status === "Fits") {
    item.classList.add("fits");
  } else if (fitResult.status === "Hangs out") {
    item.classList.add("HangsOut");
  } else if (fitResult.status === "Doesn't fit") {
    item.classList.add("noFit");
  }

  // Remove selected product 
  const removeButton = document.createElement("button");
  removeButton.className = "removeButton";
  removeButton.innerHTML = '<i class="fa-solid fa-xmark "></i>';
  removeButton.addEventListener("click", () => {
    selectedProducts.removeChild(item);
  });
  item.appendChild(removeButton);

  // Prepend the new item to the selected products list
  selectedProducts.prepend(item);
};

// get selected product search result value
document.getElementById("productSearch").addEventListener("input", (event) => {
  populateProductSearchResults(event.target.value);
});

// -------------------- Check fit based on box orientation allowing product depth to hang out of cargo area 
// Todo Revisit remaining volume calc to use hangingDepth
const checkFit = (product) => {
  const orientations = [
    [product.height, product.width, product.depth],
    [product.height, product.depth, product.width],
    [product.width, product.height, product.depth],
    [product.width, product.depth, product.height],
    [product.depth, product.height, product.width],
    [product.depth, product.width, product.height],
  ];

  for (const [h, w, d] of orientations) {
    console.log(carDimensions.remainingWidth);
    console.log(carDimensions.remainingHeight);
    console.log(carDimensions.remainingDepth);

    if (h <= carDimensions.remainingHeight && w <= carDimensions.remainingWidth) {
      if (d <= carDimensions.remainingDepth) {
        // If it fits completely, update the remaining space
        carDimensions.remainingHeight -= h;
        carDimensions.remainingWidth -= w;
        carDimensions.remainingDepth -= d;
        return { status: "Fits", hangingDepth: 0 };
      } else {
        // If it hangs out, only update the height and width, and calculate hanging depth
        carDimensions.remainingHeight -= h;
        carDimensions.remainingWidth -= w;
        const hangingDepth = d - carDimensions.remainingDepth;
        return { status: "Hangs out", hangingDepth };
      }
    }
  }

  return { status: "Doesn't fit", hangingDepth: null };
};
