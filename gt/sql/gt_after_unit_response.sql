DELIMITER $$
CREATE TRIGGER AfterInsertInUnitResponse
AFTER INSERT ON unit_response
FOR EACH ROW
BEGIN


	DELETE p
			FROM pending as p
			INNER JOIN units as u ON u.id = p.unit_id
			INNER JOIN devices as d ON d.id = u.device_id
			INNER JOIN devices_versions as v ON v.id = d.version_id


			INNER JOIN devices_commands as c ON c.id = p.command_id

			WHERE u.id = NEW.unit_id AND c.id = NEW.command_id AND p.index = NEW.index;

 
END $$
DELIMITER ;