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