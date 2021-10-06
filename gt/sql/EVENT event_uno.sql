DELIMITER $$
CREATE EVENT task_uno
    ON SCHEDULE
      EVERY 1 MINUTE
    COMMENT 'Clears out sessions table each hour.'
    DO
      begin
      
      
		insert into task (name, value) values('x','y');
      
      end $$
      
      
DELIMITER ;