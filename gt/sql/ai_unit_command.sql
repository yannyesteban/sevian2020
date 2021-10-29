DELIMITER $$
CREATE TRIGGER ai_unit_command
AFTER INSERT ON unit_command
FOR EACH ROW

BEGIN
	
	DECLARE role_id int;
    
    SELECT dc.role_id
    INTO role_id
	FROM device_command as dc WHERE id = NEW.command_id;
	
	IF role_id = 1 THEN 

		INSERT INTO unit_event (unit_id, name, event_id) VALUES (NEW.unit_id, NEW.name, NEW.index)
        ON DUPLICATE KEY UPDATE name = NEW.name;
    
    END IF;
    
END $$
DELIMITER ;