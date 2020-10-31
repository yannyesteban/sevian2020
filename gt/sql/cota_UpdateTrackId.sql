DELIMITER $$
CREATE TRIGGER UpdateTrackId
AFTER INSERT ON tracks
FOR EACH ROW
BEGIN

	UPDATE equipos SET id_track = NEW.id WHERE codequipo = NEW.codequipo;

 
END$$
DELIMITER ;