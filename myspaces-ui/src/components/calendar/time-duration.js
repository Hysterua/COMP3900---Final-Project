import eachHourOfInterval from 'date-fns/eachHourOfInterval'

/**
 * @name timeDuration
 * @description A function to calculate the number of hours a booking should be calculated by
 * @param {start date time string} startDateTime 
 * @param {finish date time string} finishDateTime 
 * @returns A number, indicating the number of hours to calculate by
 */
export function timeDuration(startDateTime, finishDateTime) {

    const startDateTimeFormat = new Date(startDateTime);
    const finishDateTimeFormat = new Date(finishDateTime);
    
    if (finishDateTimeFormat <= startDateTimeFormat) return 0;

    else {
        var result = eachHourOfInterval({start: startDateTimeFormat, end: finishDateTimeFormat})
        let length = result.length;
        return length - 1
    }
}

/**
 * @name checkTimesValid
 * @description A function to calculate the number of hours a booking should be calculated by
 * @param {start date time string} startDateTime 
 * @param {finish date time string} finishDateTime 
 * @returns A number, indicating the number of hours to calculate by
 */
export function checkTimesValid(startDateTime, finishDateTime) {

    const startDateTimeFormat = new Date(startDateTime);
    const finishDateTimeFormat = new Date(finishDateTime);

    if (finishDateTimeFormat <= startDateTimeFormat) {return false;}
    else return true
}