-- Función para obtener las temáticas más consultadas
CREATE OR REPLACE FUNCTION get_most_consulted_topics()
RETURNS TABLE(tematica TEXT, total_sesiones BIGINT, porcentaje NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name::TEXT as tematica,
        COUNT(ses.id) as total_sesiones,
        ROUND(COUNT(ses.id) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed'), 2) as porcentaje
    FROM specialties s
    JOIN sessions ses ON s.id = ses.specialty_id
    WHERE ses.status = 'completed'
    GROUP BY s.id, s.name
    ORDER BY total_sesiones DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener los días más ocupados
CREATE OR REPLACE FUNCTION get_busiest_days()
RETURNS TABLE(dia_semana TEXT, total_sesiones BIGINT, porcentaje NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE EXTRACT(DOW FROM session_date)
            WHEN 0 THEN 'Domingo'
            WHEN 1 THEN 'Lunes'
            WHEN 2 THEN 'Martes'
            WHEN 3 THEN 'Miércoles'
            WHEN 4 THEN 'Jueves'
            WHEN 5 THEN 'Viernes'
            WHEN 6 THEN 'Sábado'
        END::TEXT as dia_semana,
        COUNT(*)::BIGINT as total_sesiones,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed'), 2) as porcentaje
    FROM sessions
    WHERE status = 'completed'
    GROUP BY EXTRACT(DOW FROM session_date)
    ORDER BY total_sesiones DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener las modalidades más populares
CREATE OR REPLACE FUNCTION get_popular_modalities()
RETURNS TABLE(modalidad TEXT, total_sesiones BIGINT, porcentaje NUMERIC, precio_promedio NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        modality::TEXT as modalidad,
        COUNT(*)::BIGINT as total_sesiones,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions WHERE status = 'completed'), 2) as porcentaje,
        ROUND(AVG(price), 2) as precio_promedio
    FROM sessions
    WHERE status = 'completed'
    GROUP BY modality
    ORDER BY total_sesiones DESC;
END;
$$ LANGUAGE plpgsql;
