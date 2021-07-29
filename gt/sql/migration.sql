CREATE DEFINER=`root`@`localhost` PROCEDURE `migration`()
BEGIN

/* tabla gt_empty.clients */
TRUNCATE gt_empty.client;
/* tabla gt_empty.account */
TRUNCATE gt_empty.account;
/* gt_empty.vehicle_brand */
TRUNCATE gt_empty.vehicle_brand;
/* gt_empty.vehicle_model  */
TRUNCATE gt_empty.vehicle_model;
/* table gt_empty.vehicle */
TRUNCATE gt_empty.vehicle;
/* gt_empty.phone_number */
TRUNCATE gt_empty.phone_number;
/* gt_empty.device_name */
TRUNCATE gt_empty.device_name;
/* gt_empty.device */
TRUNCATE gt_empty.device;
/*table gt_empty.unit_name */
TRUNCATE gt_empty.unit_name;
/*table gt_empty.unit */
TRUNCATE gt_empty.unit;
/* table: gt_empty._sg_user */

TRUNCATE gt_empty.mark_category;


TRUNCATE gt_empty.image;
TRUNCATE gt_empty.mark;




INSERT INTO gt_empty._sg_users (user, pass, expiration, status, clave)

SELECT u.usuario, md5(u.clave), vencimiento, u.status, u.clave
FROM cota.cfg_usuarios as u
LEFT JOIN gt_empty._sg_users as u2 ON u2.user = u.usuario
WHERE u2.user IS NULL;

UPDATE gt_empty._sg_users as u2
INNER JOIN cota.cfg_usuarios as u ON u.usuario=u2.user
SET pass=md5(u.clave), u2.clave = u.clave,u2.expiration=vencimiento,u2.status=u.status;



/* tabla clients*/
INSERT INTO  gt_empty.client (id2, name, status)
SELECT c.codcliente,ucase(c.nombre),c.situacion
FROM cota.clientes as c
LEFT JOIN gt_empty.client as c2 ON c2.id2 = c.codcliente
WHERE c2.id2 IS NULL;


/* table account*/
INSERT INTO gt_empty.account
(id2, client_id, type_id, person_id, name, state_id, city,
address, email, comment, phone, fax, status)

SELECT coddato, c.id as client_id, tipo_persona, codpersona, ucase(nombre), codestado, ciudad,
direccion, d.email, observaciones, telefono, d.fax, d.status
FROM cota.datos_administrativos as d
INNER JOIN gt_empty.client as c ON c.id2 = d.codcliente
LEFT JOIN gt_empty.account as a2 ON a2.id2 = coddato
WHERE a2.id2 IS NULL;



/* vehicle_brand*/
INSERT INTO  gt_empty.vehicle_brand (id2, name)

SELECT m.codmarca, ucase(m.marca)
FROM cota.marcas as m
LEFT JOIN gt_empty.vehicle_brand as b ON b.id2=m.codmarca
WHERE b.id2 IS NULL;

/* gt_empty.vehicle_model */
INSERT INTO gt_empty.vehicle_model (id2, name, brand_id )

SELECT mm.codmodelo, mm.modelo, b.id
FROM cota.modelos as mm
INNER JOIN gt_empty.vehicle_brand as b ON b.id2 = mm.codmarca
LEFT JOIN gt_empty.vehicle_model as m ON m.id2 = mm.codmodelo
WHERE m.id2 IS NULL;

/* table gt_empty.vehicle */
INSERT INTO gt_empty.vehicle
(id2, account_id, device_id, type_id, name_id, aux_name, plate, brand_id, model_id, 
status, year, color, color_id, serial, picture, servicio_ini, comment, admin_status)

SELECT codvehiculo, null, null, null, null,  codigo2,  placa, b.id as codmarca, m.id as codmodelo,
v.status, ano, v.color,c.id, v.serial, foto,
v.servicio_ini, observaciones, status_admin
FROM cota.vehiculos as v
LEFT JOIN gt_empty.vehicle as v2 ON v2.id2 = codvehiculo
LEFT JOIN gt_empty.vehicle_brand as b ON b.id2 = v.codmarca
LEFT JOIN gt_empty.vehicle_model as m ON m.id2 = v.codmodelo
LEFT join gt_empty.vehicle_color as c on c.color = v.color
WHERE v2.id2 IS NULL
ORDER BY 1;

/* gt_empty.phone_number */
INSERT INTO gt_empty.phone_number
(id2, plan_id, carrier_id, gsm_account_id, voice_number, data_number, serial_sim, status)

SELECT codlinea, codplan, codoperadora, codcuenta, numero_voz, numero_datos, l.serial_sim, l.status
FROM cota.lineas as l
LEFT JOIN gt_empty.phone_number as ph2 ON ph2.id2 = codlinea;

/* gt_empty.device_name */
INSERT INTO gt_empty.device_name (name, client_id, status_id)
SELECT c.codigo, c.codcliente, c.status
FROM cota.codigos_equipos as c
INNER JOIN gt_empty.client as cc ON cc.id2 = c.codcliente
LEFT JOIN gt_empty.device_name as n ON n.name = c.codigo
WHERE n.name IS NULL;

/* gt_empty.device */

INSERT INTO gt_empty.device
(id2, name, version_id,  serial, imei, password, phone_number_id, installed, comment, activo, status, version2)

SELECT E.codequipo, CE.codigo, 0, E.serial, E.imei,  E.password, linea_celular, fecha_instalacion,
concat(ifnull(observaciones,''),' ', ifnull(ficha_equipo,'')), E.activo, e.status, e.version
FROM cota.equipos as  E
LEFT join cota.codigos_equipos CE on CE.id = E.codigo_und
LEFT JOIN gt_empty.device as d2 ON d2.id2 = E.codequipo
WHERE d2.id2  IS NULL;

update
gt_empty.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =40
where marca_equipo='X1';


update
gt_empty.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =42
where marca_equipo='X1 PLUS';

update
gt_empty.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =3
where marca_equipo='X1 PRO';

update
gt_empty.device d
inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =39
where marca_equipo='VT-200';


update
gt_empty.device d

inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =17
where marca_equipo='VT-10S900';

update
gt_empty.device d

inner join cota.modelos_equipos as v ON v.codmodelo = version2
inner join cota.marca_equipos as ma on ma.codmarca = v.codmarca
SET version_id =17
where marca_equipo='VT-10EG';


/*table gt_empty.unit_name*/
INSERT INTO gt_empty.unit_name (id2, name, status)
SELECT c.id, ucase(c.codigo), c.status
FROM cota.codigos_vehiculos as c
LEFT JOIN gt_empty.unit_name as n2 ON n2.id2 = c.id
WHERE n2.id2 IS NULL;


INSERT INTO gt_empty.unit

(name, name_id, device_id, vehicle_id, person_id, icon_id, account_id, contract_start, contract_end,
status_id, admin_status_id, coddato, codvehiculo)

SELECT UCASE(codigo2) as name,n.id as name_id ,d.id as device_id, v.id as vehicle_id,
null as person_id,IFNULL(vi.icono,1) as icon_id,
a.id as account_id, fecha_instalacion as contract_start, fecha_desinstalacion as contract_end,
1 as status_id, v2.status_admin, c.coddato, c.codvehiculo

FROM cota.cuenta_vehiculos as c
LEFT JOIN gt_empty.unit as u2 ON u2.coddato = c.coddato AND u2.codvehiculo = c.codvehiculo
LEFT JOIN gt_empty.device as d ON d.id2 = c.codequipo
LEFT JOIN gt_empty.vehicle as v ON v.id2 = c.codvehiculo
LEFT JOIN cota.vehiculos as v2 ON v2.codvehiculo = c.codvehiculo
LEFT JOIN gt_empty.account as a ON a.id2= c.coddato
LEFT JOIN cota.vehiculo_inputs as vi ON vi.codvehiculo = c.codvehiculo
LEFT JOIN gt_empty.unit_name as n ON n.id2 = v2.codigo
WHERE u2.coddato IS NULL AND u2.codvehiculo IS NULL;


UPDATE gt_empty.tracking as t

INNER JOIN gt_empty.device as d ON d.name = t.device_id
INNER JOIN gt_empty.unit as u ON u.device_id = d.id
SET t.unit_id = u.id;

/* update tracking_id*/
UPDATE gt_empty.unit as u
INNER JOIN (
 select t.id, u.id as unit_id, date_time, t.date_time as m
from gt_empty.tracking as t
inner join gt_empty.device as d on t.device_id = d.name
inner join gt_empty.unit as u on u.device_id = d.id
#group by t.device_id
) as x ON x.unit_id=u.id
set u.tracking_id=x.id, u.tracking_date=x.date_time;


INSERT INTO mark_category (client_id, name, user, id2)


SELECT cl.id as client_id, ucase(categoria) as name, c.usuario as user, codcategoria as id2
FROM cota.categorias c
LEFT JOIN client as cl ON cl.id2 = c.codcliente
LEFT JOIN mark_category as mc ON mc.id2=c.codcategoria
WHERE mc.id2 IS NULL;

INSERT into gt_empty.image (name, description, image, type_id)
SELECT concat('img_', i.codicono) as name, i.descripcion, i.icono as image, i.tipo as type_id
FROM cota.iconos as i;



INSERT INTO gt_empty.mark (client_id, account_id, user, name,description,
longitude, latitude, image,
address, phone1, phone2,
phone3, fax, email, web,

note, scope, id2)

SELECT cl.id as client_id, acc.id as account_id, s.usuario as user, s.sitio as name, s.descripcion as description,
 longitud as longitude, latitud as latitude, i.name as image, s.direccion AS address, s.telefono1 as phone1, s.telefono2 as phone2,
telefono3 as phone3, s.fax as fax, s.email as email, s.web as web,

 s.observaciones as note, s.tipo as scope, s.codsitio as id2



FROM cota.sitios s

INNER JOIN gt_empty.mark_category as mc ON mc.id2 = s.codcategoria
INNER JOIN gt_empty.image as i on i.id = s.codicono
LEFT JOIN gt_empty.mark as mr ON mr.id2 = s.codsitio

LEFT JOIN gt_empty.client as cl ON cl.id2 = s.codcliente
LEFT JOIN gt_empty.account as acc ON acc.id2 = s.coddato
WHERE mr.id2 is null

;

END