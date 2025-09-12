class Favorites extends HTMLElement {
    constructor() {
        super()
        this.db;
    }

    addFavsLinks() {
        // return {
        //     "IN1000": {type: "link", url: "https://www.uio.no/studier/emner/matnat/ifi/IN1000/h25/index.html"},
        //     "Mine Studier": {type: "link", url: "https://minestudier.no/en/student"},
        //     "Devilry": {type: "link", url: "https://devilry.ifi.uio.no/"}   
        // }
        
        const transaction = this.db.transaction("favorites", "readonly")

        const favsObjStr = transaction.objectStore("favorites");
        const cur = favsObjStr.openCursor()

        cur.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) return;
            const {text, type, url} = cursor.value;
            
            this.addFavLink({id: cursor.key, text: text, type: type, url: url})
            cursor.continue();
        }

        cur.onerror = () => {
            console.log("Error when getting favorites")
        }

    }

    addFavLink(fav) {
        if (fav.type != "link") return;

        const linkContainer = document.createElement("div")
        const linkText = document.createElement("p")
        linkText.innerText = fav.text
        linkContainer.appendChild(linkText)
        linkContainer.setAttribute("class", "link-container")
        linkContainer.addEventListener("click", (e) => {
            e.preventDefault()

            if (e.getModifierState("Control")) {
                console.log(e.target);
                return;
            }

            window.location = fav.url
        })

        this.container.appendChild(linkContainer)
        
    }

    addAddButton() {
        const addButton = document.createElement("div")
        const buttonText = document.createElement("p")
        buttonText.innerText = "+"
        addButton.appendChild(buttonText)
        addButton.classList.add("link-container")
        addButton.addEventListener("click", () => {
            this.createFavorite()
        })
        this.container.appendChild(addButton)
    }

    createFavorite() {
        while (this.db === undefined) {
            setTimeout(()=>{}, 500)
        }

        const transaction = this.db.transaction("favorites", "readwrite")

        const favsObjStr = transaction.objectStore("favorites");

        console.log("hello")
        const req = favsObjStr.add({text: "test", type: "link", url: "test"})
        req.onsuccess = (e) => {
            this.refreshFavs()
        }
    }

    refreshFavs() {
        this.container.innerHTML = "";
        this.addAddButton()
        this.addFavsLinks()
    }

    connectedCallback() {

        this.shadow = this.attachShadow({mode: "closed"})
        this.container = document.createElement("div")
        this.container.classList.add("container")
        
        


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

        this.addAddButton()
        this.shadow.appendChild(styles)
        this.shadow.appendChild(this.container)

        this.handleOpenDB()

    }

    handleOpenDB() {
        const request = window.indexedDB.open("favorites", 1)

        request.onsuccess = (event) => {
            this.db = event.target.result;
            this.addFavsLinks()
        }

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            const objectStore = this.db.createObjectStore('favorites', { autoIncrement: true });
        }
    }
}

customElements.define("favorites-tile", Favorites)