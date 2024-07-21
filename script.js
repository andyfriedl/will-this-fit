class Box {
    constructor(product_id, product_name, width, height, depth, weight) {
        this.product_id = product_id;
        this.product_name = product_name;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.weight = weight;
        this.volume = width * height * depth;
    }
}

class Vehicle {
    constructor(make, model, year, cargo_width, cargo_height, cargo_depth) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.cargo_width = cargo_width;
        this.cargo_height = cargo_height;
        this.cargo_depth = cargo_depth;
        this.remaining_volume = cargo_width * cargo_height * cargo_depth;
        this.boxes = [];
    }

    can_fit(box) {
        return (
            box.width <= this.cargo_width &&
            box.height <= this.cargo_height &&
            box.depth <= this.cargo_depth &&
            box.volume <= this.remaining_volume
        );
    }

    can_fit_with_hangout(box) {
        return (
            box.width <= this.cargo_width &&
            box.height <= this.cargo_height &&
            box.volume <= this.remaining_volume
        );
    }

    add(box) {
        this.remaining_volume -= box.volume;
        this.boxes.push(box);
    }
}

function can_pack_all_boxes(boxes, vehicle) {
    boxes.sort((a, b) => b.volume - a.volume);
    const packed_boxes = [];
    const unpacked_boxes = [];

    for (let box of boxes) {
        if (vehicle.can_fit(box)) {
            vehicle.add(box);
            packed_boxes.push(box.product_id);
        } else {
            unpacked_boxes.push(box.product_id);
        }
    }

    return [packed_boxes, unpacked_boxes];
}

function can_pack_all_boxes_with_hangout(boxes, vehicle) {
    boxes.sort((a, b) => b.volume - a.volume);
    const packed_boxes = [];
    const unpacked_boxes = [];

    for (let box of boxes) {
        if (vehicle.can_fit_with_hangout(box)) {
            vehicle.add(box);
            packed_boxes.push(box.product_id);
        } else {
            unpacked_boxes.push(box.product_id);
        }
    }

    return [packed_boxes, unpacked_boxes];
}

function can_pack_all_boxes_mixed(boxes, vehicle) {
    const [packed_boxes, unpacked_boxes] = can_pack_all_boxes(boxes, vehicle);
    const [packed_boxes_with_hangout, boxes_that_wont_fit] = can_pack_all_boxes_with_hangout(
        unpacked_boxes.map(id => boxes.find(b => b.product_id === id)),
        vehicle
    );

    return [packed_boxes, packed_boxes_with_hangout, boxes_that_wont_fit];
}

function checkFit() {
    const selectedProducts = document.querySelectorAll("#selectedProducts li");
    const boxes = [
        new Box(66666666, "test", 50.25, 2.75, 41.25, 25.5),
        new Box(60470408, "NYSJÖN", 20.25, 2.75, 31.25, 25.5),
        new Box(20400323, "SALJEN", 10.75, 2, 11.25, 1),
        new Box(50311066, "FRIHETEN", 32.75, 16.5, 55, 78),
        new Box(40104294, "LACK", 25.25, 2.5, 35.75, 18),
        new Box(20470047, "TIPHEDE", 16.75, 3.5, 18.75, 6)
    ];

   
    const selectedBoxIds = Array.from(selectedProducts).map(item => {
        return parseInt(item.dataset.boxId);
    });

    const selectedBoxes = boxes.filter(box => selectedBoxIds.includes(box.product_id));

    const [packed_boxes, packed_boxes_with_hangout, boxes_that_wont_fit] = can_pack_all_boxes_mixed(selectedBoxes, vehicle);

    let results = `<h2>Will this fit in your <u> ${vehicle.year} ${vehicle.make} ${vehicle.model}</u> - TEST DATA</h2>`;

    if (packed_boxes.length) {
        results += `<p>📦 These boxes will fit inside your ${vehicle.make}:</p><ul>`;
        packed_boxes.forEach(box_id => {
            const box = boxes.find(b => b.product_id === box_id);
            results += `<li>${box.product_id}: ${box.product_name}</li>`;
        });
        results += `</ul>`;
    }

    if (packed_boxes_with_hangout.length) {
        results += `<p>⚠️ These boxes will fit but hang out of your ${vehicle.make}:</p><ul>`;
        packed_boxes_with_hangout.forEach(box_id => {
            const box = boxes.find(b => b.product_id === box_id);
            const hangout_depth = box.depth - vehicle.cargo_depth;
            results += `<li>${box_id}: ${box.product_name} - This box will hang out by ${hangout_depth} inches</li>`;
        });
        results += `</ul>`;
    }

    if (boxes_that_wont_fit.length) {
        results += `<p>❌ These boxes don't fit inside your ${vehicle.make}:</p><ul>`;
        boxes_that_wont_fit.forEach(box_id => {
            const box = boxes.find(b => b.product_id === box_id);
            results += `<li>${box.product_id}: ${box.product_name}</li>`;
        });
        results += `</ul>`;
    }

    document.getElementById("results").innerHTML = results;
}

// Vehicle data
const vehicles = [
    { year: 2010, make: "Jeep", model: "Wrangler Unlimited", cargo_width: 40.25, cargo_height: 35.5, cargo_depth: 34.5 },
    { year: 2014, make: "Subaru", model: "Crosstrek", cargo_width: 28.5, cargo_height: 24.1, cargo_depth: 25.8 },
    { year: 2014, make: "Dodge", model: "Dart", cargo_width: 33.5, cargo_height: 36.1, cargo_depth: 30.8 },
    { year: 2019, make: "Jeep", model: "Grand Cherokee", cargo_width: 34.5, cargo_height: 22.1, cargo_depth: 29.8 }
];

// Populate vehicle options
function populateVehicleOptions() {
    const yearSelect = document.getElementById("year-select");
    const makeSelect = document.getElementById("make-select");
    const modelSelect = document.getElementById("model-select");

    // Populate years
    const years = [...new Set(vehicles.map(v => v.year))];
    yearSelect.innerHTML = '<option value="" disabled selected>Select year</option>';
    years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });

    // Event listener for year selection
    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        const makes = [...new Set(vehicles.filter(v => v.year == selectedYear).map(v => v.make))];
        makeSelect.innerHTML = '<option value="" disabled selected>Select make</option>';
        makes.forEach(make => {
            makeSelect.innerHTML += `<option value="${make}">${make}</option>`;
        });
        makeSelect.disabled = false;
        modelSelect.innerHTML = '<option value="" disabled selected>Select model</option>';
        modelSelect.disabled = true;
    });

    // Event listener for make selection
    makeSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        const selectedMake = makeSelect.value;
        const models = vehicles.filter(v => v.year == selectedYear && v.make == selectedMake).map(v => v.model);
        modelSelect.innerHTML = '<option value="" disabled selected>Select model</option>';
        models.forEach(model => {
            modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
        });
        modelSelect.disabled = false;
    });
}

populateVehicleOptions();

// Product search and results
const boxes = [
    new Box(66666666, "test", 50.25, 2.75, 41.25, 25.5),
    new Box(60470408, "NYSJÖN", 20.25, 2.75, 31.25, 25.5),
    new Box(20400323, "SALJEN", 10.75, 2, 11.25, 1),
    new Box(50311066, "FRIHETEN", 32.75, 16.5, 55, 78),
    new Box(40104294, "LACK", 25.25, 2.5, 35.75, 18),
    new Box(20470047, "TIPHEDE", 16.75, 3.5, 18.75, 6)
];

function populateProductSearchResults(query) {
    const resultsDiv = document.getElementById("productSearchResults");
    resultsDiv.innerHTML = '';

    if (!query) {
        return;
    }

    const filteredBoxes = boxes.filter(box => box.product_name.toLowerCase().includes(query.toLowerCase()));

    if (filteredBoxes.length === 0) {
        resultsDiv.innerHTML = '<div>No products found</div>';
        return;
    }

    filteredBoxes.forEach(box => {
        const div = document.createElement("div");
        div.textContent = `${box.product_name} (${box.product_id})`;
        div.className = 'search-result-item';
        div.dataset.boxId = box.product_id;
        div.addEventListener("click", () => {
            addProduct(box);
            resultsDiv.innerHTML = ''; // Clear results after selection
            document.getElementById("searchProductInput").value = ''; // Clear input field
        });
        resultsDiv.appendChild(div);
    });
}

function addProduct(box) {
    const selectedProducts = document.getElementById("selectedProducts");

    const item = document.createElement("li");
    item.textContent = `${box.product_name} (${box.product_id})`;
    item.dataset.boxId = box.product_id;
    item.classList.add('product-search-item');

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
        selectedProducts.removeChild(item);
    });
    item.appendChild(removeButton);
    selectedProducts.appendChild(item);
}

document.getElementById("productSearch").addEventListener("input", (event) => {
    populateProductSearchResults(event.target.value);
});

// Random background boxes generation
const colors = ['#a1caba', '#e9ba08', '#ad2e00', '#e95d2e', '#e9c79d', '#232829']; // E9E9E8
const container = document.body;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

for (let i = 0; i < 20; i++) {
    const box = document.createElement('div');
    box.className = 'random-box';
    box.style.backgroundColor = colors[getRandomInt(colors.length)];
    box.style.top = getRandomInt(window.innerHeight - 222) + 'px'; // Constrains the divs within the viewport
    box.style.left = getRandomInt(window.innerWidth - 222) + 'px'; // Constrains the divs within the viewport
    box.style.width = getRandomInt(150) + 15 + 'px';
    box.style.height = getRandomInt(333) + 55 + 'px';
    box.style.transform = `rotate(${getRandomInt(6) + 87}deg)`;
    container.appendChild(box);
}

// Event listener for the button
document.getElementById('startButton').addEventListener('click', checkFit);
