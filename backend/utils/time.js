const { DateTime } = require("luxon");

const getCurrentTime = () => {
  return DateTime.now().setZone("Asia/Jakarta");
};
const getFormatTime = () => {
  return DateTime.now().setZone("Asia/Jakarta").toFormat("yyyyMMddHHmmss");
};
const calculateEndDate = (startDate, durationInMonths) => {
  const start = DateTime.fromJSDate(startDate);
  return start.plus({ months: durationInMonths }).toJSDate();
};
module.exports = {
  getCurrentTime,
  getFormatTime,
  calculateEndDate
};
