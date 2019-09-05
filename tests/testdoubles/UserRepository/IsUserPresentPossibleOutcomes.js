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

class CannotSearchForUserRepositoryStub {

    async isUserPresent(){
        throw 'Cannot search for nobody.'
    }

}

module.exports = {
    UserAlwaysPresentRepositoryStub,
    UserAlwaysNotPresentRepositoryStub,
    CannotSearchForUserRepositoryStub
}