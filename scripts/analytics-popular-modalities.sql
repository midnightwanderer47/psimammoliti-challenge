-- ¿Qué modalidad es más usada?
-- Query to find the most popular session modalities

SELECT 
    modality as modalidad,
    COUNT(*) as total_sesiones,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed')), 
        1
    ) as porcentaje,
    ROUND(AVG(price), 2) as precio_promedio,
    ROUND(MIN(price), 2) as precio_minimo,
    ROUND(MAX(price), 2) as precio_maximo,
    COUNT(DISTINCT patient_id) as pacientes_unicos,
    COUNT(DISTINCT psychologist_id) as psicologos_que_ofrecen
FROM sessions
WHERE status = 'completed'
GROUP BY modality
ORDER BY total_sesiones DESC;

-- Query to see modality preferences by specialty
SELECT 
    s.name as especialidad,
    ses.modality as modalidad,
    COUNT(*) as sesiones,
    ROUND(AVG(ses.price), 2) as precio_promedio
FROM sessions ses
JOIN specialties s ON ses.specialty_id = s.id
WHERE ses.status = 'completed'
GROUP BY s.name, ses.modality
ORDER BY s.name, sesiones DESC;

-- Query to analyze modality trends over time
SELECT 
    DATE_TRUNC('month', session_date) as mes,
    modality as modalidad,
    COUNT(*) as sesiones_del_mes,
    ROUND(AVG(price), 2) as precio_promedio_mes
FROM sessions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', session_date), modality
ORDER BY mes, sesiones_del_mes DESC;

-- Query to see modality distribution by day of week
SELECT 
    CASE 
        WHEN EXTRACT(DOW FROM session_date) = 0 THEN 'Domingo'
        WHEN EXTRACT(DOW FROM session_date) = 1 THEN 'Lunes'
        WHEN EXTRACT(DOW FROM session_date) = 2 THEN 'Martes'
        WHEN EXTRACT(DOW FROM session_date) = 3 THEN 'Miércoles'
        WHEN EXTRACT(DOW FROM session_date) = 4 THEN 'Jueves'
        WHEN EXTRACT(DOW FROM session_date) = 5 THEN 'Viernes'
        WHEN EXTRACT(DOW FROM session_date) = 6 THEN 'Sábado'
    END as dia_semana,
    modality as modalidad,
    COUNT(*) as sesiones,
    ROUND(
        (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY EXTRACT(DOW FROM session_date))), 
        1
    ) as porcentaje_del_dia
FROM sessions
WHERE status = 'completed'
GROUP BY EXTRACT(DOW FROM session_date), modality
ORDER BY EXTRACT(DOW FROM session_date), sesiones DESC;
