const vehicleData = {
  makes: {
    Jeep: ["Wrangler", "Wrangler Unlimited"],
    Ford: ["F-150", "Mustang"],
    Dodge: ["Charger", "Dart"],
  },
  cargoDimensions: {
    Wrangler: {
      "2007-2018": { width: 31.7, height: 22.7, depth: 11.7 },
      "2019-2024": { width: 32.0, height: 22.0, depth: 12.0 },
    },
    "Wrangler Unlimited": {
      "2007-2018": { width: 33.7, height: 24.7, depth: 13.7 },
      "2019-2024": { width: 34.0, height: 25.0, depth: 14.0 },
    },
    "F-150": {
      "2015-2020": { width: 52.8, height: 32.0, depth: 18.0 },
      "2021-2024": { width: 53.0, height: 32.5, depth: 18.5 },
    },
    Mustang: {
      "2015-2020": { width: 48.5, height: 22.0, depth: 15.0 },
      "2021-2024": { width: 49.0, height: 22.5, depth: 15.5 },
    },
    Charger: {
      "2011-2020": { width: 46.5, height: 21.0, depth: 16.0 },
      "2021-2024": { width: 47.0, height: 21.5, depth: 16.5 },
    },
    Dart: {
      "2010-2018": { width: 27.5, height: 22.5, depth: 19.0 },
      "2019-2024": { width: 28.0, height: 23.0, depth: 19.5 },
    },
  },
};

const { makes, cargoDimensions } = vehicleData;

function updateModels() {
  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const selectedMake = makeSelect.value;

  modelSelect.innerHTML = '<option value="">Select Model</option>';
  if (selectedMake) {
    makes[selectedMake].forEach((model) => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });
  }
}

function updateDimensions() {
  const modelSelect = document.getElementById("model");
  const makeSelect = document.getElementById("make");
  const yearInput = document.getElementById("year");
  const dimensionsDiv = document.getElementById("dimensions");
  const errorDiv = document.getElementById("error");
  const selectedModel = modelSelect.value;
  const selectedMake = makeSelect.value;
  const selectedYear = parseInt(yearInput.value);

  dimensionsDiv.textContent = "";
  errorDiv.textContent = "";

  if (selectedModel && selectedYear) {
    const modelDimensions = cargoDimensions[selectedModel];
    let found = false;

    for (const range in modelDimensions) {
      const [startYear, endYear] = range.split("-").map(Number);
      if (selectedYear >= startYear && selectedYear <= endYear) {
        dimensionsDiv.textContent =
          selectedMake +
          " " +
          selectedModel +
          " cargo area = " +
          JSON.stringify(modelDimensions[range]); // Display dimensions as JSON for clarity
        found = true;
        break;
      }
    }

    if (!found) {
      errorDiv.textContent = "Error: Selected year is out of range.";
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

// -----================== search ==================----------

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
    width: 25.25,
    height: 2.5,
    depth: 35.75,
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
    const filteredBoxes = boxes.filter(box => {
      return box.product_name.toLowerCase().includes(query.toLowerCase()) ||
             box.product_id.toString().includes(query);
    });
  
    if (filteredBoxes.length === 0) {
      resultsDiv.innerHTML = '<div>No products found</div>';
      return;
    }
  
    const fragment = document.createDocumentFragment();
  
    filteredBoxes.forEach(box => {
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
  

  function addProduct(box) {
    const selectedProducts = document.getElementById("selectedProducts");
  
    // Check if the product already exists in the selected products
    const existingItem = Array.from(selectedProducts.children).find(item => item.dataset.boxId === box.product_id);
  
    if (existingItem) {
      // If product exists, increment quantity ----- not working
      const currentQuantity = parseInt(existingItem.dataset.quantity);
      const newQuantity = currentQuantity + 1;
      existingItem.dataset.quantity = newQuantity;
      existingItem.textContent = `${box.product_name} (${box.product_id}) x ${newQuantity}`;
    } else {
      // If product doesn't exist, create a new list item
      const item = document.createElement("li");
    //   item.textContent = `${box.product_name} (${box.product_id}) - qty: 1`;
      item.textContent = `${box.product_name} (${box.product_id})`;
      item.dataset.boxId = box.product_id;
      item.dataset.quantity = 1;
      item.classList.add("product-search-item");
  
      const removeButton = document.createElement("button");
      removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      removeButton.addEventListener("click", () => {
        selectedProducts.removeChild(item);
      });
      item.appendChild(removeButton);
  
      // Prepend the new item to the selected products list
      selectedProducts.prepend(item);
    }
  }

  
  

document.getElementById("productSearch").addEventListener("input", (event) => {
  populateProductSearchResults(event.target.value);
});


const select = document.getElementById('make');
select.addEventListener('change', function() {
  const selectedOption = select.options[select.selectedIndex];
  const iconClass = selectedOption.dataset.icon;
  // Replace placeholder with the icon based on iconClass
});

// Random background boxes generation
// const colors = ['#a1caba', '#e9ba08', '#ad2e00', '#e95d2e', '#d3a708', '#232829']; // E9E9E8
// const container = document.body;

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }

// for (let i = 0; i < 20; i++) {
//     const box = document.createElement('div');
//     box.className = 'random-box';
//     box.style.backgroundColor = colors[getRandomInt(colors.length)];
//     box.style.top = getRandomInt(window.innerHeight - 222) + 'px'; // Constrains the divs within the viewport
//     box.style.left = getRandomInt(window.innerWidth - 222) + 'px'; // Constrains the divs within the viewport
//     box.style.width = getRandomInt(150) + 15 + 'px';
//     box.style.height = getRandomInt(333) + 55 + 'px';
//     box.style.transform = `rotate(${getRandomInt(6) + 87}deg)`;
//     container.appendChild(box);
// }