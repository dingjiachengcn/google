CREATE TABLE t0(c0);
SELECT (SELECT 1 WHERE c0 GROUP BY 1 HAVING FALSE)  FROM t0 GROUP BY 1;