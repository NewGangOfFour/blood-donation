const {secretKeyHash} = require('../user/Hashing')
const {createValidationException, createApplicationException} = require('./usecaseExceptions')

function isEmailValid(email){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isPhoneNumberValid(phone){
    return /^(\+|00){0,2}(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(phone);
}

function isDateValid(givenDate) {
   const date = new Date(givenDate.year, givenDate.month, givenDate.day + 1)
   return givenDate.year === date.getFullYear() &&
          givenDate.month === date.getMonth() &&
          givenDate.day + 1 === date.getDate()
}

function isBloodTypeValid(bloodType){
    return ['A+','A-','B+','B-','AB+','AB-','O+','O-'].includes(bloodType);
}

class RequestValidationQuery {

    constructor(createNewUserRequest){
        this.request = createNewUserRequest
        this.failureMessage = 'UNKNOWN'
    }

    didSucceed(){
        if(!isEmailValid(this.request.email)) {
            this.failureMessage = 'Invalid email.'
            return false
        }
        if(!isPhoneNumberValid(this.request.phone)) {
            this.failureMessage = 'Invalid phone.'
            return false
        }
        if(!isBloodTypeValid(this.request.bloodType)) {
            this.failureMessage = 'Invalid blood type.'
            return false
        }
        if(!isDateValid(this.request.dateOfBirth)){
            this.failureMessage = 'Invalid date of birth.'
            return false
        }
        return true
    }

    failureCause(){
        return this.failureMessage
    }

}

module.exports = class {

    constructor(userRepository){
        this.userRepository = userRepository
    }

    async do(createNewUserRequest){
        const requestValidationQuery = new RequestValidationQuery(createNewUserRequest)
        if(!requestValidationQuery.didSucceed())
            throw createValidationException(requestValidationQuery.failureCause())
        if(await this.userRepository.isUserPresent(createNewUserRequest.email))
            throw createApplicationException('Email already used.')
        createNewUserRequest.password = secretKeyHash(createNewUserRequest.password)
        this.userRepository.createUser(createNewUserRequest);
    }

}
