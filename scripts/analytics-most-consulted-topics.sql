-- ¿Qué temática es más consultada?

SELECT 
    s.name as tematica,
    COUNT(ses.id) as total_sesiones,
    ROUND(
        (COUNT(ses.id) * 100.0 / (
            SELECT COUNT(*) 
            FROM sessions 
            WHERE status IN ('completed', 'scheduled')
        )), 2
    ) as porcentaje
FROM specialties s
JOIN sessions ses ON s.id = ses.specialty_id
WHERE ses.status IN ('completed', 'scheduled')
GROUP BY s.id, s.name
ORDER BY total_sesiones DESC;
