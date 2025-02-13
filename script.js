const apiUrl = "https://restcountries.com/v3.1/all";
const weatherApiKey = "TWOJ_KLUCZ_API";  // Wpisz swój klucz API OpenWeatherMap

let wszystkieKraje = [];
let aktualnyIndex = -1;
let posortowaneKraje = [];

async function pobierzDane() {
    const response = await fetch(apiUrl);
    const dane = await response.json();
    wszystkieKraje = dane;
    posortowaneKraje = dane.map(kraj => kraj.name.common).sort();
}

function szukajKraju() {
    const wpisanaNazwa = document.getElementById("szukaj").value.toLowerCase();
    const lista = document.getElementById("lista-krajow");
    lista.innerHTML = "";

    if (wpisanaNazwa.length === 0) return;

    const pasujaceKraje = posortowaneKraje.filter(nazwa =>
        nazwa.toLowerCase().startsWith(wpisanaNazwa)
    );

    pasujaceKraje.forEach(nazwa => {
        const li = document.createElement("li");
        li.textContent = nazwa;
        li.onclick = () => pokazSzczegoly(nazwa);
        lista.appendChild(li);
    });
}

async function pokazSzczegoly(nazwaKraju) {
    const kraj = wszystkieKraje.find(k => k.name.common === nazwaKraju);
    if (!kraj) return;

    aktualnyIndex = posortowaneKraje.indexOf(nazwaKraju);

    document.getElementById("nazwa-kraju").textContent = kraj.name.common;
    document.getElementById("kontynent").textContent = kraj.continents ? kraj.continents[0] : "Brak danych";
    document.getElementById("stolica").textContent = kraj.capital ? kraj.capital[0] : "Brak danych";
    document.getElementById("powierzchnia").textContent = kraj.area.toLocaleString();
    document.getElementById("ludnosc").textContent = kraj.population.toLocaleString();
    document.getElementById("flaga").src = kraj.flags?.svg || "https://via.placeholder.com/150";

    document.getElementById("mapa").src = `https://maps.google.com/maps?q=${kraj.latlng[0]},${kraj.latlng[1]}&hl=pl&z=5&output=embed`;

    pobierzPogode(kraj.capital ? kraj.capital[0] : "");

    document.getElementById("szczegoly-kraju").style.display = "block";
}

pobierzDane();
