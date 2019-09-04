module.exports = {
   
    createValidationException(message){
        return new Exception('ValidationException', message)
    },
    createApplicationException(message){
        return new Exception('ApplicationException', message)
    }

}

class Exception {

    constructor(type, message){
        this.type = type
        this.message = message
    }

    equals(candidateException){
        return this.type ===  candidateException.type &&
               this.message === candidateException.message
    }

}