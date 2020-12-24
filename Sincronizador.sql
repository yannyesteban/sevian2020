INSERT INTO gt._sg_users (user, pass, expiration, status, clave)

SELECT u.usuario, md5(u.clave), vencimiento, u.status, u.clave
FROM cota.cfg_usuarios as u
LEFT JOIN gt._sg_users as u2 ON u2.user = u.usuario
WHERE u2.user IS NULL;

UPDATE gt._sg_users as u2
INNER JOIN cota.cfg_usuarios as u ON u.usuario=u2.user
SET pass=md5(u.clave), u2.clave = u.clave,u2.expiration=vencimiento,u2.status=u.status

;


/*BRANDS*/
INSERT INTO gt.devices_names (name, client_id, status_id)
SELECT c.codigo, c.codcliente, c.status
FROM cota.codigos_equipos as c
INNER JOIN clients as cc ON cc.id2 = c.codcliente
LEFT JOIN gt.devices_names as n ON n.name = c.codigo
WHERE n.name IS NULL;

TRUNCATE gt.brands;

INSERT INTO  gt.brands (id2, brand)

SELECT m.codmarca, ucase(m.marca)
FROM cota.marcas as m
LEFT JOIN gt.brands as b ON b.id2=m.codmarca
WHERE b.id2 IS NULL;


TRUNCATE gt.contact_type;

INSERT INTO gt.contact_type (id2, type, color, background)
SELECT t.codtipo, UCASE(t.tipo), t.color, t.fondo
FROM cota.tipos_contacto t
LEFT JOIN gt.contact_type as tt ON tt.id2 = t.codtipo
WHERE tt.id2 IS NULL


/* MODELS*/
TRUNCATE gt.models;
INSERT INTO gt.models (id2, model, brand_id )

SELECT mm.codmodelo, UCASE(mm.modelo), b.id
FROM cota.modelos as mm
INNER JOIN gt.brands as b ON b.id2 = mm.codmarca
LEFT JOIN gt.models as m ON m.id2 = mm.codmodelo
WHERE m.id2 IS NULL








SELECT c.codcliente,ucase(c.nombre),c.situacion
FROM cota.clientes as c
LEFT JOIN gt.clients as c2 on c.codcliente = c2.id2
WHERE id2 IS NULL;

UPDATE cota.clientes as c
INNER JOIN gt.clients as c2 on c.codcliente = c2.id2
SET client = ucase(c.nombre)


/* */

INSERT INTO gt.accounts
(id2, client_id, type_id, person_id, name,
state_id, city, address, email, comment, phone, fax, status)

SELECT coddato, 0, tipo_persona, d.codpersona, ucase(d.nombre),
d.codestado, d.ciudad, d.direccion, d.email, d.observaciones, d.telefono, d.fax, d.status
FROM cota.datos_administrativos as d
LEFT JOIN gt.accounts as a2 ON d.coddato = a2.id2
WHERE a2.id IS NULL




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

UPDATE gt.contacts as co
INNER JOIN cota.contactos c ON c.codcontacto = co.id2
SET
name = UCASE(c.nombres), last_name = UCASE(c.apellidos), number_id=UCASE(c.cedula),
co.position=UCASE(c.cargo),
address=c.direccion, phone=c.telefono, phone2=c.telefono2, phone3=c.telefono3,
co.email=LCASE(c.email1), co.email2=LCASE(c.email2), co.email3=LCASE(c.email3)