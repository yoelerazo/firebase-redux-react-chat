import moment from 'moment';

export function formatByDay(targetdate) {

  let now = moment(moment().format('MM.DD.YYYY'), 'MM.DD.YYYY');
  let date = moment(moment(targetdate, "x").format('MM.DD.YYYY'), 'MM.DD.YYYY');
  let diffDays = now.diff(date, 'days');
  
  if(diffDays === 0) {
      return "Today";
  } else if(diffDays === 1) {
      return "Yesterday";
  } else {
      return date.format('DD.MM.YYYY');
  }
}