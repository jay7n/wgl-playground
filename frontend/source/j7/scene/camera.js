import { createMatrix4, angleToRadian } from 'j7/math'

const Camera = {
    static: {
        type: 'Camera',
        makePerspectiveProjectionMatrix(vFOVAngle, hwAspect, nearClip, farClip) {
            const halfRadian = angleToRadian(vFOVAngle * 0.5)
            const tanHalfRadian = Math.tan(halfRadian)
            const n = nearClip, f = farClip

            const m11 = hwAspect / tanHalfRadian
            const m22 = 1 / tanHalfRadian
            const m33 = (n + f) / (f - n)
            const m43 = 2 * f * n / (n - f)

            //LINOTE: this framework is deigned to use right-hand coordinate system,
            // while the clip-space in openGL uses left-hand sys, so here we need to flip the z-axis
            const m34 = -1

            const matrix = createMatrix4(
                m11, 0,   0,   0,
                0,   m22, 0,   0,
                0,   0,   m33, m34,
                0,   0,   m43, 0
            )

            return matrix
        }
    },
    init(canvas, options) {
        options = Object.assign({
            vFOVAngle: 45,
            hwAspect: canvas.height / canvas.width,
            nearClip: -1,
            farClip: -100,
            perspectiveProjectionMatrix: null
        }, options)

        this._ = options
    },

    get vFOVAngle() {
        return this._.vFOVAngle
    },

    get hwAspect() {
        return this._.hwAspect
    },

    get nearClip() {
        return this._.nearClip
    },

    get farClip() {
        return this._.farClip
    },

    get perspectiveProjectionMatrix() {
        if (!this._.perspectiveProjectionMatrix) {
            this._.perspectiveProjectionMatrix = this.static.makePerspectiveProjectionMatrix(
                this.vFOVAngle, this.hwAspect, this.nearClip, this.farClip)
        }

        return this._.perspectiveProjectionMatrix
    }
}

function createCamera(options) {
    const camera = Object.create(Camera)
    camera.init(options)
    return camera
}

export {createCamera, Camera }
