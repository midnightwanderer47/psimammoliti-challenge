-- ¿Qué día tiene más sesiones?
-- Query to find the busiest days of the week

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
    EXTRACT(DOW FROM session_date) as numero_dia,
    COUNT(*) as total_sesiones,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed')), 
        1
    ) as porcentaje,
    ROUND(AVG(price), 2) as precio_promedio
FROM sessions
WHERE status = 'completed'
GROUP BY EXTRACT(DOW FROM session_date)
ORDER BY total_sesiones DESC;

-- Query to see hourly distribution by day
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
    session_time as hora,
    COUNT(*) as sesiones,
    COUNT(DISTINCT psychologist_id) as psicologos_activos
FROM sessions
WHERE status = 'completed'
GROUP BY EXTRACT(DOW FROM session_date), session_time
ORDER BY EXTRACT(DOW FROM session_date), session_time;

-- Query to compare weekdays vs weekends
SELECT 
    CASE 
        WHEN EXTRACT(DOW FROM session_date) IN (0, 6) THEN 'Fin de semana'
        ELSE 'Días laborales'
    END as tipo_dia,
    COUNT(*) as total_sesiones,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed')), 
        1
    ) as porcentaje,
    ROUND(AVG(price), 2) as precio_promedio,
    COUNT(DISTINCT patient_id) as pacientes_unicos
FROM sessions
WHERE status = 'completed'
GROUP BY 
    CASE 
        WHEN EXTRACT(DOW FROM session_date) IN (0, 6) THEN 'Fin de semana'
        ELSE 'Días laborales'
    END
ORDER BY total_sesiones DESC;
