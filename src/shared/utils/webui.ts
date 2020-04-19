export const createMount = (document) => {
    const mount = document.createElement("div");

    mount.id = "app";

    document.body.insertAdjacentElement('afterbegin', mount);

    const title = document.createElement("title");
    const path = window.location.pathname;

    if(path == "/newtab") {
        title.textContent = "New Tab";
    } else if(path == "/settings") {
        title.textContent = "Settings";
    } else {
        title.textContent = "Unknown"
    }

    document.head.appendChild(title)
}