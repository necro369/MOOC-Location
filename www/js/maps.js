var app = {
  variable: {
	  mapa: null,
	  myMarker: null,
	  myCircle: null
  },
  
  inicio: function() {
    this.iniciaFastClick();
  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },

  dispositivoListo: function(){
    navigator.geolocation.getCurrentPosition(app.pintaCoordenadasEnMapa, app.errorAlSolicitarLocalizacion);
  },

  pintaCoordenadasEnMapa: function(position){
    app.variable.mapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

	var token_mapbox = 'pk.eyJ1IjoibmVjcm8zNjkiLCJhIjoiY2l5MnVndTM2MDAzdjMzcWtld3dyaHNzeSJ9.i_GZOkxHdwYrDN0DHEWs5g';
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=' + token_mapbox, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(app.variable.mapa);

    app.pintaMarcador([position.coords.latitude, position.coords.longitude], '¡Estoy aquí!', true);

    app.variable.mapa.on('click', function(evento){
      var texto = 'Marcador en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) + ')';
      app.pintaMarcador(evento.latlng, texto, false);
    });
	
	var watchID = navigator.geolocation.watchPosition(app.updateLocation, app.errorAlSolicitarLocalizacion, {timeout: 30000});
  },

  pintaMarcador: function(latlng, texto, myLocation){
	var mapa = app.variable.mapa;
	
	if(myLocation){
		if(app.variable.myMarker != null){
			mapa.removeLayer(app.variable.myMarker);
			mapa.removeLayer(app.variable.myCircle);
		}
		app.variable.myMarker = L.marker(latlng, {icon: app.getCustomIcon()}).addTo(mapa);
		app.variable.myMarker.bindPopup(texto).openPopup();
		
		app.variable.myCircle = L.circle(latlng, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0,
			radius: 1000
		}).addTo(mapa);
	}else{
		//Default marker
		var marcador = L.marker(latlng).addTo(mapa);
		marcador.bindPopup(texto).openPopup();
	}
  },

  errorAlSolicitarLocalizacion: function(error){
    console.log(error.code + ': ' + error.message);
  },
  
  getCustomIcon: function(){
	var pushpin = L.icon({
		iconUrl: 'img/marker.png',

		iconSize:     [48, 48], // size of the icon
		iconAnchor:   [24, 48], // point of the icon which will correspond to marker's location
		popupAnchor:  [13, -45] // point from which the popup should open relative to the iconAnchor
	});
	
	return pushpin;
  },
  
  updateLocation: function(position){
	  app.pintaMarcador([position.coords.latitude, position.coords.longitude], '¡Estoy aquí!', true);
  }
};

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    app.inicio();
  }, false);
  document.addEventListener('deviceready', function() {
    app.dispositivoListo();
  }, false);
}
