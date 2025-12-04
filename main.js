// import split from "./split";

let obj = {
    p_Len : 0,
    P_Seq:[],
    allocation:[],
    maximum:[],
    need:[],
    avaliable:[],
}


let __ava_len;

let init = (allo,maxim,avaliable,tampil = false) => {
    let array_max_len = Math.max(allo.length,maxim.length,avaliable.length);

    if (obj.p_Len === 0) {
        __ava_len = avaliable.length;
        obj.avaliable.push(avaliable);
    }else{
        obj.avaliable.push(null);
    }

    let need = []
    for (let i = 0; i < __ava_len;i++){
        need.push(maxim[i]-allo[i])
    }

    obj.P_Seq.push(`P${obj.p_Len}`)
    obj.allocation.push(allo);
    obj.maximum.push(maxim);
    obj.need.push(need);
    if (tampil === true){
        console.dir(obj, { 
        depth: null,
        maxArrayLength: null });
    }
    obj.p_Len++;
 

     
}
function padCenter(texts, targetLength, padChar = ' ') {
  // Hitung berapa panjang yang harus dicapai padStart
  // Rumus: (TotalTarget - PanjangTeks) / 2 + PanjangTeks
  let text = String(texts)
  const startLength = Math.floor((targetLength - text.length) / 2) + text.length;
  
  return text.padStart(startLength, padChar).padEnd(targetLength, padChar);
}

let test = () =>{
    testCase = [
        {
            allo:[1,1,0,0],
            maxim:[5,3,2,3],
            ava:[1,0,1,2]
        },
        {
            allo:[2,0,3,2],
            maxim:[4,0,3,3],
            ava:[1,0,1,2]
        },
        {
            allo:[3,3,0,2],
            maxim:[4,3,1,2],
            ava:[1,0,1,2]
        },
        {
            allo:[0,2,2,1],
            maxim:[2,3,3,3],
            ava:[1,0,1,2]
        },
    ]
    for(let i of testCase){
        init(i.allo,i.maxim,i.ava);
    }

    console.log("=".repeat(67));
    console.log(`||${padCenter("Iterasi",10)} | ${padCenter("Allocation",10)} | ${padCenter("maximum",10)} | ${padCenter("need",10)} | ${padCenter("avaliable",10)} ||`);
    console.log("=".repeat(67));
    for (let i = 0 ;i < obj.P_Seq.length;i++){
        // console.log(i);
        console.log(`||${padCenter(obj.P_Seq[i],10)} | ${padCenter(obj.allocation[i],10)} | ${padCenter(obj.maximum[i],10)} | ${padCenter(obj.need[i],10)} | ${padCenter(obj.avaliable[i],10)} ||`);
    }
    console.log("=".repeat(67));
}

test()



