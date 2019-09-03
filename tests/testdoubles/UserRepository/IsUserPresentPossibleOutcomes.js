class UserAlwaysPresentRepositoryStub {

    async isUserPresent(){
        return true
    }

}

class UserAlwaysNotPresentRepositoryStub {

    async isUserPresent(){
        return false
    }

}

module.exports = {
    UserAlwaysPresentRepositoryStub,
    UserAlwaysNotPresentRepositoryStub
}