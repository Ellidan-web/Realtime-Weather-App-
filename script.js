// ELEMENTS
const API_KEY = "";

const bg = {
  Clear: "linear-gradient(135deg,#f6d365,#fda085)",
  Clouds: "linear-gradient(135deg,#bdc3c7,#2c3e50)",
  Rain: "linear-gradient(135deg,#667db6,#0082c8)",
  Snow: "linear-gradient(135deg,#e6dada,#274046)"
};

// AUTO GEOLOCATION
window.onload = () => {
  loadCache();
  navigator.geolocation?.getCurrentPosition(pos => {
    fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
  });
};

function getWeather() {
  fetchWeather(`q=${cityInput.value}`);
}

async function fetchWeather(query) {
  error.style.display="none";
  loading.style.display="block";
  card.style.display="none";

  try {
    const w = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`).then(r=>r.json());
    const f = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&units=metric&appid=${API_KEY}`).then(r=>r.json());
    updateUI(w,f);
    cache(w,f);
  } catch {
    error.style.display="block";
  }
  loading.style.display="none";
}

function updateUI(w,f) {
  card.style.display="block";
  city.textContent = `${w.name}, ${w.sys.country}`;
  desc.textContent = w.weather[0].description;
  temp.textContent = Math.round(w.main.temp)+"°";
  feels.textContent = Math.round(w.main.feels_like)+"°";
  humidity.textContent = w.main.humidity+"%";
  wind.textContent = w.wind.speed+" m/s";
  icon.src = `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`;

  document.body.style.background = bg[w.weather[0].main] || bg.Clear;
  animateFX(w.weather[0].main);

  forecast.innerHTML="";
  const days = {};
  f.list.forEach(i=>{
    const d=i.dt_txt.split(" ")[0];
    if(!days[d]) days[d]=i;
  });

  Object.values(days).slice(0,5).forEach(d=>{
    forecast.innerHTML+=`
      <div class="day">
        <div>${new Date(d.dt_txt).toLocaleDateString(undefined,{weekday:"short"})}</div>
        <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
        <div>${Math.round(d.main.temp)}°</div>
      </div>`;
  });

  drawChart(f.list.slice(0,8));
}

// HOURLY CHART
let chart;
function drawChart(list) {
  const ctx=document.getElementById("hourlyChart");
  if(chart) chart.destroy();
  chart=new Chart(ctx,{
    type:'line',
    data:{
      labels:list.map(i=>i.dt_txt.split(" ")[1]),
      datasets:[{
        data:list.map(i=>i.main.temp),
        borderColor:'white',
        tension:0.4
      }]
    },
    options:{
      plugins:{legend:{display:false}},
      scales:{x:{ticks:{color:'white'}},y:{ticks:{color:'white'}}}
    }
  });
}

// CACHE
function cache(w,f){
  localStorage.setItem("weather",JSON.stringify({w,f,time:Date.now()}));
}
function loadCache(){
  const c=JSON.parse(localStorage.getItem("weather"));
  if(c && Date.now()-c.time<600000) updateUI(c.w,c.f);
}

// WEATHER FX
const canvas=document.getElementById("fx");
const ctx=canvas.getContext("2d");
canvas.width=innerWidth;
canvas.height=innerHeight;
let particles=[];

function animateFX(type){
  particles=[];
  if(type==="Rain"){
    for(let i=0;i<200;i++)particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,s:4});
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(type==="Rain"){
      ctx.fillStyle="rgba(255,255,255,0.5)";
      particles.forEach(p=>{
        ctx.fillRect(p.x,p.y,2,10);
        p.y+=p.s;
        if(p.y>canvas.height)p.y=0;
      });
    }
    requestAnimationFrame(draw);
  }
  draw();
}

const suggestionsBox = document.getElementById("suggestions");
let debounceTimer;

// Fetch city suggestions
cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    suggestionsBox.style.display = "none";
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchSuggestions(query);
  }, 300);
});

async function fetchSuggestions(query) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    const cities = await res.json();
    showSuggestions(cities);
  } catch {
    suggestionsBox.style.display = "none";
  }
}

function showSuggestions(cities) {
  suggestionsBox.innerHTML = "";

  if (!cities.length) {
    suggestionsBox.style.display = "none";
    return;
  }

  cities.forEach(city => {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.textContent = `${city.name}, ${city.country}`;
    div.onclick = () => {
      cityInput.value = city.name;
      suggestionsBox.style.display = "none";
      fetchWeather(`lat=${city.lat}&lon=${city.lon}`);
    };
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
}
