const d = new Date();
let carDimensions = {};


var imageUrls = [
  "images/YQAAOTVzRJAEpGh-IcK9D.png",
  "images/cgq21xNFhcyjS_Avbq2CAw1.png",
  "images/38u_VKoJQcMz4AZXjrap0.png",
  "images/jeBxrAkADPZMEQzTO6zrk.jpeg",
  "images/lzsFHQAq5UXvNk2k2gBir.png",
  "images/IAEIWXrM5l-4B3nMlXOVc.png",
  "images/5WjmH0NSM2zasezOQ3pw5.png",
  "images/zr2xtR1etHptX2H_0PW01.png",
  "images/Rt34c7EfssvUwBxrhuqy3.png",
  "images/8o4zJp0Qr-NQQIOczglCP.png",
  "images/Ei5cp7eAVVm9I_aZtKiVt.png"
  // Add more image URLs here
];

function displayRandomImage() {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  const imageUrl = imageUrls[randomIndex];

  // Get the image element by its ID
  const carImage = document.getElementById("car-image");

  // Set the src attribute of the image element to the random image URL
  carImage.src = imageUrl;
}

// Call the function to display a random image initially
displayRandomImage();

const vehicleData = {
  "currentYear": d.getFullYear(),
  "makes": {
    "Jeep": ["Wrangler", "Wrangler Unlimited"],
    "Ford": ["F-150", "Mustang"],
    "Dodge": ["Charger", "Dart"],
    "Subaru": ["Crosstrek"],
  },
  "cargoDimensions": {
    "Wrangler": {
      "2007-2018": { "width": 31.7, "height": 22.7, "depth": 11.7 },
      "2019-current": { "width": 32.0, "height": 22.0, "depth": 12.0 },
    },
    "Wrangler Unlimited": {
      "2007-2018": { "width": 33.7, "height": 24.7, "depth": 13.7 },
      "2019-current": { "width": 34.0, "height": 25.0, "depth": 14.0 },
    },
    "F-150": {
      "2015-2020": { "width": 52.8, "height": 32.0, "depth": 18.0 },
      "2021-current": { "width": 53.0, "height": 32.5, "depth": 18.5 },
    },
    "Mustang": {
      "2015-2020": { "width": 48.5, "height": 22.0, "depth": 15.0 },
      "2021-current": { "width": 49.0, "height": 22.5, "depth": 15.5 },
    },
    "Charger": {
      "2011-2020": { "width": 46.5, "height": 21.0, "depth": 16.0 },
      "2021-current": { "width": 47.0, "height": 21.5, "depth": 16.5 },
    },
    "Dart": {
      "2010-2018": { "width": 27.5, "height": 22.5, "depth": 19.0 },
      "2019-current": { "width": 28.0, "height": 23.0, "depth": 19.5 },
    },
    "Crosstrek": {
      "2012-2016": { "width": 41, "height": 20, "depth": 22 },
      "2016-current": { "width": 41, "height": 23.0, "depth": 19.5 },
    },
  },
};



let selectedCargoWidth, selectedCargoHeight, selectedCargoDepth;
let found = false;

const { makes, cargoDimensions } = vehicleData;

function updateModels() {
  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const selectedMake = makeSelect.value;
  const selectedModel = modelSelect.value;
  // here
  document.getElementById("productSearch").disabled = true;
  document.getElementById("year").disabled = true;
  document.getElementById("year").value = "";
  document.getElementById("error").textContent = "";
  document.getElementById("dimensions").innerHTML = '<div class="dimensions-placeholder">Make Model cargo area = {"width":...,"height":...,"depth":...}</div>';

  modelSelect.innerHTML = '<option value="">Model</option>';

  if (selectedMake) {
    makes[selectedMake].forEach((model) => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });
    // NEW ----
    modelSelect.addEventListener("change", () => {
      document.getElementById("year").disabled = modelSelect.value === "";
    });
  }

  

  const selectElement = document.getElementById("model");
  const inputYear = document.getElementById("year");

  selectElement.addEventListener("change", () => {
    if (selectElement.value !== "") {
      inputYear.disabled = false;
      inputYear.value = "";
    } else {
      inputYear.disabled = true;
    }
  });

}

function updateDimensions() {
  const modelSelect = document.getElementById("model");
  const makeSelect = document.getElementById("make");
  const yearInput = document.getElementById("year");
  const dimensionsDiv = document.getElementById("dimensions");
  const selectedModel = modelSelect.value;
  const selectedMake = makeSelect.value;
  const selectedYearString = yearInput.value; // Get the value as a string

  // Check year is a valid 4-digit number
  if (!/^(19|20)\d{2}$/.test(selectedYearString)) {
    dimensionsDiv.textContent = "";
    dimensionsDiv.innerHTML +=  "<div> <i class='box_error fas fa-exclamation-triangle'></i> Error: Please enter a valid 4-digit year</div>";
    yearInput.value = ""; // Clear the input field
    yearInput.focus(); // Set focus back to the input field
    document.getElementById("productSearch").disabled = true;
    return; // Exit function if is invalid
  }

  const selectedYear = parseInt(selectedYearString); // Convert to integer
  dimensionsDiv.textContent = "";

  document.getElementById("productSearch").disabled = true;

  if (selectedModel && selectedYear) {
    const modelDimensions = cargoDimensions[selectedModel];
    let found = false;

    for (const range in modelDimensions) {

      //  NEW
      let [startYear, endYear] = range.split("-").map((year) => 
        year === "current" ? vehicleData.currentYear : parseInt(year)
      );

      if (selectedYear >= startYear && selectedYear <= endYear) {
        const dimensions = modelDimensions[range];

        dimensionsDiv.innerHTML =
        " <div> <i class='box_success fas fa-check box_success fa-lg'></i> " +
          selectedMake +
          " " +
          selectedModel +
          "  cargo area = " +
          JSON.stringify(modelDimensions[range]) + "</div>"; // Display dimensions as JSON for clarity


        // setCarDimensions make, model, height, width, depth
        setCarDimensions(selectedMake, selectedModel, dimensions.height, dimensions.width, dimensions.depth);

        found = true;

        break;
      }
    }

    // enable year after make and model
    if (!found) {
      dimensionsDiv.innerHTML +=  "<div> <i class='box_error fas fa-exclamation-triangle'></i> Error: Selected year is out of range.</div>";
      console.log("error");
      document.getElementById("productSearch").disabled = true;
    } else {
      document.getElementById("productSearch").disabled = false;
    }
  }
}

// Populate makes on page load and call updateModels
document.addEventListener("DOMContentLoaded", () => {
  const makeSelect = document.getElementById("make");
  Object.keys(makes).forEach((make) => {
    makeSelect.innerHTML += `<option value="${make}">${make}</option>`;
  });
  updateModels(); // Call updateModels here
});

function simulateEnterKey() {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    charCode: 13,
  });
  document.dispatchEvent(event);
}

// -----================== product search ==================----------

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
];

function populateProductSearchResults(query) {
  const resultsDiv = document.getElementById("productSearchResults");
  resultsDiv.innerHTML = "";

  if (!query) {
    return;
  }

  // Filter boxes based on product name or id
  const filteredBoxes = boxes.filter((box) => {
    return (
      box.product_name.toLowerCase().includes(query.toLowerCase()) ||
      box.product_id.toString().includes(query)
    );
  });

  if (filteredBoxes.length === 0) {
    resultsDiv.innerHTML =
      "<div> <i class='box_error fas fa-exclamation-triangle'></i> No products found</div>";
    return;
  }

  const fragment = document.createDocumentFragment();

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
}

function setCarDimensions(make, model, height, width, depth) {
  carDimensions = {
    make: make,
    model: model,
    remainingHeight: height,
    remainingWidth: width,
    remainingDepth: depth
  };
}

function addProduct(box) {
  const selectedProducts = document.getElementById("selectedProducts");

  const fitResult = checkFit(box);
  console.log(fitResult.status);

  // If product doesn't exist, create a new list item
  const item = document.createElement("li");
  //   item.textContent = `${box.product_name} (${box.product_id}) - qty: 1`;
  item.innerHTML = `${box.product_name} ${box.product_id} = {width: "${box.width}", height: "${box.height}", depth: "${box.depth}"}`;
  item.dataset.boxId = box.product_id;
  item.dataset.quantity = 1;
  item.classList.add("product-search-item");

  if (fitResult.status == "Fits") {
    item.classList.add("fits");
  } else if (fitResult.status == "Hangs out") {
    item.classList.add("HangsOut");
  } else if (fitResult.status == "Doesn't fit") {
    item.classList.add("noFit");
  }

  const removeButton = document.createElement("button");
  removeButton.className = "removeButton";
  removeButton.innerHTML = '<i class="fa-solid fa-xmark "></i>';
  removeButton.addEventListener("click", () => {
    selectedProducts.removeChild(item);
  });
  item.appendChild(removeButton);

  // Prepend the new item to the selected products list
  selectedProducts.prepend(item);
}

document.getElementById("productSearch").addEventListener("input", (event) => {
  populateProductSearchResults(event.target.value);
});

function checkFit(product) {

  const orientations = [
    [product.height, product.width, product.depth],
    [product.height, product.depth, product.width],
    [product.width, product.height, product.depth],
    [product.width, product.depth, product.height],
    [product.depth, product.height, product.width],
    [product.depth, product.width, product.height]
  ];

  for (const [h, w, d] of orientations) {
    if (h <= carDimensions.remainingHeight && w <= carDimensions.remainingWidth) {
      if (d <= carDimensions.remainingDepth) {
        // Update remaining space
        carDimensions.remainingHeight -= h;
        carDimensions.remainingWidth -= w;
        carDimensions.remainingDepth -= d;
        return { status: "Fits", hangingDepth: 0 };
      } else {
        // Update remaining space for hanging out case
        carDimensions.remainingHeight -= h;
        carDimensions.remainingWidth -= w;
        carDimensions.remainingDepth = 0;
        return { status: "Hangs out", hangingDepth: d - carDimensions.remainingDepth };
      }
    }
  }

  return { status: "Doesn't fit", hangingDepth: null };
}
