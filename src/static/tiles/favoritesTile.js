class Favorites extends HTMLElement {
    constructor() {
        super()
        this.db;
    }

    populateGrid() {

        const transaction = this.db.transaction("favorites", "readonly")

        const favsObjStr = transaction.objectStore("favorites");
        const cur = favsObjStr.openCursor()

        cur.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) return;
            const {text, type, url} = cursor.value;
            
            this.insertItem({id: cursor.key, text: text, type: type, url: url})
            cursor.continue();
        }

        cur.onerror = () => {
            console.log("Error when getting favorites")
        }

    }

    insertItem(item) {
        if (item.type != "link") return;

        const linkContainer = document.createElement("div")
        const linkText = document.createElement("p")
        linkText.innerText = item.text
        linkContainer.appendChild(linkText)
        linkContainer.setAttribute("class", "link-container")
        linkContainer.addEventListener("click", (e) => {
            e.preventDefault()

            if (e.getModifierState("Control")) {
                console.log(e.target);
                return;
            }

            window.location = item.url
        })

        this.container.appendChild(linkContainer)
        
    }

    insertAddButton() {
        const addButton = document.createElement("div")
        const buttonText = document.createElement("p")
        buttonText.innerText = "+"
        addButton.appendChild(buttonText)
        addButton.classList.add("link-container")
        addButton.addEventListener("click", () => {
            this.createNewFavorite()
        })
        this.container.appendChild(addButton)
    }

    createNewFavorite() {
        const transaction = this.db.transaction("favorites", "readwrite")

        const favsObjStr = transaction.objectStore("favorites");

        const req = favsObjStr.add({text: "test", type: "link", url: "test"})
        req.onsuccess = (e) => {
            this.refreshGrid()
        }
    }

    refreshGrid() {
        this.container.innerHTML = "";
        this.insertAddButton()
        this.populateGrid()
    }

    insertStyles() {
        const styles = document.createElement("style")
        
        styles.textContent = `
            .container {
                height: 100%;
                width: 100%;
                display: grid;
                grid-auto-flow: column;
                grid-template-rows: repeat(3, 1fr);
        
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
        this.shadow.appendChild(styles)
    }
    
    handleOpenDB() {
        const request = window.indexedDB.open("favorites", 1)

        request.onsuccess = (event) => {
            this.db = event.target.result;
            this.populateGrid()
        }

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            const objectStore = this.db.createObjectStore('favorites', { autoIncrement: true });
        }
    }

    connectedCallback() {

        this.shadow = this.attachShadow({mode: "closed"})
        this.container = document.createElement("div")
        this.container.classList.add("container")
        
        this.insertStyles()
        this.insertAddButton()
        
        this.handleOpenDB()
        
        this.shadow.appendChild(this.container)
    }

}

customElements.define("favorites-tile", Favorites)