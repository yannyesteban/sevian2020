CREATE DEFINER=`root`@`localhost` PROCEDURE `migration`()
BEGIN


INSERT INTO mark_category (client_id, name, user, id2)


SELECT cl.id as client_id, ucase(categoria) as name, c.usuario as user, codcategoria as id2
FROM cota.categorias c
LEFT JOIN client as cl ON cl.id2 = c.codcliente
LEFT JOIN mark_category as mc ON mc.id2=c.codcategoria
WHERE mc.id2 IS NULL;

TRUNCATE gt.image;
INSERT into gt.image (name, description, image, type_id)
SELECT concat('img_', i.codicono) as name, i.descripcion, i.icono as image, i.tipo as type_id
FROM cota.iconos as i;



INSERT INTO gt._sg_users (user, pass, expiration, status, clave)

SELECT u.usuario, md5(u.clave), vencimiento, u.status, u.clave
FROM cota.cfg_usuarios as u
LEFT JOIN gt._sg_users as u2 ON u2.user = u.usuario
WHERE u2.user IS NULL;

UPDATE gt._sg_users as u2
INNER JOIN cota.cfg_usuarios as u ON u.usuario=u2.user
SET pass=md5(u.clave), u2.clave = u.clave,u2.expiration=vencimiento,u2.status=u.status;



/* tabla clients*/
INSERT INTO  gt.client (id2, name, status)
SELECT c.codcliente,ucase(c.nombre),c.situacion
FROM cota.clientes as c
LEFT JOIN gt.client as c2 ON c2.id2 = c.codcliente
WHERE c2.id2 IS NULL;


/* table account*/
INSERT INTO gt.account
(id2, client_id, type_id, person_id, name, state_id, city,
address, email, comment, phone, fax, status)

SELECT coddato, c.id as client_id, tipo_persona, codpersona, ucase(nombre), codestado, ciudad,
direccion, d.email, observaciones, telefono, d.fax, d.status
FROM cota.datos_administrativos as d
INNER JOIN gt.client as c ON c.id2 = d.codcliente
LEFT JOIN gt.account as a2 ON a2.id2 = coddato
WHERE a2.id2 IS NULL;



/* vehicle_brand*/
INSERT INTO  gt.vehicle_brand (id2, name)

SELECT m.codmarca, ucase(m.marca)
FROM cota.marcas as m
LEFT JOIN gt.vehicle_brand as b ON b.id2=m.codmarca
WHERE b.id2 IS NULL;

/* gt.vehicle_model */
INSERT INTO gt.vehicle_model (id2, name, brand_id )

SELECT mm.codmodelo, mm.modelo, b.id
FROM cota.modelos as mm
INNER JOIN gt.vehicle_brand as b ON b.id2 = mm.codmarca
LEFT JOIN gt.vehicle_model as m ON m.id2 = mm.codmodelo
WHERE m.id2 IS NULL;

/* table gt.vehicle */
INSERT INTO gt.vehicle
(id2, account_id, device_id, type_id, name_id, aux_name, plate, brand_id, model_id, 
status, year, color, color_id, serial, picture, servicio_ini, comment, admin_status)

SELECT codvehiculo, null, null, null, null,  codigo2,  placa, b.id as codmarca, m.id as codmodelo,
v.status, ano, v.color,c.id, v.serial, foto,
v.servicio_ini, observaciones, status_admin
FROM cota.vehiculos as v
LEFT JOIN gt.vehicle as v2 ON v2.id2 = codvehiculo
LEFT JOIN gt.vehicle_brand as b ON b.id2 = v.codmarca
LEFT JOIN gt.vehicle_model as m ON m.id2 = v.codmodelo
LEFT join gt.vehicle_color as c on c.color = v.color
WHERE v2.id2 IS NULL
ORDER BY 1;

/* gt.phone_number */
INSERT INTO gt.phone_number
(id2, plan_id, carrier_id, gsm_account_id, voice_number, data_number, serial_sim, status)

SELECT codlinea, codplan, codoperadora, codcuenta, numero_voz, numero_datos, l.serial_sim, l.status
FROM cota.lineas as l
LEFT JOIN gt.phone_number as ph2 ON ph2.id2 = codlinea;

/* gt.device_name */
INSERT INTO gt.device_name (name, client_id, status_id)
SELECT c.codigo, c.codcliente, c.status
FROM cota.codigos_equipos as c
INNER JOIN gt.client as cc ON cc.id2 = c.codcliente
LEFT JOIN gt.device_name as n ON n.name = c.codigo
WHERE n.name IS NULL;

/* gt.device */

INSERT INTO gt.device
(id2, name, version_id,  serial, imei, password, phone_number_id, installed, comment, activo, status, version2)

SELECT E.codequipo, CE.codigo, 0, E.serial, E.imei,  E.password, linea_celular, fecha_instalacion,
concat(ifnull(observaciones,''),' ', ifnull(ficha_equipo,'')), E.activo, e.status, e.version
FROM cota.equipos as  E
LEFT join cota.codigos_equipos CE on CE.id = E.codigo_und
LEFT JOIN gt.device as d2 ON d2.id2 = E.codequipo
WHERE d2.id2  IS NULL;

update
gt.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =40
where marca_equipo='X1';


update
gt.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =42
where marca_equipo='X1 PLUS';

update
gt.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =3
where marca_equipo='X1 PRO';

update
gt.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =39
where marca_equipo='VT-200';


update
gt.device d

inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =17
where marca_equipo='VT-10S900';

update
gt.device d

inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =17
where marca_equipo='VT-10EG';


/*table gt.unit_name*/
INSERT INTO gt.unit_name (id2, name, status)
SELECT c.id, ucase(c.codigo), c.status
FROM cota.codigos_vehiculos as c
LEFT JOIN gt.unit_name as n2 ON n2.id2 = c.id
WHERE n2.id2 IS NULL;


INSERT INTO gt.unit

(name, name_id, device_id, vehicle_id, person_id, icon_id, account_id, contract_start, contract_end,
status_id, admin_status_id, coddato, codvehiculo)

SELECT UCASE(codigo2) as name,n.id as name_id ,d.id as device_id, v.id as vehicle_id,
null as person_id,IFNULL(vi.icono,1) as icon_id,
a.id as account_id, fecha_instalacion as contract_start, fecha_desinstalacion as contract_end,
1 as status_id, v2.status_admin, c.coddato, c.codvehiculo

FROM cota.cuenta_vehiculos as c
LEFT JOIN gt.unit as u2 ON u2.coddato = c.coddato AND u2.codvehiculo = c.codvehiculo
LEFT JOIN gt.device as d ON d.id2 = c.codequipo
LEFT JOIN gt.vehicle as v ON v.id2 = c.codvehiculo
LEFT JOIN cota.vehiculos as v2 ON v2.codvehiculo = c.codvehiculo
LEFT JOIN gt.account as a ON a.id2= c.coddato
LEFT JOIN cota.vehiculo_inputs as vi ON vi.codvehiculo = c.codvehiculo
LEFT JOIN gt.unit_name as n ON n.id2 = v2.codigo
WHERE u2.coddato IS NULL AND u2.codvehiculo IS NULL;

INSERT INTO gt.user_unit (user, unit_id)
SELECT uv.usuario as user, u.id as unit_id
FROM cota.usuario_vehiculos as uv

INNER JOIN gt.vehicle as v ON v.id2=uv.codvehiculo
INNER JOIN  gt.unit as u ON u.vehicle_id = v.id
LEFT JOIN  gt.user_unit as uu ON uu.user = uv.usuario AND uu.unit_id = u.id
WHERE uu.user IS NULL;

truncate unit_input;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
1 as number,
1 as type,
input_1 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_1 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
2 as number,
1 as type,
input_2 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_2 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
3 as number,
1 as type,
input_3 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_3 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
4 as number,
1 as type,
input_4 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_4 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
5 as number,
1 as type,
input_5 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_5 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
6 as number,
1 as type,
input_6 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_6 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
7 as number,
1 as type,
input_7 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_7 is not null;


INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
8 as number,
1 as type,
input_8 as input_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE input_8 is not null;



INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
1 as number,
2 as type,
output_1 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_1 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
2 as number,
2 as type,
output_2 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_2 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode )
SELECT codvehiculo as unit_id ,
3 as number,
2 as type,
output_3 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_3 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
4 as number,
2 as type,
output_4 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_4 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
5 as number,
2 as type,
output_5 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_5 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
6 as number,
2 as type,
output_6 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_6 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
7 as number,
2 as type,
output_7 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_7 is not null;

INSERT into unit_input (unit_id, number, type, input_id, mode)
SELECT codvehiculo as unit_id ,
8 as number,
2 as type,
output_8 as output_id,
0 as mode
FROM cota.vehiculo_inputs
WHERE output_8 is not null;



END