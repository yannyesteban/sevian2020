DELIMITER $$
CREATE TRIGGER UpdateTrackId
AFTER INSERT ON tracking
FOR EACH ROW
BEGIN

	UPDATE units SET tracking_id = NEW.id, n=n+1, tracking_date=NEW.date_time WHERE id = NEW.unit_id;

 
END$$
DELIMITER ;