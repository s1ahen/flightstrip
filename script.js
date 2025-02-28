// Firebase configuration (injected via GitHub Actions)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to the flightStrips collection
const flightStripsRef = db.collection('flightStrips');

document.getElementById('createStrip').addEventListener('click', createFlightStrip);
document.getElementById('deleteMode').addEventListener('click', toggleDeleteMode);

let isDeleteMode = false;

// Load saved strips from Firestore
loadStrips();

function createFlightStrip() {
    const squawk = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const stripData = {
        callsign: document.querySelector('[placeholder="CALLSIGN"]').value,
        type: document.querySelector('[placeholder="TYPE"]').value,
        dep: document.querySelector('[placeholder="DEP"]').value,
        arr: document.querySelector('[placeholder="ARR"]').value,
        flt: document.querySelector('[placeholder="FLT"]').value,
        fltplan: document.querySelector('[placeholder="FLTPLN"]').value,
        notes: document.querySelector('[placeholder="Notes"]').value,
        clearance: document.querySelector('#clearance').value,
        column: 'departure', // Default column
        squawk: squawk,
    };

    // Add the strip to Firestore
    flightStripsRef.add(stripData)
        .then(() => {
            console.log('Flight strip added to Firestore');
        })
        .catch((error) => {
            console.error('Error adding flight strip: ', error);
        });
}

function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => button.classList.toggle('visible', isDeleteMode));
}

function deleteStrip(stripId) {
    flightStripsRef.doc(stripId).delete()
        .then(() => {
            console.log('Flight strip deleted from Firestore');
        })
        .catch((error) => {
            console.error('Error deleting flight strip: ', error);
        });
}

function loadStrips() {
    flightStripsRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const stripData = change.doc.data();
            const stripId = change.doc.id;

            if (change.type === 'added' || change.type === 'modified') {
                updateOrCreateStrip(stripId, stripData);
            }
            if (change.type === 'removed') {
                removeStrip(stripId);
            }
        });
    });
}

function updateOrCreateStrip(stripId, stripData) {
    let strip = document.getElementById(stripId);
    if (!strip) {
        strip = document.createElement('div');
        strip.className = 'flight-strip';
        strip.draggable = true;
        strip.id = stripId;
        strip.innerHTML = `
            <div class="row">
                <input type="text" placeholder="CALLSIGN" value="${stripData.callsign}">
                <input type="text" placeholder="TYPE" value="${stripData.type}">
            </div>
            <div><strong>Squawk:</strong> ${stripData.squawk}</div>
            <div class="row">
                <input type="text" placeholder="DEP" value="${stripData.dep}">
                <input type="text" placeholder="ARR" value="${stripData.arr}">
                <input type="text" placeholder="FLT" value="${stripData.flt}">
            </div>
            <input type="text" placeholder="FLTPLN" value="${stripData.fltplan}">
            <input type="text" placeholder="Notes" value="${stripData.notes}">
            <div class="clearance-status">
                <label for="clearance">Clearance Status:</label>
                <select id="clearance">
                    <option value="yes" ${stripData.clearance === 'yes' ? 'selected' : ''}>Yes</option>
                    <option value="no" ${stripData.clearance === 'no' ? 'selected' : ''}>No</option>
                    <option value="pending" ${stripData.clearance === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="arriving" ${stripData.clearance === 'arriving' ? 'selected' : ''}>Arriving</option>
                </select>
            </div>
            <button class="delete-btn">Delete</button>
        `;
        strip.querySelector('.delete-btn').addEventListener('click', () => deleteStrip(stripId));
        strip.addEventListener('dragstart', dragStart);
        strip.addEventListener('dragend', dragEnd);
        document.getElementById(stripData.column).appendChild(strip);
    } else {
        // Update the existing strip
        strip.querySelector('[placeholder="CALLSIGN"]').value = stripData.callsign || '';
        strip.querySelector('[placeholder="TYPE"]').value = stripData.type || '';
        strip.querySelector('[placeholder="DEP"]').value = stripData.dep || '';
        strip.querySelector('[placeholder="ARR"]').value = stripData.arr || '';
        strip.querySelector('[placeholder="FLT"]').value = stripData.flt || '';
        strip.querySelector('[placeholder="FLTPLN"]').value = stripData.fltplan || '';
        strip.querySelector('[placeholder="Notes"]').value = stripData.notes || '';
        strip.querySelector('#clearance').value = stripData.clearance || '';
        strip.querySelector('div').textContent = `Squawk: ${stripData.squawk}`;
    }
}

function removeStrip(stripId) {
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
        // Update the strip's column in Firestore
        flightStripsRef.doc(id).update({ column: targetColumn.id });
    }
}
