String.prototype.toDate = function (format) {
  var normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems = normalizedFormat.split('-');
  var dateItems = normalized.split('-');

  var monthIndex = formatItems.indexOf('mm');
  var dayIndex = formatItems.indexOf('dd');
  var yearIndex = formatItems.indexOf('yyyy');
  var hourIndex = formatItems.indexOf('hh');
  var minutesIndex = formatItems.indexOf('ii');
  var secondsIndex = formatItems.indexOf('ss');

  var today = new Date();

  var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
  var month =
    monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
  var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();

  var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
  var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
  var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year, month, day, hour, minute, second);
};

var monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
var dayOfWeekNames = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday"
];
function formatDate(date, patternStr){
    if (!patternStr) {
        patternStr = 'M/d/yyyy';
    }
    var day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        miliseconds = date.getMilliseconds(),
        h = hour % 12,
        hh = twoDigitPad(h),
        HH = twoDigitPad(hour),
        mm = twoDigitPad(minute),
        ss = twoDigitPad(second),
        aaa = hour < 12 ? 'AM' : 'PM',
        EEEE = dayOfWeekNames[date.getDay()],
        EEE = EEEE.substr(0, 3),
        dd = twoDigitPad(day),
        M = month + 1,
        MM = twoDigitPad(M),
        MMMM = monthNames[month],
        MMM = MMMM.substr(0, 3),
        yyyy = year + "",
        yy = yyyy.substr(2, 2)
    ;
    // checks to see if month name will be used
    patternStr = patternStr
      .replace('hh', hh).replace('h', h)
      .replace('HH', HH).replace('H', hour)
      .replace('mm', mm).replace('m', minute)
      .replace('ss', ss).replace('s', second)
      .replace('S', miliseconds)
      .replace('dd', dd).replace('d', day)
      
      .replace('EEEE', EEEE).replace('EEE', EEE)
      .replace('yyyy', yyyy)
      .replace('yy', yy)
      .replace('aaa', aaa);
    if (patternStr.indexOf('MMM') > -1) {
        patternStr = patternStr
          .replace('MMMM', MMMM)
          .replace('MMM', MMM);
    }
    else {
        patternStr = patternStr
          .replace('MM', MM)
          .replace('M', M);
    }
    return patternStr;
}
function twoDigitPad(num) {
    return num < 10 ? "0" + num : num;
}
