DELIMITER $$
CREATE TRIGGER UpdateTrackId2020
AFTER INSERT ON tracks_2020
FOR EACH ROW
BEGIN

	UPDATE equipos SET id_track2 = NEW.id, last_track=NEW.fecha_hora WHERE codequipo = NEW.codequipo;


INSERT INTO tracks
	(codequipo, id_equipo, fecha_hora, longitud, latitud, 
	velocidad, heading, altitud, satelites,event_id,
	input, millas, analog_input_1, analog_input_2, analog_output, 
	output, counter_1, counter_2, accuracy
	)
	
	VALUES
	(NEW.codequipo, NEW.id_equipo, NEW.fecha_hora, NEW.longitud, NEW.latitud, 
	NEW.velocidad, NEW.heading, NEW.altitud, NEW.satelites, NEW.event_id,
	NEW.input, NEW.millas, NEW.analog_input_1, NEW.analog_input_2, NEW.analog_output, 
	NEW.output, NEW.counter_1, NEW.counter_2, NEW.accuracy
	);
 
END$$
DELIMITER ;