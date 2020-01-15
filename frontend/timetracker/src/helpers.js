export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString( 16 )
    } );
};

export const getFormattedTime = date =>
    date instanceof Date ?
        `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}` :
        null;

export const getFormattedDateAndTime = date =>
    date instanceof Date ?
        `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${getFormattedTime( date )}` :
        null;

export const secondsToTime = seconds => {
    const date = new Date( null );
    date.setSeconds( seconds ? seconds : 0 );
    return date.toISOString().substr( 11, 8 );
};

export const addDays = days => date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const copy = obj => JSON.parse( JSON.stringify( obj ) );
