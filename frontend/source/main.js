import j7 from '@/j7'

async function main() {
    const canvas = document.getElementById('canvas')
    const app = new j7.Application(canvas)

    j7.logger.debug.log(app)

    app.start()
}

main()
