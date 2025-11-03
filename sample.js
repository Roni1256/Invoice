const date=new Date()


const present=date.toISOString();



const present_year=present.slice(0,10).split('-')[0]
const present_month=present.slice(0,10).split('-')[1]
const present_date=present.slice(0,10).split('-')[2]
const present_hour=present.slice(11,19).split(':')[0]
const present_minute=present.slice(11,19).split(':')[1]
const present_second=present.slice(11,19).split(':')[2]

// const past=date.toLocaleDateString().split('/');
// const past_date=past[0]
// const past_month=past[1]
// const past_year=past[2]
// const past_hour=date.getHours()
// const past_minute=date.getMinutes()
// const past_second=date.getSeconds()-10


const past="2025-10-29T17:15:08.967Z"
const past_year=past.slice(0,10).split('-')[0]
const past_month=past.slice(0,10).split('-')[1]
const past_date=past.slice(0,10).split('-')[2]
const past_hour=past.slice(11,19).split(':')[0]
const past_minute=past.slice(11,19).split(':')[1]
const past_second=past.slice(11,19).split(':')[2]



let ago=""
if(present_year>past_year){
    ago=`${present_year-past_year} years ago`
}else if(present_month>past_month){
    ago=`${present_month-past_month} months ago`
}else if(present_date>past_date){
    ago=`${present_date-past_date} days ago`
}else if(present_hour>past_hour){
    ago=`${present_hour-past_hour} hours ago`
}else if (present_minute>past_minute){
    ago=`${present_minute-past_minute} minutes ago`
}else{
    ago=`${present_second-past_second} seconds ago`
}

// if(present_year-past_year<1){
//     if(present_month-past_month<1){
//         if(present_date-past_date<1){
//             if(present_hour-past_hour<1){
//                 if(present_minute-past_minute<1){
//                     if(present_second-past_second<1){
//                         ago=`0 seconds ago`
//                     }else{
//                         ago=`${present_second-past_second} seconds ago`
//                     }
//                 }else{
//                     ago=`${present_minute-past_minute} minutes ago`
//                 }
//             }else{
//                 ago=`${present_hour-past_hour} hours ago`
//             }
//         }else{
//             ago=`${present_date-past_date} days ago`
//         }
//     }else{
//         ago=`${present_month-past_month} months ago`
//     }
// }else{
//     ago=`${present_year-past_year} years ago`
// }
console.log(past);

console.log(present);

console.log(ago);




const id="690247dfd8afa63b9eab518c"
const cid="68fe2e683ee0e6fde55ed356"
console.log(id===cid);
