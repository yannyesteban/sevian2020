DELIMITER $$
CREATE TRIGGER UpdateTrackId
AFTER INSERT ON tracking
FOR EACH ROW
BEGIN

	

	UPDATE unit SET tracking_id = NEW.id, tracking_date=NEW.date_time WHERE id = NEW.unit_id;
    
    INSERT INTO event (unit_id, date_time, event_id, mode, status)
	
    SELECT NEW.unit_id, NEW.date_time, ue.event_id, ue.mode, 0
	FROM unit_event as ue
	WHERE (unit_id = NEW.unit_id OR unit_id IS NULL) AND ue.event_id = NEW.event_id AND ue.mode > 0
    
    ORDER BY ue.unit_id DESC
    LIMIT 1;
    
    
END$$
DELIMITER ;