



/* tabla clients*/
truncate clients;

INSERT INTO  gt.clients (id2, client, status)
SELECT c.codcliente,c.nombre,c.situacion
FROM cota.clientes as c;

/* tabla accounts*/
truncate accounts;

INSERT INTO gt.accounts
(id2, client_id, type_id, person_id, name, state_id, city, address, email, comment, phone, fax, status)
SELECT coddato, 0, tipo_persona, codpersona, nombre, codestado, ciudad, direccion, email, observaciones, telefono, fax, status
FROM datos_administrativos as d;

UPDATE gt.accounts as a
INNER JOIN cota.datos_administrativos as DA ON da.coddato=a.id2
#INNER JOIN cota.clientes as CL ON cl.codcliente= DA.codcliente
INNER JOIN gt.clients as c ON c.id2 = DA.codcliente
SET client_id = c.id
/* equipos:*/
/*modulo= marca_equipos
version = modelos_equipos
linea_celular = lineas
*/

truncate phone_numbers;

insert into gt.phone_numbers
(id2, plan_id, carrier_id, gsm_account_id, voice_number, data_number, serial_sim, status)

SELECT codlinea, codplan, codoperadora, codcuenta, numero_voz, numero_datos, serial_sim, status FROM cota.lineas l;


INSERT INTO gt.devices
(id2, device_name, version_id,  serial, imei, password, phone_number_id, installed, comment, activo, status)


truncate devices;
SELECT codequipo, CE.codigo, 0, serial, imei,  password, linea_celular, fecha_instalacion, concat(ifnull(observaciones,''),' ', ifnull(ficha_equipo,'')), activo, e.status
FROM cota.equipos as  E
LEFT join cota.codigos_equipos CE on CE.id = E.codigo_und

;


/* table vehicles*/

TRUNCATE vehicles;

SELECT * FROM vehiculos v;

INSERT INTO gt.vehicles
(id2, account_id, device_id, type_id, name_id, aux_name, plate, brand_id, model_id, status, year, color, color_id, serial, picture, servicio_ini, comment, admin_status)


SELECT codvehiculo, null, null, null, null,  codigo2,  placa, codmarca, codmodelo, status, ano, v.color,c.id, serial, foto, servicio_ini, observaciones, status_admin
FROM cota.vehiculos as v
left join gt.vehicle_color as c on c.color = v.color

/*table UNITS*/
truncate units_names;
insert into gt.units_names (id2, name, status)
SELECT id, ucase(codigo), status FROM codigos_vehiculos

TRUNCATE units;

INSERT INTO gt.units

(name, name_id, device_id, vehicle_id, person_id, icon_id, account_id, contract_start, contract_end,
status_id, admin_status_id)


SELECT UCASE(codigo2) as name,n.id as name_id ,d.id as device_id, v.id as vehicle_id,
null as person_id,vi.icono as icon_id,
a.id as account_id, fecha_instalacion as contract_start, fecha_desinstalacion as contract_end,
1 as status_id, v2.status_admin

FROM cota.cuenta_vehiculos as c
LEFT JOIN gt.devices as d ON d.id2 = c.codequipo
LEFT JOIN gt.vehicles as v ON v.id2 = c.codvehiculo
LEFT JOIN cota.vehiculos as v2 ON v2.codvehiculo = c.codvehiculo
LEFT JOIN gt.accounts as a ON a.id2= c.coddato
LEFT JOIN vehiculo_inputs as vi ON vi.codvehiculo = c.codvehiculo
LEFT JOIN gt.units_names as n ON n.id2 = v2.codigo