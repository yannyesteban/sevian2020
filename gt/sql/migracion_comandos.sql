SELECT d2.id,d1.param, v.*


FROM device_param_value as v

INNER JOIN device_comm_param d1  ON v.param_id = d1.id

INNER JOIN device_command as c1 ON c1.id = d1.command_id


inner join device_command as c2 on c2.command = c1.command
inner join device_comm_param as d2 on d1.param = d2.param and d2.command_id= c2.id
#INNER JOIN device_command as c1 ON c1.id = d1.command_id and d1.



where d1.command_id = 968

order by c2.id, d1.id

;



insert into device_param_value (param_id, `value`, title, description)

SELECT d2.id as param_id, v.value, v.title, v.description


FROM device_param_value as v

INNER JOIN device_comm_param d1  ON v.param_id = d1.id

INNER JOIN device_command as c1 ON c1.id = d1.command_id


inner join device_command as c2 on c2.command = c1.command
inner join device_comm_param as d2 on d1.param = d2.param and d2.command_id= c2.id
#INNER JOIN device_command as c1 ON c1.id = d1.command_id and d1.



where d1.command_id = 968

order by c2.id, d1.id




