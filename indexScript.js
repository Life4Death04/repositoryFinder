const selectLanguageInput = document.getElementById('selectLanguage');
const stateDisplay = document.getElementById('state');
const button = document.getElementById('button');

function handleState(state){
    switch (state){
        case state = 'empty': stateDisplay.textContent = 'Please, select a language'; break;

        case state = 'loading': stateDisplay.textContent = 'Fetching data, wait a second...'; break;

        case state = 'error': 
            stateDisplay.textContent = `We couldn't fetch the data, sorry :c`;
            stateDisplay.style.backgroundColor = 'rgb(255,200,200)';
            break;
        
        default: stateDisplay.textContent = '';
    }
}

async function fetchDataRepository(){
    handleState('loading'); 
    try{
        const language = selectLanguageInput.value;
        const response = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`);
        const data = await response.json();

        const randomIndex = Math.floor(Math.random() * data.items.length);
        const randomRepository = data.items[randomIndex];
        const repAuthorDisplay = document.createElement('h4');
        const repDescriptionDisplay = document.createElement('p');
        const repAuthorData = randomRepository.name;
        const repDescriptionData = randomRepository.description;
        stateDisplay.textContent = '';
        repAuthorDisplay.textContent = repAuthorData;
        repDescriptionDisplay.textContent = repDescriptionData;
        stateDisplay.appendChild(repAuthorDisplay);
        stateDisplay.appendChild(repDescriptionDisplay);

        stateDisplay.style.backgroundColor = 'rgb(228,225,225)';
        button.style.display = 'inline';
        button.style.backgroundColor = 'rgb(0,0,0)';
        button.textContent = 'Refresh';
        button.addEventListener('click', fetchDataRepository);

        if(!response.ok){
            throw new error('Something went wrong');
        }
    }catch(error){
        console.error(error)
        handleState('error');
        button.style.display = 'inline';
        button.style.backgroundColor = 'rgb(255,0,0)'
        button.textContent = 'Click to retry'
        button.addEventListener('click', fetchDataRepository);
    }
}

async function fetchDataListOptions(){
    try{
        const response = await fetch(`https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json`);
        const data = await response.json();
        for(let i=0; i<data.length; i++){
            const option = document.createElement('option');
            option.textContent = data[i].title;
            option.value = data[i].title;
            selectLanguageInput.appendChild(option);
        }   


        if(!response.ok){
            throw new error(`We couldn't fetch the data, sorry :c`);
        }
    }catch(error){
        console.error(error);
    }
}

handleState('empty');
fetchDataListOptions();

selectLanguageInput.addEventListener('change', fetchDataRepository);