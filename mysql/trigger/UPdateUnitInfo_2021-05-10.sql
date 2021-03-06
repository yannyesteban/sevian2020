DELIMITER $$
CREATE TRIGGER UpdateUnitInfo
BEFORE INSERT ON tracking
FOR EACH ROW
BEGIN

	

	UPDATE unit SET tracking_id = NEW.id, tracking_date=NEW.date_time WHERE id = NEW.unit_id;
    
    INSERT INTO event (unit_id, date_time, event_id, mode, status, title)
	
    SELECT NEW.unit_id, NEW.date_time, ue.event_id, ue.mode, 0, (SELECT de.name
		FROM unit as u
		INNER JOIN device as d ON d.id = u.device_id
		INNER JOIN device_version v on v.id = d.version_id
		INNER JOIN device_event as de ON de.version_id = v.id
		WHERE u.id = NEW.unit_id
		AND de.event_id = NEW.event_id
	) as title
	FROM unit_event as ue
	WHERE (unit_id = NEW.unit_id OR unit_id IS NULL) AND ue.event_id = NEW.event_id AND ue.mode > 0
    
    ORDER BY ue.unit_id DESC
    LIMIT 1;
    
    
END $$
DELIMITER ;