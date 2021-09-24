insert
IGNORE
into tracking
(
unit_id,
device_id,
date_time,
longitude,
latitude,
speed,
heading,
altitude,
satellite,
event_id,
input_status,
mileage,
voltage_level_i1,
voltage_level_i2,
output_status,
time)



SELECT


u.id as unit_id, t.id_equipo, DATE_ADD(t.fecha_hora, interval 4 hour) as fecha_hora, t.longitud, t.latitud, t.velocidad, t.heading, t.altitud, t.satelites, t.event_id, t.input,
t.millas, t.analog_input_1, t.analog_input_2,

t.output,  t.fh_server


FROM cota.tracks_2020 t
left JOIN device as d ON d.id2 = t.codequipo
left JOIN unit2 as u ON u.device_id = d.id
where t.id>329133949-10000000

#order by t.id
limit 2500000, 500000


;


insert
#IGNORE
into tracking
(
unit_id,
device_id,
date_time,
longitude,
latitude,
speed,
heading,
altitude,
satellite,
event_id,
input_status,
mileage,
voltage_level_i1,
voltage_level_i2,
output_status,
time)



SELECT


u.id as unit_id, t.id_equipo, DATE_ADD(t.fecha_hora, interval 4 hour) as fecha_hora, t.longitud, t.latitud, t.velocidad, t.heading, t.altitud, t.satelites, t.event_id, t.input,
t.millas, t.analog_input_1, t.analog_input_2,

t.output,  t.fh_server


FROM cota.tracks_2020 t
left JOIN device as d ON d.id2 = t.codequipo
left JOIN unit2 as u ON u.device_id = d.id
where t.id>329133949-10000000

#order by t.id
limit 0, 50;










insert IGNORE  into tracking
(
unit_id,
device_id,
date_time,
longitude,
latitude,
speed,
heading,
altitude,
satellite,
event_id,
input_status,
mileage,
voltage_level_i1,
voltage_level_i2,
output_status,
time)



SELECT


u.id as unit_id, t.id_equipo, t.fecha_hora, t.longitud, t.latitud, t.velocidad, t.heading, t.altitud, t.satelites, t.event_id, t.input,
t.millas, t.analog_input_1, t.analog_input_2,

t.output,  t.fh_server


FROM cota.tracks_2020 t
INNER JOIN device as d ON d.id2 = t.codequipo
INNER JOIN unit2 as u ON u.device_id = d.id
where t.fh_server >= 'fh_server' limit 0, 500000