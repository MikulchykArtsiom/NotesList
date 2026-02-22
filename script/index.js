const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}

const MOCK_NOTES = [{
        id: 1,
        title: 'Note 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime quam facere labore nobis velit earum quia doloribus et dignissimos eius!',
        color: colors.GREEN,
        isFavorite: false,
    },
    {
        id: 2,
        title: 'Note 2',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum cupiditate obcaecati harum iste, iure vero!',
        color: colors.BLUE,
        isFavorite: true,
    },
    {
        id: 3,
        title: 'Note 3',
        description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
        color: colors.PURPLE,
        isFavorite: false,
    }
]

const model = {
    notes: [], //MOCK_NOTES,
    isShowOnlyFavorite: false,

    saveLocalStorage(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    },

    getLocalStorage() {
        this.notes = JSON.parse(localStorage.getItem('notes'))
    },

    toggleShowOnlyFavorite(isShowOnlyFavorite) {
        this.isShowOnlyFavorite = isShowOnlyFavorite
        this.updateNotesView()
    },

    updateNotesView() {
        const notesToRender = this.notes.filter((note) => note.isFavorite)

        if (this.isShowOnlyFavorite) {
            this.saveLocalStorage(this.notes)
            view.renderNotes(notesToRender)
        } else {
            this.saveLocalStorage(this.notes)
            view.renderNotes(this.notes)
        }

    },

    addNote(title, description, color) {
        const isFavorite = false
        const id = new Date().getTime()
        const note = {
            id,
            title,
            description,
            color,
            isFavorite
        }

        this.notes.unshift(note)
        this.updateNotesView()
    },

    deleteNotes(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId)
        this.updateNotesView()
    },

    isFavoriteNote(noteId) {
        const favoriteNote = this.notes.find((note) => note.id === noteId)
        favoriteNote.isFavorite = !favoriteNote.isFavorite
        this.updateNotesView()
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.note-form')
        const input = document.querySelector('.form-info > input')
        const textarea = document.querySelector('.form-info > textarea')
        const notesList = document.querySelector('.notes-list')
        const favoriteList = document.querySelector('.filter-box')

        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const title = document.querySelector('#title').value
            const description = document.querySelector('#description').value
            const colors = Array.from(document.querySelectorAll('.radio'))
            const color = colors.find(color => color.checked).value

            controller.addNote(title, description, color)

            if (title.length <= 50 && description.length <= 250 && title && description) {
                input.value = ''
                textarea.value = ''
                const color = colors.find(color => color.value === "yellow")
                color.checked = 'true'
            }

        })

        notesList.addEventListener('click', (event) => {
            if (event.target.classList.contains('favorite-button')) {
                const noteId = +event.target.closest('.note').id
                controller.isFavoriteNote(noteId)
            }
            if (event.target.classList.contains('delete-button')) {
                const noteId = +event.target.closest('.note').id
                controller.deleteNotes(noteId)

            }
        })

        favoriteList.addEventListener('click', () => {
            favoriteList.classList.toggle('done')
            const isShowOnlyFavorite = favoriteList.classList.contains('done')
            controller.toggleShowOnlyFavorite(isShowOnlyFavorite)
        })

    },

    renderNotes(notes) {

        const notesList = document.querySelector('.notes-list')
        const counter = document.querySelector('.counter')
        const favoriteList = document.querySelector('.filter-box')
        const counterText = document.querySelector('.counterText')

        if (model.isShowOnlyFavorite) {
            counterText.textContent = 'Избранных:'
        } else {
            counterText.textContent = 'Всего заметок:'
        }
        counter.innerHTML = `${notes.length}`

        let notesHTML = ''
        let favoriteHTML = ''

        if (model.notes.length === 0) {
            notesHTML = `<p class = "notNotes">У вас нет еще ни одной заметки<br>Заполните поля выше и создайте свою первую заметку!</p>`
        } else {
            const imgFavoriteList = favoriteList.classList.contains('done') ? 'images/checkbox_active.png' : 'images/checkbox_inactive.png'
            favoriteHTML = `Показать только избранные заметки <img src=${imgFavoriteList}> `

            for (const note of notes) {
                const imgFavorite = note.isFavorite ? "images/heart_active.svg" : "images/heart_inactive.svg"
                notesHTML += `
        <li id="${note.id}" class="note">
        <div class="note-wrapper ${note.color}" >
        <h2 class="note-title">${note.title}</h2>
        <div class="buttons">
        <img class="favorite-button"src=${imgFavorite}>
        <img class="delete-button"src="images/trash.svg">
        </div>
        </div>
        <p class="note-description">${note.description}</p>
        </li>
        `
            }
        }

        favoriteList.innerHTML = favoriteHTML
        notesList.innerHTML = notesHTML
    },

    showMessage(context, color, img) {
        const messageBox = document.querySelector('.messages-box')
        const messageImg = document.createElement('img')
        messageImg.setAttribute('src', img)
        const message = document.createElement('p')
        message.textContent = context
        message.classList.add(color)
        message.append(messageImg)
        messageBox.append(message)
        setTimeout(() => {
            message.remove()
        }, 3000)
    }
}

const controller = {
    addNote(title, description, color) {
        if (title.length > 50) {
            view.showMessage('Максимальная длина заголовка - 50 символов', 'red', 'images/warning.svg')
        } else if (description.length > 250) {
            view.showMessage('Максимальная длина описания - 250 символов', 'red', 'images/warning.svg')
        } else if (title.trim() !== '' && description.trim() !== '') {
            newColor = colors[color.toUpperCase()]
            model.addNote(title, description, newColor)
            view.showMessage('Заметка добавлена', 'green', 'images/Done.svg')
        } else {
            view.showMessage('Заполните все поля', 'red', 'images/warning.svg')
        }
    },

    deleteNotes(noteId) {
        model.deleteNotes(noteId)
        view.showMessage('Заметка удалена', 'red', 'images/warning.svg')
    },

    isFavoriteNote(noteId) {
        model.isFavoriteNote(noteId)
    },

    toggleShowOnlyFavorite(isShowOnlyFavorite) {
        model.toggleShowOnlyFavorite(isShowOnlyFavorite)
    }
}

function init() {
    model.getLocalStorage()
    view.init()
}

init()