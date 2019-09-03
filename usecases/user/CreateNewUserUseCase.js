const {secretKeyHash} = require('../user/Hashing')

function isEmailValid(email){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

module.exports = class {

    constructor(userRepoitory){
        this.userRepository = userRepoitory
    }

    async do(createNewUserRequest){
        if(!isEmailValid(createNewUserRequest.email))
            throw {type: 'ValidationException', message: 'Invalid email'}
        if(await this.userRepository.isUserPresent(createNewUserRequest.email))
            throw {type: 'ApplicationException', message: 'Email already used.'}
        createNewUserRequest.password = secretKeyHash(createNewUserRequest.password)
        this.userRepository.createUser(createNewUserRequest);
    }

}
