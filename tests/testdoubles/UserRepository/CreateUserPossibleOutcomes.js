class UserCreationSucceedingSpy {

    constructor(){
        this.userData = {}
    }

    async createUser(userData){
        this.userData = userData
    }

    getWrittenUser(){
        return this.userData
    }

}

class UserCreationFailureStub {

    constructor(){
        this.userData = {}
    }

    async createUser(userData){
        throw 'I failed!'
    }

}

module.exports = {
    UserCreationSucceedingSpy,
    UserCreationFailureStub
}