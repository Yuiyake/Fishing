// // start: "2021-12-21", end:"2022-02-04"
// function changeDate(start, end) {
//   let res = [];
//   let obj = {
//     month: "",
//     start: "",
//     end: ""
//   };
//   let startTime = new Date(start), 
//   endTime = new Date(end);
//   const getDistanceMonth = (startTime, endTime) => {
//     startTime = new Date(startTime)
//     endTime = new Date(endTime)
//     let dateToMonth = 0
//     const startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() / 24 / 60
//     const endDate = endTime.getDate() + endTime.getHours() / 24 + endTime.getMinutes() / 24 / 60
//     if (endDate >= startDate) {
//       dateToMonth = 0
//     } else {
//       dateToMonth = -1
//     }
//     const yearToMonth = (endTime.getYear() - startTime.getYear()) * 12
//     const monthToMonth = endTime.getMonth() - startTime.getMonth()
//     return yearToMonth + monthToMonth + dateToMonth + 1
//   }
//   let disMonth = getDistanceMonth(startTime, endTime)+1;
//   for(let i=0; i<disMonth; i++) {
//     let first = i===0? true:false,
//         end = i === disMonth-1? true:false;
//     let year = startTime.getMonth()+1+i>12? startTime.getFullYear()+1 : startTime.getFullYear(),
//         month = startTime.getMonth()+1+i > 12? i : startTime.getMonth()+1+i ,
//         startDay = first? startTime.getDate() : '01'
//         endDay = end? getLastDay(endTime) : getLastDay(new Date(year, month))
//       obj.month = year + '-' + month
//       obj.start = year + '-' + month + "-" + startDay
//       obj.end = year + '-' + month + '-' + getLastDay(startTime)
    
      
//     console.log(obj)
//   }
// }
// function getLastDay(str) {
//   let date = new Date(str);
//   let year = date.getFullYear();
//   let month = date.getMonth()+1;
//   let dateObj = new Date(year, month, 0);
//   let theLastDay = dateObj.getDate();
//   return theLastDay;
// }


// changeDate("2021-1-21","2022-02-04");

// var array = [1, [2, [3, [4, 5]]]];
// // reduce
// function flatDeep2(arr){
// 	return arr.reduce((pre, next) => {
//     return pre.concat(Array.isArray(next)? flatDeep2(next) : next);
//   }, [])
// }
// console.log(flatDeep2(array));

// var pivotIndex = function(nums) {
//   if(nums < 2) return -1;
//   let l=0, r=nums.length-1;
//   let leftArr = [nums[l]], rightArr = [nums[r]];
//   while(l < r) {
//       if(typeof(addNum(leftArr, rightArr)) === 'number') {
//           console.log(leftArr, rightArr);
//           return l;
//       } else if(addNum(leftArr, rightArr) === 'leftMax'){
//           r -= 1;
//           rightArr.push(nums[r]);
//       } else {
//           l += 1;
//           leftArr.push(nums[l])
//       }
//   }
//   return -1;
// };
// function addNum(left, right) {
//   leftSum = 0, rightSum = 0;
//   for(let item of left) {
//       leftSum += item;
//   }
//   for(let item of right) {
//       rightSum += item;
//   }
//   if(leftSum === rightSum) {
//     return 1;
//   } else {
//     return leftSum > rightSum? 'leftMax':'rightMax'
//   }
// }
// pivotIndex([1,7,3,6,5,6])

const fn = (...args) => {
  for(const arg of args) {
    console.log(arg);
  }
}
const [a, b] = [1, 2];
console.log(fn(`${a} + ${b} = ${a+b}`));



