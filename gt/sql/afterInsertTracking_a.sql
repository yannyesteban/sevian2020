DELIMITER $$
CREATE TRIGGER afterInsertTracking_a
AFTER INSERT ON tracking_a
FOR EACH ROW
BEGIN
	UPDATE unit SET tracking_id = NEW.id, tracking_date=NEW.date_time WHERE id = NEW.unit_id;

END $$

DELIMITER ;