export const schedule = {
  isApproved: true,
  month: 'Aug',
  breakTimeLengths: [
    {
      shiftLength: 4 * 60,
      breakTime: 15,
    },
    {
      shiftLength: 8 * 60,
      breakTime: 30,
    },
    {
      shiftLength: 11 * 60,
      breakTime: 60,
    },
    {
      shiftLength: 24 * 60,
      breakTime: 90,
    },
  ],
  workTimes: [
    {
      date: new Date('2022-08-01'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
    {
      date: new Date('2022-08-02'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
    {
      date: new Date('2022-08-03'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
    {
      date: new Date('2022-08-04'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
    {
      date: new Date('2022-08-05'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
    {
      date: new Date('2022-08-06'),
      start: '09:00',
      end: '18:00',
      dayOff: true,
    },
    {
      date: new Date('2022-08-07'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
    {
      date: new Date('2022-08-08'),
      start: '09:00',
      end: '18:00',
      dayOff: false,
    },
  ],
};
