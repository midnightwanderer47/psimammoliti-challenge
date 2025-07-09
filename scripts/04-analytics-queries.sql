-- Consulta: ¿Qué temática es más consultada?
SELECT 
    s.name as tematica,
    COUNT(ses.id) as total_sesiones,
    ROUND(COUNT(ses.id) * 100.0 / (SELECT COUNT(*) FROM sessions), 2) as porcentaje
FROM specialties s
JOIN sessions ses ON s.id = ses.specialty_id
WHERE ses.status = 'completed'
GROUP BY s.id, s.name
ORDER BY total_sesiones DESC;

-- Consulta: ¿Qué día tiene más sesiones?
SELECT 
    CASE EXTRACT(DOW FROM session_date)
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
    END as dia_semana,
    COUNT(*) as total_sesiones,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed'), 2) as porcentaje
FROM sessions
WHERE status = 'completed'
GROUP BY EXTRACT(DOW FROM session_date)
ORDER BY total_sesiones DESC;

-- Consulta: ¿Qué modalidad es más usada?
SELECT 
    modality as modalidad,
    COUNT(*) as total_sesiones,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed'), 2) as porcentaje,
    ROUND(AVG(price), 2) as precio_promedio
FROM sessions
WHERE status = 'completed'
GROUP BY modality
ORDER BY total_sesiones DESC;

-- Consulta adicional: Análisis por psicólogo
SELECT 
    p.name as psicologo,
    COUNT(s.id) as total_sesiones,
    ROUND(AVG(s.price), 2) as precio_promedio,
    ROUND(AVG(p.rating), 2) as rating_promedio
FROM psychologists p
JOIN sessions s ON p.id = s.psychologist_id
WHERE s.status = 'completed'
GROUP BY p.id, p.name
ORDER BY total_sesiones DESC;

-- Consulta adicional: Tendencias por mes
SELECT 
    TO_CHAR(session_date, 'YYYY-MM') as mes,
    COUNT(*) as total_sesiones,
    COUNT(DISTINCT patient_id) as pacientes_unicos,
    ROUND(SUM(price), 2) as ingresos_totales
FROM sessions
WHERE status = 'completed'
GROUP BY TO_CHAR(session_date, 'YYYY-MM')
ORDER BY mes DESC;
