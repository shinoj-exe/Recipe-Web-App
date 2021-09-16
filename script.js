const mealsEl = document.getElementById("meals")
const newBtn = document.querySelector(".new-btn")
var favMeals = document.querySelector(".fav-meals")

const searchTerm = document.getElementById("search-term")
const searchBtn = document.getElementById("search")

const mealPopup = document.getElementById("meal-popup")
const mealInfoEl =document.getElementById("meal-info")
const overlay = document.querySelector(".overlay")
const popupCloseBtn = document.querySelector(".close-popup")



getRandomMeal()
getRandomMeal()

async function getRandomMeal(){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal= respData.meals[0];
    console.log(randomMeal);
    addMeal(randomMeal,true)
}

async function getMealById(id){
    const meal= await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
}

async function getMealsBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term)

    const respData = await resp.json();
    const meal = await respData.meals;

    return meal;
}

function addMeal(mealData,random=false){
    const meal=document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML=`
    <div class="meal-header">
        ${random ? `<span class="random">New Recipe!</span>`:" "}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="btn fav-btn">
            <i class="fas fa-heart"></i>
        </button>
        <button class="btn close-btn">
            <i class="fas fa-times"></i>
        </button>
    </div>
    `
    mealsEl.appendChild(meal)

    const btn =meal.querySelector(".fav-btn");

    btn.addEventListener("click",()=>{
        btn.classList.add("active")
        btn.disabled=true;
        var li =document.createElement("li")
        li.innerHTML = `<li class="item">
                        <button class="remove">
                            <i class="fas fa-times"></i>
                        </button>
                        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
                        </li>`
        favMeals.appendChild(li)   


        const removeBtn = li.querySelector(".remove")
        removeBtn.addEventListener("click",()=>{
            btn.classList.remove("active")
            btn.disabled=false;
            favMeals.removeChild(li)
        }) 
        li.addEventListener("click",()=>{
            showMealInfo(mealData)
        })

    }) 
    const close =meal.querySelector(".close-btn");
    close.addEventListener("click",()=>{
        meal.parentElement.removeChild(meal)
    })

    meal.addEventListener("click",()=>{
        showMealInfo(mealData)
    })
    
}
newBtn.addEventListener("click",getRandomMeal);


var removeFav = document.querySelectorAll(".remove")
removeFav.forEach(remove=>{
    remove.addEventListener("click",()=>{
        remove.parentElement.remove();
    })
})

function showMealInfo(mealData){
    // clean up
    mealInfoEl.innerHTML='';

    // get ingrediants
    const ingredients=[];
    for(let i=1;i<=20;i++)
        if(mealData[`strIngredient`+i]){
            ingredients.push(`${mealData[`strIngredient`+i]}-${mealData[`strMeasure`+i]}`)
        }else{
            break;
        }

    // update meal info
    const mealEl = document.createElement("div")
    
    mealEl.innerHTML=`
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients</h3>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
    `
    mealInfoEl.appendChild(mealEl)

    mealPopup.classList.remove("hidden")
}

searchBtn.addEventListener("click", async ()=>{
    mealsEl.innerHTML='';
    const search =searchTerm.value;

    const meals = await getMealsBySearch(search)

    if(meals){
        meals.forEach(meal =>{
            addMeal(meal);
        })
    }
})

searchTerm.addEventListener("keyup",function(e){
    if(e.key === "Enter")
    searchBtn.click();
})

popupCloseBtn.addEventListener("click",()=>{
    mealPopup.classList.add("hidden")
})

overlay.addEventListener("click",()=>{
    mealPopup.classList.add("hidden")
})

document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){
        if(!mealPopup.classList.contains("hidden")){
            mealPopup.classList.add("hidden")
        }
    }
})
