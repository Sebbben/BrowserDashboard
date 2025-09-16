class ClockTile extends HTMLElement {
    constructor() {
        super()
    }

    getTimeString() {
        let time = new Date()
        return `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`
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

customElements.define("clock-tile", ClockTile)