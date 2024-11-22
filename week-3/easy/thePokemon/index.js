document.getElementById('fetchCards').addEventListener('click', async() => {
    const numCards = parseInt(document.getElementById('numCards').value);
    const category = document.getElementById('category').value;
    const cardContainer = document.getElementById('cardContainer');

    cardContainer.innerHTML = '';

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/type/${category}`);
        const data = await response.json();

        const pokeList = data.pokemon;
        const pokeSelect = pokeList.slice(0, numCards);

        pokeSelect.forEach(async(p) => {
            const pokeURL = await fetch(p.pokemon.url);
            const pokeData = await pokeURL.json();
            renderCard(pokeData);
        });
    }
    catch(error){
        console.log(`Error fetching Pokemon`, error);
        cardContainer.innerHTML = '<p>Error fetching Pokemon. Please try again.</p>'
    }

    function renderCard(pokemon){
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        card.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
    `;

    cardContainer.appendChild(card);
    }
})