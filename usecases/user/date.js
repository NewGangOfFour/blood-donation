module.exports = {
    epochAfterYears,
    shiftDateForwardsByYears,
    createJSDateFromDateOfBirth
}

function shiftDateForwardsByYears(date, years){
    date.setFullYear(date.getFullYear() + years)
    return date
}

function createJSDateFromDateOfBirth(dateOfBirth){
    return new Date(dateOfBirth.year,
                    dateOfBirth.month,
                    dateOfBirth.day + 1)
}

function epochAfterYears(dateOfBirth, years){
    return shiftDateForwardsByYears(createJSDateFromDateOfBirth(dateOfBirth), years)
}
