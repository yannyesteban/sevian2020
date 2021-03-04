DELIMITER $$
CREATE TRIGGER InsertOnPending
AFTER INSERT ON pending
FOR EACH ROW
BEGIN

	

	
    
    INSERT INTO event (unit_id, date_time, event_id, mode, title, info, status)
	
    SELECT NEW.unit_id, NEW.datetime, ue.event_id, ue.mode,CONCAT('$+',(SELECT command FROM device_command WHERE id=NEW.command_id)) as title,NEW.command, 0
	FROM unit_event as ue
    LEFT JOIN device_event as de ON de.event_id=ue.event_id
	WHERE (unit_id = NEW.unit_id OR unit_id IS NULL) AND ue.event_id = 208 AND ue.mode > 0 
    
    ORDER BY ue.unit_id DESC
    LIMIT 1;
    
    
END$$
DELIMITER ;