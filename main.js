const input = document.querySelector('input');
const botao = document.querySelector('button');
const span = document.querySelector('.map-header>span')

const ip = document.querySelector('[data-descricao="ip"');
const localizacao = document.querySelector('[data-descricao="localizacao"');
const timezone = document.querySelector('[data-descricao="timezone"');
const isp = document.querySelector('[data-descricao="isp"');

const iconePersonalizado = L.icon({
  iconUrl: './images/icon-location.svg',

  iconSize:     [60, 95], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
})

window.addEventListener('load', () => {
  fetch('https://api.ipify.org?format=json')
  .then(data => data.json())
  .then(data => {
    procuraIp(data.ip);
  })

  input.value = ''
})

window.addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    procuraIp(input.value)
  }
})

botao.addEventListener('click', () => procuraIp(input.value))

function procuraIp(enderecoIp) {
  if (!enderecoIp.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    span.classList.add('ativo');
    setTimeout(() => {
      span.classList.remove('ativo');
    }, 3000)
  } else {  
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_tAKzi4gu8dpp5LokCrRAQHXuOeE18&ipAddress=${enderecoIp}`)
    .then(data => data.json())
    .then(newData => {
        const novoMapa = document.createElement('div');
        novoMapa.id = 'map'

        const wrapper = document.querySelector('.wrapper-map');
        
        document.getElementById('map').remove()
        wrapper.appendChild(novoMapa)

        const { ip: ipRecebido, location: localizacaoRecebido, isp: ispRecebido, location: { lat, lng } } = newData;
        
        ip.value = ipRecebido;
        localizacao.value = `${localizacaoRecebido.city}${localizacaoRecebido.postalCode !== '' ? `, ${localizacaoRecebido.postalCode}` : ''}`;
        timezone.value = localizacaoRecebido.timezone;
        isp.value = ispRecebido;
        
        console.log(lat, lng);

        var map = L.map('map').setView([lat + 0.002, lng], 19);

        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 16,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        L.marker([lat, lng], {icon: iconePersonalizado}).addTo(map);
        input.value = ''
      })
  }
}