function callSuperiorProto(instance, callerFuncName, ...args) {
    const delegate = Object.getPrototypeOf(instance)
    const _super = Object.getPrototypeOf(delegate)
    _super[callerFuncName].call(instance, ...args)
}

function stupidIsType(o, T) {
    if (T == null) {
        return false
    }
    if (T.isPrototypeOf(o)) {
        return true
    } else {
        return stupidIsType(o, T.prototype)
    }
}


export {
    callSuperiorProto,
    stupidIsType
}
