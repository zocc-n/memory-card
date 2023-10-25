import { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';

function App() {
  const [generation, setGeneration] = useState(1);
  const [pokemonIDs, setPokemonIDs] = useState(null);
  const [numberOfPokemon, setNumberOfPokemon] = useState(0);
  const [numberOfCards, setNumberOfCards] = useState(1);
  const [gameStatus, setGameStatus] = useState('settings');
  const [randomPokemon, setRandomPokemon] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);


  const setIdFromUrl = (generationData) => {
    const urls = generationData.pokemon_species.map(item => item.url);
    setPokemonIDs(urls.map(url => getPokemonId(url)));
    setNumberOfPokemon(urls.length);
  } 

  const getPokemonId = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  }

  useEffect(() => {
    //gets URLs and a number of all Pokemon from a selected generation
    fetch(`https://pokeapi.co/api/v2/generation/${generation}`)
      .then(res => res.json())
      .then(data => setIdFromUrl(data)); 
  }, [generation]);

  useEffect(() => {
    //removes best score when number of card is changed
    setBestScore(0);
  }, [numberOfCards])

  const getRandomNumbers = (numberOfCards) => {
    //gets a set number of different random intigers used for Pokemon IDs
    const nums = [];
    let count = 0;
    while(count < numberOfCards){
      let randNum = Math.floor(Math.random() * numberOfPokemon + 1);
      if(!nums.includes(randNum)){
        nums.push(randNum);
        count++;
      }
    }
    return nums;
  }

  const getCards = () => {
    //fetches data of random Pokemon used for cards and changes gameStatus to 'ingame'
    const randNums = getRandomNumbers(numberOfCards);
    setGameStatus('ingame');
    for(let i=0; i<randNums.length; i++){
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIDs[randNums[i]]}`)
      .then(res => res.json())
      .then(data => setRandomPokemon(prev => [...prev, {
        id: data.id,
        name: data.name,
        img: data.sprites.other['official-artwork']['front_default'],
        clicked: false,
      }]));
    }
  }

  const shuffleCards = () => {
    //modern Fisher–Yates shuffle algorithm
    const array = [...randomPokemon];
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setRandomPokemon(array);
  }

  const handleCardClick = (id) => {
    if(gameStatus === 'ingame'){
      const clickedCard = randomPokemon.filter(item => item.id == id)[0];
      
      if(clickedCard.clicked === false){
        setRandomPokemon(prev => [...prev, clickedCard.clicked = true]);
        setCurrentScore(prev => prev + 1);
        if(currentScore >= bestScore){
          setBestScore(prev => prev + 1);
        }
        if(currentScore + 1 === randomPokemon.length){
          setGameStatus('win');
        }
        shuffleCards();
      }
      else {
        setGameStatus('lose');
      }
    }
  }

  const handleReturnClick = () => {
    setGameStatus("settings");
    setRandomPokemon([]);
    setCurrentScore(0);
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


  if(gameStatus === 'settings'){
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
      <div>
        <div>
          {gameStatus==="lose" && <p className='lose'>GAME OVER</p>}
          {gameStatus==="win" && <p className='win'>CONGRATULATIONS! YOU WON!</p>}
          <p>Current score: {currentScore}</p>
          <p>Best score: {bestScore}</p>
        </div>
      </div>
        <div className='cards-container'>
          {randomPokemon.map(item => (
            <Card 
              key={item.id}
              id={item.id}
              name={item.name}
              src={item.img}
              handleClick={handleCardClick}
            />))}
        </div>
        <div className='button-container'>
          <button onClick={handleReturnClick}>
            {gameStatus ==="ingame" ? "Return" : "Try again"}  
          </button>
        </div>
      </>
    )
  }
}

export default App