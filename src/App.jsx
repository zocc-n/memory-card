import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [generation, setGeneration] = useState(1);
  const [pokemonURLs, setPokemonURLs] = useState([]);
  const [numberOfPokemon, setNumberOfPokemon] = useState(0);
  const [numberOfCards, setNumberOfCards] = useState(1);
  const [randomNums, setRandomNums] = useState([]);
  const [inGame, setInGame] = useState(false);
  const [randomPokemon, setRandomPokemon] = useState([]);

  let urls;
  const setUrls = (info) => {
    urls = info.pokemon_species.map(item => item.url);
    // console.log("urls from setUrls: ", urls)
    setPokemonURLs(urls);
    setNumberOfPokemon(urls.length);
  } 

  useEffect(() => {
    //gets URLs and a number of all Pokemon from a selected generation
    console.log("useEffecte FETCH done - URLs saved to pokemonURLs")
    fetch(`https://pokeapi.co/api/v2/generation/${generation}`)
      .then(res => res.json())
      .then(data => setUrls(data)); 
  }, [generation]);

  const getRandomNumbers = (numberOfCards) => {
    //gets a set number of different random intigers used for Pokemon IDs
    const nums = [];
    let count = 0;
    // console.log('numberOfCards from getRandomNumbers is', numberOfCards)
    while(count < numberOfCards){
      let randNum = Math.floor(Math.random() * numberOfPokemon + 1);
      if(!nums.includes(randNum)){
        nums.push(randNum);
        count++;
      }
    }
    // console.log('Returned nums: ', nums)
    return nums;
  }

  const handleGenerationChange = (e) => {
    if(e.target.value < 10 && e.target.value > 0){
      setGeneration(e.target.value);
    }
    else {
      alert('Value must be between 1 and 10');
    }
  }

  const handleNumberOfCards = (e) => {
    if(e.target.value < 1 || e.target.value > numberOfPokemon){
      alert(`Value must be between 1 and ${numberOfPokemon}`);
    }
    else {
      setNumberOfCards(e.target.value);
    }
  }

  const getCards = () => {
    //fetches data of random Pokemon used for cards and changes inGame status to true
    const randNums = getRandomNumbers(numberOfCards);
    setRandomNums(randNums);
    setInGame(true);
    // console.log('randNums from getCards: ', randNums)
    // console.log('randomNums from getCards: ', randomNums)

    for(let i=0; i<randNums.length; i++){
      fetch(`https://pokeapi.co/api/v2/pokemon/${randNums[i]}`)
      .then(res => res.json())
      .then(data => setRandomPokemon(prev => [...prev, {
        id: data.id,
        name: data.name,
        img: data.sprites.other['official-artwork']['front_default'],
      }]))
    }
    // console.log('randomPokemon from getCards', randomPokemon);
  }


  // console.log('randomPokemon from root', randomPokemon);


  if(!inGame){
    return (
      <>
        <div>
          <span>Generation: </span>
          <input 
            type="number"
            value={generation}
            onChange={handleGenerationChange}
          />
        </div>
        <div>
          <span>Number of cards: </span>
          <input 
            type="number"
            value={numberOfCards}
            onChange={handleNumberOfCards}
          />
        </div>
  
        <button onClick={getCards}>Get cards</button>
      </>
    )
  }
  else{
    return(
      <>
      <span>To be added...</span>
      </>
    )
  }
}

export default App