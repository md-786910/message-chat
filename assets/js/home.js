const elements = document.querySelectorAll(".user_image")

const linkBtn = document.querySelector(".linkBtn")

const model = document.querySelector(".model")

linkBtn.addEventListener("click", (e) => {
    e.preventDefault()
    model.classList.toggle("model_show")

})







// make here active profile

for (let i = 0; i < elements.length; i++) {

    elements[i].onclick = function () {

        let el = elements[0];

        while (el) {
            if (el.tagName === "DIV") {

                el.classList.remove("active_user")
            }
            el = el.nextSibling;
        }

        this.classList.add("active_user")
    }

}