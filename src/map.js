// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [-0.22, -78.51],
    zoom: 11,
    minZoom: 11,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [-0.22, -78.51];
    map.setView(cucu, 11);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Parroquia ' + props.PARROQUIA + '<br />' + 
        'Proyección población 2020' + props.Pob2020_Pr.toFixed(0)  + '<br />' +  '<br />' + 

        '<b>Marcador Inclusión Urbana '  + props.INDICE_MAR.toFixed(0)  + ' %' + '</b>'+ '<br />' + '<br />' + 

        '<b>Vivienda asequible, de calidad y con servicios '  + props.VIV.toFixed(0)  + ' %' + '</b>'+ '<br />' +
        'Calidad estructural y cualitativa de la vivienda: ' + props.V_CAL.toFixed(0) + ' %' + '<br />' +
        'Acceso a servicios básicos e internet: ' + props.V_SER.toFixed(0) + ' %' + '<br />' +
        'Asequibilidad: </b> ' + props.V_ASE.toFixed(0)  + ' %' +  '<br />' +  '<br />' +  

        '<b>Salud y bienestar ' + props.SAL.toFixed(0)  + ' %'  + '</b>'+ '<br />' +
        'Proximidad a centros de salud: ' + props.S_PRO.toFixed(0) + ' %' + '<br />' +
        'Exposición factores ambientales: ' + props.S_AMB.toFixed(0) + ' %' + '<br />' +
        'Esperanza de vida (considerando brecha de género): '  + props.S_BIE.toFixed(0)  + ' %' +  '<br />' +  '<br />' +  

        '<b>Educación, cultura y diversidad ' + props.EDU.toFixed(0)  + ' %'  + '</b>'+  '<br />' +
        'Proximidad centros educativos: ' + props.E_PRO.toFixed(0) + ' %' + '<br />' +
        'Diversidad socioeconómica: ' + props.E_DIV.toFixed(0) + ' %' + '<br />' +
        'Nivel educativo (considerando brecha de género): '  + props.E_BIE.toFixed(0)  + ' %' +  '<br />' +  '<br />' +  
        
        '<b>Espacio público y seguridad ' + props.EPUB.toFixed(0)  + ' %'  + '</b>'+ '<br />' +
        'Proximidad a espacios públicos: ' + props.EP_PRO.toFixed(0) + ' %' + '<br />' +
        'Vitalidad ambiente urbano: ' + props.EP_VIT.toFixed(0) + ' %' + '<br />' +
        'Seguridad y protección: '  + props.EP_SEG.toFixed(0)  + ' %' +  '<br />' +  '<br />' +  

        '<b>Oportunidades económicas ' + props.OPO.toFixed(0)  + ' %'  + '</b>'+  '<br />' +
        'Proximidad a comercio y servicios: ' + props.O_PRO.toFixed(0) + ' %' + '<br />' +
        'Acceso a oportunidades para el bienestar: '  + props.O_BIE.toFixed(0) + ' %'   : 'Seleccione una manzana');
};
info.addTo(map);

function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(localidad, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p style="font-size: 10px">${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    INDICE_MAR: {
        title: "Marcador potencial integración urbana",
        subtitle: "%", 
        elem1: '<div><span  style= "color:#FCF9BB">▉</span>74 - 78</div>',
        elem2: '<div><span  style= "color:#FE9D6C">▉</span>71 - 73</div>', 
        elem3: '<div><span  style= "color:#CA3E72">▉</span>69 - 70</div>',
        elem4: '<div><span  style= "color:#862781">▉</span>67 - 68</div>',
        elem5: '<div><span  style= "color:#2A115C">▉</span>58 - 66</div>',
        elem6: '',
        elem7: '',
        elem8: "ONU-Habitat 2020 - Elaboración propia",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.INDICE_MAR,
}).addTo(map);

var currentStyle = 'INDICE_MAR';

manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'P_MAT_ADE') {
        return d > 85 ? '#1a9641' :
            d > 65 ? '#a6d96a' :
                d > 35 ? '#f4f466' :
                    d > 15 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'INDICE_MAR') {
        return d > 72 ? '#FCF9BB' :
            d > 70 ? '#FE9D6C' :
                d > 67 ? '#CA3E72' :
                    d > 64 ? '#862781' :
                        '#2A115C';
    }
    else {
        return d > 4 ? '#d7191c' :
            d > 3 ? '#fdae61' :
                d > 2 ? '#f4f466' :
                    d > 1 ? '#a6d96a' :
                        '#1a9641';
    }

}

function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};
// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'INDICE_MAR'});

function popupText(feature, layer) {
    layer.bindPopup('Parroquia ' + feature.properties.PARROQUIA  + '<br />')
}
