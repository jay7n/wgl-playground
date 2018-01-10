import App from './app'

async function main() {
    const canvas = document.getElementById('canvas')
    const app = new App(canvas)
    app.start()
}

main()
