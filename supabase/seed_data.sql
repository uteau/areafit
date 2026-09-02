-- ============================================================================
-- AreaFit - Datos de prueba
-- ============================================================================
-- Este script crea usuarios de prueba, grupos, eventos, rutinas y ejercicios.
--
-- Usuarios a crear: 2 entrenadores + 10 deportistas (5H, 5M)
-- Contraseña de prueba para TODOS los usuarios: Areafit123!
--
-- Sobra 1 admin que ya existe en tu base de datos.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USUARIOS (auth.users) + PROFILES
-- Generamos los UUIDs de forma determinista para poder referenciarlos
-- sin depender de RETURNING / variables psql (compatible con SQL editor).
-- ----------------------------------------------------------------------------
-- Usamos gen_random_uuid() no determinista: en su lugar, fijamos UUIDs
-- constantes para que los INSERTs en profiles referencien exactamente el
-- mismo auth.users.id.

-- --- ENTRENADORES ------------------------------------------------------------

insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
) values
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'entrenador.masculino@areafit.test',
  crypt('Areafit123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Carlos Ruiz"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'entrenador.femenino@areafit.test',
  crypt('Areafit123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Lucía Fernández"}',
  'authenticated', 'authenticated', now(), now()
);

-- --- DEPORTISTAS HOMBRES ------------------------------------------------------

insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
) values
(
  '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000',
  'deportista.h1@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Andrés Molina"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000',
  'deportista.h2@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Diego Castro"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000',
  'deportista.h3@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Mateo Vidal"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000',
  'deportista.h4@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Santiago Rojas"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000',
  'deportista.h5@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Emilio Navarro"}',
  'authenticated', 'authenticated', now(), now()
);

-- --- DEPORTISTAS MUJERES ------------------------------------------------------

insert into auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
) values
(
  '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000',
  'deportista.f1@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Valentina Pérez"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000',
  'deportista.f2@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Camila Torres"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000',
  'deportista.f3@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Mariana Soto"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000',
  'deportista.f4@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Daniela Reyes"}',
  'authenticated', 'authenticated', now(), now()
),
(
  '30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000',
  'deportista.f5@areafit.test', crypt('Areafit123!', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"full_name":"Paula Herrera"}',
  'authenticated', 'authenticated', now(), now()
);

-- ----------------------------------------------------------------------------
-- 2. PROFILES
-- ----------------------------------------------------------------------------
insert into public.profiles (id, full_name, role) values
  ('10000000-0000-0000-0000-000000000001', 'Carlos Ruiz',       'entrenador'),
  ('10000000-0000-0000-0000-000000000002', 'Lucía Fernández',   'entrenador'),
  ('20000000-0000-0000-0000-000000000001', 'Andrés Molina',     'deportista'),
  ('20000000-0000-0000-0000-000000000002', 'Diego Castro',      'deportista'),
  ('20000000-0000-0000-0000-000000000003', 'Mateo Vidal',       'deportista'),
  ('20000000-0000-0000-0000-000000000004', 'Santiago Rojas',    'deportista'),
  ('20000000-0000-0000-0000-000000000005', 'Emilio Navarro',    'deportista'),
  ('30000000-0000-0000-0000-000000000001', 'Valentina Pérez',   'deportista'),
  ('30000000-0000-0000-0000-000000000002', 'Camila Torres',     'deportista'),
  ('30000000-0000-0000-0000-000000000003', 'Mariana Soto',      'deportista'),
  ('30000000-0000-0000-0000-000000000004', 'Daniela Reyes',     'deportista'),
  ('30000000-0000-0000-0000-000000000005', 'Paula Herrera',     'deportista');

-- ----------------------------------------------------------------------------
-- 3. GRUPOS
-- ----------------------------------------------------------------------------
insert into public.player_groups (id, name, description, created_by) values
  (
    '40000000-0000-0000-0000-000000000001',
    'Masculino',
    'Grupo de entrenamiento masculino',
    '10000000-0000-0000-0000-000000000001'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Femenino',
    'Grupo de entrenamiento femenino',
    '10000000-0000-0000-0000-000000000002'
  );

-- ----------------------------------------------------------------------------
-- 4. MIEMBROS DE GRUPO (5 hombres en Masculino, 5 mujeres en Femenino)
-- ----------------------------------------------------------------------------
insert into public.player_group_members (group_id, player_id) values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003'),
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004'),
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000004'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000005');

-- ----------------------------------------------------------------------------
-- 5. EVENTOS
-- ----------------------------------------------------------------------------
insert into public.events (id, title, event_type, starts_at, location, description, created_by) values
  (
    '50000000-0000-0000-0000-000000000001',
    'Partido amistoso contra River',
    'partido',
    now() + interval '5 days',
    'Cancha Municipal',
    'Partido amistoso de preparación. Llegar 30 min antes.',
    '10000000-0000-0000-0000-000000000001'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'Entrenamiento de fuerza - Grupo Masculino',
    'entrenamiento',
    now() + interval '2 days',
    'Gimnasio Central',
    'Sesión de fuerza enfocada en tren inferior.',
    '10000000-0000-0000-0000-000000000001'
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'Entrenamiento táctico - Grupo Femenino',
    'entrenamiento',
    now() + interval '3 days',
    'Cancha 2',
    'Trabajo de posicionamiento y circulación de balón.',
    '10000000-0000-0000-0000-000000000002'
  ),
  (
    '50000000-0000-0000-0000-000000000004',
    'Fiesta de fin de temporada',
    'evento',
    now() + interval '30 days',
    'Salón de eventos Areafit',
    'Celebración de cierre de temporada con premiaciones.',
    '10000000-0000-0000-0000-000000000001'
  );

-- ----------------------------------------------------------------------------
-- 6. RUTINAS
--    - 1 asignada al grupo Masculino
--    - 1 asignada al grupo Femenino
--    - 5 asignadas a jugadores individuales
-- ----------------------------------------------------------------------------
insert into public.routines (id, title, description, created_by, assigned_to_player, assigned_to_group) values
  -- Rutina de grupo: Masculino
  (
    '60000000-0000-0000-0000-000000000001',
    'Pretemporada Grupo Masculino',
    'Rutina base de pretemporada para el grupo masculino: fuerza y resistencia.',
    '10000000-0000-0000-0000-000000000001',
    null,
    '40000000-0000-0000-0000-000000000001'
  ),
  -- Rutina de grupo: Femenino
  (
    '60000000-0000-0000-0000-000000000002',
    'Acondicionamiento Grupo Femenino',
    'Acondicionamiento físico general para el grupo femenino.',
    '10000000-0000-0000-0000-000000000002',
    null,
    '40000000-0000-0000-0000-000000000002'
  ),
  -- Rutina individual: Andrés Molina (H1)
  (
    '60000000-0000-0000-0000-000000000011',
    'Refuerzo de potencia para Andrés',
    'Trabajo individual de potencia de piernas y salto.',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    null
  ),
  -- Rutina individual: Diego Castro (H2)
  (
    '60000000-0000-0000-0000-000000000012',
    'Recuperación y movilidad para Diego',
    'Rutina de recuperación activa y movilidad articular.',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    null
  ),
  -- Rutina individual: Mateo Vidal (H3)
  (
    '60000000-0000-0000-0000-000000000013',
    'Core y estabilidad para Mateo',
    'Fortalecimiento del core y estabilidad del tronco.',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    null
  ),
  -- Rutina individual: Valentina Pérez (F1)
  (
    '60000000-0000-0000-0000-000000000014',
    'Velocidad y agilidad para Valentina',
    'Sprint, cambios de dirección y agilidad.',
    '10000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    null
  ),
  -- Rutina individual: Camila Torres (F2)
  (
    '60000000-0000-0000-0000-000000000015',
    'Fuerza superior para Camila',
    'Trabajo de fuerza de tren superior con foco en estabilidad de hombro.',
    '10000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    null
  );

-- ----------------------------------------------------------------------------
-- 7. EJERCICIOS
-- ----------------------------------------------------------------------------
insert into public.routine_exercises (routine_id, name, sets, reps, notes, position) values
  -- Pretemporada Grupo Masculino
  ('60000000-0000-0000-0000-000000000001', 'Sentadilla con peso',     4, '10-12', 'Controlar la bajada',                  1),
  ('60000000-0000-0000-0000-000000000001', 'Press de banca',          4, '8-10',  'Acompañado por spotter',                2),
  ('60000000-0000-0000-0000-000000000001', 'Zancadas con mancuernas', 3, '12',     'Alternar piernas',                      3),
  ('60000000-0000-0000-0000-000000000001', 'Plancha frontal',         3, '60 seg', 'Mantener alineación de cadera',        4),

  -- Acondicionamiento Grupo Femenino
  ('60000000-0000-0000-0000-000000000002', 'Burpees',                3, '15',     'Ritmo constante',                       1),
  ('60000000-0000-0000-0000-000000000002', 'Mountain climbers',      3, '30 seg', 'Caderas bajas',                         2),
  ('60000000-0000-0000-0000-000000000002', 'Sentadilla con salto',   3, '12',     'Aterrizar suave',                       3),
  ('60000000-0000-0000-0000-000000000002', 'Abdominales',            3, '20',     'Sin tirones en el cuello',              4),

  -- Refuerzo de potencia para Andrés
  ('60000000-0000-0000-0000-000000000011', 'Salto en cajón',         4, '8',      'Explosividad máxima',                   1),
  ('60000000-0000-0000-0000-000000000011', 'Peso muerto rumano',     4, '8-10',   'Espalda neutra',                        2),
  ('60000000-0000-0000-0000-000000000011', 'Empuje de cadera',       3, '10',     'Pico de contracción al final',          3),

  -- Recuperación y movilidad para Diego
  ('60000000-0000-0000-0000-000000000012', 'Roll de espuma Femoral', 2, '45 seg', 'Automasaje suave',                      1),
  ('60000000-0000-0000-0000-000000000012', 'Estiramiento isquios',   3, '30 seg', 'Sin rebote',                            2),
  ('60000000-0000-0000-0000-000000000012', 'Movilidad de cadera',    3, '10',     'Amplitud completa de movimiento',       3),

  -- Core y estabilidad para Mateo
  ('60000000-0000-0000-0000-000000000013', 'Plancha lateral',        3, '40 seg', 'Ambos lados',                           1),
  ('60000000-0000-0000-0000-000000000013', 'Russian twist',          3, '20',     'Control del torso',                     2),
  ('60000000-0000-0000-0000-000000000013', 'Elevación de piernas',   3, '12',     'Zona lumbar pegada al suelo',           3),

  -- Velocidad y agilidad para Valentina
  ('60000000-0000-0000-0000-000000000014', 'Sprint 30 m',            5, '1',      'Recuperación completa entre sprints',   1),
  ('60000000-0000-0000-0000-000000000014', 'Conos de agilidad',      4, '1',      'Cambios de dirección rápidos',          2),
  ('60000000-0000-0000-0000-000000000014', 'Skip alto',              3, '20 seg', 'Barbillas al frente',                   3),

  -- Fuerza superior para Camila
  ('60000000-0000-0000-0000-000000000015', 'Dominadas asistidas',    4, '6-8',    'Usar banda elástica',                   1),
  ('60000000-0000-0000-0000-000000000015', 'Remo con mancuerna',     4, '10',     'Aprieta escápula',                      2),
  ('60000000-0000-0000-0000-000000000015', 'Press militar',          3, '8-10',   'Core activo',                           3);

-- ============================================================================
-- Resumen / credenciales de prueba (para login)
-- ============================================================================
-- ENTRENADORES
--   entrenador.masculino@areafit.test / Areafit123!
--   entrenador.femenino@areafit.test / Areafit123!
--
-- DEPORTISTAS (HOMBRES) - Grupo Masculino
--   deportista.h1@areafit.test ... deportista.h5@areafit.test / Areafit123!
--
-- DEPORTISTAS (MUJERES) - Grupo Femenino
--   deportista.f1@areafit.test ... deportista.f5@areafit.test / Areafit123!
--
-- Contraseña compartida: Areafit123!
-- ============================================================================
