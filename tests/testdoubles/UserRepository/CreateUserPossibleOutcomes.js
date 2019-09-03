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

module.exports = {
    UserCreationSucceedingSpy
}