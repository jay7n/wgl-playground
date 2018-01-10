import { stupidIsType } from '@/base'

const Vector3 = {
    static: {
        add(v3a, v3b) {
            let v3ab = createVector3()

            v3ab._v[0] = v3a._v[0] + v3b._v[0]
            v3ab._v[1] = v3a._v[1] + v3b._v[1]
            v3ab._v[2] = v3a._v[2] + v3b._v[2]

            return v3ab
        },

        sub(v3a, v3b) {
            const inv_v3b = [...v3b].map(comp => -comp)
            return this.static.add(v3a, inv_v3b)
        },

        dot(v3a, v3b) {
            const res = v3a._v[0] * v3b._v[0] +
                        v3a._v[1] * v3b._v[1] +
                        v3a._v[2] * v3b._v[2]

            return res
        },

        cross(v3a, v3b) {
            const x = v3a.y*v3b.z - v3a.z*v3b.y
            const y = v3a.z*v3b.x - v3a.x*v3b.z
            const z = v3a.x*v3b.y - v3a.y*v3b.x

            return createVector3(x, y, z)
        },

        scale(v3, s) {
            const v3s = createVector3(
                v3._v[0] * s,
                v3._v[1] * s,
                v3._v[2] * s
            )

            return v3s
        },

        multiplyMatrix3(v3, m3) {
            // TODO
        },
    },

    init(x, y, z) {
        let v = [0,0,0]

        if (x != null) {
            if (stupidIsType(x, Array)) {
                const arr = x; v = [...arr]
            } else if (stupidIsType(x, Object)) {
                const obj = x; v = [obj.x, obj.y, obj.z, obj.w]
            } else {
                v = [x, y, z]
            }
        }

        this._v = v
    },

    get x() {
        return this._v[0]
    },

    get y() {
        return this._v[1]
    },

    get z() {
        return this._v[2]
    },

    get v() {
        return [...this._v]
    },

    set v(newv) {
        this._v = [...newv]
    },

    add(v3) {
        const byv3add = this.static.add(this, v3)
        this._v = byv3add._v
        return this
    },

    sub(v3) {
        const byv3sub = this.static.sub(this, v3, this)
        this._v = byv3sub._v
        return this
    },

    dot(v3) {
        return this.static.dot(this, v3)
    },

    cross(v3) {
        const byv3cross = this.static.cross(this, v3)
        this._v = byv3cross._v
        return this
    },

    scale(s) {
        const bys = this.static.scale(this, s)
        this._v = bys._v
        return this
    },

    clone() {
        return createVector3(this._v)
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
