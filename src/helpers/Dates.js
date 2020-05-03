/* const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]; */

export const isToday = (date) => {
    const currentDate = new Date();
    const targetDate = new Date(date);
    const newCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const newTargetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    return numberDaysBetweenDates(newCurrentDate.getTime(), newTargetDate.getTime()) === 0 ? true : false;
}

export const isYesterday = (date) => {
    const currentDate = new Date();
    const targetDate = new Date(date);
    const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
    const newTargetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    return numberDaysBetweenDates(yesterday.getTime(), newTargetDate.getTime()) === 0 ? true : false;
}

export const diffBetweenDates = (date1, date2) => {
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    const newDateOne = new Date(dateOne.getFullYear(), dateOne.getMonth(), dateOne.getDate());
    const newDateTwo = new Date(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate());

    return numberDaysBetweenDates(newDateOne.getTime(), newDateTwo.getTime());
}

const numberDaysBetweenDates = (dateOne, dateTwo) => {
    let microSecondsDiff = Math.abs(dateOne - dateTwo);
    let daysDiff = Math.floor(microSecondsDiff/(1000 * 60 * 60  * 24));
    return daysDiff;
}

export const getTimeFromTimestamp = (date) => {
    return new Date(date).toLocaleTimeString();
}

export const getTimeAndDateFromTimestamp = (date) => {
    return new Date(date).toLocaleString();
}

export const getDateFromTimestamp = (date) => {
    return getTimeAndDateFromTimestamp(date).split(',')[0];
}