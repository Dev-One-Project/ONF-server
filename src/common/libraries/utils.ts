export const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
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
    result.push(new Date(startDate.toISOString().split('T')[0]));
    startDate.setDate(startDate.getDate() + 1);
  }
  return result;
};

export const dateGetDatesStartToEnd = (date) => {
  const result = [];
  const end = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  const startDate = new Date(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
  );

  const endDate = new Date(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${end}`,
  );

  while (startDate <= endDate) {
    result.push(new Date(startDate.toISOString().split('T')[0]));
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

export const getNewEmailTemplate = (newEmail, code) => {
  return `
  <html>
  <div style="display: flex; flex-direction: column; align-items: center;">
  <div width: 500px>
      <h1>새로운 이메일 ${newEmail}으로 변경을 확인합니다.</h1>
      <hr />
      <div>
          <p style="font-size: 30px; font-weight:600; color:#111;">인증코드 : ${code}</p>
          <p style="font-size: 30px; font-weight:600; color:#111;">인증코드를 입력해주세요</p>

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
  today = new Date(today);
  const sunday = today.getTime() - 86400000 * today.getDay();

  today.setTime(sunday);

  const week = [today.toISOString().slice(0, 10)];

  for (let i = 1; i < 7; i++) {
    today.setTime(today.getTime() + 86400000);
    week.push(today.toISOString().slice(0, 10));
  }

  return [week[0], week[week.length - 1]];
};

export const changeTime = (today, time) => {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  const front = time.slice(0, 2);
  const back = time.slice(2);

  return new Date(`${year}-${month}-${date}T${front}:${back}:00.000Z`);
};

export const timeDiff = (time1, time2) => {
  const date = new Date();

  const offset = date.getTimezoneOffset();

  date.setMinutes(offset);
  date.setHours(0, 0, 0, 0);

  date.setHours(Number(time1.split(':')[0]) + 9, time1.split(':')[1]);
  const date1 = new Date(date);
  date.setHours(Number(time2.split(':')[0]) + 9, time2.split(':')[1]);
  const date2 = new Date(date);

  let diffMilliseconds = Math.abs(Number(date1) - Number(date2));

  if (date2 < date1) {
    diffMilliseconds += 86400000;
  }

  const diffMinutes = Math.floor(diffMilliseconds / 1000 / 60);
  const hours = Math.floor(diffMinutes / 60);

  return hours;
};

export const timeRange = (time1, time2) => {
  const date1 = new Date(time1);

  const date2 = new Date(date1);

  const offset = date2.getTimezoneOffset();
  date2.setMinutes(offset);
  date2.setHours(0, 0, 0, 0);

  date2.setHours(Number(time2.split(':')[0]) + 9, time2.split(':')[1]);

  const diffMilliseconds = Math.abs(Number(date2) - Number(date1));

  let diffMinutes = Math.floor(diffMilliseconds / 60000);

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours >= 1) {
    diffMinutes -= diffHours * 60;
  }

  if (date1 < date2) {
    return diffHours > 0
      ? `- ${diffHours}시간 ${diffMinutes}분`
      : `- ${diffMinutes}분`;
  } else {
    return diffHours > 0
      ? `+ ${diffHours}시간 ${diffMinutes}분`
      : `+ ${diffMinutes}분`;
  }
};

export const timeArr = (start, end) => {
  const result = [];
  start = new Date(start);
  end = new Date(end);
  while (start <= end) {
    result.push(new Date(start.toISOString().split('T')[0]));
    start.setDate(start.getDate() + 1);
  }
  return result;
};
