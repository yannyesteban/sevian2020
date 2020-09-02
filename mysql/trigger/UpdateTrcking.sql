DELIMITER $$
CREATE TRIGGER UpdateTrackId
AFTER INSERT ON tracking
FOR EACH ROW
BEGIN

	UPDATE units SET tracking_id = NEW.id WHERE id = NEW.unit_id;

 
END$$
DELIMITER ;