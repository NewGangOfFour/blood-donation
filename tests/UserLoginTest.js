const UserLoginUsecase = require('../usecases/user/UserLoginUsecase');

class UserRepositorySpy{
    constructor(){
        this.userLoginCredentials = {};
    }

    async loginUser(userLoginCredentials){
        this.userLoginCredentials = userLoginCredentials;
    }

    checkIfLoggedIn(){
        return true;
    }
}

QUnit.test('Test that login succeeds if Login credentials are correct',(assert)=>{
    const userRepositorySpy = new UserRepositorySpy();
    const userLoginUsecase = new UserLoginUsecase(userRepositorySpy);
    userLoginUsecase.do({
        email:"hesoyame@gmail.com",
        password:"hesoyami1234"
    })
    .then(()=>{
        assert.ok(userRepositorySpy.checkIfLoggedIn());
    });
});