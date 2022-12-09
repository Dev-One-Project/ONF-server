export const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new Date(`${year}-${month}-${day}`);
};

export const dayOfTheWeek = () => {
  const weekday = ['일', '월', '화', '수', '목', '금', '토'];

  const day = new Date(getToday()[0], getToday()[1] - 1, getToday()[2]);

  return weekday[day.getDay()];
};

// export const totalTime = (start: Date, end: Date) => {
//   const total = [];
//   let workMinute: number;
//   const startTimeHour = start.getHours();
//   const startTimeMinutes = start.getMinutes();
//   const endTimeHour = end.getHours();
//   const endTimeMinutes = end.getMinutes();
//   const startMonth = start.getMonth()
//   const endMonth = end.getMonth()

//   if (startTimeHour > endTimeHour) {
//     if (startTimeMinutes > endTimeMinutes) {
//       workMinute = endTimeMinutes + 60 - startTimeMinutes;
//       total.push(endTimeHour + (24 - startTimeHour) - 1, workMinute);
//     } else {
//       workMinute = endTimeMinutes - startTimeMinutes;
//       total.push(endTimeHour + (24 - startTimeHour), workMinute);
//     }
//   } else if(startTimeHour === endTimeHour) {
//     if(startMonth === endMonth) {
//       workMinute = endTimeMinutes - startTimeMinutes
//       total.push(0, workMinute)
//     } else if(startMonth < endMonth) {

//     }

//   }
//   else {
//     if (startTimeMinutes > endTimeMinutes) {
//       workMinute = endTimeMinutes + 60 - startTimeMinutes;
//       total.push(endTimeHour - startTimeHour - 1, workMinute);
//     } else {
//       workMinute = endTimeMinutes - startTimeMinutes;
//       total.push(endTimeHour - startTimeHour, workMinute);
//     }
//   }

//   // if (startTimeMinutes > endTimeMinutes) {
//   //   workMinute = endTimeMinutes + 60 - startTimeMinutes;
//   //   total.push(endTimeHour - startTimeHour - 1, workMinute);
//   // } else {
//   //   workMinute = endTimeMinutes - startTimeMinutes;
//   //   total.push(endTimeHour - startTimeHour, workMinute);
//   // }

//   return `${total[0]}시간 ${total[1]}분`;
// };

export const totalTime = (start: Date, end: Date): any => {
  const total = new Date((end as any) - (start as any));

  const hour = total.getHours();
  const minutes = total.getMinutes();

  return `${hour}시간 ${minutes}분`;
};

export const updateTotalTime = (start: Date, end: Date): any => {
  const total = new Date((end as any) - (start as any));

  const hour = total.getHours();
  const minutes = total.getMinutes();

  return `${hour - 9}시간 ${minutes}분`;
};

export const minusNineHour = (time: Date): Date => {
  time.setHours(time.getHours() - 9);

  return time;
};
