import {createVector3, Vector3, angleToRadian} from '@/math'
import { stupidIsType } from '@/base'

const Quaternion = {
    static: {
        createFromAxisAngle(x, y, z, angle) {
            let axis = [x, y, z]
            if (stupidIsType(x, Array)) {
                const arr = x; axis = [arr[0], arr[1], arr[2]]
                angle = arr[3] == null ? y : arr[3]
            } else if (stupidIsType(x, Object)) {
                const obj = x; axis = [obj.x, obj.y, obj.z]
                angle = obj.angle == null ? y : obj.angle
            } else if (stupidIsType(x, String) || typeof x == 'string') {
                const str = x
                switch(str) {
                case 'x': axis = [1,0,0]; break
                case 'y': axis = [0,1,0]; break
                case 'z': axis = [0,0,1]; break
                default: axis = [0,0,0]
                }
                angle = y
            }

            const r = angleToRadian(angle*0.5)
            const sin = Math.sin(r)
            const cos = Math.cos(r)

            x = axis[0]*sin; y = axis[1]*sin; z = axis[2]*sin
            const q = createQuaternion(x, y, z, cos)
            return q
        },

        length(q) {
            return Math.sqrt(this.lengthSquare(q))
        },

        lengthSquare(q) {
            return q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w
        },

        getNorm(q) {
            const l = Quaternion.static.length(q)
            const [x,y,z,w] = [q.x/l, q.y/l, q.z/l, q.w/l]
            return createQuaternion(x, y, z, w)
        },

        isNorm(q) {
            const l = Quaternion.static.lengthSquare(q)
            return Math.abs(l - 1) < 0.0001
        },

        multiply(qa, qb) {
            const qav3 = createVector3(qa.x, qa.y, qa.z)
            const qbv3 = createVector3(qb.x, qb.y, qb.z)

            const va_cross_vb = Vector3.static.cross(qav3, qbv3)
            const vb_scale_wa = Vector3.static.scale(qbv3, qa.w)
            const va_scale_wb = Vector3.static.scale(qav3, qb.w)
            const v = createVector3()
            v.add(va_cross_vb).add(vb_scale_wa).add(va_scale_wb)

            const wawb = qa.w * qb.w
            const va_dot_vb = Vector3.static.dot(qav3, qbv3)
            const w = wawb - va_dot_vb

            return createQuaternion(v.x, v.y, v.z, w)
        }
    },

    init(x, y, z, w) {
        let q = [0,0,0,1]

        if (x != null) {
            if (stupidIsType(x, Array)) {
                const arr = x; q = [...arr]
            } else if (stupidIsType(x, Object)) {
                const obj = x; q = [obj.x, obj.y, obj.z, obj.w]
            } else {
                q = [x, y, z, w]
            }
        }

        this._ = {
            q
        }
    },

    get x() {
        return this._.q[0]
    },

    get y() {
        return this._.q[1]
    },

    get z() {
        return this._.q[2]
    },

    get w() {
        return this._.q[3]
    },

    copy() {
        return createQuaternion(this.x, this.y, this.z, this.w)
    },

    isNorm() {
        return Quaternion.static.isNorm(this)
    },

    normalize() {
        const normq = Quaternion.static.getNorm(this)
        this._.q = normq._.q
        return this
    },

    multiply(q) {
        return Quaternion.static.multiply(this, q)
    }

}

function createQuaternion(x, y, z, w) {
    const q = Object.create(Quaternion)
    q.init(x, y, z, w)
    return q
}

function createQuaternionFromAxisAngle(x, y, z, angle) {
    const q = Quaternion.static.createFromAxisAngle(x, y, z, angle)
    return q

    // const q = Object.create(Quaternion)
    // const {x:newx, y:newy, z:newz, w:neww} = Quaternion.static.initFromAxisAngle(x, y, z, angle)
    // q.init(newx, newy, newz, neww)
    // return q
}

export {
    Quaternion,
    createQuaternion,
    createQuaternionFromAxisAngle,
}
