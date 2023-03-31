const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
let i = 0;


// Obtener la ciudad guardada del almacenamiento local
const storedCity = localStorage.getItem('city');
if (storedCity) {
  document.querySelector('.search-box input').value = storedCity;
  search.click(); // Ejecutar la búsqueda automáticamente si se encuentra una ciudad guardada
}

document.addEventListener('DOMContentLoaded', () => {
  const city = localStorage.getItem('city');
  if (city) {
    const searchInput = document.querySelector('.search-box input');
    searchInput.value = city;
    searchInput.dispatchEvent(new Event('input'));
    search.click(); // Ejecutar la búsqueda automáticamente si se encuentra una ciudad guardada
  }
});

  // Obtiene un número aleatorio entre 1 y 5
  const randomNum = Math.floor(Math.random() * 5) + 1;

  // Selecciona la imagen correspondiente
  const imageSrc = `images/totoro${randomNum}.gif`;
  
  // Asigna la imagen al elemento HTML correspondiente
  const imgElement = document.querySelector('.img-ia');
  imgElement.src = imageSrc;
  

search.addEventListener('click', () => {
  const city = document.querySelector('.search-box input').value;
  const APIKey = 'YOUR_API_KEY_OPENWEATHER';

  if (city === '') {
    return;
  }

  // Guardar la ciudad ingresada por el usuario en el almacenamiento local
  localStorage.setItem('city', city);
  //console.log(fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`).then(response => response.json()))
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
      if (json.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        return;
      }

      error404.style.display = 'none';
      error404.classList.remove('fadeIn');

      const image = document.querySelector('.weather-box img');
      const temperature = document.querySelector('.weather-box .temperature');
      const description = document.querySelector('.weather-box .description');
      const humidity = document.querySelector('.weather-details .humidity span');
      const wind = document.querySelector('.weather-details .wind span');

      switch (json.weather[0].main) {
        case 'Clear':
          image.src = 'images/clear.png';
          break;

        case 'Rain':
          image.src = 'images/rain.png';
          break;

        case 'Snow':
          image.src = 'images/snow.png';
          break;

        case 'Clouds':
          image.src = 'images/cloud.png';
          break;

        case 'Haze':
          image.src = 'images/mist.png';
          break;

        default:
          image.src = '';
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      weatherBox.style.display = '';
      weatherDetails.style.display = '';
      weatherBox.classList.add('fadeIn');
      weatherDetails.classList.add('fadeIn');
      container.style.height = '480px';

    // Llamada a la API de OpenAI
    const prompt = `Actua como un profesional muy amigable en climatologia. A las ${hours}:${minutes} en ${json.name}, la temperatura es ${parseInt(json.main.temp)}°C con humedad de ${json.main.humidity}. Has la recomendacion al usuario usando emojis para hacer mas amigable la conversacion.`;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${'YOUR_API_KEY_OPENAI'}`
    };
    const body = {
        'model': "text-davinci-003",
        'prompt': prompt,
        'temperature': 0.7,
        'max_tokens': 250,
        'top_p': 1,
        'frequency_penalty': 0,
        'presence_penalty': 0
    };
    
    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(response => {
        const result = response.choices[0].text.trim();
        console.log(result);

    // Mostrar el resultado en el HTML

    typeWriter(result, i);
    recommendation.style.display = 'block';
    })
    .catch(error => {
    console.error('Error:', error);
    });


    const inputIa = document.querySelector('.input-text-ia');
    inputIa.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        const userInput = inputIa.value;
        console.log(userInput)
        fetchOpenAI(userInput);
        inputIa.value = '';
      }
    });
  

    
});
});

function fetchOpenAI(userInput) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${'YOUR_API_KEY_OPENAI'}`
  };
  const recommendationText = document.querySelector('#recommendation').innerHTML
  const temperature = document.querySelector('.weather-box .temperature');
  const description = document.querySelector('.weather-box .description');
  const humidity = document.querySelector('.weather-details .humidity span');
  const wind = document.querySelector('.weather-details .wind span');
  console.log(recommendationText)
  document.querySelector('.recommendation').innerHTML = '';
  const prompt = `$Contexto: Actua como un profesional muy amigable en climatologia. ${temperature}, ${humidity}.  ${recommendationText}. Has la recomendacion al usuario usando emojis para hacer mas amigable la conversacion. Usuario: ${userInput}`;
  const body = {
    'model': "text-davinci-003",
    'prompt': prompt,
    'temperature': 0.5,
    'max_tokens': 150,
    'top_p': 1,
    'frequency_penalty': 0,
    'presence_penalty': 0
  };
  fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(response => {
    const result = response.choices[0].text.trim();
  typeWriter(result, i);
  recommendation.style.display = 'block';
  })
  .catch(error => {
  console.error('Error:', error);
  });

}

function typeWriter(text, i) {
    if (i < text.length) {
      document.querySelector('.recommendation').innerHTML += text.charAt(i);
      i++;
      setTimeout(function() {
        typeWriter(text, i);
      }, 50); // Retraso de 50ms entre cada letra
    }
  }


