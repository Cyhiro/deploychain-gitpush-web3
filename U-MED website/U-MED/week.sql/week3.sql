-- question 1.1
SELECT COUNT(*) AS total_admissions FROM admissions;
--question 1.2
SELECT AVG(datediff(discharge_date, admission_date)) AS average_length_of_stay FROM admissions, discharges ;

--question 2.1
SELECT primary_diagnosis, count(*) AS total_admissions FROM admissions GROUP BY primary_diagnosis;
--question 2.2
SELECT service,avg(datediff(discharge_date, admission_date)) AS average_length_of_stay FROM admissions, discharges GROUP BY service;
--question 2.3
SELECT discharge_disposition, count(*) AS discharge_count FROM discharges GROUP BY discharge_disposition;

--question 3.1
SELECT service, count() AS total_admissions FROM admissions GROUP BY service HAVING count() > 5;
--question 3.2
SELECT avg(datediff(discharge_date, admission_date)) AS average_length_of_stay FROM admissions, discharges WHERE primary_diagnosis = 'stroke';

--question 4.1
SELECT acuity, count(*) AS total_visits FROM ed_visits GROUP BY acuity;
--question 4.2
SELECT primary_diagnosis, service, count(*) AS total_admissions FROM admissions GROUP BY primary_diagnosis, service;

--question 5.1
SELECT date_format(admission_date, '%Y-%M') AS admission_month,count(*) AS total_admissions FROM admissions group by admission_month;
--question 5.2
SELECT primary_diagnosis, max(datediff(discharge_date, admission_date)) AS max_length_of_stay FROM admissions, discharges group by primary_diagnosis;

--bonus challenge
SELECT service, SUM(datediff(discharge_date, admission_date)) AS total_length_of_stay, avg(datediff(discharge_date, admission_date)) AS average_length_of_stay FROM admissions, discharges GROUP BY service ORDER BY average_length_of_stay DESC;