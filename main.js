import split_arr from "./split.js";

let obj = {
    p_Len: 0,
    P_Seq: [],
    allocation: [],
    maximum: [],
    need: [],
    avaliable: [],
}


let __ava_len;

let init = (_allo, _maxim, _avil, tampil = false) => {
    let [allocation, maximized, available_len] = split_arr(_allo, _maxim, _avil);
    // Jika objek kosong => masukkan available ke objek
    if (obj.p_Len === 0) {
        obj.avaliable.push(_avil);
        __ava_len = available_len;
    } else {
        obj.avaliable.push(null);
    }

    let need = []
    for (let i = 0; i < __ava_len; i++) {
        need.push(maximized[i] - allocation[i])
    }

    obj.P_Seq.push(`P${obj.p_Len}`)
    obj.allocation.push(allocation);
    obj.maximum.push(maximized);
    obj.need.push(need);

    if (tampil === true) {
        console.dir(obj, {
            depth: null,
            maxArrayLength: null
        });
    }
    obj.p_Len++;
}

let padCenter = (texts, targetLength, padChar = ' ') => {
    // Hitung berapa panjang yang harus dicapai padStart
    // Rumus: (TotalTarget - PanjangTeks) / 2 + PanjangTeks
    let text = String(texts)
    const startLength = Math.floor((targetLength - text.length) / 2) + text.length;

    return text.padStart(startLength, padChar).padEnd(targetLength, padChar);
}

function generateTable(Process, Resource,value) {
    let tableHTML = '<table id="myTable">';

    // Header Group Row
    tableHTML += '<thead>';
    tableHTML += '<tr>';
    tableHTML += '<th rowspan="2" class="header-cell">Process</th>';
    tableHTML += `<th colspan="${Resource}" class="header-cell">Allocation</th>`;
    tableHTML += `<th colspan="${Resource}" class="header-cell">Maximum</th>`;
    tableHTML += `<th colspan="${Resource}" class="header-cell">Available</th>`;
    tableHTML += '</tr>';

    // Header Resource Row
    tableHTML += '<tr>';
    // Allocation Resources
    for (let j = 0; j < Resource; j++) {
        const hurufr = String.fromCharCode(65 + j); 
        tableHTML += `<th class="header-cell">${hurufr}</th>`;
    }
    // Maximum Resources
    for (let j = 0; j < Resource; j++) {
        const hurufm = String.fromCharCode(65 + j); 
        tableHTML += `<th class="header-cell">${hurufm}</th>`;
    }
    // Available Resources
    for (let j = 0; j < Resource; j++) {
        const hurufa = String.fromCharCode(65 + j); 
        tableHTML += `<th class="header-cell">${hurufa}</th>`;
    }
    tableHTML += '</tr>';
    tableHTML += '</thead>';

    // Body
    tableHTML += '<tbody>';
    for (let i = 0; i < Process; i++) {
        tableHTML += '<tr>';
        tableHTML += `<td class="header-cell">P${i}</td>`;

        // Allocation Inputs
        for (let j = 0; j < Resource; j++) {
            tableHTML += `<td><input type="number" class="cell-input allocation" data-row="${i}" data-col="${j}" value="0"></td>`;
        }

        // Maximum Inputs
        for (let j = 0; j < Resource; j++) {
            tableHTML += `<td><input type="number" class="cell-input maximum" data-row="${i}" data-col="${j}" value="0"></td>`;
        }

        // Available Inputs (Only on first row, or maybe we allow updating available per step? Standard is initial available)
        // The user's previous code had available only on the first row.
        // Let's keep it consistent: Inputs on first row, empty on others.
        if (i === 0) {
            for (let j = 0; j < Resource; j++) {
                tableHTML += `<td><input type="number" class="cell-input available" data-col="${j}" value="0"></td>`;
            }
        } else {
            for (let j = 0; j < Resource; j++) {
                tableHTML += `<td></td>`;
            }
        }

        tableHTML += '</tr>';
    }
    tableHTML += '</tbody>';
    tableHTML += '</table>';

    tableHTML += '<div style="text-align:center; margin-top:1rem;"><button onclick="runAlgorithm()">Run Algorithm</button></div>';
    document.getElementById('table-container').innerHTML = tableHTML;
}


// On Going =====================================================
let trimData = (data) => {
    data = data.trim().split('\n');
    let out = [];
    for (let i = 0; i < data.length; i++) {
        let temp = []
        let split = data[i].split(' ')
        console.log(`split i-${i}: ${split}`);
        for (let j = 0; j < split.length; j++) {
            temp.push(split[j]);
        }
        out.push(temp);
        console.log(`out i - ${i}: ${out}`);    
    }
    console.log(out);    
    return out;

    // return data.trim().split('\n').map(row => row.trim().split(' '));
}

document.getElementById('generate-btn').addEventListener('click', () => {
    const areaValue = document.getElementById('bulk-input').value;
    const processes = document.getElementById('process-count');
    const resources = document.getElementById('resource-count');

    let processes_val = processes.value;
    let resources_val = resources.value;

    if (areaValue === '') {
        console.log(trimData(areaValue));
        generateTable(parseInt(processes_val), parseInt(resources_val));
        return;
    }else if(trimData(areaValue)[0].length % 3 === 0 ){
        
        processes.value = trimData(areaValue).length;
        resources.value = trimData(areaValue)[0].length / 3; // dibagi 3 [allocation, maximum, available]

        console.log(`Resources: ${resources.value}` );
        console.log(`Processes: ${processes.value}`);
        console.log(trimData(areaValue));
        generateTable(processes.value,resources.value ,trimData(areaValue));
    } 

    
    /*
    1 2 3 1 3 4 3 4 5
    3 5 6 1 3 4
    */
});

// function displayResults() {
//     let html = '<h3>Results</h3>';
//     html += '<table>';
//     html += '<tr><th>Process</th><th>Allocation</th><th>Maximum</th><th>Need</th><th>Available After</th></tr>';

//     for (let i = 0; i < obj.P_Seq.length; i++) {
//         html += '<tr>';
//         html += `<td>${obj.P_Seq[i]}</td>`;
//         html += `<td>${obj.allocation[i].join(', ')}</td>`;
//         html += `<td>${obj.maximum[i].join(', ')}</td>`;
//         html += `<td>${obj.need[i].join(', ')}</td>`;
//         html += `<td>${obj.avaliable[i] ? obj.avaliable[i].join(', ') : ''}</td>`;
//         html += '</tr>';
//     }
//     html += '</table>';
//     if (typeof document !== 'undefined') {
//         document.getElementById('result-container').innerHTML = html;
//     }
// }

// DOM Elements
// if (typeof document !== 'undefined') {
//     const generateBtn = document.getElementById('generate-btn');
//     const tableContainer = document.getElementById('table-container');
//     const resultContainer = document.getElementById('result-container');
//     const processInput = document.getElementById('process-count');
//     const resourceInput = document.getElementById('resource-count');

//     generateBtn.addEventListener('click', () => {
//         const processes = parseInt(processInput.value);
//         const resources = parseInt(resourceInput.value);
//         generateTable(processes, resources);
//     });

//     window.runAlgorithm = () => {
//         const rows = parseInt(processInput.value);
//         const cols = parseInt(resourceInput.value);

//         let allocation = [];
//         let maximum = [];
//         let available = [];

//         // Collect Allocation
//         for (let i = 0; i < rows; i++) {
//             let row = [];
//             for (let j = 0; j < cols; j++) {
//                 const val = document.querySelector(`.allocation[data-row="${i}"][data-col="${j}"]`).value;
//                 row.push(parseInt(val));
//             }
//             allocation.push(row);
//         }

//         // Collect Maximum
//         for (let i = 0; i < rows; i++) {
//             let row = [];
//             for (let j = 0; j < cols; j++) {
//                 const val = document.querySelector(`.maximum[data-row="${i}"][data-col="${j}"]`).value;
//                 row.push(parseInt(val));
//             }
//             maximum.push(row);
//         }

//         // Collect Available
//         for (let j = 0; j < cols; j++) {
//             const val = document.querySelector(`.available[data-col="${j}"]`).value;
//             available.push(parseInt(val));
//         }

//         // Reset global object
//         obj = {
//             p_Len: 0,
//             P_Seq: [],
//             allocation: [],
//             maximum: [],
//             need: [],
//             avaliable: [],
//         };

//         for (let i = 0; i < rows; i++) {
//             init(allocation[i], maximum[i], available);
//         }

//         displayResults();
//     }
// }



// =============== TEST CASE ===============

let test = () => {
    let testCase = [
        {
            allo: "1 1 0 0",
            maxim: "5 3 2 3",
            ava: "1 0 1 2"
        },
        {
            allo: "2 0 3 2",
            maxim: "4 0 3 3",
            ava: "1 0 1 2"
        },
        {
            allo: "3 3 0 2",
            maxim: "4 3 1 2",
            ava: "1 0 1 2"
        },
        {
            allo: "0 2 2 1",
            maxim: "2 3 3 3",
            ava: "1 0 1 2"
        },
    ]
    for (let i of testCase) {
        init(i.allo, i.maxim, i.ava);
    }

    console.log("=".repeat(67));
    console.log(`||${padCenter("Iterasi", 10)} | ${padCenter("Allocation", 10)} | ${padCenter("maximum", 10)} | ${padCenter("need", 10)} | ${padCenter("avaliable", 10)} ||`);
    console.log("=".repeat(67));
    for (let i = 0; i < obj.P_Seq.length; i++) {
        console.log(`||${padCenter(obj.P_Seq[i], 10)} | ${padCenter(obj.allocation[i], 10)} | ${padCenter(obj.maximum[i], 10)} | ${padCenter(obj.need[i], 10)} | ${padCenter(obj.avaliable[i], 10)} ||`);
    }
    console.log("=".repeat(67));
}

if (typeof document === 'undefined') {
    test();
}

