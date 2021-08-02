DELIMITER $$
CREATE TRIGGER beforeInsertTracking_a
BEFORE INSERT ON tracking_a
FOR EACH ROW
BEGIN
	If(year(NEW.fecha_hora) < YEAR(NOW())) THEN
    	SET NEW.fecha_hora = DATE_ADD(NEW.fecha_hora, INTERVAL 1024 WEEK);
	END IF;

 
END $$
DELIMITER ;