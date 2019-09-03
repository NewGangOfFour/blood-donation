module.exports = (a, b) => {
    let newObject = {}
    writeObjectAndItsPrototypeIntoTargetObject(newObject, a)
    writeObjectAndItsPrototypeIntoTargetObject(newObject, b)
    return newObject
}

function writeObjectAndItsPrototypeIntoTargetObject(target,object){
    for(let attr of Object.getOwnPropertyNames(object))
        target[attr] = object[attr]
    for(let attr of Object.getOwnPropertyNames(object.__proto__))
        if(attr !== "constructor")
            target[attr] = object.__proto__[attr]
}