document.getElementById('createStrip').addEventListener('click', createFlightStrip);

function createFlightStrip() {
    const squawk = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const strip = document.createElement('div');
    strip.className = 'flight-strip departure';
    strip.draggable = true;
    strip.id = `strip-${Date.now()}`; // Unique ID for each strip
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
    `;
    strip.addEventListener('dragstart', dragStart);
    strip.addEventListener('dragend', dragEnd);
    document.getElementById('departure').appendChild(strip);
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
    document.querySelectorAll('.column').forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', drop);
    });
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(column => {
        column.classList.remove('hovered');
    });
}

function dragOver(event) {
    event.preventDefault();
    event.target.classList.add('hovered');
}

function dragLeave(event) {
    event.target.classList.remove('hovered');
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggable = document.getElementById(id);
    const targetColumn = event.target.closest('.column'); // Ensure we drop into a column

    if (targetColumn) {
        targetColumn.appendChild(draggable);

        // Update the card's color based on the column it's dropped into
        draggable.classList.remove('departure', 'approach', 'ground', 'tower');
        draggable.classList.add(targetColumn.id);
    }

    draggable.classList.remove('dragging');
    event.target.classList.remove('hovered');
}

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('dragleave', dragLeave);
    column.addEventListener('drop', drop);
});