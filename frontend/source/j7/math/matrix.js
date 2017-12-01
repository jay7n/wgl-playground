const Matrix3 = {
    static: {
        multiply(m3a, m3b, m3ab) {
            if (m3ab == null) {
                m3ab = createMatrix3()
            }

            m3ab._m[0] = m3a._m[0]*m3b._m[0] + m3a._m[1]*m3b._m[3] + m3a._m[2]*m3b._m[6] // r1c1
            m3ab._m[1] = m3a._m[0]*m3b._m[1] + m3a._m[1]*m3b._m[4] + m3a._m[2]*m3b._m[7] // r1c2
            m3ab._m[2] = m3a._m[0]*m3b._m[2] + m3a._m[1]*m3b._m[5] + m3a._m[2]*m3b._m[8] // r1c3

            m3ab._m[3] = m3a._m[3]*m3b._m[0] + m3a._m[4]*m3b._m[3] + m3a._m[5]*m3b._m[6] // r2c1
            m3ab._m[4] = m3a._m[3]*m3b._m[1] + m3a._m[4]*m3b._m[4] + m3a._m[5]*m3b._m[7] // r2c2
            m3ab._m[5] = m3a._m[3]*m3b._m[2] + m3a._m[4]*m3b._m[5] + m3a._m[5]*m3b._m[8] // r2c3

            m3ab._m[6] = m3a._m[6]*m3b._m[0] + m3a._m[7]*m3b._m[3] + m3a._m[8]*m3b._m[6] // r2c1
            m3ab._m[7] = m3a._m[6]*m3b._m[1] + m3a._m[7]*m3b._m[4] + m3a._m[8]*m3b._m[7] // r2c2
            m3ab._m[8] = m3a._m[6]*m3b._m[2] + m3a._m[7]*m3b._m[5] + m3a._m[8]*m3b._m[8] // r2c3

            return m3ab
        },
    },

    init(
        r1c1, r1c2, r1c3,
        r2c1, r2c2, r2c3,
        r3c1, r3c2, r3c3
    ) {
        if (r1c1 != null) {
            Object.assign(this, {
                _m: [
                    r1c1, r1c2, r1c3,
                    r2c1, r2c2, r2c3,
                    r3c1, r3c2, r3c3,
                ]
            })
        } else {
            this.setIdentity()
        }
    },

    setIdentity() {
        this._m = [
            1,0,0,
            0,1,0,
            0,0,1,
        ]
    },

    multiply(m3) {
        this.static.multiply(this, m3, this)
        return this
    },
}


const Matrix4 = {
    static: {
        multiply(m4a, m4b, m4ab) {
            if (m4ab == null) {
                m4ab = createMatrix4()
            }

            m4ab._m[0] = m4a._m[0]*m4b._m[0] + m4a._m[1]*m4b._m[4] + m4a._m[2]*m4b._m[8]  + m4a._m[3]*m4b._m[12]  // r1c1
            m4ab._m[1] = m4a._m[0]*m4b._m[1] + m4a._m[1]*m4b._m[5] + m4a._m[2]*m4b._m[9]  + m4a._m[3]*m4b._m[13]  // r1c2
            m4ab._m[2] = m4a._m[0]*m4b._m[2] + m4a._m[1]*m4b._m[6] + m4a._m[2]*m4b._m[10] + m4a._m[3]*m4b._m[14]  // r1c3
            m4ab._m[3] = m4a._m[0]*m4b._m[3] + m4a._m[1]*m4b._m[7] + m4a._m[2]*m4b._m[11] + m4a._m[3]*m4b._m[15]  // r1c4

            m4ab._m[0] = m4a._m[4]*m4b._m[0] + m4a._m[5]*m4b._m[4] + m4a._m[6]*m4b._m[8]  + m4a._m[7]*m4b._m[12]  // r2c1
            m4ab._m[1] = m4a._m[4]*m4b._m[1] + m4a._m[5]*m4b._m[5] + m4a._m[6]*m4b._m[9]  + m4a._m[7]*m4b._m[13]  // r2c2
            m4ab._m[2] = m4a._m[4]*m4b._m[2] + m4a._m[5]*m4b._m[6] + m4a._m[6]*m4b._m[10] + m4a._m[7]*m4b._m[14]  // r2c3
            m4ab._m[3] = m4a._m[4]*m4b._m[3] + m4a._m[5]*m4b._m[7] + m4a._m[6]*m4b._m[11] + m4a._m[7]*m4b._m[15]  // r2c4

            m4ab._m[0] = m4a._m[8]*m4b._m[0] + m4a._m[9]*m4b._m[4] + m4a._m[10]*m4b._m[8]  + m4a._m[11]*m4b._m[12]  // r3c1
            m4ab._m[1] = m4a._m[8]*m4b._m[1] + m4a._m[9]*m4b._m[5] + m4a._m[10]*m4b._m[9]  + m4a._m[11]*m4b._m[13]  // r3c2
            m4ab._m[2] = m4a._m[8]*m4b._m[2] + m4a._m[9]*m4b._m[6] + m4a._m[10]*m4b._m[10] + m4a._m[11]*m4b._m[14]  // r3c3
            m4ab._m[3] = m4a._m[8]*m4b._m[3] + m4a._m[9]*m4b._m[7] + m4a._m[10]*m4b._m[11] + m4a._m[11]*m4b._m[15]  // r3c4

            m4ab._m[0] = m4a._m[12]*m4b._m[0] + m4a._m[13]*m4b._m[4] + m4a._m[14]*m4b._m[8]  + m4a._m[15]*m4b._m[12]  // r4c1
            m4ab._m[1] = m4a._m[12]*m4b._m[1] + m4a._m[13]*m4b._m[5] + m4a._m[14]*m4b._m[9]  + m4a._m[15]*m4b._m[13]  // r4c2
            m4ab._m[2] = m4a._m[12]*m4b._m[2] + m4a._m[13]*m4b._m[6] + m4a._m[14]*m4b._m[10] + m4a._m[15]*m4b._m[14]  // r4c3
            m4ab._m[3] = m4a._m[12]*m4b._m[3] + m4a._m[13]*m4b._m[7] + m4a._m[14]*m4b._m[11] + m4a._m[15]*m4b._m[15]  // r4c4

            return m4ab
        },

        transform(translation, rotation, scale) {
            // TODO: currently only consider translation

            const t = translation.v

            return createMatrix4(
                1,    0,    0,    0,
                0,    1,    0,    0,
                0,    0,    1,    0,
                t[0], t[1], t[2], 1
            )
        }
    },

    init(
        r1c1, r1c2, r1c3, r1c4,
        r2c1, r2c2, r2c3, r2c4,
        r3c1, r3c2, r3c3, r3c4,
        r4c1, r4c2, r4c3, r4c4
    ) {
        if (r1c1 != null) {
            Object.assign(this, {
                _m: [
                    r1c1, r1c2, r1c3, r1c4,
                    r2c1, r2c2, r2c3, r2c4,
                    r3c1, r3c2, r3c3, r3c4,
                    r4c1, r4c2, r4c3, r4c4
                ]
            })
        } else {
            this.setIdentity()
        }
    },

    setIdentity() {
        this._m = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1,
        ]
    },

    multiply(m4) {
        this.static.multiply(this, m4, this)
        return this
    },
}

function createMatrix(dimension, ...args) {
    let matrix = null

    switch(dimension) {
    case 3:
        matrix = Object.create(Matrix3)
        break
    case 4:
        matrix = Object.create(Matrix4)
        break
    }

    matrix.init(...args)
    return matrix
}

function createMatrix3(
    r1c1, r1c2, r1c3,
    r2c1, r2c2, r2c3,
    r3c1, r3c2, r3c3,
) {
    return createMatrix(3,
        r1c1, r1c2, r1c3,
        r2c1, r2c2, r2c3,
        r3c1, r3c2, r3c3,
    )
}

function createMatrix4(
    r1c1, r1c2, r1c3, r1c4,
    r2c1, r2c2, r2c3, r2c4,
    r3c1, r3c2, r3c3, r3c4,
    r4c1, r4c2, r4c3, r4c4
) {
    return createMatrix(4,
        r1c1, r1c2, r1c3, r1c4,
        r2c1, r2c2, r2c3, r2c4,
        r3c1, r3c2, r3c3, r3c4,
        r4c1, r4c2, r4c3, r4c4
    )
}

export {
    Matrix3,
    Matrix4,
    createMatrix3,
    createMatrix4,
}
