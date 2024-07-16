"""
This script determines whether various Ikea boxes will fit inside the cargo area of a vehicle.

Classes:
    Box: Represents a box with specific dimensions and weight.
    Vehicle: Represents a vehicle with cargo dimensions and methods to check if a box can fit.

Functions:
    can_pack_all_boxes: Sorts boxes by volume and determines which boxes fit entirely inside the vehicle's cargo area.
    can_pack_all_boxes_with_hangout: Sorts boxes by volume and determines which boxes fit inside the vehicle's cargo area with allowance for hangout.
    can_pack_all_boxes_mixed: Combines checks for both fitting entirely and with hangout, and provides a comprehensive result.

Usage:
    1. Define a list of Box objects with their respective dimensions and weight.
    2. Define a Vehicle object with the cargo dimensions.
    3. Use the can_pack_all_boxes_mixed function to determine which boxes fit, which fit with hangout, and which do not fit at all.
    4. Print the results to see which boxes can be packed inside the vehicle.
"""
class Box:
    def __init__(self, product_id, product_name, width, height, depth, weight):
        self.product_id = product_id
        self.product_name = product_name
        self.width = width
        self.height = height
        self.depth = depth
        self.weight = weight
        self.volume = width * height * depth

class Vehicle:
    def __init__(self, make, model, year, cargo_width, cargo_height, cargo_depth):
        self.make = make
        self.model = model
        self.year = year
        self.cargo_width = cargo_width
        self.cargo_height = cargo_height
        self.cargo_depth = cargo_depth
        self.remaining_volume = cargo_width * cargo_height * cargo_depth
        self.boxes = []

    def can_fit(self, box):
        return (box.width <= self.cargo_width and
                box.height <= self.cargo_height and
                box.depth <= self.cargo_depth and
                box.volume <= self.remaining_volume)

    def can_fit_with_hangout(self, box):
        return (box.width <= self.cargo_width and
                box.height <= self.cargo_height and
                box.volume <= self.remaining_volume)

    def add(self, box):
        self.remaining_volume -= box.volume
        self.boxes.append(box)

def can_pack_all_boxes(boxes, vehicle):
    boxes.sort(key=lambda box: box.volume, reverse=True)
    packed_boxes = []
    unpacked_boxes = []

    for box in boxes:
        if vehicle.can_fit(box):
            vehicle.add(box)
            packed_boxes.append(box.product_id)
        else:
            unpacked_boxes.append(box.product_id)

    return packed_boxes, unpacked_boxes

def can_pack_all_boxes_with_hangout(boxes, vehicle):
    boxes.sort(key=lambda box: box.volume, reverse=True)
    packed_boxes = []
    unpacked_boxes = []

    for box in boxes:
        if vehicle.can_fit_with_hangout(box):
            vehicle.add(box)
            packed_boxes.append(box.product_id)
        else:
            unpacked_boxes.append(box.product_id)

    return packed_boxes, unpacked_boxes

def can_pack_all_boxes_mixed(boxes, vehicle):
    boxes.sort(key=lambda box: box.volume, reverse=True)
    packed_boxes = []
    unpacked_boxes = []

    for box in boxes:
        if vehicle.can_fit(box):
            vehicle.add(box)
            packed_boxes.append(box.product_id)
        else:
            unpacked_boxes.append(box)

    packed_boxes_with_hangout = []
    unpacked_boxes_with_hangout = []

    for box in unpacked_boxes:
        if vehicle.can_fit_with_hangout(box):
            vehicle.add(box)
            packed_boxes_with_hangout.append(box.product_id)
        else:
            unpacked_boxes_with_hangout.append(box.product_id)

    return packed_boxes, packed_boxes_with_hangout, unpacked_boxes_with_hangout

# Example usage:
boxes = [
    Box(66666666, "test", 50.25, 2.75, 41.25, 25.5), 
    Box(60470408, "NYSJÖN", 20.25, 2.75, 31.25, 25.5), 
    Box(20400323, "SALJEN", 10.75, 2, 11.25, 1), 
    Box(50311066, "FRIHETEN", 32.75, 16.5, 55, 78), 
    Box(40104294, "LACK", 25.25, 2.5, 35.75, 18), 
    Box(20470047, "TIPHEDE", 16.75, 3.5, 18.75, 6)
]
vehicle = Vehicle("Jeep", "Wrangler Unlimited", 2010, 40.25, 35.5, 34.5)

# Single function call to handle all scenarios
packed_boxes, packed_boxes_with_hangout, boxes_that_wont_fit = can_pack_all_boxes_mixed(boxes, vehicle)

print('\n\n\n')
print(f"Will this fit in your car - {vehicle.year} {vehicle.make} {vehicle.model}")
print(' ')

if packed_boxes:
    print(f"📦 These boxes will fit inside your {vehicle.make}:")
    for box_id in packed_boxes:
        for box in boxes:
            if box.product_id == box_id:
                print(f"- {box.product_id}: {box.product_name}")
                break
    print("---")

if packed_boxes_with_hangout:
    print(f"⚠️ These boxes will fit but hang out of your {vehicle.make}:")
    for box_id in packed_boxes_with_hangout:
        hangout_depth = 0
        for box in boxes:
            if box.product_id == box_id:
                hangout_depth = box.depth - vehicle.cargo_depth
                break

        print(f"- {box_id}: {box.product_name} - This box will hangout by {hangout_depth} inches")
    print("---")

if boxes_that_wont_fit:
    print(f"❌ These boxes don't fit inside your {vehicle.make}:")
    for box_id in boxes_that_wont_fit:
        for box in boxes:
            if box.product_id == box_id:
                print(f"- {box.product_id}: {box.product_name}")
                break
    print("---")
