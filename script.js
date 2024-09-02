const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const imageZone = document.getElementById("image-div")

const pokeName = document.getElementById("pokemon-name");
const pokeId = document.getElementById("pokemon-id");
const pokeWeight = document.getElementById("weight");
const pokeHeight = document.getElementById("height");
const pokeTypes = document.getElementById("types");

const statNames = [
  "hp",
  "attack",
  "special-attack",
  "defense",
  "special-defense",
  "speed"
]

const statEls = {};
statNames.forEach((statName)=>{
  statEls[statName] = document.getElementById(statName);
})

const pokeHp = document.getElementById("hp");
const pokeAttack = document.getElementById("attack");
const pokeSpAttack = document.getElementById("special-attack");
const pokeDefense = document.getElementById("defense");
const pokeSpDefense = document.getElementById("special-defense");
const pokeSpeed = document.getElementById("speed");

const findPokemon = async ()=> {
  const input = filterInput(searchInput.value);
  clearResults();
  const fetched = await fetchDataOf(input);
  if (!fetched || !fetched.ok) {
    alert("Pokémon not found");
    return;
  }
  let parsed;
  fetched.json().then(showResults);
}



const filterInput = (userInput)=> {
  return userInput.toLowerCase()
  //Replace all contiguous whitespace with a dash
                  .replaceAll(/\s+/g, "-")
  // Replace venus symbol with "f"
                  .replaceAll("♀", "f")
  //Replace mars symbol with "m"
                  .replaceAll("♂", "m")
  //Remove all non-valid characters left
                  .replaceAll(/[^0-9a-zA-Z-]+/g, "");
}

const fetchDataOf = async (pokemon)=> {
  let ret = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemon}`);
  return ret;
}

const clearResults = ()=> {
  for (let stat of Object.keys(statEls)) {
    statEls[stat].innerText = "";
  }
  const img = document.getElementById("sprite");
  if (img){
    img.remove()
  }

  pokeTypes.innerHTML = "";
}

const showResults = async (pokeObj)=> {
  const {id, name, height, weight, types, stats, sprites} = await pokeObj;

  imageZone.innerHTML += `<img id="sprite" src="${sprites.front_default}">`

  pokeId.innerText = id;
  pokeName.innerText = name.toUpperCase();
  pokeWeight.innerText = weight;
  pokeHeight.innerText = height;

  let foundStats = {}
  stats.forEach((entry)=>{
    foundStats[entry.stat.name] = entry["base_stat"];
  })

  for (let key of Object.keys(statEls) ) {
    console.log(`${key}: ${foundStats[key]}`)
    statEls[key].innerText = foundStats[key];
  }

  for (const entry of types) {
    let type = entry.type.name
    pokeTypes.innerHTML += `<span class="type ${type}">${type.toUpperCase()}</span>`;
  }
  
}



searchBtn.addEventListener("click", ()=>{
  findPokemon()
})