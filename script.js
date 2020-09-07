const cards_container = document.querySelector("#cards");
const message = document.querySelector("#filter_message");
const search = document.querySelector("#input1");

function displayCards(arr) {
  // create html
  var html;

  if (arr.length > 0) {
    html =
      `<ul class="d-flex flex-wrap">` +
      arr
        .map(function (item) {
          return `<div class="card" style="width: 18rem;">
                  <img src="${item.img}" class="card-img-top" alt="..." style="height:220px">
                  <div class="card-body d-flex flex-column justify-content-end">
                  <span class="badge badge-light w-25 my-2">${item.category}</span>
                    <h3 class="card-title h5">${item.name}</h3>
                    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                    <a href="${item.url}" class="btn btn-primary" target="_blank">Show Recipe</a>
                  </div>
                </div>`;
        })
        .join("");
  } else {
    html = `<div class="alert alert-primary" role="alert">Sorry, no recipes found based on your search...</div>`;
    filter_message.textContent = "";
  }

  cards_container.innerHTML = html;
}

function displayIngredients(arr) {
  arr.sort();
  var html =
    `<ul id="ingredUl">` +
    arr
      .map(function (item) {
        return `<li>${item}</li>`;
      })
      .join("");

  document.querySelector("#ingredients").innerHTML = html;
}
displayIngredients(my_ingredients);

function filterResults() {
  var result = [];
  let checker = (arr, target) => target.every((v) => arr.includes(v));

  cards.forEach(function (card) {
    // see if card is a match
    if (checker(my_ingredients, card.ingredients)) {
      result.push(card);
    }
  });
  console.log("result: " + result);
  displayCards(result);
}

document.addEventListener("click", function (e) {
  if (e.target.matches("#filter")) {
    filterResults();
    filter_message.textContent = "Filtered recipes";
  }

  if (e.target.matches("#showAll")) {
    displayCards(cards);
    filter_message.textContent = "All recipes";
  }

  if (e.target.matches("#hideAll")) {
    cards_container.innerHTML = "";
    filter_message.textContent = "";
  }

  if (e.target.matches("#show_book")) {
    document.querySelector("#book").classList.remove("d-none");
  }

  if (e.target.matches("#close_book")) {
    console.log("hi");
    document.querySelector("#book").classList.add("d-none");
  }
});

document.querySelector("#one_food").addEventListener("submit", function (e) {
  e.preventDefault();

  var one_ingredient = `${search.value}`;

  var result = [];
  cards.forEach(function (card) {
    if (card.ingredients.includes(one_ingredient)) {
      result.push(card);
    }
  });
  displayCards(result);
  filter_message.innerHTML = `Recipes based on your search for <b>"${one_ingredient}"</b>`;

  search.value = "";
});
