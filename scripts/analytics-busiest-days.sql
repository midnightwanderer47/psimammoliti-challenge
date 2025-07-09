-- ¿Qué día tiene más sesiones?

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
    COUNT(*) as total_sesiones,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as sesiones_completadas,
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as sesiones_programadas,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status IN ('completed', 'scheduled'))), 
        1
    ) as porcentaje
FROM sessions
WHERE status IN ('completed', 'scheduled')
GROUP BY EXTRACT(DOW FROM session_date)
ORDER BY total_sesiones DESC;
