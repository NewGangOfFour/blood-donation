const {
    UseCase: CreateNewUserUseCase,
    ApplicationException
} = require('../usecases/user/CreateNewUserUseCase')
const {
    UserCreationSucceedingSpy,
    UserCreationFailureStub
} = require('../tests/testdoubles/UserRepository/CreateUserPossibleOutcomes')
const {
    UserAlwaysPresentRepositoryStub,
    UserAlwaysNotPresentRepositoryStub,
    CannotSearchForUserRepositoryStub
} = require('../tests/testdoubles/UserRepository/IsUserPresentPossibleOutcomes')
const ObjectModifier = require('../tests/helpers/ObjectModifier')
const combineIntoOneObject = require('../tests/helpers/combineIntoOneObject')
const {
    createValidationException,
    createApplicationException,
    createIOException
} = require('../usecases/user/usecaseExceptions')
const {secretKeyHash} = require('../usecases/user/Hashing')

const SEVENTEEN_YEARS = 17
const validAddUserRequest = {
    firstName: 'Bassel',
    lastName: 'Chahine',
    password: 'thisispassword',
    email: 'hesoyam@outlook.com',
    phone: '+9613000000',
    dateOfBirth: {
        day: 0,
        month: 3,
        year: 1990
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
        assert.ok(userRepository.getWrittenUser().dateOfBirth.day === 0)
        assert.ok(userRepository.getWrittenUser().dateOfBirth.month === 3)
        assert.ok(userRepository.getWrittenUser().dateOfBirth.year === 1990)
        assert.ok(userRepository.getWrittenUser().bloodType === 'B+')
    })
});

QUnit.test('Test that creating new user fails when user email is not used but adding user fails', (assert) => {
    const userRepository = combineIntoOneObject(
        new UserAlwaysNotPresentRepositoryStub(),
        new UserCreationFailureStub
    )
    const createNewUserUseCase = new CreateNewUserUseCase(userRepository)
    return createNewUserUseCase.do(validAddUserRequest)
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createIOException('Cannot add user.')
        ))
    })
});

QUnit.test('Test that creating new user fails when user cannot be searched for', (assert) => {
    const userRepository = combineIntoOneObject(
        new CannotSearchForUserRepositoryStub(),
        new UserCreationSucceedingSpy()
    )
    const createNewUserUseCase = new CreateNewUserUseCase(userRepository)
    return createNewUserUseCase.do(validAddUserRequest)
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createIOException('Cannot search for user.')
        ))
    })
});

QUnit.test('Test that creating new user fails when email is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub()
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository)
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        email: 'invalidemail'
    }))
    .catch((actualException) => {
        assert.ok(actualException.equals(
               createValidationException('Invalid email.')
        ))
    })
})

QUnit.test('Test that creating new user fails when phone is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub()
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository)
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        phone: 'iAmNotValidPhoneValue'
    }))
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createValidationException('Invalid phone.')
        ))
    })
})

QUnit.test('Test that creating new user fails when blood type is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub()
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository)
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        bloodType: 'C'
    }))
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createValidationException('Invalid blood type.')
     ))
    })
})

QUnit.test('Test that creating new user fails when day of dateOfBirth is invalid', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub()
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository)
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        dateOfBirth: {
            day: 31,
            month: 1,
            year: 1972
        }
    }))
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createValidationException('Invalid date of birth.')
        ))
    })
})

QUnit.test('Test that creating new user fails when user is less than 18 years old', (assert) => {
    const anyRepository = new UserAlwaysNotPresentRepositoryStub()
    const createNewUserUseCase = new CreateNewUserUseCase(anyRepository)
    return createNewUserUseCase.do(validRequestModifier.alterObjectWithChanges({
        dateOfBirth: {
            day: 2,
            month: 5,
            year: new Date(Date.now()).getFullYear() - SEVENTEEN_YEARS
        }
    }))
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createApplicationException(ApplicationException.USER_UNDER_AGE)
        ))
    })
})

QUnit.test('Test that creating new user fails when email is already used', (assert) => {
    const userRepository = new UserAlwaysPresentRepositoryStub()
    const createNewUserUseCase = new CreateNewUserUseCase(userRepository)
    return createNewUserUseCase.do(validAddUserRequest)
    .catch((actualException) => {
        assert.ok(actualException.equals(
            createApplicationException(ApplicationException.USER_ALREADY_HAS_ACCOUNT)
        ))
    })
})