class Background extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({"mode": "open"})

        const backgroundImage = document.createElement("img")

        backgroundImage.src = "/static/backgrounds/sheep.jpg"
        
        const style = document.createElement("style")

        style.textContent = `
        img {
            object-fit: cover;
            height: 100%;
            width: 100%;
            filter: blur(0px);
            position: absolute;
            left: 0;
            top: 0;
        }
        `

        shadow.appendChild(style)
        shadow.appendChild(backgroundImage)
    }
}

class Dashboard extends HTMLElement {
    constructor() {
        super()

        this.gridX = 10
        this.gridY = 10
        this.content = [
            {
                name: "Test",
                type: "clock-tile",
                x0: 9,
                x1: 11,
                y0: 1,
                y1: 2
            },
            {
                name: "Test",
                type: "clock-tile",
                x0: 1,
                x1: 3,
                y0: 1,
                y1: 2
            },
            {
                name: "Test",
                type: "favorites-tile",
                x0: 4,
                x1: 8,
                y0: 4,
                y1: 8
            }
        ]
    }

    connectedCallback() {
        const shadow = this.attachShadow({"mode": "open"})
        const container = document.createElement("div")
        container.setAttribute("class", "container")
        
        for (const tile of this.content) {
            const elm = document.createElement("dashboard-tile")
            elm.setAttribute("x0", tile.x0);
            elm.setAttribute("x1", tile.x1);
            elm.setAttribute("y0", tile.y0);
            elm.setAttribute("y1", tile.y1);
            elm.setAttribute("type", tile.type)

            container.appendChild(elm)
        }

        const styles = document.createElement("style")
        styles.textContent = `
        .container {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(${this.gridX}, 1fr);
            grid-template-rows: repeat(${this.gridY}, 1fr);
            column-gap: 10px;
            row-gap: 15px;
        }
        `
        shadow.appendChild(styles)
        shadow.appendChild(container)

    }
}

class DashboardTile extends HTMLElement {
    constructor() {
        super() 
    }

    getId() {
        return [
            "dashboard-tile", 
            this.getAttribute("x0"), 
            this.getAttribute("x1"), 
            this.getAttribute("y0"), 
            this.getAttribute("y1")
        ].join("-")
    }

    connectedCallback() {
        this.setAttribute("id", this.getId())
        const shadow = this.attachShadow({"mode": "closed"})

        const container = document.createElement("div")
        container.setAttribute("class", "container")

        let content;
        if (this.getAttribute("type"))
            content = document.createElement(this.getAttribute("type"))
        else
            console.log("Could not create element of type" + this.getAttribute("type"))

        if (content)
            container.appendChild(content);

        const styles = document.createElement("style")

        styles.textContent = `
        .container {
            display: grid;
            height: 100%;
            width: 100%;
            background: rgba(50,150,100,0.4);
            backdrop-filter: blur(7px);
            border-radius: 10px;
            text-align: center;
            vertical-align: center;
        }
        `

        shadow.appendChild(styles)
        shadow.appendChild(container)

        this.updateParentStyles()

    }

    updateParentStyles() {
        const shadow = this.getRootNode()
        shadow.querySelector("style").textContent += `
        #${this.getId()} {
            grid-row-start: ${this.getAttribute("y0")};
            grid-row-end: ${this.getAttribute("y1")};
            grid-column-start: ${this.getAttribute("x0")};
            grid-column-end: ${this.getAttribute("x1")};

        }
        `
    }

}

class Modal extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.shadow = this.attachShadow({mode: "open"})
        this.container = document.createElement("div")
        this.container.classList.add("container")

        const styles = document.createElement("style");
        styles.textContent = `
            .container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                height: auto;
                min-height: 30%;
                width: auto;
                min-width: 50%;
                background: rgba(200, 200, 200, 0.5);
                padding: 20px;
                border-radius: 10px;
            }

            .content-container {
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .close-button {
                display: grid;
                position: fixed;
                right: 3%;
                top: 3%;
                font-size: 2rem;
                font-weight: bold;
                font-family: 'Arial';
                width: 3rem;
                height: 3rem;
                border-radius: 3rem;
                background: #fff;
                align-items: center;
                justify-items: center;
                z-index: 10;
            }

            .close-button:hover {
                filter: blur(5px);
                cursor: crosshair;
            }   

            .close-button > p {
                margin: 0;
                padding: 0;
            }

            custom-modal-content {
                width: 100%;
                height: 100%;
            }
        `

        const closeButton = document.createElement("div")
        closeButton.innerHTML = "<p>X</p>"
        closeButton.classList.add("close-button")
        closeButton.addEventListener("click", (e) => {e.preventDefault; this.hide()})
        this.container.appendChild(closeButton)

        this.contentContainer = document.createElement("div")
        this.contentContainer.classList.add("content-container")
        this.container.appendChild(this.contentContainer)

        this.shadow.appendChild(styles)
    }

    show() {
        this.shadow.appendChild(this.container)
    }

    hide() {
        this.shadow.removeChild(this.container)
    }

    setContent(content) {
        this.contentContainer.innerHTML = ""
        this.contentContainer.appendChild(content)
    }
}

class ModalContent extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({mode: "closed"})
    }

    connectedCallback() {
    }

    appendChild(child) {
        this.shadow.appendChild(child)
    }
}

customElements.define("background-image", Background)
customElements.define("dashboard-wrapper", Dashboard)
customElements.define("dashboard-tile", DashboardTile)
customElements.define("custom-modal", Modal)
customElements.define("custom-modal-content", ModalContent)