const btn = document.querySelector(".add-btn")
const postContainer = document.querySelector(".post-container")
const postInput = document.querySelector(".post-input")
const section = document.querySelector(".section")

let postArray = []
let count = 0

getData()

function getData() {
  fetch("http://localhost:3000/result")
    .then((response) => response.json())
    .then((data) => {
      postArray = data.posts
      renderData()
      if (postArray.length > 0) {
        const firstPost = postArray[0]
        handlePostInput(
          firstPost.profilepic,
          firstPost.name,
          firstPost.lastname,
          firstPost.currentdate
        )
      }
    })
}

function renderData() {
  postContainer.innerHTML = ""
  postArray.forEach((item) => {
    const {
      name,
      lastname,
      text,
      currentdate: date,
      profilepic: profilePic,
      commentpic: commentPic,
      comment,
      url,
    } = item
    
    const postHTML = `
      <div class="post">
        <div class="info">
          <img class="profile-pic" src="${profilePic}" alt="">
          <div>
            <span class="name">${name} ${lastname}</span>
            <div class="date-info">
              <span class="date">${date}</span>
            </div>
          </div>
        </div>
        <div class="post-text">${text}</div>
        <div class="post-image">
        ${item.medias
        .map((media) => {
          if (media.type === "video") {
            return `<video controls>
                        <source src="${media.url}" type="${media.mimeType}">
                      </video>`
          } else if (media.type === "image") {
            return `<img src="${media.url}" alt="post image" />`
          } else {
            return ""
          }
        })
        .join("")}
        </div>
        <div class="interaction-section">
          <i class="fa-regular fa-heart" onclick="toggleLike(this)"></i>
          <i class="fa-regular fa-comment"></i>
        </div>
        <div>
          <p class="like-count" data-count="0">0 like</p>
        </div>
        <div>
          <div class="comment">
            <img src="${commentPic}" class="comment-picture" alt="">
            <div>${comment}</div>
          </div>
          <ul class="answer-list">
            <div>
              <li>Like</li>
              <li class="answer">Answer</li>
            </div>
          </ul>
        </div>
      </div>
    `

    postContainer.innerHTML += postHTML
  })

  const answerList = document.querySelector(".answer-list")
  const answerElements = document.querySelectorAll(".answer")
  answerComment(answerElements, answerList)
}

function handlePostInput(profilePic, name, surname, date) {
  postInput.addEventListener("click", () => {
    const modal = document.createElement("div")
    modal.classList.add("modal")
    section.appendChild(modal)

    const modalBox = document.createElement("div")
    modalBox.classList.add("modal-box")
    modal.appendChild(modalBox)

    modal.style.display = "block"

    modalBox.innerHTML = `
     <div class="post-wrapper">
         <div>
             <h2>Create Post</h2>
         </div>
         <div class="info">
             <img class="profile-pic" src="${profilePic}" alt="">
             <div class="info-wrapper">
                 <span class="name">${name} ${surname}</span>
                 <div class="date-info">${date}</div>
             </div>
         </div>
         <div class="post-text" contentEditable="true" placeholder="What are you thinking about?" role="textbox"
             aria-multiline="true"></div>
         <div class="send-btn">
             <button>Send</button>
         </div>
     </div>
     `

    handleCloseBtn(modal, modalBox)

    const postTextElement = modalBox.querySelector(".post-text")
    postTextElement.style.minHeight = "9rem" // Set the default min-height

    const sendBtn = modalBox.querySelector(".send-btn button")

    sendBtn.addEventListener("click", () => {
      const paragraphValue = postTextElement.textContent.trim()

      if (paragraphValue !== "") {
        const currentDate = new Date().toLocaleDateString()
        const time = new Date().toLocaleTimeString()

        const postHTML = `
           <div class="post">
             <div class="info">
               <img class="profile-pic" src="${profilePic}" alt="">
               <div>
                 <span class="name">${name} ${surname}</span>
                 <div class="date-info">
                   <span class="date">${currentDate}</span>
                   <span class="time">${time}</span>
                 </div>
               </div>
             </div>
             <div class="edit-wrapper"><i class="fa-solid fa-pen-to-square edit" onclick="handleEditBtn(this)"></i><i class="fa-solid fa-check end" onclick="handleEndBtn(this)"></i></div>
             <div class="post-text">${paragraphValue}</div>
             <div class="interaction-section">
               <i class="fa-regular fa-heart" onclick="toggleLike(this)"></i>
               <i class="fa-regular fa-comment"></i>
             </div>
             <div>
               <p class="like-count" data-count="0">0 like</p>
             </div>
             <div>
               <input class="comment-input" type="text" placeholder="İlk yorumu yap">
             </div>
           </div>
         `
        tempElement(postHTML)

        modal.style.display = "none"
      }
    })

    handleEditBtn(postTextElement)
    handleEndBtn(postTextElement)
  })
}

function tempElement(postHTML) {
  const tempElement = document.createElement("div")
  tempElement.innerHTML = postHTML

  postContainer.insertBefore(tempElement, postContainer.firstChild)
}

function handleCloseBtn(modal, modalBox) {
  const closeBtn = document.createElement("button")
  closeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`
  modalBox.appendChild(closeBtn)

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
  })
}

function toggleLike(e) {
  e.classList.toggle("fa-solid")
  const post = e.closest(".post")
  const likeCountElement = post.querySelector(".like-count")

  let count = parseInt(likeCountElement.getAttribute("data-count")) || 0

  if (e.classList.contains("fa-solid")) {
    count++
  } else {
    count--
  }

  likeCountElement.textContent = `${count} like`
  likeCountElement.setAttribute("data-count", count)
}

function answerComment(answerElements, answerList) {
  answerElements.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      const answerEl = document.createElement("input")
      answerEl.classList.add("answer-element")

      answerList.appendChild(answerEl)
    })
  })
}

function handleEditBtn(editBtn) {
  const postTextElement = document.querySelector(".post-text")
  postTextElement.contentEditable = true
  postTextElement.style.outline = "none"
  postTextElement.style.backgroundColor = "rgb(243, 238, 238)"
}

function handleEndBtn(endBtn) {
  const postTextElement = document.querySelector(".post-text")
  postTextElement.contentEditable = false
  postTextElement.style.outline = ""
  postTextElement.style.backgroundColor = "white"
}
