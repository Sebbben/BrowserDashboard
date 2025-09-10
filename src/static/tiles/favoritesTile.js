class Favorites extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        const shadow = this.attachShadow({mode: "closed"})

        const favsTree = {
            "IN1000": {type: "link", url: "https://www.uio.no/studier/emner/matnat/ifi/IN1000/h25/index.html"},
            "Mine Studier": {type: "link", url: "https://minestudier.no/en/student"},
            "Devilry": {type: "link", url: "https://devilry.ifi.uio.no/"}
            
        }

        const container = document.createElement("div")
        container.classList.add("container")
        
        for (const [fav, info] of Object.entries(favsTree)) {
            if (info.type != "link") continue;

            const linkContainer = document.createElement("div")
            const linkText = document.createElement("p")
            linkText.innerText = fav
            linkContainer.appendChild(linkText)
            linkContainer.setAttribute("class", "link-container")
            linkContainer.addEventListener("click", (e) => {
                window.location = info.url
            })

            container.appendChild(linkContainer)
            
        }

        const styles = document.createElement("style")
        
        styles.textContent = `
        .container {
            height: 100%;
            width: 100%;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: auto;
            align-items: center;
        }

        .link-container {
            height: 50px;
            width: 70px;
            display: grid;
            justify-self: center;
            align-items: center;
            text-align: center;
            background: rgba(200, 200, 200, 0.5);
            padding: 10px;
            border-radius: 10px;
        }

        .link-container:hover {
            background: rgba(200,200,200,0.2);
            filter: blur(2px);
            cursor: crosshair; 
        }
        
        p {
            margin: 0;
            padding; 0;
        }
        `

        // const root = this.getRootNode()
        // root.querySelector("style").textContent += styles
        shadow.appendChild(styles)
        shadow.appendChild(container)
    }
}

customElements.define("favorites-tile", Favorites)