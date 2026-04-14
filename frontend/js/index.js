async function kirjautunutUI(){
    try{
        const response = await fetch('/api/me')
        const data = await response.json()

        const vierasUI = document.getElementById('auth-vieras')
        const käyttäjäUI = document.getElementById('auth-käyttäjä')
        const postButton = document.getElementById('postButton')

        if(data.kirjautunut){
            vierasUI.style.display = 'none'
            käyttäjäUI.style.display = 'block'
        } else{
            vierasUI.style.display = 'block'
            käyttäjäUI.style.display = 'none'
            postButton.style.display = 'none'
        }
    } catch(err){
        console.error("auth check failed:", err)
    }
}
document.addEventListener('DOMContentLoaded', kirjautunutUI) //Näyttää vieraille ja käyttäjille eri näkymät. Vois kopsata muille sivuille.

const sortingButton = document.getElementById("sorting");
const sortingItems = document.querySelectorAll(".sorting-item");

if (sortingButton) {
    sortingItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            sortingButton.textContent = item.textContent.trim();
        });
    });
}

function renderPost(post) {
    const btnClass = post.user_liked ? 'btn-primary' : 'btn-outline-dark'
    const likeText = post.user_liked ? 'Tykätty' : 'Tykkää'
    return `
    <li class="list-group-item mb-1">
        <div class="card shadow">
          <div class="card-body">
            <header>
              <h2 class="h5 mb-1">${post.title}</h2>
              <p class="text-muted">${post.username} • ${new Date(post.created_at).toLocaleString('fi-FI')}</p>
            </header>
            <p>${post.content}</p>
            <footer>
              <button type="button" class="btn ${btnClass} post-buttons like-btn" data-id="${post.id}">
                <span class="like-count">${post.total_likes}</span>
                <span class="like-text">${likeText}</span>
              <button type="button" class="btn btn-outline-dark post-buttons" data-bs-toggle="modal" data-bs-target="#comments-modal">
                <svg class="comment-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <g transform="translate(-152 -255)" fill="currentColor">
                    <path d="M168,281 C166.832,281 165.704,280.864 164.62,280.633 L159.912,283.463 L159.975,278.824 C156.366,276.654 154,273.066 154,269 C154,262.373 160.268,257 168,257 C175.732,257 182,262.373 182,269 C182,275.628 175.732,281 168,281 L168,281 Z M168,255 C159.164,255 152,261.269 152,269 C152,273.419 154.345,277.354 158,279.919 L158,287 L165.009,282.747 C165.979,282.907 166.977,283 168,283 C176.836,283 184,276.732 184,269 C184,261.269 176.836,255 168,255 L168,255 Z M175,266 L161,266 C160.448,266 160,266.448 160,267 C160,267.553 160.448,268 161,268 L175,268 C175.552,268 176,267.553 176,267 C176,266.448 175.552,266 175,266 L175,266 Z M173,272 L163,272 C162.448,272 162,272.447 162,273 C162,273.553 162.448,274 163,274 L173,274 C173.552,274 174,273.553 174,273 C174,272.447 173.552,272 173,272 L173,272 Z"/>
                  </g>
                </svg>
                Kommentit
              </button>
            </footer>
          </div>
        </div>
      </li>`
}
let currentPage = 1
async function loadPosts() {
  try{ 
    const response = await fetch(`/api/load-posts?page=${currentPage}`)
    const posts = await response.json();

    const list = document.getElementById('forum-post-list')
    const btn = document.getElementById('load-more-btn')

    if(currentPage === 1) list.innerHTML = ''

    if(posts.length<10){
      if(btn) btn.style.display = 'none'
    } else{
      if(btn) btn.style.display = 'block'
    }
    
    posts.forEach(post =>{
      const postHTML = renderPost(post)
      list.insertAdjacentHTML('beforeend', postHTML)
    })

} catch (err){
  console.error("Virhe ladatessa julkaisuja:", err)
}}
loadPosts()

document.getElementById('load-more-btn').addEventListener('click',()=>{
  currentPage++
  loadPosts()
}) //Lataa uusimmat 10 julkaisua

document.getElementById('forum-post-list')-addEventListener('click', async (e)=>{
  const btn = e.target.closest('.like-btn')
  if(!btn) return

  const postId = btn.getAttribute('data-id')
  const countSpan = btn.querySelector('.like-count')
  const textSpan = btn.querySelector('.like-text')

  try{
  const response = await fetch(`/api/like-post/${postId}`, {method: 'POST'})
        const data = await response.json()
        let currentCount = parseInt(countSpan.innerText)

        if (data.liked){
            btn.classList.replace('btn-outline-dark', 'btn-primary')
            textSpan.innerText = 'Tykätty'
            countSpan.innerText = currentCount + 1
        } else{
            btn.classList.replace('btn-primary', 'btn-outline-dark')
            textSpan.innerText = 'Tykkää'
            countSpan.innerText = currentCount - 1
        }
  } catch(err){
    console.error("Jokin meni pieleen:", err)
  }
}) //Lataa lisää julkaisuja napista