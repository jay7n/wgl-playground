import j7 from 'j7'

async function main() {
    const canvas = document.getElementById('canvas')
    const app = new j7.Application(canvas)

    app.start()
}

main()
