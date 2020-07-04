SELECT JSON_EXTRACT(j, '$[0][0]') as z, JSON_EXTRACT(j, '$[0][1]') as c,
POINT(JSON_EXTRACT(j, '$[0][0]'), JSON_EXTRACT(j, '$[0][1]') ) as p1,
POINT(JSON_EXTRACT(j, '$[1][0]'), JSON_EXTRACT(j, '$[1][1]') ) as p1,

ST_Distance_Sphere (
POINT(JSON_EXTRACT(j, '$[0][0]'), JSON_EXTRACT(j, '$[0][1]') ),
POINT(JSON_EXTRACT(j, '$[1][0]'), JSON_EXTRACT(j, '$[1][1]') )) as d
from geofences