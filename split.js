export function getCleanDataFromText(text) {
    let lines = text.trim().split('\n');
    let cleanData = [];
    
    for (let i = 0; i < lines.length; i++) {
        let numbers = lines[i].trim().split(/\s+/);
        if (numbers.length > 1) {
            cleanData.push(numbers);
        }
    }
    return cleanData;
}

export function normalizeArray(arr, targetLength) {
    let numberArray = arr.map(num => Math.abs(Number(num)));
    console.log(numberArray)
    
    // +++++++ 0 nek kosong
    while (numberArray.length < targetLength) {
        numberArray.push(0);
    }
    // potong
    return numberArray.slice(0, targetLength);
}