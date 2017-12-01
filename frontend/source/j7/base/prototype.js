function callSuperProto(delegate, instance, callerFuncName, ...args) {
    const _super = Object.getPrototypeOf(delegate)
    _super[callerFuncName].call(instance, ...args)
}

export {
    callSuperProto
}
