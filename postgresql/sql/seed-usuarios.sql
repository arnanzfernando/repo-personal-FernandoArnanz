INSERT INTO usuarios (nombre, email, password, roles) VALUES
  ('Ana Admin', 'ana.admin@example.com', 'changeme', '["ROLE_ADMIN"]'),
  ('Luis Usuario', 'luis.user@example.com', 'changeme', '["ROLE_USER"]'),
  ('María Lider', 'maria.user@example.com', 'changeme', '["ROLE_USER","ROLE_MANAGER"]');

INSERT INTO tareas (titulo, descripcion, estado, fecha_limite, usuario_id) VALUES
('Preparar presentación', 'Revisar diapositivas y ejemplos', 'en_progreso', CURRENT_DATE + INTERVAL '2 days', 2),
('Revisar pull requests', 'Validar MR pendientes del sprint', 'pendiente', CURRENT_DATE + INTERVAL '1 day', 1),
('Planificar roadmap', 'Definir objetivos del próximo mes', 'pendiente', NULL, 3),
('Actualizar documentación', 'Sincronizar README y notas', 'completada', CURRENT_DATE - INTERVAL '1 day', 2);