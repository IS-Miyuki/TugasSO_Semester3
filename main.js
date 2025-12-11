import { getCleanDataFromText, normalizeArray } from './split.js';

let memory = {
    processes: 0,
    resources: 0,
    alloc: [],   
    max: [],     
    need: [],    
    work: [],    
    finished: [], 
    safePath: [], 
    isRunning: false
};

// ==========================================
// 2. DOM EVENT LISTENERS
// ==========================================
// Check if document exists (browser environment)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Listen for the "Generate" button click
        const genBtn = document.getElementById('generate-btn');
        if (genBtn) {
            genBtn.addEventListener('click', handleGenerateTable);
        }
    });
}

// ==========================================
// 3. UI GENERATION
// ==========================================
function handleGenerateTable() {
    const rawText = document.getElementById('bulk-input').value;
    const pInput = document.getElementById('process-count');
    const rInput = document.getElementById('resource-count');

    let preFillData = null;

    // Check if user pasted data
    if (rawText.trim() !== '') {
        let cleanData = getCleanDataFromText(rawText);
        if (cleanData.length > 0) {
            pInput.value = cleanData.length;
            
            const totalCols = cleanData[0].length;
            rInput.value = Math.ceil(totalCols / 4);
            
            preFillData = cleanData;
        }
    }

    const rowCount = parseInt(pInput.value);
    const colCount = parseInt(rInput.value);

    generateHTMLTable(rowCount, colCount, preFillData);
}

function generateHTMLTable(rowCount, colCount, preFillData = null) {
    let html = '<table id="bankerTable">';

    html += `
    <thead>
        <tr>
            <th rowspan="3" class="header-cell">Process</th>
            <th colspan="${colCount}" class="header-cell">Allocation</th>
            <th colspan="${colCount}" class="header-cell">Maximum</th>
            <th colspan="${colCount}" class="header-cell">Available</th>
            <th colspan="${colCount}" class="header-cell">Need</th>
        </tr>
        <tr>`;

    // Generate A, B, C... headers
    for(let k=0; k<4; k++) {
        for(let j=0; j<colCount; j++) {
            html += `<th class="header-cell">${String.fromCharCode(65 + j)}</th>`;
        }
    }
    html += `</tr></thead>`;

    // --- BODY ---
    html += '<tbody>';
    for (let i = 0; i < rowCount; i++) {
        html += `<tr id="process-row-${i}">`;
        html += `<td class="header-cell">P${i}</td>`;

        // Get row data if available
        let rowData = preFillData && preFillData[i] ? preFillData[i] : null;

        // Split data into chunks: Alloc, Max, Avail
        // normalizeArray will handle the padding with 0s if the slice is short
        let allocData = rowData ? normalizeArray(rowData.slice(0, colCount), colCount) : [];
        let maxData   = rowData ? normalizeArray(rowData.slice(colCount, colCount*2), colCount) : [];
        let availData = rowData ? normalizeArray(rowData.slice(colCount*2, colCount*3), colCount) : [];

        for (let j = 0; j < colCount; j++) {
            let val = rowData ? allocData[j] : 0;
            html += `<td><input type="number" class="cell-input input-allocation" data-row="${i}" data-col="${j}" value="${val}"></td>`;
        }

        for (let j = 0; j < colCount; j++) {
            let val = rowData ? maxData[j] : 0;
            html += `<td><input type="number" class="cell-input input-maximum" data-row="${i}" data-col="${j}" value="${val}"></td>`;
        }

        for (let j = 0; j < colCount; j++) {
            if (i === 0) {
                let val = rowData ? availData[j] : 0;
                html += `<td><input type="number" class="cell-input input-available" data-col="${j}" value="${val}"></td>`;
            } else {
                html += `<td class="work-display" data-row="${i}" data-col="${j}"></td>`;
            }
        }

        for (let j = 0; j < colCount; j++) {
            html += `<td class="need-display" data-row="${i}" data-col="${j}">0</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';

    // Inject Controls (Buttons + Log)
    html += `
        <div class="algo-controls" style="text-align:center; margin-top:20px;">
            <button id="btn-start" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Start Simulation</button>
            <button id="btn-next" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;" disabled>Next Step &rarr;</button>
            <div id="status-display" style="margin-top:15px; font-weight:bold; font-size: 1.1em;"></div>
        </div>
        <div id="log-container" class="log-box" style="margin-top: 15px; border: 1px solid #ccc; padding: 10px; height: 150px; overflow-y: auto; background: #f9f9f9; text-align: left;">
            Logs will appear here...
        </div>
    `;

    document.getElementById('table-container').innerHTML = html;

    // Add listeners to new buttons
    document.getElementById('btn-start').addEventListener('click', startSimulation);
    document.getElementById('btn-next').addEventListener('click', runNextStep);
}


function startSimulation() {
    const logBox = document.getElementById('log-container');
    let pCount = parseInt(document.getElementById('process-count').value);
    let rCount = parseInt(document.getElementById('resource-count').value);

    // kembaliin input kalau berubah
    const availInputs = document.querySelectorAll('.input-available');
    availInputs.forEach(input => {
        if (input.dataset.initial) {
            input.value = input.dataset.initial; // Restore original value
        }
        // Save the current value as the initial value for this run
        input.dataset.initial = input.value;
    });

    // Reset Table UI (Clear Work Displays)
    document.querySelectorAll('.work-display').forEach(td => td.innerText = '');

    // Reset Memory
    memory = {
        processes: pCount,
        resources: rCount,
        alloc: [],
        max: [],
        need: [],
        work: [],
        finished: new Array(pCount).fill(false),
        safePath: [],
        isRunning: true
    };

    // 1. Read Inputs
    for(let i=0; i<pCount; i++) {
        let rowAlloc = [];
        let rowMax = [];
        for(let j=0; j<rCount; j++) {
            let aVal = document.querySelector(`.input-allocation[data-row="${i}"][data-col="${j}"]`).value;
            let mVal = document.querySelector(`.input-maximum[data-row="${i}"][data-col="${j}"]`).value;
            rowAlloc.push(Number(aVal));
            rowMax.push(Number(mVal));
        }
        memory.alloc.push(rowAlloc);
        memory.max.push(rowMax);
    }

    // available
    for(let j=0; j<rCount; j++) {
        let avaVal = document.querySelector(`.input-available[data-col="${j}"]`).value;
        memory.work.push(Number(avaVal));
    }

    // need
    for(let i=0; i<pCount; i++) {
        let rowNeed = [];
        for(let j=0; j<rCount; j++) {
            rowNeed.push(memory.max[i][j] - memory.alloc[i][j]);
        }
        memory.need.push(rowNeed);
    }

    // Display Need calculation in log
    logBox.innerHTML += `<div class="log-item" style="border-bottom:1px solid #eee; padding:5px 0;">
        <span style="color:blue; font-weight:bold;">Need Calculation:</span><br>
        Need[i][j] = Maximum[i][j] - Allocation[i][j]
    </div>`;

    // Update Need display in UI
    for(let i=0; i<pCount; i++) {
        for(let j=0; j<rCount; j++) {
            let needCell = document.querySelector(`.need-display[data-row="${i}"][data-col="${j}"]`);
            if(needCell) {
                needCell.innerText = memory.need[i][j];
            }
        }
    }

    // UI Updates
    document.getElementById('btn-next').disabled = false;
    document.getElementById('btn-start').disabled = true;
    document.getElementById('log-container').innerHTML = "<div>System Initialized. Ready to find Safe Sequence...</div>";
    document.getElementById('status-display').innerHTML = `Current Work (Available): [ ${memory.work.join(', ')} ]`;
    
    // Clear colors
    document.querySelectorAll('tr').forEach(tr => {
        tr.classList.remove('process-safe', 'process-deadlock');
        tr.style.backgroundColor = ''; // Reset inline styles if any
    });
}

function runNextStep() {
    if (!memory.isRunning) return;

    let foundSafeProcess = false;

    for (let i = 0; i < memory.processes; i++) {
        if (memory.finished[i] === false) {

            // cek amungkin ngga kalau available ambil proses ini
            let possible = true;
            for (let j = 0; j < memory.resources; j++) {
                if (memory.need[i][j] > memory.work[j]) {
                    possible = false;
                    break; 
                }
            }
// di sini buat cek apakah bisa ngga nya nanti 
            if (possible) {
                foundSafeProcess = true;

                // available = cur_available + allocation 
                let oldWork = [...memory.work];
                for (let j = 0; j < memory.resources; j++) {
                    memory.work[j] = memory.work[j] + memory.alloc[i][j];
                }

                memory.finished[i] = true;
                memory.safePath.push(`P${i}`);

                updateUI_Success(i, oldWork, memory.work);
                return; // Exit after doing ONE step
            }
        }
    }

    if (!foundSafeProcess) {
        checkFinalResult();
    }
}

function updateUI_Success(processIndex, oldWork, newWork) {
    const logBox = document.getElementById('log-container');
    const row = document.getElementById(`process-row-${processIndex}`);
    
    // Simple green highlight
    row.style.backgroundColor = '#d4edda'; 
    
    // VISUAL UPDATE: Update Available columns to show change
    for(let j = 0; j < memory.resources; j++) {
        // Update the Input fields at the top (Row 0) to serve as a global counter
        let inputEl = document.querySelector(`.input-available[data-col="${j}"]`);
        if(inputEl) inputEl.value = newWork[j];

        // Update the "work-display" cells for the process that just finished (if not Row 0)
        let displayCell = document.querySelector(`.work-display[data-row="${processIndex}"][data-col="${j}"]`);
        if(displayCell) {
            displayCell.innerText = newWork[j];
            displayCell.style.fontWeight = 'bold';
            displayCell.style.color = 'blue';
        }
    }

    logBox.innerHTML += `
        <div class="log-item" style="border-bottom:1px solid #eee; padding:5px 0;">
            <span style="color:green; font-weight:bold;">P${processIndex} runs!</span> 
            Need <= Available ([${oldWork}]). 
            <br>
            Returns Alloc: [${memory.alloc[processIndex]}]. 
            New Available: [${newWork}].
        </div>
    `;
    logBox.scrollTop = logBox.scrollHeight;
    
    document.getElementById('status-display').innerHTML = `Current Work (Available): [ ${newWork.join(', ')} ]`;
}

function checkFinalResult() {
    let allDone = memory.finished.every(status => status === true);
    const logBox = document.getElementById('log-container');
    const nextBtn = document.getElementById('btn-next');

    if (allDone) {
        logBox.innerHTML += `<div class="log-item" style="background:#e8f5e9; padding:10px; margin-top:5px; border:1px solid green;">
            <strong>SAFE SEQUENCE FOUND:</strong> <br>
            ${memory.safePath.join(' &rarr; ')}
        </div>`;
        nextBtn.innerText = "Completed";
        nextBtn.disabled = true;
        document.getElementById('status-display').innerText = "System is Safe.";
    } else {
        logBox.innerHTML += `<div class="log-item" style="background:#ffebee; padding:10px; margin-top:5px; border:1px solid red; color:red;">
            <strong>DEADLOCK DETECTED!</strong> <br>
            No more processes can run.
        </div>`;
        
        memory.finished.forEach((isDone, idx) => {
            if (!isDone) {
                document.getElementById(`process-row-${idx}`).style.backgroundColor = '#f8d7da';
            }
        });
        
        nextBtn.innerText = "Deadlock";
        nextBtn.disabled = true;
        document.getElementById('status-display').innerText = "System is Unsafe.";
    }
    memory.isRunning = false;
    document.getElementById('btn-start').disabled = false;
}