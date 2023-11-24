//Karla's apiKey stored in a variable, and a variable dishName created to capture user input from the input box on the search page.  It is just set to "Maple Glazed Salmon" as a default for now so I can test this code. Button element created in search.html and stored in a variable here so I can listen for clicks on it 
var apiKeySpnclr = "8fd577ed42a246f5ae57136ccaf8d0f7";

document.addEventListener('DOMContentLoaded', function () {
  // Click listener for seeFavesButton1
  var seeFavesButton1 = document.getElementById("see-faves-1");
  seeFavesButton1.addEventListener('click', function () {
    // Redirect to favourites.html
    window.location.href = 'library/favourites.html';
  });

  // Click listener for SearchBtnEl
  var searchBtnEl = document.getElementById("button-addon2");
  searchBtnEl.addEventListener('click', function () {
    // Capture input
    var ingredientOrDishName = document.querySelector(".input-1").value;

    // Use Promise.all to handle multiple asynchronous operations
Promise.all([
  getRecipes(ingredientOrDishName),
  getMenuItems(ingredientOrDishName)
])
  .then(function (results) {
    var allRecipeDetails = results[0];
    var allMenuItems = results[1];

    console.log('Recipe details:', allRecipeDetails);
    console.log('Menu items:', allMenuItems);
    console.log(allRecipeDetails.length);
    console.log(allMenuItems.length);

      // Redirect to results2.html
      window.location.href = 'library/results2.html';
      console.log('After redirecting to results2.html');
    }       
  )
  .catch(function (error) {
    // Handle errors
    console.error('Error:', error.message);
  });
});

// Async function to get recipes
function getRecipes(ingredientOrDishName) {
  return new Promise(function (resolve, reject) {
    // Check that the input has been captured
    console.log('Ingredient or Dish Name:', ingredientOrDishName);

    // A fetch URL to get recipes from spoonacular api.
    // Query parameters are hardcoded to limit recipes returned to 5, to sort by most popular
    // and display them in descending order. Data will include full recipe instructions and nutritional info
    var recipesURL = `https://api.spoonacular.com/recipes/complexSearch?query=${ingredientOrDishName}&addRecipeNutrition=true&instructionsRequired=true&sort=popularity&sortDirection=desc&number=5&apiKey=${apiKeySpnclr}`;

    // Send a fetch request to get recipes.
    fetch(recipesURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('Data received successfully:', data);
        if (data.results && data.results.length > 0) {
          console.log(data.results);

          // Declares the recipe and recipeDetails variables and sets them initially to an empty array.
          var allReturnedRecipes = [];
          var allRecipeDetails = [];

          // Iterates through each returned recipe
          for (var i = 0; i < data.results.length; i++) {
            console.log('Rendering details for recipe:', i);
            var recipeData = data.results[i];

// Extracts the ingredients values and formats them.
var ingredientsVal = [];
  for (var j = 0; j < recipeData.nutrition.ingredients.length; j++) {
    var ingredient = recipeData.nutrition.ingredients[j];
    var formattedIngredient = '';
      //Ingredients are under the nutrients array in the data.results. Amounts are given here per serving so this multiplies by the servings value to get the right amount for the whole recipe.
      var adjustedAmount = ingredient.amount * recipeData.servings;
      // This logic evaluates whether the adjusted amount is a whole number. If so, it updates the value of the formattedIngredients string. If not, it rounds to one decimal place before updating the value of the formattedIngredients string.
      if (adjustedAmount % 1 === 0) {
        formattedIngredient += adjustedAmount;
      } else {
        formattedIngredient += adjustedAmount.toFixed(1);
      }
      formattedIngredient += ' ' + ingredient.unit + ' ' + ingredient.name;
      ingredientsVal.push(formattedIngredient);
    }
// Checks that the ingredients value has been extracted and formatted correctly. Should be an array that looks like this: [["28 ounces canned tomatoes", "14 ounces canned tomatoes", "2 tablespoons chili powder," "1 tablespoon ground cumin", "2 teaspoons paprika", "1 tablespoon brown sugar", "1 tablespoon brown sugar", " "0.5 teaspoon salt", "3 " carrots", "4 stalks celery", "1 medium onion", "2 cloves garlic", "1 pound beef chuck", "15 ounces kidney beans"]
console.log('Ingredients:', ingredientsVal);


//Extracts the steps value and formats it
var stepsVal = [];
if (recipeData.analyzedInstructions[0] && recipeData.analyzedInstructions[0].steps) {
  var stepArray = recipeData.analyzedInstructions[0].steps;
  for (var k = 0; k < stepArray.length; k++) {
    stepsVal.push(stepArray[k].number + '. ' + stepArray[k].step);
  }
}
//Checks that the steps value has been extracted and is formatted correctly. Should be an array that looks like this: ["1. In a medium bowl, stir together the crushed tomato…cumin, paprika, brown sugar, and salt. Set aside.", "2. Place the carrots, celery, onions, garlic, beef, and kidney beans into the base of a slow cooker.", "3. Pour the tomato sauce mixture evenly over the top …d vegetables. Cover and cook on high for 6 hours.", "4. Taste and adjust seasoning as necessary- adding more chili powder if you'd prefer more spice."]
console.log('Steps:', stepsVal);


//Compiles nutritional info by extracting and formatting select data from the data.results nutrients array.  I am making 2 arrays because I want to render them this way to the accordion
var nutritionalInfoVal1 = [];
var nutritionalInfoVal2 = [];
//Accesses the nutrientsArray from the data.results and filters it to include only select nutrients
var nutrientsArray = recipeData.nutrition.nutrients;
//Defines arrays for different groups of nutrients
var group1Nutrients = ['Calories', 'Fat'];
var group2Nutrients = ['Carbohydrates', 'Sugar', 'Protein'];
//Filters nutrients based on groups
var selectNutrients1 = nutrientsArray.filter(function(nutrient) {
  return group1Nutrients.includes(nutrient.name);
});
var selectNutrients2 = nutrientsArray.filter(function(nutrient) {
  return group2Nutrients.includes(nutrient.name);
});
//Iterates through the selectNutrients1 array to extract and format the nutritional information values for group 1
for (var m = 0; m < selectNutrients1.length; m++) {
  var nutrient = selectNutrients1[m];
  var formattedNutritionalInfo = ' ' + nutrient.name + ': ' + nutrient.amount + ' ' + nutrient.unit;
  nutritionalInfoVal1.push(formattedNutritionalInfo);
}
//Iterates through the selectNutrients2 array to extract and format the nutritional information values for group 2
for (var n = 0; n < selectNutrients2.length; n++) {
  var nutrient = selectNutrients2[n];
  var formattedNutritionalInfo = ' ' + nutrient.name + ': ' + nutrient.amount + ' ' + nutrient.unit;
  nutritionalInfoVal2.push(formattedNutritionalInfo);
}
//Checks that the select nutritional info values have been extracted and formatted correctly for group 1
console.log('Nutritional Info Group 1:', nutritionalInfoVal1);
//Checks that the select nutritional info values have been extracted and formatted correctly for group 2
console.log('Nutritional Info Group 2:', nutritionalInfoVal2);



//Creates an object to store easily renderable information for each recipe returned by the fetch request
  var returnedRecipeObject = {
    id: recipeData.id,
    title: recipeData.title,
    servings: recipeData.servings,
    readyInMinutes: recipeData.readyInMinutes,
    image: recipeData.image, // value will be an http link to the spoonacular site with a jpg extension
    ingredients: ingredientsVal,
    steps: stepsVal, 
    sourceUrl: recipeData.sourceUrl,
  };
    
//Creates an object to store more recipe details
  var recipeDetailsObject = {
    id: recipeData.id,
    title: recipeData.title,
    image: recipeData.image,
    aggregateLikes: recipeData.aggregateLikes, //value will be a number
    cheap: recipeData.cheap, //value will be a boolean
    veryHealthy: recipeData.veryHealthy, //value will be a boolean
    cuisines: recipeData.cuisines || [], //sometimes cuisines and weightPerServing are undefined, so in this case they will default to an empty array
    weightPerServing: recipeData.weightPerServing || [], 
    diets: recipeData.diets, // value will be an array of strings
    nutritionalInfo1: nutritionalInfoVal1,
    nutritionalInfo2: nutritionalInfoVal2  
  }

// Push the returnedRecipeObject into the allReturnedRecipes array
allReturnedRecipes.push(returnedRecipeObject);
console.log('Recipe added:', allReturnedRecipes);

// Push the recipeDetailsObject into the allRecipeDetails array
allRecipeDetails.push(recipeDetailsObject);
console.log('Recipe details added:', allRecipeDetails);

// Save the arrays to localStorage
localStorage.setItem("recipes", JSON.stringify(allReturnedRecipes));
localStorage.setItem("recipeinfo", JSON.stringify(allRecipeDetails));

// Resolve the promise with the data
resolve(allRecipeDetails);
}

} else {
// If there are no results, show a modal
var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
modal.show();

// Reject the promise with an error message
reject('No results found');
}
})
.catch(function (error) {
// Handle fetch or processing errors
console.error('Error:', error);
reject(error);
});
});
}


// Async function to get menu items
function getMenuItems(ingredientOrDishName) {
  return new Promise(function (resolve, reject) {
    var menuItemsURL = 'https://api.spoonacular.com/food/menuItems/search?query=' + ingredientOrDishName + '&apiKey=' + apiKeySpnclr;

    fetch(menuItemsURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('Menu Items Data:', data);

        var allMenuItems = [];
        var processedTitles = []; // Array to store processed titles
        
        if (data.menuItems && data.menuItems.length > 0) {
          for (var i = 0; i < data.menuItems.length; i++) {
            var menuItem = data.menuItems[i];
        
            // Process menuItem data
            var title = menuItem.title;
            var restaurant = menuItem.restaurantChain;
        
            // Check if the first five words of the title have been processed before to avoid duplicates
            var titleWords = title.split(' ').slice(0, 5).join(' ');
            if (!processedTitles.includes(titleWords)) {
              var menuItemObject = {
                title: title,
                restaurant: restaurant
              };
        
              allMenuItems.push(menuItemObject);
              processedTitles.push(titleWords); // Store processed title
        
              console.log('Processed Menu Item:', menuItemObject);
            }
          }
        
          // Save the menu items data to local storage
          localStorage.setItem('menuitems', JSON.stringify(allMenuItems));
          console.log('Filtered Menu Items:', allMenuItems);        

          // Resolve with the filtered menu items array directly
          resolve(allMenuItems);
        } else {
          console.log('No menu items found.');
          // Resolve with an empty array if no menu items are found
          resolve([]);
        }
      })
      .catch(function (error) {
        // Handle fetch or processing errors
        console.error('Error fetching menu items:', error);
        reject(error);
      });
  });
}});