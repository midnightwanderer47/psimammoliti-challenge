-- ¿Qué temática es más consultada?
-- Query to find the most consulted topics/specialties

SELECT 
    s.name as tematica,
    COUNT(ses.id) as total_sesiones,
    ROUND(
        (COUNT(ses.id) * 100.0 / (SELECT COUNT(*) FROM sessions)), 
        1
    ) as porcentaje
FROM specialties s
JOIN sessions ses ON s.id = ses.specialty_id
WHERE ses.status = 'completed'
GROUP BY s.id, s.name
ORDER BY total_sesiones DESC;

-- Alternative query with more details
SELECT 
    s.name as tematica,
    s.description as descripcion,
    COUNT(ses.id) as total_sesiones,
    ROUND(AVG(ses.price), 2) as precio_promedio,
    ROUND(
        (COUNT(ses.id) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed')), 
        1
    ) as porcentaje_del_total,
    COUNT(DISTINCT ses.psychologist_id) as psicologos_que_atienden,
    COUNT(DISTINCT ses.patient_id) as pacientes_unicos
FROM specialties s
JOIN sessions ses ON s.id = ses.specialty_id
WHERE ses.status = 'completed'
GROUP BY s.id, s.name, s.description
ORDER BY total_sesiones DESC;

-- Query to see monthly trends for top specialties
SELECT 
    s.name as tematica,
    DATE_TRUNC('month', ses.session_date) as mes,
    COUNT(ses.id) as sesiones_del_mes
FROM specialties s
JOIN sessions ses ON s.id = ses.specialty_id
WHERE ses.status = 'completed'
    AND s.name IN (
        SELECT s2.name 
        FROM specialties s2
        JOIN sessions ses2 ON s2.id = ses2.specialty_id
        WHERE ses2.status = 'completed'
        GROUP BY s2.name
        ORDER BY COUNT(ses2.id) DESC
        LIMIT 5
    )
GROUP BY s.name, DATE_TRUNC('month', ses.session_date)
ORDER BY s.name, mes;
