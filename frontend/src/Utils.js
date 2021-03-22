
exports.getDateFromEpoch = function (epoch) {
    if (epoch === undefined) {
        return ""
    }
    const newDate = new Date(0);
    newDate.setUTCMilliseconds(epoch);
    return newDate.toISOString();
}

exports.getEpochFromDate = function (date) {
    return new Date(date).getTime();
}