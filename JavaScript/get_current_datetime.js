function get_current_date() {
    var currentdate = new Date();
    var current_date = currentdate.getFullYear() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getDate();
    return current_date;
}

function get_current_time() {
    var currentdate = new Date();
    var current_time = currentdate.toString().substr(16, 8);
    return current_time;
}
function get_current_datetime() {
    var current_datetime = get_current_date() + " " + get_current_time();
    return current_datetime;
}