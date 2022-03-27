DELIMITER $$
CREATE TRIGGER cota.cot_codigos_vehiculos
AFTER UPDATE ON codigos_vehiculos
FOR EACH ROW
BEGIN

	UPDATE gt.unit_name SET name = NEW.codigo WHERE id2 = NEW.id;

END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_codigos_equipos
AFTER UPDATE ON codigos_equipos
FOR EACH ROW
BEGIN

	UPDATE gt.device_name SET name = NEW.codigo WHERE name = OLD.codigo;
	UPDATE gt.device SET name = NEW.codigo  WHERE name = OLD.codigo;

END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_equipos
BEFORE UPDATE ON equipos
FOR EACH ROW
BEGIN

	UPDATE gt.device as d
	INNER JOIN cota.equipos as e ON e.codequipo = d.id2
	INNER JOIN cota.codigos_equipos as ce ON ce.id = e.codigo_und

	SET d.name = ce.codigo
	WHERE d.id2 = NEW.codequipo;

END $$

DELIMITER ;



DELIMITER $$
CREATE TRIGGER cota.cot_cuenta_vehiculos
AFTER UPDATE ON cuenta_vehiculos
FOR EACH ROW
BEGIN

UPDATE gt.unit as u
INNER JOIN cota.cuenta_vehiculos as cv ON cv.codvehiculo = u.codvehiculo AND cv.coddato = u.coddato
LEFT JOIN cota.equipos as e ON e.codequipo = cv.codequipo
LEFT JOIN gt.device as d ON d.id2 = e.codequipo


SET u.device_id = d.id
WHERE u.codvehiculo = NEW.codvehiculo AND u.coddato = NEW.coddato;


END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_vehiculo_inputs
AFTER UPDATE ON vehiculo_inputs
FOR EACH ROW
BEGIN

DELETE ui
FROM gt.unit_input as ui
INNER JOIN gt.unit as u ON u.id = ui.unit_id
WHERE u.codvehiculo = NEW.codvehiculo;


INSERT INTO gt.unit_input (unit_id, number, type, input_id, mode)

(SELECT
u.id as unit_id,
x.pos,
1 as type,
i2.id as input_id,
1 as mode

FROM cota.vehiculo_inputs vi
INNER JOIN gt.index_aux as x
INNER JOIN gt.vehicle as v ON v.id2=vi.codvehiculo
INNER JOIN gt.unit as u ON u.vehicle_id = v.id
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
WHERE vi.codvehiculo = NEW.codvehiculo

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
INNER JOIN gt.vehicle as v ON v.id2=vi.codvehiculo
INNER JOIN gt.unit as u ON u.vehicle_id = v.id
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
WHERE vi.codvehiculo = NEW.codvehiculo
ORDER BY unit_id, pos
);



END $$

DELIMITER ;



DELIMITER $$
CREATE TRIGGER cota.cot_insert_equipos
AFTER INSERT ON cota.equipos
FOR EACH ROW
BEGIN
	call migration();

END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_insert_vehiculos
AFTER INSERT ON cota.vehiculos
FOR EACH ROW
BEGIN
	call migration();

END $$

DELIMITER ;



DELIMITER $$
CREATE TRIGGER cota.cot_insert_cfg_usuarios
AFTER INSERT ON cota.cfg_usuarios
FOR EACH ROW
BEGIN
	INSERT INTO gt._sg_users (user, pass, expiration, status, clave)

	SELECT u.usuario, md5(u.clave), vencimiento, u.status, u.clave
	FROM cota.cfg_usuarios as u
	LEFT JOIN gt._sg_users as u2 ON u2.user = u.usuario
	WHERE u2.user IS NULL;

END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_usuario_vehiculos
AFTER INSERT ON cota.usuario_vehiculos
FOR EACH ROW
BEGIN
	INSERT INTO gt.user_unit (user, unit_id)
	SELECT uv.usuario as user, u.id as unit_id
	FROM cota.usuario_vehiculos as uv

	INNER JOIN gt.vehicle as v ON v.id2=uv.codvehiculo
	INNER JOIN  gt.unit as u ON u.vehicle_id = v.id
	LEFT JOIN  gt.user_unit as uu ON uu.user = uv.usuario AND uu.unit_id = u.id
	WHERE uu.user IS NULL;

END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_update_usuario_vehiculos
AFTER UPDATE ON cota.usuario_vehiculos
FOR EACH ROW
BEGIN

	DELETE FROM gt.user_unit WHERE `user` = NEW.usuario;
	INSERT INTO gt.user_unit (user, unit_id)
	SELECT uv.usuario as user, u.id as unit_id
	FROM cota.usuario_vehiculos as uv

	INNER JOIN gt.vehicle as v ON v.id2=uv.codvehiculo
	INNER JOIN  gt.unit as u ON u.vehicle_id = v.id
	LEFT JOIN  gt.user_unit as uu ON uu.user = uv.usuario AND uu.unit_id = u.id
	WHERE uu.user IS NULL;

END $$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER cota.cot_update_vehiculos
AFTER UPDATE ON vehiculos
FOR EACH ROW
BEGIN

	UPDATE gt.vehicle as v

    SET plate = NEW.placa,
   v.year = NEW.ano,
   color = NEW.color,
   v.serial = NEW.serial


  WHERE id2 = NEW.codvehiculo;

END $$

DELIMITER ;