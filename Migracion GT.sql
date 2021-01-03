


TRUNCATE gt.input;


INSERT INTO gt.input (id2, name, type)

SELECT
i.codtipo, ucase(i.tipo_input) as name, i.clasificacion
FROM cota.tipos_inputs i
LEFT JOIN gt.input as i2 ON i2.id2 = i.codtipo
WHERE i2.id2 IS NULL
ORDER BY 2;

UPDATE gt.input as i2
INNER JOIN cota.inputs as i ON i.codtipo = i2.id2
SET i2.value_on = ucase(input)
WHERE i.codinput % 2 !=0;

UPDATE gt.input as i2
INNER JOIN cota.inputs as i ON i.codtipo = i2.id2
SET i2.value_off = ucase(input)
WHERE i.codinput % 2 =0;

UPDATE gt.input as i2
SET i2.clasificacion = type;


/*unit input*/

INSERT INTO gt.unit_input (unit_id, number, type, input_id, mode)

(SELECT
u.id as unit_id,
x.pos,
1 as type,
i2.id as input_id,
1 as mode

FROM cota.vehiculo_inputs vi
INNER JOIN gt.index_aux as x
INNER JOIN gt.vehicles as v ON v.id2=vi.codvehiculo
INNER JOIN gt.units as u ON u.vehicle_id = v.id
INNER JOIN gt.input as i2 ON i2.id2 = CASE x.pos
WHEN 1 THEN input_1
WHEN 2 THEN input_2
WHEN 3 THEN input_3
WHEN 4 THEN input_4
WHEN 5 THEN input_5
WHEN 6 THEN input_6
WHEN 7 THEN input_7
WHEN 8 THEN input_8
END

LEFT JOIN gt.unit_input as ui ON ui.unit_id = u.id AND ui.number = x.pos AND ui.type = 1
WHERE ui.unit_id IS NULL# AND input_id IS NOT NULL;

ORDER BY unit_id, pos
)
UNION
(SELECT
u.id as unit_id,
x.pos,
2 as type,
i2.id as input_id,
1 as mode

FROM cota.vehiculo_inputs vi
INNER JOIN gt.index_aux as x
INNER JOIN gt.vehicles as v ON v.id2=vi.codvehiculo
INNER JOIN gt.units as u ON u.vehicle_id = v.id
INNER JOIN gt.input as i2 ON i2.id2 = CASE x.pos
WHEN 1 THEN output_1
WHEN 2 THEN output_2
WHEN 3 THEN output_3
WHEN 4 THEN output_4
WHEN 5 THEN output_5
WHEN 6 THEN output_6
WHEN 7 THEN output_7
WHEN 8 THEN output_8
END

LEFT JOIN gt.unit_input as ui ON ui.unit_id = u.id AND ui.number = x.pos AND ui.type = 2
WHERE ui.unit_id IS NULL# AND input_id IS NOT NULL;
ORDER BY unit_id, pos
)


/* vehicle_model */
TRUNCATE gt.vehicle_model;
INSERT INTO gt.vehicle_model (id2, name, brand_id )

SELECT mm.codmodelo, mm.modelo, b.id
FROM cota.modelos as mm
INNER JOIN gt.vehicle_brand as b ON b.id2 = mm.codmarca
LEFT JOIN vehicle_model as m ON m.id2 = mm.codmodelo
WHERE m.id2 IS NULL;


/* tabla client*/
truncate client;

INSERT INTO  gt.client (id2, name, status)
SELECT c.codcliente,ucase(c.nombre),c.situacion
FROM cota.clientes as c;

/* tabla account*/
truncate account;

INSERT INTO gt.account
(id2, client_id, type_id, person_id, name, state_id, city, address, email, comment, phone, fax, status)
SELECT coddato, 0, tipo_persona, codpersona, ucase(nombre), codestado, ciudad, direccion, email, observaciones, telefono, fax, status
FROM cota.datos_administrativos as d;

UPDATE gt.account as a
INNER JOIN cota.datos_administrativos as DA ON da.coddato=a.id2
#INNER JOIN cota.clientes as CL ON cl.codcliente= DA.codcliente
INNER JOIN gt.client as c ON c.id2 = DA.codcliente
SET client_id = c.id
/* equipos:*/
/*modulo= marca_equipos
version = modelos_equipos
linea_celular = lineas
*/

TRUNCATE gt.contacts;

INSERT INTO gt.contacts
(id2, client_id, name, last_name, number_id,
position,
address, phone, phone2, phone3, email, email2, email3)


SELECT codcontacto, cc.id, c.nombres, c.apellidos, c.cedula,
c.cargo,
c.direccion, c.telefono, c.telefono2, c.telefono3, c.email1, c.email2, c.email3
FROM cota.contactos c
LEFT JOIN gt.clients as cc ON cc.id2 = c.codcliente
LEFT JOIN gt.contacts as c2 ON c2.id2 = c.codcontacto
WHERE c2.id2 IS NULL;


truncate phone_numbers;

insert into gt.phone_numbers
(id2, plan_id, carrier_id, gsm_account_id, voice_number, data_number, serial_sim, status)

SELECT codlinea, codplan, codoperadora, codcuenta, numero_voz, numero_datos, serial_sim, status FROM cota.lineas l;


truncate devices;
INSERT INTO gt.device
(id2, name, version_id,  serial, imei, password, phone_number_id, installed, comment, activo, status)

SELECT codequipo, CE.codigo, 0, serial, imei,  password, linea_celular, fecha_instalacion, concat(ifnull(observaciones,''),' ', ifnull(ficha_equipo,'')), activo, e.status
FROM cota.equipos as  E
LEFT join cota.codigos_equipos CE on CE.id = E.codigo_und;


/* table vehicle*/

TRUNCATE gt.vehicle;

SELECT * FROM cota.vehiculos v;

INSERT INTO gt.vehicle
(id2, account_id, device_id, type_id, name_id, aux_name, plate, brand_id, model_id, status, year, color, color_id, serial, picture, servicio_ini, comment, admin_status)


SELECT codvehiculo, null, null, null, null,  codigo2,  placa, b.id as codmarca, m.id as codmodelo, v.status, ano, v.color,c.id, v.serial, foto, v.servicio_ini, observaciones, status_admin
FROM cota.vehiculos as v
LEFT JOIN gt.vehicle_brand as b ON b.id2 = v.codmarca
LEFT JOIN gt.vehicle_model as m ON m.id2 = v.codmodelo
left join gt.vehicle_color as c on c.color = v.color
ORDER BY 1;

/*table UNITS*/
truncate units_names;
insert into gt.units_names (id2, name, status)
SELECT id, ucase(codigo), status FROM codigos_vehiculos

TRUNCATE units;

INSERT INTO gt.units

(name, name_id, device_id, vehicle_id, person_id, icon_id, account_id, contract_start, contract_end,
status_id, admin_status_id)


SELECT UCASE(codigo2) as name,n.id as name_id ,d.id as device_id, v.id as vehicle_id,
null as person_id,IFNULL(vi.icono,1) as icon_id,
a.id as account_id, fecha_instalacion as contract_start, fecha_desinstalacion as contract_end,
1 as status_id, v2.status_admin

FROM cota.cuenta_vehiculos as c
LEFT JOIN gt.devices as d ON d.id2 = c.codequipo
LEFT JOIN gt.vehicles as v ON v.id2 = c.codvehiculo
LEFT JOIN cota.vehiculos as v2 ON v2.codvehiculo = c.codvehiculo
LEFT JOIN gt.accounts as a ON a.id2= c.coddato
LEFT JOIN vehiculo_inputs as vi ON vi.codvehiculo = c.codvehiculo
LEFT JOIN gt.units_names as n ON n.id2 = v2.codigo;
/* update tracking_id*/
UPDATE units as u
INNER JOIN (

select t.id, unit_id, date_time, max(id) as m
from tracking as t
group by unit_id
) as x ON x.unit_id=u.id
set u.tracking_id=x.id, u.tracking_date=x.date_time;



insert into tracks_2020a ( codequipo, id_equipo, fecha_hora, longitud, latitud, velocidad, heading, altitud, satelites, event_id, input, millas, analog_input_1, analog_input_2, analog_output, output, counter_1, counter_2, accuracy, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10, fh_server)
select  codequipo, id_equipo, fecha_hora, longitud, latitud, velocidad, heading, altitud, satelites, event_id, input, millas, analog_input_1, analog_input_2, analog_output, output, counter_1, counter_2, accuracy, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10, fh_server
from tracks_2020

order by id desc limit 1000000


update tracks_2020a as t
inner join devices as d on d.id2 = t.codequipo
inner join units as u on u.device_id = d.id
set t.unit_id = u.id

insert into tracks_2020a ( codequipo, id_equipo, fecha_hora, longitud, latitud, velocidad, heading, altitud, satelites, event_id, input, millas, analog_input_1, analog_input_2, analog_output, output, counter_1, counter_2, accuracy, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10, fh_server)

select  t.codequipo, id_equipo, fecha_hora, longitud, latitud, velocidad, heading, altitud, satelites, event_id, input, millas, analog_input_1, analog_input_2, analog_output, output, counter_1, counter_2, accuracy, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10, fh_server
from equipos as e
inner join tracks_2020 as t on t.id = id_track2



update
gt.devices d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =40
where marca_equipo='X1'


update
gt.devices d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =42
where marca_equipo='X1 PLUS'

update
gt.devices d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =3
where marca_equipo='X1 PRO'

update
gt.devices d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =39
where marca_equipo='VT-200'


update
gt.devices d

inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =17
where marca_equipo='VT-10S900'

update
gt.devices d

inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =17
where marca_equipo='VT-10EG'