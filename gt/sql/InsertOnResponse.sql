DELIMITER $$
CREATE TRIGGER InsertOnResponse
AFTER INSERT ON unit_response
FOR EACH ROW
BEGIN

	

	
    
    INSERT INTO event (unit_id, date_time, event_id, mode, title, info, status)
	
    SELECT NEW.unit_id, NEW.stamp, ue.event_id, ue.mode,
    CONCAT('$+',(SELECT command FROM device_command WHERE id=NEW.command_id)) as title,
    NEW.response, 0
	FROM unit_event as ue
    LEFT JOIN device_event as de ON de.event_id=ue.event_id
	WHERE (unit_id = NEW.unit_id OR unit_id IS NULL) AND ue.event_id = 207 
    AND ue.mode > 0
    AND NEW.command_id > 0
    
    ORDER BY ue.unit_id DESC
    LIMIT 1;
    
    
END$$
DELIMITER ;