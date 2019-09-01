
module.exports = class {
    constructor(UserRepository){
        this.UserRepository = UserRepository;
    }

    async do(loginUserRequest){
        this.UserRepository.loginUser(loginUserRequest);
    }
}