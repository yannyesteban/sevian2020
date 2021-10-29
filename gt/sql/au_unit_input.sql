DELIMITER $$
CREATE TRIGGER au_unit_input
AFTER UPDATE ON unit_input
FOR EACH ROW

BEGIN
	
	DECLARE name varchar(45);
    DECLARE event_id int unsigned;
    
    SELECT de.event_id
	INTO event_id
	FROM unit as u
	INNER JOIN device as d ON d.id = u.device_id
	INNER JOIN device_event as de ON de.version_id = d.version_id
	WHERE u.id=NEW.unit_id AND de.role_id = 16 and de.index = NEW.number;
	IF event_id IS NOT NULL THEN  
		SELECT i.name INTO name FROM input i WHERE id = NEW.input_id;
 
		INSERT INTO unit_event (unit_id, name, event_id) VALUES (NEW.unit_id, name, event_id)
		ON DUPLICATE KEY UPDATE name = name;
	END IF;
    
     
END $$
DELIMITER ;