class MyTag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("My first custom tag!")
        this.innerText = "Hello from my new tag!"
    }
}

customElements.define("my-tag", MyTag)