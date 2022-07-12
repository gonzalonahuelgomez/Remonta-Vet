//Attribution IGN
const ignAttr = '<a href="http://www.ign.gob.ar" target="_blank">Instituto Geográfico Nacional</a>'

//Url Tilelayers
const satelital = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { maxzoom: 16, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
    argenmapOscuro = L.tileLayer("https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/argenmap_oscuro@EPSG%3A3857@png/{z}/{x}/{-y}.png", { maxzoom: 16, attribution: ignAttr }),
    baseGrises = L.tileLayer("https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png", { maxzoom: 16, attribution: ignAttr }),
    baseClasico = L.tileLayer("https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png", { maxzoom: 16, attribution: ignAttr })

const urlRemonta = "https://remonta.ign.gob.ar/geoserver/sgmremvet/ows?service=WFS&version=1.0.0",
      urlAguasCont = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_aguas_continentales&outputFormat=application%2Fjson",
      urlAsentEdif = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_asentamientos_y_edificios&outputFormat=application%2Fjson",
      urlEquip = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_equipamiento&outputFormat=application%2Fjson",
      urlFabricProc = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_fabricacion_y_procesamiento&outputFormat=application%2Fjson",
      urlGeoformologia = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_geomorfologia&outputFormat=application%2Fjson",
      urlTranspAereo = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_transporte_aereo&outputFormat=application%2Fjson",
      urlZonaCostera = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_de_zona_costera&outputFormat=application%2Fjson",
      urlRestrLim = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAreas_restringidas_y_limites&outputFormat=application%2Fjson",
      urlEdificios = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AAsent_edif&outputFormat=application%2Fjson",
      urlControles = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AControles&outputFormat=application%2Fjson",
      urlCultivos = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3ACultivos&outputFormat=application%2Fjson",
      urlCultReligion = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3ACultura_y_religion&outputFormat=application%2Fjson",
      urlDepartamento = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3ADepartamento&outputFormat=application%2Fjson",
      urlEdafologia = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AEdafologia&outputFormat=application%2Fjson",
      urlEstOpDef = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AEstructuras_operativas_y_defensivas&outputFormat=application%2Fjson",
      urlInstMil = urlRemonta + "&request=GetFeature&typeName=sgmremvet%3AInstalacion_Militar&outputFormat=application%2Fjson"

//Setear Zoom dependiendo el width del browser
const setInitialZoom = (clientWidth) => {
    let mapZoom

    return clientWidth < 576 ? mapZoom = 7 :
           clientWidth < 992 ? mapZoom = 8 :
                               mapZoom = 6

}

//ClientWidth
const browserWidth = window.innerWidth || document.documentElement.clientWidth

//Resize del mapa
window.addEventListener('resize', function(){
    let width = window.innerWidth || document.documentElement.clientWidth

    width < 576 ? map.setZoom(7) :
    width < 992 ? map.setZoom(8) :
                  map.setZoom(7)
});

//Crear mapa
const map = L.map('mapa', {
    layers: [baseClasico],
    zoomControl: false,
    zoomSnap: 0,
    zoomDelta: 0.5
}).setView([-33.65120829920498, -64.05029296875001], setInitialZoom(browserWidth))

//Cambiar attribution de leaflet
map.attributionControl.setPrefix('<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>')

//Zoom Home
const zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);

//Icons    
const setIcon = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
    }
});

// const lutoIcon = new setIcon({
//     iconUrl: './img/banderaLuto.jpg',
//     iconSize: new L.Point(40, 30)
// })

//Styles para definir las capas en el mapa
// const styles = (color, weight, dashArray = null) => {
//     return {
//         color,
//         weight,
//         dashArray,
//         fillOpacity: 0
//     }
// }

//Decoder
function decode_utf8(word) {
    return decodeURIComponent(escape(word));
}

//Get Colors
const CAMINOCOLOR = {
    'Camino Pavimentado': ['rgba(227,26,28,255)', 2],
    'Camino consolidado': ['rgba(82,80,212,255)', 1.6],
    'camino de tierra': ['rgba(0,0,0,255)', 1],
    'Calle': ['rgba(0,0,0,255)', 1.6],
    'Huella': ['rgba(35,35,35,255)', 0.5, '2 2'],
    'Senda Rural': ['rgba(0,0,0,255)', 1, '1 5'],
}

//Markers && Layers
const urlWMS = "https://remonta.ign.gob.ar/geoserver/sgmremvet/wms?service=WMS&"

const aguasCont = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_aguas_continentales",
    format: 'image/png',
    transparent: true,
})

const asentEdif = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_asentamientos_y_edificios",
    format: 'image/png',
    transparent: true
})

const equip = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_equipamiento",
    format: 'image/png',
    transparent: true
})

const fabricProc = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_fabricacion_y_procesamiento",
    format: 'image/png',
    transparent: true
})

const geomorfologia = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_geomorfologia",
    format: 'image/png',
    transparent: true
})

const transpAereo = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_transporte_aereo",
    format: 'image/png',
    transparent: true
})

const zonaCostera = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_de_zona_costera",
    format: 'image/png',
    transparent: true
})

const restrLim = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Areas_restringidas_y_limites",
    format: 'image/png',
    transparent: true
})

const edificios = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Asent_edif",
    format: 'image/png',
    transparent: true
})

const controles = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Controles",
    format: 'image/png',
    transparent: true
})

const cultivos = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Cultivos, sgmremvet:Sin_vegetacion, sgmremvet:Vegetacion_herbacea, sgmremvet:Vegetacion_arborea, sgmremvet:Vegetacion_arbustiva",
    format: 'image/png',
    transparent: true
})

const cultReligion = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Cultura_y_religion",
    format: 'image/png',
    transparent: true
})

const departamento = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Departamento",
    format: 'image/png',
    transparent: true
})

const edafologia = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Edafologia",
    format: 'image/png',
    transparent: true
})

const estOpDef = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Estructuras_operativas_y_defensivas",
    format: 'image/png',
    transparent: true
})

const instMil = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Instalacion_Militar",
    format: 'image/png',
    transparent: true
})

const camposRem = L.tileLayer.betterWms(urlWMS, {
    layers: "sgmremvet:Campos de Remonta",
    format: 'image/png',
    transparent: true
}).addTo(map)

// const potreros = L.tileLayer.wms(urlWMS, {
//     layers: "sgmremvet:Potreros RemVet",
//     format: 'image/png',
//     transparent: true
// })

// fetch(urlAguasCont)
//     .then((response) => response.json())
//     .then((data) => {
//         aguasCont.addData(data)
//     })

// fetch(urlAsentEdif)
//     .then((response) => response.json())
//     .then((data) => {
//         asentEdif.addData(data)
//     })
    
// fetch(urlEquip)
//     .then((response) => response.json())
//     .then((data) => {
//         equip.addData(data)
//     })

// fetch(urlFabricProc)
//     .then((response) => response.json())
//     .then((data) => {
//         fabricProc.addData(data)
//     })

// fetch(urlGeoformologia)
//     .then((response) => response.json())
//     .then((data) => {
//         geomorfologia.addData(data)
//     })
    
// fetch(urlTranspAereo)
//     .then((response) => response.json())
//     .then((data) => {
//         transpAereo.addData(data)
//     })

// fetch(urlZonaCostera)
//     .then((response) => response.json())
//     .then((data) => {
//         zonaCostera.addData(data)
//     })

// fetch(urlRestrLim)
//     .then((response) => response.json())
//     .then((data) => {
//         restrLim.addData(data)
//     })
    
// fetch(urlEdificios)
//     .then((response) => response.json())
//     .then((data) => {
//         edificios.addData(data)
//     })

// fetch(urlControles)
//     .then((response) => response.json())
//     .then((data) => {
//         controles.addData(data)
//     })

// // fetch(urlCultivos)
// //     .then((response) => response.json())
// //     .then((data) => {
// //         cultivos.addData(data)
// //     })
    
// fetch(urlCultReligion)
//     .then((response) => response.json())
//     .then((data) => {
//         cultReligion.addData(data)
//     })

// fetch(urlDepartamento)
//     .then((response) => response.json())
//     .then((data) => {
//         departamento.addData(data)
//     })

// fetch(urlEdafologia)
//     .then((response) => response.json())
//     .then((data) => {
//         edafologia.addData(data)
//     })
    
// fetch(urlEstOpDef)
//     .then((response) => response.json())
//     .then((data) => {
//         estOpDef.addData(data)
//     })

// fetch(urlInstMil)
//     .then((response) => response.json())
//     .then((data) => {
//         instMil.addData(data)
//     })

//Layer Control
const baselayer = {
    'Mapa Clásico': baseClasico,
    'Mapa Gris': baseGrises,
    'Mapa Oscuro': argenmapOscuro,
    'Mapa Satelital': satelital
}

const overlays = {    
    'Establecimientos de Remonta y Veterinaria': camposRem,
    'Aguas Continentales': aguasCont,
    'Áreas de Asentamientos y Edificios': asentEdif,
    'Equipamiento': equip,
    'Fabricación y Procesamiento': fabricProc,
    'Geomorfología': geomorfologia,
    'Transporte Aéreo': transpAereo,
    'Zona Costera': zonaCostera,
    'Áreas Restringidas y Límites': restrLim,
    'Edificios': edificios,
    'Controles': controles,
    'Vegetacion Campo Grl Ávalos': cultivos,
    'Cultura y Religión': cultReligion,
    'Departamentos': departamento,
    'Edafología': edafologia,
    'Estructuras Operativas y Defensivas': estOpDef,
    'Instalaciones Militares': instMil,
    // 'Potreros Remonta y Veterinaria': potreros
};

const setCollapsed = (clientWidth) => {
    let collapsed

    return clientWidth < 576 ? collapsed = true :
                               collapsed = false                              

}

const layerControl = L.control.layers(baselayer, overlays, { collapsed: setCollapsed(browserWidth) }).addTo(map);

map.on('click', (e) => console.log(e) )