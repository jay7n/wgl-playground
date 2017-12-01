const Vector3 = {
    static: {
        add(v3a, v3b, v3ab) {
            if (v3ab == null) {
                v3ab = createVector3()
            }

            v3ab._v[0] = v3a._v[0] + v3b._v[0]
            v3ab._v[1] = v3a._v[1] + v3b._v[1]
            v3ab._v[2] = v3a._v[2] + v3b._v[2]

            return v3ab
        },

        sub(v3a, v3b, v3ab) {
            const inv_v3b = [...v3b].map(comp => -comp)
            return this.static.add(v3a, inv_v3b, v3ab)
        },

        dot(v3a, v3b) {
            const res = v3a._v[0] * v3b._v[0] +
                        v3a._v[1] * v3b._v[1] +
                        v3a._v[2] * v3b._v[2]

            return res
        }
    },

    init(x, y, z) {
        if (Array.prototype.isPrototypeOf(x)) {
            Object.assign(this, {
                _v: [x[0], x[1], x[2]]
            })
        } else if (Object.prototype.isPrototypeOf(x)) {
            Object.assign(this, {
                _v: [x.x, x.y, x.z]
            })
        } else {
            if (x != null) {
                Object.assign(this, {
                    _v: [x,y,z]
                })
            } else {
                this.setIdentity()
            }
        }
    },

    setIdentity() {
        this._v = [0,0,0]
    },

    get v() {
        return [...this._v]
    },

    set v(newv) {
        this._v = [...newv]
    },

    add(v3) {
        this.static.add(this, v3, this)
        return this
    },

    sub(v3) {
        this.static.sub(this, v3, this)
        return this
    },

    dot(v3) {
        return this.static.dot(this, v3)
    },

    copy() {
        return createVector3(this.v)
    }
}

const Vector4 = {
    // TODO: follow Vector3
    init(x, y, z, w) {
        Object.assign(this, {
            _v: [0,0,0,1]
        })
    }
}

function createVector(dimension, ...args) {
    let vector = null

    switch(dimension) {
    case 3:
        vector = Object.create(Vector3)
        break
    case 4:
        vector = Object.create(Vector4)
        break
    }

    vector.init(...args)
    return vector
}

function createVector3(x, y, z) {
    return createVector(3, x, y, z)
}

function createVector4(x, y, z, w) {
    return createVector(4, x, y, z, w)
}

export {
    Vector3,
    Vector4,
    createVector3,
    createVector4,
}
