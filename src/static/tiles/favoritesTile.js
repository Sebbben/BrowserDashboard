class Favorites extends HTMLElement {
	constructor() {
		super()
		this.db;
		this.items = {}
	}

	populateGrid() {

		const transaction = this.db.transaction("favorites", "readonly")

		const favsObjStr = transaction.objectStore("favorites");
		const cur = favsObjStr.openCursor()

		cur.onsuccess = (event) => {
			const cursor = event.target.result;
			if (!cursor) return;
			const {text, type, url} = cursor.value;
			
			const item = {id: cursor.key, text: text, type: type, url: url}

			this.items[cursor.key] = item
			this.insertItem(item)
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
				this.openEditCardFor(item.id);
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
		this.items = {}
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
				height: 100px;
				width: 300px;
				display: grid;
				justify-self: center;
				align-items: center;
				text-align: center;
				background: rgba(50, 250, 200, 0.3);
				padding: 10px;
				border-radius: 10px;
			}
		
			.link-container:hover {
				background: rgba(0, 200, 150, 0.3);
				filter: blur(0px);
				cursor: crosshair; 
			}
			
			p {
				margin: 0;
				padding; 0;
				font-size: 2rem;
				font-weight: 200;
				font-family: arial;
				color: white;
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

	updateFavorite(itemId, text, url) {
		const favorites = this.db.transaction("favorites", "readwrite").objectStore("favorites")
		const req = favorites.put({text: text, url: url, type: "link"}, itemId)
		req.onsuccess = () => {
			this.refreshGrid()
		}

	}

	removeFavorite(itemId) {
		const favorites = this.db.transaction("favorites", "readwrite").objectStore("favorites")
		const req = favorites.delete(itemId)
		req.onsuccess = () => {
			this.refreshGrid()
		}

	}

	openEditCardFor(itemId) {
		if (!(itemId in this.items)) return;

		const modal = document.querySelector("custom-modal")
		const item = this.items[itemId]

		const content = document.createElement("custom-modal-content")
		const container = document.createElement("div")
		container.classList.add("container")

		const textInput = document.createElement("input")
		textInput.type = "text"
		textInput.name = "text"
		textInput.value = item.text

		const urlInput = document.createElement("input")
		urlInput.type = "text"
		urlInput.name = "url"
		urlInput.value = item.url

		const save = document.createElement("button")
		save.innerText = "Save"
		save.addEventListener("click", (e) => {
			e.preventDefault()
			this.updateFavorite(itemId, textInput.value, urlInput.value)
		})
		
		const deleteButton = document.createElement("button")
		deleteButton.innerText = "Delete"
		deleteButton.addEventListener("click", (e) => {
			e.preventDefault()
			this.removeFavorite(itemId)
		})

		const styles = document.createElement("style")
		styles.textContent = `
			.container {
				width: 100%;
				height: 100%;
			}
		`

		container.appendChild(textInput)
		container.appendChild(urlInput)
		container.appendChild(save)
		container.appendChild(deleteButton)
		
		content.appendChild(styles)
		content.appendChild(container)


		modal.setContent(content)
		modal.show()
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