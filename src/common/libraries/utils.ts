export const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new Date(`${year}-${month}-${day}`);
};

export const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
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

export const minusNineHour = (time: Date): Date => {
  time?.setHours(time.getHours() - 9);

  return time;
};

export const plusNineHour = (time: Date): Date => {
  time?.setHours(time.getHours() + 9);

  return time;
};

export const getDatesStartToEnd = (month) => {
  const result = [];
  const arr = month.split('-');
  const end = new Date(arr[0], arr[1], 0).getDate();

  const startDate = new Date(`${arr[0]}-${arr[1]}`);
  const endDate = new Date(`${arr[0]}-${arr[1]}-${end}`);

  while (startDate <= endDate) {
    result.push(startDate.toISOString().split('T')[0]);
    startDate.setDate(startDate.getDate() + 1);
  }
  return result;
};

export const getEmailTemplate = (company, code) => {
  return `
  <html>
  <div style="display: flex; flex-direction: column; align-items: center;">
  <div width: 500px>
      <h1>${company}에 초대되었습니다!</h1>
      <hr />
      <div>
          <p style="font-size: 30px; font-weight:600; color:#111;">합류코드 : ${code}</p>
          <p style="font-size: 30px; font-weight:600; color:#111;">지금 바로 합류하세요!</p>

      </div>
      <hr />
  </div>
  </div>
</html>`;
};

export const checkEmail = (email: string) => {
  const regex =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  return email != '' && email != 'undefined' && regex.test(email);
};

export const currentWeek = (today) => {
  // const today = new Date();
  const sunday = today.getTime() - 86400000 * today.getDay();

  today.setTime(sunday);

  const week = [today.toISOString().slice(0, 10)];

  for (let i = 1; i < 7; i++) {
    today.setTime(today.getTime() + 86400000);
    week.push(today.toISOString().slice(0, 10));
  }

  return [week[0], week[week.length - 1]];
};
