class TestTile extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        console.log("I was added")
        const root = this.getRootNode().querySelector(".container");

        const text = document.createElement("p")
        text.innerText = "Hello world!"

        root.appendChild(text)
    }

}

customElements.define("test-tile", TestTile)