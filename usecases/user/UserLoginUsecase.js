const {secretKeyHash} = require('../../usecases/user/Hashing')
const {
    createApplicationException,
    createIOException
} = require('../user/usecaseExceptions')

module.exports = class {
    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async isUserPresent(email) {
        return this.userRepository.isUserPresent(email)
        .catch(() => {
            throw createIOException('Cannot search for user')
        })
    }

    async getUser(email) {
        return this.userRepository.getUser()
        .catch(() => {
            throw createIOException('Cannot get user')
        })
    }

    async do(loginUserRequest){
        if(! await this.isUserPresent(loginUserRequest.email))
            throw createApplicationException('User not present')
        if((await this.getUser(loginUserRequest.email)).password !== secretKeyHash(loginUserRequest.password))
            throw createApplicationException('Invalid Password')
    }
}