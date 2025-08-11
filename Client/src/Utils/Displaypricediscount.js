export const displaydiscount=(price,discount)=>{
    return (price-(price*discount/100)).toFixed(2)
}
