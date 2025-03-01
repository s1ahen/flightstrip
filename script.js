document.getElementById('createStrip').addEventListener('click', createFlightStrip);
document.getElementById('deleteMode').addEventListener('click', toggleDeleteMode);

let isDeleteMode = false;

function createFlightStrip() {
    // Generate a random squawk code
    const squawk = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Create the flight strip
    const strip = document.createElement('div');
    strip.className = 'flight-strip';
    strip.draggable = true;
    strip.id = `strip-${Date.now()}`;
    strip.innerHTML = `
        <div class="row">
            <input type="text" placeholder="CALLSIGN" style="width: 48%;">
            <input type="text" placeholder="TYPE" style="width: 48%;">
        </div>
        <div class="row">
            <label for="squawk"><strong>Squawk:</strong></label>
            <input type="text" id="squawk" value="${squawk}" maxlength="4" style="width: 60px;">
        </div>
        <div class="row">
            <input type="text" placeholder="DEP" style="width: 30%;">
            <input type="text" placeholder="ARR" style="width: 30%;">
            <input type="text" placeholder="FLT" style="width: 30%;">
        </div>
        <input type="text" placeholder="FLTPLN">
        <input type="text" placeholder="Notes">
        <div class="clearance-status">
            <label for="clearance">Clearance Status:</label>
            <select id="clearance">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="pending">Pending</option>
                <option value="arriving">Arriving</option>
            </select>
        </div>
        <button class="delete-btn">Delete</button>
    `;

    // Add event listeners
    strip.querySelector('.delete-btn').addEventListener('click', () => deleteStrip(strip.id));
    strip.addEventListener('dragstart', dragStart);
    strip.addEventListener('dragend', dragEnd);

    // Append the strip to the departure column
    document.getElementById('departure').appendChild(strip);
}

function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => button.classList.toggle('visible', isDeleteMode));
}

function deleteStrip(stripId) {
    const strip = document.getElementById(stripId);
    if (strip) {
        strip.remove();
    }
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('drop', drop);
});

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggable = document.getElementById(id);
    const targetColumn = event.target.closest('.column');

    if (targetColumn) {
        // Remove any existing column-specific classes
        draggable.classList.remove(
            'departure-strip',
            'approach-strip',
            'ground-strip',
            'tower-strip'
        );

        // Add a class based on the target column
        if (targetColumn.id === 'departure') {
            draggable.classList.add('departure-strip');
        } else if (targetColumn.id === 'approach') {
            draggable.classList.add('approach-strip');
        } else if (targetColumn.id === 'ground') {
            draggable.classList.add('ground-strip');
        } else if (targetColumn.id === 'tower') {
            draggable.classList.add('tower-strip');
        }

        // Append the strip to the target column
        targetColumn.appendChild(draggable);
    }
}


// Airport frequency data with custom center names
const airportFrequencies = {
    "IBAR": {
        tower: "118.080",
        ground: "N/A",

    },
    "IHEN": {
        tower: "N/A",
        ground: "N/A",
        centers: 
    },
    "ILAR": {
        tower: "121.200",
        ground: "199.400",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "IZOLIRANI CENTER", frequency: "124.640" }
        ]
    },
    "IIAB": {
        tower: "127.250",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "IZOLIRANI CENTER", frequency: "124.640" }
        ]
    },
    "IPAP": {
        tower: "119.900",
        ground: "120.800",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "IZOLIRANI CENTER", frequency: "124.640" }
        ]
    },
    "IGRV": {
        tower: "118.300",
        ground: "121.900",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "TOKYO CENTER", frequency: "132.300" }
        ]
    },
    "IJAF": {
        tower: "119.100",
        ground: "121.700",
        centers: [
            { name: "LARNACA CENTER", frequency: "126.300" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "PERTH CENTER", frequency: "135.250" }
        ]
    },
    "IZOL": {
        tower: "118.700",
        ground: "121.900",
        centers: [
            { name: "LARNACA CENTER", frequency: "126.300" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "PERTH CENTER", frequency: "135.250" }
        ]
    },
    "ISCM": {
        tower: "118.220",
        ground: "N/A",
        centers: [
            { name: "LARNACA CENTER", frequency: "126.300" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "PERTH CENTER", frequency: "135.250" }
        ]
    },
    "IDSC": {
        tower: "122.500",
        ground: "N/A",
        centers: [
            { name: "PERTH CENTER", frequency: "135.250" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "GRINDAVIK CENTER", frequency: "126.750" }
        ]
    },
    "ITKO": {
        tower: "118.800",
        ground: "118.225",
        centers: [
            { name: "PERTH CENTER", frequency: "135.250" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "GRINDAVIK CENTER", frequency: "126.750" }
        ]
    },
    "ILKL": {
        tower: "120.150",
        ground: "N/A",
        centers: [
            { name: "IZOLIRANI CENTER", frequency: "124.640" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "TOKYO CENTER", frequency: "132.300" }
        ]
    },
    "IPPH": {
        tower: "127.400",
        ground: "121.700",
        centers: [
            { name: "IZOLIRANI CENTER", frequency: "124.640" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "TOKYO CENTER", frequency: "132.300" }
        ]
    },
    "IGAR": {
        tower: "118.800",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "LARNACA CENTER", frequency: "126.300" }
        ]
    },
    "IBLT": {
        tower: "118.430",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "LARNACA CENTER", frequency: "126.300" }
        ]
    },
    "IRFD": {
        tower: "124.850",
        ground: "120.400",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "LARNACA CENTER", frequency: "126.300" }
        ]
    },
    "ITRC": {
        tower: "118.500",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "LARNACA CENTER", frequency: "126.300" }
        ]
    },
    "IBTH": {
        tower: "128.600",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "TOKYO CENTER", frequency: "132.300" },
            { name: "IZOLIRANI CENTER", frequency: "124.640" }
        ]
    },
    "ISAU": {
        tower: "118.205",
        ground: "130.880",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "GRINDAVIK CENTER", frequency: "126.750" },
            { name: "IZOLIRANI CENTER", frequency: "124.640" }
        ]
    },
    "ISKP": {
        tower: "118.400",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "IZOLIRANI CENTER", frequency: "124.640" }
        ]
    },
    "IMLR": {
        tower: "133.850",
        ground: "N/A",
        centers: [
            { name: "ROCKFORD CENTER", frequency: "124.850" },
            { name: "SOTAF CENTER", frequency: "128.600" },
            { name: "LARNACA CENTER", frequency: "126.300" }
        ]
    }
    // Add more airports as needed
};

// Get references to the dropdown and frequency display elements
const airportDropdown = document.getElementById('airport');
const towerFreq = document.getElementById('tower-freq');
const groundFreq = document.getElementById('ground-freq');
const center1Name = document.getElementById('center1-name');
const center1Freq = document.getElementById('center1-freq');
const center2Name = document.getElementById('center2-name');
const center2Freq = document.getElementById('center2-freq');
const center3Name = document.getElementById('center3-name');
const center3Freq = document.getElementById('center3-freq');

// Add event listener to the dropdown
airportDropdown.addEventListener('change', (event) => {
    const selectedAirport = event.target.value;

    if (selectedAirport && airportFrequencies[selectedAirport]) {
        const frequencies = airportFrequencies[selectedAirport];
        towerFreq.textContent = frequencies.tower;
        groundFreq.textContent = frequencies.ground;
        center1Name.textContent = frequencies.centers[0].name;
        center1Freq.textContent = frequencies.centers[0].frequency;
        center2Name.textContent = frequencies.centers[1].name;
        center2Freq.textContent = frequencies.centers[1].frequency;
        center3Name.textContent = frequencies.centers[2].name;
        center3Freq.textContent = frequencies.centers[2].frequency;
    } else {
        // Reset frequencies if no airport is selected
        towerFreq.textContent = "-";
        groundFreq.textContent = "-";
        center1Name.textContent = "-";
        center1Freq.textContent = "-";
        center2Name.textContent = "-";
        center2Freq.textContent = "-";
        center3Name.textContent = "-";
        center3Freq.textContent = "-";
    }
});

// Rest of your existing script.js code...