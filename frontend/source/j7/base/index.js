function callSuperiorProto(instance, callerFuncName, ...args) {
    const delegate = Object.getPrototypeOf(instance)
    const _super = Object.getPrototypeOf(delegate)
    _super[callerFuncName].call(instance, ...args)
}

export {
    callSuperiorProto
}
