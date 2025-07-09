-- ¿Qué modalidad es más usada?

SELECT 
    modality as modalidad,
    COUNT(*) as total_sesiones,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status IN ('completed', 'scheduled'))), 
        1
    ) as porcentaje
FROM sessions
WHERE status IN ('completed', 'scheduled')
GROUP BY modality
ORDER BY total_sesiones DESC;
