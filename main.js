let obj = {
    p_Len : 0,
    P_Seq:[],
    allocation:[],
    maximum:[],
    need:[],
    avaliable:[],
}

let split = () => {
    
}
let __ava_len;

let init = (allo,maxim,avaliable) => {
    let array_max_len = Math.max(allo.length,maxim.length,avaliable.length);
    console.log(array_max_len);

    if (obj.p_Len === 0) {
        __ava_len = avaliable.length;
    }
    
    if (allo.length > ava_len){

    }
    
    obj.maximum.push(maxim);
    obj.avaliable.push(avaliable);

    console.table(obj);
    window.alert(obj);

    // if (obj.maximum.length !== 0) {
    //     obj.allocation = allo;
    //     obj.maximum = maxim;
    //     obj.avaliable = avaliable;
    //     obj.need = 
    // }
    // let panjang = obj.maximum.length;
    // let lebar = obj.maximum[0].length;
    
    // obj.p_Len++;
    // obj.P_Seq.push(`P${obj.p_Len-1}`);   
}

let allocation1 = [1,0,2,4];
let maximum2 = [3,2,2];
let avaliable3 = [3,3,2];

init(allocation1,maximum2,avaliable3);