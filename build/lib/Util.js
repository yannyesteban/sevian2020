export const createGeoJSONRectangle = function (p1, p2 = null) {
    //let line = turf.lineString([p1, p2]);
    //let bbox = turf.bbox(line);
    //let bboxPolygon = turf.bboxPolygon(bbox);
    let ret;
    if (p2) {
        ret = [[
                [p1[0], p1[1]],
                [p2[0], p1[1]],
                [p2[0], p2[1]],
                [p1[0], p2[1]],
                [p1[0], p1[1]]
            ]];
    }
    else {
        ret = [[p1]];
    }
    //let ret = bboxPolygon.geometry.coordinates;
    //ret.push(ret[0]);
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": ret
                    }
                }]
        }
    };
    ret[0].forEach((item, index) => {
        if (index >= 4) {
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    // 
    p1 = null, p2 = null;
    let midpoint = null;
    ret[0].forEach((item, index) => {
        if (index > 0) {
            p2 = turf.point(item);
            midpoint = turf.midpoint(p1, p2);
            p1 = p2;
        }
        else {
            p1 = turf.point(item);
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": midpoint.geometry.coordinates
            },
            "properties": {
                "index": 3 + index,
                "type": "m",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
export const createGeoJSONPoly = function (coords, ini) {
    let c = [];
    let ret = coords.slice();
    ret.push(ret[0]);
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
        }
    };
    coords.forEach((item, index) => {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    let p1 = null, p2 = null, midpoint = null;
    ret.forEach((item, index) => {
        if (index > 0) {
            p2 = turf.point(item);
            midpoint = turf.midpoint(p1, p2);
            p1 = p2;
        }
        else {
            p1 = turf.point(item);
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": midpoint.geometry.coordinates
            },
            "properties": {
                "index": index,
                "type": "m",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
export const createGeoJSONLine = function (coords, ini) {
    let ret = coords;
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": ret
                    }
                }]
        }
    };
    coords.forEach((item, index) => {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    let p1 = null, p2 = null, midpoint = null;
    ret.forEach((item, index) => {
        if (index > 0) {
            p2 = turf.point(item);
            midpoint = turf.midpoint(p1, p2);
            p1 = p2;
        }
        else {
            p1 = turf.point(item);
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": midpoint.geometry.coordinates
            },
            "properties": {
                "index": index,
                "type": "m",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
export const createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points)
        points = 64;
    var coords = {
        latitude: center[1],
        longitude: center[0]
    };
    var km = radiusInKm;
    var ret = [];
    let hands = [];
    var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    var distanceY = km / 110.574;
    var theta, x, y;
    for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);
        ret.push([coords.longitude + x, coords.latitude + y]);
        if (i % (~~(points / 4)) == 0) {
            hands.push([coords.longitude + x, coords.latitude + y]);
        }
    }
    ret.push(ret[0]);
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
        }
    };
    let point = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": center
        },
        "properties": {
            "index": -1,
            "type": "c",
        }
    };
    json.data.features.push(point);
    hands.forEach((item, index) => {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
//# sourceMappingURL=Util.js.map