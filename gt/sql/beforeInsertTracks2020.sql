DELIMITER $$
CREATE TRIGGER beforeInsertTracksM
BEFORE INSERT ON tracks_m
FOR EACH ROW
BEGIN
	If(year(NEW.fecha_hora) < YEAR(NOW())) THEN
    	SET NEW.fecha_hora = DATE_ADD(NEW.fecha_hora, INTERVAL 1024 WEEK);
	END IF;

	

 
END





$$
DELIMITER ;