const {secretKeyHash} = require('../user/Hashing')

function isEmailValid(email){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isPhoneNumberValid(phone){
    return /^(\+|00){0,2}(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(phone);
}

module.exports = class {

    constructor(userRepoitory){
        this.userRepository = userRepoitory
    }

    async do(createNewUserRequest){
        if(!isEmailValid(createNewUserRequest.email))
            throw {type: 'ValidationException', message: 'Invalid email'}
        if(!isPhoneNumberValid(createNewUserRequest.phone))
            throw {type: 'ValidationException', message: 'Invalid phone'}
        if(await this.userRepository.isUserPresent(createNewUserRequest.email))
            throw {type: 'ApplicationException', message: 'Email already used.'}
        createNewUserRequest.password = secretKeyHash(createNewUserRequest.password)
        this.userRepository.createUser(createNewUserRequest);
    }

}
