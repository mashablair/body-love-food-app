const cards_container = document.querySelector("#cards");
const message = document.querySelector("#filter_message");
const search = document.querySelector("#input1");
let checker = (arr, target) => target.every((v) => arr.includes(v));

function displayCards(arr) {
  // create html
  var html;

  if (arr.length > 0) {
    html =
      `<ul class="d-flex flex-wrap">` +
      arr
        .map(function (item) {
          var ready_to_cook = false;
          // see if it's ready to cook
          if (checker(my_ingredients, item.ingredients)) {
            ready_to_cook = true;
          }

          return `<div class="card" style="width: 18rem;">
                  <img src='${item.img ? item.img : "images/no_image.png"}' class="card-img-top" alt="..." style="height:220px">
                  <img src="images/ready.png" aria-label="ready to cook" title="ready to cook" class='ready ${ready_to_cook ? "" : "d-none"} '>
                  <div class="card-body d-flex flex-column justify-content-end">
                    <span class="badge badge-light w-25 my-2">${item.category}</span>
                    <h3 class="card-title h5">${item.name}</h3>
                    <div class="btn-group action_btns" role="group">
                      <a href="${item.url}" class="btn btn-secondary ${item.url ? "" : "d-none"}" target="_blank">Recipe</a>
                      <button class="btn btn-outline-dark show_missing" data-calculated="false" aria-label="show missing ingredients" title="show missing ingredients" data-num="${
                        item.num
                      }">🕵️‍</button>
                      <button class="btn btn-outline-dark add_to_cart" aria-label="add missing ingredients to a shopping list" title="add missing ingredients to a shopping list" data-num="${
                        item.num
                      }">Add 🛒</button>
                    </div>
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
displayCards(cards);

function displayIngredients(arr, idUL, idContainer) {
  arr.sort();
  var html =
    `<ul id="${idUL}">` +
    arr
      .map(function (item) {
        return `<li>${item}</li>`;
      })
      .join("") +
    "</ul>";

  document.querySelector(`#${idContainer}`).innerHTML = html;
}
displayIngredients(my_ingredients, "ingredUl", "ingredients");

function filterResults() {
  var result = [];

  cards.forEach(function (card) {
    // see if card is a match
    if (checker(my_ingredients, card.ingredients)) {
      result.push(card);
    }
  });
  console.log("result: " + result);
  displayCards(result);
}

function filterByCat(event, category) {
  event.preventDefault();
  var result = [];

  cards.forEach(function (card) {
    if (card.category === category) {
      result.push(card);
    }
  });
  displayCards(result);
  filter_message.innerHTML = `Filtered recipes by <b>${category}</b>`;
}

document.addEventListener("click", function (e) {
  if (e.target.matches("#filter")) {
    e.preventDefault();
    filterResults();
    filter_message.innerHTML = `Filtered recipes by <b>My Ingredients</b>`;
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

  if (e.target.matches("#breakfast")) {
    filterByCat(e, "Breakfast");
  }

  if (e.target.matches("#lunch")) {
    filterByCat(e, "Lunch");
  }

  if (e.target.matches("#dinner")) {
    filterByCat(e, "Dinner");
  }

  if (e.target.matches(".add_to_cart")) {
    // find card in [cards]
    var card = cards.find((item) => item.num === e.target.dataset.num);

    // we only need items that are not in 'my_ingredients'
    card.ingredients.forEach(function (item) {
      if (!my_ingredients.includes(item)) {
        shopping_list.push({
          ingredient: `${item}`,
          recipe: `${card.name}`,
        });
      }
    });

    console.log(shopping_list);

    // remove duplicates from 'shopping list'
    // shopping_list = [...new Set(shopping_list)];

    // // loop through 'shopping_list' to see which cards have those ingredients
    // shopping_list.forEach((item) => {
    //   console.log(item);
    //   cards.forEach((card) => {
    //     if (card.ingredients.includes(item)) {
    //       console.log(card.name);
    //     }
    //   });
    // });

    // // display shopping list
    // displayIngredients(shopping_list, "shoppingUL", "shopping_list");

    var html =
      `<ul id="shoppingUL">` +
      shopping_list
        .map(function (item) {
          return `<li class="mt-2"><b>${item.ingredient}</b> <span class="badge bg-primary">${item.recipe}</span></li>`;
        })
        .join("") +
      "</ul>";

    document.querySelector("#shopping_list").innerHTML = html;
  }

  if (e.target.matches(".show_missing")) {
    if (e.target.dataset.calculated === "false") {
      var card = cards.find((item) => item.num === e.target.dataset.num);
      var missing_items = [];

      // we only need items that are not in 'my_ingredients'
      card.ingredients.forEach(function (item) {
        if (!my_ingredients.includes(item)) {
          missing_items.push(item);
        }
      });

      var html;
      if (missing_items.length > 0) {
        missing_items.sort();
        html =
          `<div class="missing_ingredients card alert-info">
            <button type="button" class="close close_missing" aria-label="Close">&times;</button>
            <div class="mb-2">You are missing these items:</div>
            <ul class="missing_ul">` +
          missing_items
            .map(function (item) {
              return `<li>${item}</li>`;
            })
            .join("") +
          "</ul><div class='mt-2'>Add them to your 🛒</div></div>";
      } else {
        html = `<div class="missing_ingredients card alert-success">
                <button type="button" class="close close_missing" aria-label="Close">&times;</button>
                <div>You have all ingredients for this recipe! 👍</div></div>`;
      }

      e.target.closest(".card-body").innerHTML += html;
      e.target.dataset.calculated = true;
    }
  }

  if (e.target.matches(".close_missing")) {
    e.target.closest(".missing_ingredients").classList.add("d-none");
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
