create table projects(id char(36), name varchar(50));
create table sessions(id serial, projectId char(36), startTime char(24), endTime char(24));