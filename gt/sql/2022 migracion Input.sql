INSERT INTO gt.unit_input (unit_id, number, type, input_id, mode)

(SELECT
u.id as unit_id,
x.pos,
1 as type,
i2.id as input_id,
1 as mode

FROM cota.vehiculo_inputs vi
INNER JOIN gt.index_aux as x
INNER JOIN gt.vehicle as v ON v.id2=vi.codvehiculo
INNER JOIN gt.unit as u ON u.vehicle_id = v.id
INNER JOIN gt.input as i2 ON i2.id2 = CASE x.pos
WHEN 1 THEN input_1
WHEN 2 THEN input_2
WHEN 3 THEN input_3
WHEN 4 THEN input_4
WHEN 5 THEN input_5
WHEN 6 THEN input_6
WHEN 7 THEN input_7
WHEN 8 THEN input_8
END

LEFT JOIN gt.unit_input as ui ON ui.unit_id = u.id AND ui.number = x.pos AND ui.type = 1
WHERE ui.unit_id IS NULL# AND input_id IS NOT NULL;

ORDER BY unit_id, pos
)
UNION
(SELECT
u.id as unit_id,
x.pos,
2 as type,
i2.id as input_id,
1 as mode

FROM cota.vehiculo_inputs vi
INNER JOIN gt.index_aux as x
INNER JOIN gt.vehicle as v ON v.id2=vi.codvehiculo
INNER JOIN gt.unit as u ON u.vehicle_id = v.id
INNER JOIN gt.input as i2 ON i2.id2 = CASE x.pos
WHEN 1 THEN output_1
WHEN 2 THEN output_2
WHEN 3 THEN output_3
WHEN 4 THEN output_4
WHEN 5 THEN output_5
WHEN 6 THEN output_6
WHEN 7 THEN output_7
WHEN 8 THEN output_8
END

LEFT JOIN gt.unit_input as ui ON ui.unit_id = u.id AND ui.number = x.pos AND ui.type = 2
WHERE ui.unit_id IS NULL# AND input_id IS NOT NULL;
ORDER BY unit_id, pos
)