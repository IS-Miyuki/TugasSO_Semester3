export function getCleanDataFromText(text) {
    let lines = text.trim().split('\n');
    let cleanData = [];
    
    for (let i = 0; i < lines.length; i++) {
        // Split by spaces or tabs (handles multiple spaces)
        let numbers = lines[i].trim().split(/\s+/);
        
        // Only keep lines that actually have numbers (avoids empty lines)
        if (numbers.length > 1) {
            cleanData.push(numbers);
        }
    }
    return cleanData;
}

export function normalizeArray(arr, targetLength) {
    // convert ke Number()
    let numberArray = arr.map(num => Number(num));
    
    // +++++++ 0 nek kosong
    while (numberArray.length < targetLength) {
        numberArray.push(0);
    }
    // potong
    return numberArray.slice(0, targetLength);
}