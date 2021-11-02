SELECT * FROM command where command_id in(SELECT id FROM device_command where command = 'OUTC');


update command set params = (select params from temp_commnad where id=4)


where command_id in(SELECT id FROM device_command where command = 'OUTC');