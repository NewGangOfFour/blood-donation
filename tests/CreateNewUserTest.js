const CreateNewUserUseCase = require('../usecases/user/CreateNewUserUseCase');

class UserRepositorySpy{

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


QUnit.test('Test that creating new user succeeds when information is valid', (assert) => {
    const userRepositorySpy = new UserRepositorySpy();
    const createNewUserUseCase = new CreateNewUserUseCase(userRepositorySpy);
    createNewUserUseCase.do({
        firstName: 'Bassel',
        lastName: 'Chahine',
        email: 'hesoyam@outlook.com',
        phone: '+9613000000',
        dateOfBirth: {
            day: '3',
            month: '3',
            year: '1990'
        },
        bloodType: 'B+'
    })
    .then(() => {
        assert.ok(userRepositorySpy.getWrittenUser().firstName === 'Bassel');
        assert.ok(userRepositorySpy.getWrittenUser().lastName === 'Chahine');
        assert.ok(userRepositorySpy.getWrittenUser().email === 'hesoyam@outlook.com');
        assert.ok(userRepositorySpy.getWrittenUser().phone === '+9613000000');
        assert.ok(userRepositorySpy.getWrittenUser().dateOfBirth.day === '3');
        assert.ok(userRepositorySpy.getWrittenUser().dateOfBirth.month === '3');
        assert.ok(userRepositorySpy.getWrittenUser().dateOfBirth.year === '1990');
        assert.ok(userRepositorySpy.getWrittenUser().bloodType === 'B+');
    })
});

QUnit.test('Test that creating new user fails when email is invalid', (assert) => {
    const userRepositorySpy = new UserRepositorySpy();
    const createNewUserUseCase = new CreateNewUserUseCase(userRepositorySpy);
    createNewUserUseCase.do({
        firstName: 'Bassel',
        lastName: 'Chahine',
        email: 'hesoyam',
        phone: '+9613000000',
        dateOfBirth: {
            day: '3',
            month: '3',
            year: '1990'
        },
        bloodType: 'B+'
    })
    .catch((exception) => {
        assert.ok(exception.type === 'ValidationException');
        assert.ok(exception.message === 'Invalid email');
    })
});