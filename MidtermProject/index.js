// Isaac and Sidharth
function displayProducts() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => loadProducts(data));

    function loadProducts(data) {
        var id = "p";
        for (var i = 0; i < 4; i++) {
            id = "p" + i;
            let container = document.getElementById(id);
            let textdiv = document.createElement("div");
            let imgdiv = document.createElement("div");

            let productData = data.Products[i];
            let price = productData.Price;
            let desc = productData.Description;
            let name = productData.Name;
            let imgPath = productData.Img;

            textdiv.className = "my-3 py-3";
            textdiv.innerHTML = `
                <h2 class="display-5">${name}</h2>
                <p class="lead">${desc} ${price}</p>
            `;
            imgdiv.className = "shadow-sm mx-auto";
            imgdiv.style = `background-image: url('${imgPath}'); background-color: black; background-repeat: no-repeat; background-position: top;  width: 80%; height: 300px; border-radius: 21px 21px 0 0;`

            container.appendChild(textdiv);
            container.appendChild(imgdiv);
        }
    }
}

function displayGuides() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => loadGuides(data));

    function loadGuides(data) {
        var id = "g";
        for (var i = 0; i < 3; i++) {
            id = "g" + i;
            let container = document.getElementById(id);
            let textdiv = document.createElement("div");
            let imgdiv = document.createElement("div");

            let learnData = data.Learn[i];
            let time = learnData.TimeEst;
            let desc = learnData.Description;
            let name = learnData.Name;
            let imgPath = learnData.Img;

            textdiv.className = "auto-text-align text-bg-light col-lg-7 bg-body-tertiary p-4";
            textdiv.innerHTML = `
                    <h2 class="featurette-heading fw-normal lh-1">${name} ~<span
                            class="text-body-secondary">${time}</span></h2>
                    <p class="lead">${desc}</p>
            `;
            imgdiv.className = "col-lg-5 mx-auto img-fluid";
            imgdiv.style = `
                width="500"; height="500"; background-image: url('${imgPath}'); background-position: center;
                `;
            // Ordering Mayhem
            if (i % 2 == 0) {
                container.appendChild(textdiv);
                container.appendChild(imgdiv);
            } else {
                container.appendChild(imgdiv);
                container.appendChild(textdiv);
            }
        }
    }
}
