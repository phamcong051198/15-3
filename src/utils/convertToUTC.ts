import * as moment from 'moment';

export function convertToUTC(timeString: string, timeDate: string) {
  return moment(timeString)
    .utcOffset(timeDate)
    .format(`DD/MM HH:mm (${timeDate})`);
}
