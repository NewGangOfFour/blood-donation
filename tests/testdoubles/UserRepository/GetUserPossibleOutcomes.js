class CannotGetUserRepositoryStub {

    async getUser(){
        throw 'Cannot get user'
    }

}

class GetUserReturnsAGivenUser {

    constructor(givenUser){
        this.givenUser = givenUser
    }

    async getUser(){
        return this.givenUser
    }
}

module.exports = {
    GetUserReturnsAGivenUser,
    CannotGetUserRepositoryStub
}