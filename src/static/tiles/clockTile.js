class TestTile extends HTMLElement {
    constructor() {
        super()
    }

    getTimeString() {
        let time = new Date()
        return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    }

    connectedCallback() {
        const root = this.getRootNode();
        
        const text = document.createElement("p")
        text.innerText = this.getTimeString()

        setInterval(() => {
            text.innerText = this.getTimeString()
        }, 1000)

        const style = root.querySelector("style")
        style.textContent += `
        p {
            font-size: 4rem;
            font-weight: bold;
            color: white;
        }
        `
        
        this.appendChild(text)
    }

}

customElements.define("test-tile", TestTile)