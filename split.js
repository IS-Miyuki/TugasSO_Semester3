// let body = document.querySelector('body');

export 







on split_arr(allocation, maximum, need, available){
    let available_len = available.length;
    let allocation_arr = allocation.split(" ").map(Number);
    let maximum_arr = maximum.split(" ").map(Number);
    let need_arr = need.split(" ").map(Number);

    while(allocation_arr.length < available_len){
        allocation_arr.push(0);
    }
    while(allocation_arr.length > available_len){
        allocation_arr.pop();  
    }

    while(maximum_arr.length < available_len){
        maximum_arr.push(0);
    }
    while(maximum_arr.length > available_len){
        maximum_arr.pop();
    }

    while(need_arr.length < available_len){
        need_arr.push(0);
    }
    while(need_arr.length > available_len){
        need_arr.pop();
    }

    return [allocation_arr, maximum_arr, need_arr]
}

let result = split_arr("1 0 1", "2 3 4", "1 2 3", [3, 3, 2, 5, 6]);
let result2 = split_arr("1 0 1", "2 3 4", "1 2 3", [3, 3]);
let result3 = split_arr("1 0 1", "2 3 4", "1 2 3", [3, 3, 1]);
let result_dict = {"Allocation": result[0], "Maximum": result[1], "Need" : result[2]}
let result_dict2 = {"Allocation": result2[0], "Maximum": result2[1], "Need" : result2[2]}
let result_dict3 = {"Allocation": result3[0], "Maximum": result3[1], "Need" : result3[2]}
console.table(result_dict);
console.table(result_dict2);
console.table(result_dict3);