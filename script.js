document.getElementById('createStrip').addEventListener('click', createFlightStrip);
document.getElementById('deleteMode').addEventListener('click', toggleDeleteMode);

let isDeleteMode = false;

function createFlightStrip() {
    const squawk = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const strip = document.createElement('div');
    strip.className = 'flight-strip';
    strip.draggable = true;
    strip.id = `strip-${Date.now()}`;
    strip.innerHTML = `
        <div class="row">
            <input type="text" placeholder="CALLSIGN">
            <input type="text" placeholder="TYPE">
        </div>
        <div><strong>Squawk:</strong> ${squawk}</div>
        <div class="row">
            <input type="text" placeholder="DEP">
            <input type="text" placeholder="ARR">
            <input type="text" placeholder="FLT">
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
    strip.querySelector('.delete-btn').addEventListener('click', () => deleteStrip(strip.id));
    strip.addEventListener('dragstart', dragStart);
    strip.addEventListener('dragend', dragEnd);
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
        targetColumn.appendChild(draggable);
    }
}