module.exports = class {

    constructor(){
        this.userData = {}
    }

    async createUser(userData){
        this.userData = userData
    }

    async isUserPresent(email){
        return false
    }
    
    getWrittenUser(){
        return this.userData
    }

}