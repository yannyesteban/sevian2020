DELIMITER $$
CREATE TRIGGER UpdateTrackId
AFTER INSERT ON tracking
FOR EACH ROW
BEGIN

    
    SET NEW.date_time = DATE_ADD(NEW.date_time, interval -4 hour);
	
    IF NEW.date_time IS NULL THEN
		SET NEW.date_time = now();

    END IF;
	

	If(year(NEW.date_time) < YEAR(NOW())) THEN
    	SET NEW.date_time = now();
	END IF;
    
	UPDATE unit 
	SET 
		tracking_id = NEW.id,
		tracking_date=NEW.date_time,
		conn_status = 1,
		conn_date = now()
	WHERE id = NEW.unit_id;
     
    INSERT IGNORE INTO event (unit_id, date_time, event_id, mode, status, title)
	
    SELECT NEW.unit_id, NEW.date_time, ue.event_id, ue.mode, 0, COALESCE(CASE WHEN ue.name IS NOT NULL and ue.name!='' THEN ue.name ELSE null END,(SELECT de.name
		FROM unit as u
		INNER JOIN device as d ON d.id = u.device_id
		INNER JOIN device_version v on v.id = d.version_id
		INNER JOIN device_event as de ON de.version_id = v.id
		WHERE u.id = NEW.unit_id
		AND de.event_id = NEW.event_id
	)) as title
	FROM unit_event as ue
	WHERE (unit_id = NEW.unit_id OR unit_id IS NULL) AND ue.event_id = NEW.event_id AND ue.mode > 0
    
    ORDER BY ue.unit_id DESC
    LIMIT 1;
    
    IF NEW.event_id = 0 or NEW.event_id = 34 THEN
		UPDATE
			unit_command as uc
		INNER JOIN device_command as dc ON dc.id = uc.command_id AND dc.role_id = 2
		SET uc.status = 2
		WHERE uc.status = 1 AND uc.unit_id = NEW.unit_id
		AND (SELECT de.role_id

			FROM unit as u
			INNER JOIN device as d ON d.id = u.device_id
			INNER JOIN device_event as de ON de.version_id = d.version_id
			WHERE u.id = NEW.unit_id and de.event_id = NEW.event_id) = 1
		
		;

    END IF;

    
END$$
DELIMITER ;