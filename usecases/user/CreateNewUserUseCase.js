const {secretKeyHash} = require('../user/Hashing')
const {
    createJSDateFromDateOfBirth,
    epochAfterYears
} = require('../../usecases/user/date')
const {createValidationException, createApplicationException, createIOException} = require('./usecaseExceptions')

function isEmailValid(email){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isPhoneNumberValid(phone){
    return /^(\+|00){0,2}(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(phone);
}

function isDateValid(givenDate) {
   const date = createJSDateFromDateOfBirth(givenDate)
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

function is18OrOlder(dateOfBirth){
    const epochWhen18YearsOld = epochAfterYears(dateOfBirth, 18)
    const currentEpoch = Date.now()
    return epochWhen18YearsOld <= currentEpoch
}

const ApplicationException = {
    USER_UNDER_AGE: 'User less than 18 years old.',
    USER_ALREADY_HAS_ACCOUNT: 'User already has an account.'
}

class UseCase{

    constructor(userRepository){
        this.userRepository = userRepository
    }

    async do(createNewUserRequest){
        const requestValidationQuery = new RequestValidationQuery(createNewUserRequest)
        if(!requestValidationQuery.didSucceed())
            throw createValidationException(requestValidationQuery.failureCause())
        if(!is18OrOlder(createNewUserRequest.dateOfBirth))
            throw createApplicationException(ApplicationException.USER_UNDER_AGE)
        if(await this.isEmailTaken(createNewUserRequest.email))
            throw createApplicationException(ApplicationException.USER_ALREADY_HAS_ACCOUNT)
        createNewUserRequest.password = secretKeyHash(createNewUserRequest.password)
        await this.addUserToRepository(createNewUserRequest)
    }    

    async isEmailTaken(email) {
        return this.userRepository.isUserPresent(email)
        .catch(()=>{
            throw createIOException('Cannot search for user.')
        })
    }

    async addUserToRepository(addUserRequest) {
        return this.userRepository.createUser(addUserRequest)
        .catch(() =>{
            throw createIOException('Cannot add user.')
        })
    }

}

module.exports = {
    UseCase,
    ApplicationException
}
