const CreateNewUserUseCase = require('../usecases/user/CreateNewUserUseCase');
const {
    UserCreationSucceedingSpy
} = require('../tests/testdoubles/UserRepository/CreateUserPossibleOutcomes')
const {
    UserAlwaysPresentRepositoryStub,
    UserAlwaysNotPresentRepositoryStub
} = require('../tests/testdoubles/UserRepository/IsUserPresentPossibleOutcomes')
const ObjectModifier = require('../tests/helpers/ObjectModifier')
const combineIntoOneObject = require('../tests/helpers/combineIntoOneObject')
const {secretKeyHash} = require('../usecases/user/Hashing')

const validAddUserRequest = {
    firstName: 'Bassel',
    lastName: 'Chahine',
    password: 'thisispassword',
    email: 'hesoyam@outlook.com',
    phone: '+9613000000',
    dateOfBirth: {
        day: '3',
        month: '3',
        year: '1990'
    },
    bloodType: 'B+' 
}

const validRequestModifier = new ObjectModifier(validAddUserRequest)

QUnit.test('Test that creating new user succeeds when information is valid', (assert) => {
    const userRepository = combineIntoOneObject(
        new UserCreationSucceedingSpy(),
        new UserAlwaysNotPresentRepositoryStub()
    )
    const createNewUserUseCase = new CreateNewUserUseCase(userRepository)
    return createNewUserUseCase.do(validAddUserRequest)
    .then(() => {
        assert.ok(userRepository.getWrittenUser().firstName === 'Bassel')
        assert.ok(userRepository.getWrittenUser().lastName === 'Chahine')
        assert.ok(userRepository.getWrittenUser().password === secretKeyHash('thisispassword'))
        assert.ok(userRepository.getWrittenUser().email === 'hesoyam@outlook.com')
        assert.ok(userRepository.getWrittenUser().phone === '+9613000000')
        assert.ok(userRepository.getWrittenUser().dateOfBirth.day === '3')
        assert.ok(userRepository.getWrittenUser().dateOfBirth.month === '3')
        assert.ok(userRepository.getWrittenUser().dateOfBirth.year === '1990')
        assert.ok(userRepository.getWrittenUser().bloodType === 'B+')
    })
});

QUnit.test('Test that creating new user fails when email is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub();
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository);
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        email: 'invalidemail'
    }))
    .catch((actualException) => {
        assert.deepEqual(
            actualException,
            {
                type: 'ValidationException',
                message: 'Invalid email.'
            }
        )
    })
});

QUnit.test('Test that creating new user fails when phone is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub();
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository);
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        phone: 'iAmNotValidPhoneValue'
    }))
    .catch((actualException) => {
        assert.deepEqual(
            actualException,
            {
                type: 'ValidationException',
                message: 'Invalid phone.'
            }
        )
    })
});

QUnit.test('Test that creating new user fails when blood type is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub();
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository);
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        bloodType: 'C'
    }))
    .catch((actualException) => {
        assert.deepEqual(
            actualException,
            {
                type: 'ValidationException',
                message: 'Invalid blood type.'
            }
        )
    })
});

QUnit.test('Test that creating new user fails when email is already used', (assert) => {
    const userRepositoryStub = new UserAlwaysPresentRepositoryStub();
    const createNewUserUseCase = new CreateNewUserUseCase(userRepositoryStub);
    return createNewUserUseCase.do(validAddUserRequest)
    .catch((actualException) => {
        assert.deepEqual(
            actualException,
            {
                type: 'ApplicationException',
                message: 'Email already used.'
            }
        )
    })
});