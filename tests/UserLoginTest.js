const UserLoginUsecase = require('../usecases/user/UserLoginUsecase');
const {secretKeyHash} = require('../usecases/user/Hashing')
const {
    UserAlwaysPresentRepositoryStub,
    UserAlwaysNotPresentRepositoryStub,
    CannotSearchForUserRepositoryStub
} = require('../tests/testdoubles/UserRepository/IsUserPresentPossibleOutcomes')
const {
    GetUserReturnsAGivenUser,
    CannotGetUserRepositoryStub
} = require('../tests/testdoubles/UserRepository/GetUserPossibleOutcomes')
const Hashing = require('../tests/helpers/combineIntoOneObject')
const {
    createApplicationException,
    createIOException
} = require('../usecases/user/usecaseExceptions')
const combineIntoOneObject = require('./helpers/combineIntoOneObject')

QUnit.test('Test that login succeeds if Login credentials are correct',(assert)=>{
    const userRepository = combineIntoOneObject(new UserAlwaysPresentRepositoryStub(),new GetUserReturnsAGivenUser(
        {email:"hesoyame@gmail.com", password: secretKeyHash("hesoyam1234")}
    ));
    const userLoginUsecase = new UserLoginUsecase(userRepository);
    return userLoginUsecase.do({
        email:"hesoyame@gmail.com",
        password: 'hesoyam1234'
    })
    .then(()=>{
        assert.ok(true);
    });
});

QUnit.test('Test that login fails if email is not found',(assert)=>{
    const userRepository = new UserAlwaysNotPresentRepositoryStub();
    const userLoginUsecase = new UserLoginUsecase(userRepository);
    return userLoginUsecase.do({
        email:"hesoyame@gmail.com",
        password: secretKeyHash('hesoyam1234')
    })
    .catch((exception)=>{
        assert.ok(exception.equals(createApplicationException('User not present')))
    });
});

QUnit.test('Test that login fails if repository is not working',(assert)=>{
    const userRepository = new CannotSearchForUserRepositoryStub();
    const userLoginUsecase = new UserLoginUsecase(userRepository);
    return userLoginUsecase.do({
        email:"hesoyame@gmail.com",
        password: secretKeyHash('hesoyam1234')
    })
    .catch((exception)=>{
        assert.ok(exception.equals(createIOException('Cannot search for user')))
    });
});

QUnit.test('Test that login fails if password is wrong',(assert)=>{
    const userRepository = combineIntoOneObject(new GetUserReturnsAGivenUser(
        {email:"hesoyame@gmail.com", password: secretKeyHash('dummy')}
    ), new UserAlwaysPresentRepositoryStub())
    const userLoginUsecase = new UserLoginUsecase(userRepository);
    return userLoginUsecase.do({
        email:"hesoyame@gmail.com",
        password: secretKeyHash('hesoyam1234')
    })
    .catch((exception)=>{
        assert.ok(exception.equals(createApplicationException('Invalid Password')));
    });
});

QUnit.test('Test that login fails if repository could not search for user',(assert)=>{
    const userRepository = combineIntoOneObject(
                                new UserAlwaysPresentRepositoryStub(),
                                new CannotGetUserRepositoryStub()
                           )
    const userLoginUsecase = new UserLoginUsecase(userRepository);
    return userLoginUsecase.do({
        email: "hesoyame@gmail.com",
        password: secretKeyHash('hesoyam1234')
    })
    .catch((exception)=>{
        assert.ok(exception.equals(createIOException('Cannot get user')));
    });
});