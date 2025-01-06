import * as proj from 'ol/proj';

function ConvertGeometry(geometry,crsto,crsfrom){
    var cordenadas = []
    console.log(geometry.coordinates)
    for (var geo of geometry.coordinates){
        console.log(geo)
        var pol=[]
        for (var pol of geo){
            var punto = []
            for(var pun of pol){
                punto.push(proj.transform(pun, 'EPSG:3857', 'EPSG:4326'));
            }
            pol.push(punto)
        }
        cordenadas.push(pol)
    }
    
}

export default {ConvertGeometry}