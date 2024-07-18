// JavaScript code moved to scripts.js

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
    const boxes = [
        new Box(66666666, "test", 50.25, 2.75, 41.25, 25.5),
        new Box(60470408, "NYSJÖN", 20.25, 2.75, 31.25, 25.5),
        new Box(20400323, "SALJEN", 10.75, 2, 11.25, 1),
        new Box(50311066, "FRIHETEN", 32.75, 16.5, 55, 78),
        new Box(40104294, "LACK", 25.25, 2.5, 35.75, 18),
        new Box(20470047, "TIPHEDE", 16.75, 3.5, 18.75, 6)
    ];

    const vehicle = new Vehicle("Jeep", "Wrangler Unlimited", 2010, 40.25, 35.5, 34.5);

    const [packed_boxes, packed_boxes_with_hangout, boxes_that_wont_fit] = can_pack_all_boxes_mixed(boxes, vehicle);

    let results = `<h2>Will this fit in your car - ${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>`;

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

// Random boxes generation
const colors = ['#a1caba', '#e9ba08', '#ad2e00', '#e95d2e', '#e9c79d', '#232829'];
const container = document.body;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

for (let i = 0; i < 20; i++) {
    const box = document.createElement('div');
    box.className = 'random-box';
    box.style.backgroundColor = colors[getRandomInt(colors.length)];
    box.style.top = getRandomInt(window.innerHeight - 100) + 'px'; // Constrains the divs within the viewport
    box.style.left = getRandomInt(window.innerWidth - 100) + 'px'; // Constrains the divs within the viewport
    box.style.width = getRandomInt(100) + 40 + 'px';
    box.style.height = getRandomInt(100) + 280 + 'px';
    box.style.transform = `rotate(${getRandomInt(360)}deg)`;
    container.appendChild(box);
}

// Event listener for the button
document.getElementById('startButton').addEventListener('click', checkFit);
