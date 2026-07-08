DELETE FROM horarios;
DELETE FROM busquedas_recientes;
DELETE FROM rutas;
DELETE FROM estaciones;

INSERT INTO estaciones (nombre, latitud, longitud, descripcion) VALUES
('Tecnologico', 4.6426, -74.0833, 'Parada cercana a Universidad'),
('Centro', 4.7110, -74.0721, 'Centro comercial principal'),
('Nororiental', 4.6500, -74.0500, 'Zona nororiental de la ciudad'),
('Sur', 4.6200, -74.0800, 'Zona sur, cerca del terminal'),
('Occidente', 4.6800, -74.1200, 'Zona occidental');

INSERT INTO rutas (nombre, descripcion, tipo) VALUES
('Troncal 1', 'Centro - Suroeste', 'Troncal'),
('Troncal 2', 'Centro - Nororiental', 'Troncal'),
('Troncal 3', 'Centro - Occidente', 'Troncal'),
('Alimentador 5', 'Periferia - Estacion Troncal', 'Alimentador'),
('Alimentador 10', 'Zona rural - Centro', 'Alimentador');

INSERT INTO horarios (estacion_id, ruta_id, hora, dia_semana) VALUES
(1, 1, '06:00', 0),
(1, 1, '06:30', 0),
(1, 1, '07:00', 0),
(1, 1, '07:30', 0),
(1, 2, '06:15', 0),
(1, 2, '06:45', 0),
(1, 2, '07:15', 0),
(1, 3, '06:45', 0),
(1, 3, '07:15', 0),
(2, 1, '06:10', 0),
(2, 1, '06:40', 0),
(2, 1, '07:10', 0),
(2, 2, '06:25', 0),
(2, 2, '06:55', 0),
(2, 2, '07:25', 0),
(3, 2, '06:30', 0),
(3, 2, '07:00', 0),
(3, 2, '07:30', 0),
(3, 4, '07:00', 0),
(3, 4, '07:30', 0),
(4, 1, '06:20', 0),
(4, 1, '06:50', 0),
(4, 1, '07:20', 0),
(4, 5, '06:30', 0),
(4, 5, '07:00', 0),
(5, 3, '07:00', 0),
(5, 3, '07:30', 0),
(5, 5, '07:30', 0);
