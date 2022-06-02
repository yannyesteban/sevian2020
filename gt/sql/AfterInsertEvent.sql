DELIMITER $$
CREATE TRIGGER AfterInsertEvent
AFTER INSERT ON event
FOR EACH ROW
BEGIN

	UPDATE unit 
	SET 
		tracking_date= COALESCE(NEW.date_time, tracking_date),
        conn_status = CASE NEW.event_id WHEN 202 THEN 0 ELSE 1 END,
		conn_date = CASE NEW.event_id WHEN 202 THEN conn_date ELSE now() END,
        event_id = NEW.event_id
	WHERE id = NEW.unit_id;
    
END$$
DELIMITER ;