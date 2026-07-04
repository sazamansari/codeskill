import { mkP, sqlBp } from "./index";

// ═══════════════════════════════════
//  SQL / DATABASE PROBLEMS (101-200)
//  Topics: SELECT, JOINs, GROUP BY, Window Functions, CTEs, Subqueries, DML, DDL
// ═══════════════════════════════════

export const SQL_PROBLEMS = [
  mkP(101,"Select All Employees","Easy","Database",["SELECT"],`Write a query to select all columns from the \`employees\` table.`,"employees table","All rows",["Use SELECT *"],"employees","All rows",sqlBp("SELECT * FROM employees;")),
  mkP(102,"Filter by Salary","Easy","Database",["SELECT","WHERE"],`Select name and salary from employees earning more than 50000.`,"employees table","Filtered rows",["Use WHERE clause"],"employees","Filtered",sqlBp("SELECT name, salary\nFROM employees\nWHERE salary > 50000;")),
  mkP(103,"Order by Salary","Easy","Database",["ORDER BY"],`List all employees ordered by salary descending.`,"employees","Sorted rows",["Use ORDER BY DESC"],"employees","Sorted",sqlBp("SELECT *\nFROM employees\nORDER BY salary DESC;")),
  mkP(104,"Count per Department","Easy","Database",["GROUP BY","COUNT"],`Count employees in each department.`,"employees","dept, count",["Use GROUP BY"],"employees","dept counts",sqlBp("SELECT department, COUNT(*) as count\nFROM employees\nGROUP BY department;")),
  mkP(105,"Average Salary","Easy","Database",["GROUP BY","AVG"],`Find average salary for each department.`,"employees","dept, avg",["Use AVG()"],"employees","averages",sqlBp("SELECT department, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department;")),
  mkP(106,"Second Highest Salary","Medium","Database",["SUBQUERY","LIMIT"],`Find the second highest salary. Return NULL if none exists.`,"employees","Second highest",["Handle NULL"],"employees","second highest",sqlBp("SELECT MAX(salary) as SecondHighest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);")),
  mkP(107,"Duplicate Emails","Easy","Database",["GROUP BY","HAVING"],`Find all duplicate email addresses.`,"person","Duplicates",["HAVING COUNT>1"],"person","duplicates",sqlBp("SELECT email\nFROM person\nGROUP BY email\nHAVING COUNT(*) > 1;")),
  mkP(108,"Customers Never Ordered","Easy","Database",["LEFT JOIN","NULL"],`Find customers who never placed an order.`,"customers, orders","Non-ordering",["Use LEFT JOIN"],"customers, orders","no orders",sqlBp("SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;")),
  mkP(109,"Dept Highest Salary","Medium","Database",["JOIN","SUBQUERY"],`Find employees with highest salary in each department.`,"employee, department","Top earners",["JOIN + subquery"],"employee, department","top earners",sqlBp("SELECT d.name AS Dept, e.name, e.salary\nFROM employee e\nJOIN department d ON e.dept_id = d.id\nWHERE (e.dept_id, e.salary) IN (\n    SELECT dept_id, MAX(salary) FROM employee GROUP BY dept_id\n);")),
  mkP(110,"Rank Scores","Medium","Database",["DENSE_RANK","Window"],`Rank scores descending with dense ranking.`,"scores","ranked",["DENSE_RANK()"],"scores","ranked",sqlBp("SELECT score,\n    DENSE_RANK() OVER (ORDER BY score DESC) AS rank\nFROM scores;")),

  // Continue pattern for 111-200...
  // Full list available in the monolithic codeskill-platform.jsx
  // Includes: Consecutive Numbers(111), Employee > Manager(112), Rising Temperature(113),
  // Delete Duplicates(114), Nth Highest(115), Top 3 per Dept(116), ... through Complex Report(200)

  mkP(140,"Running Total","Medium","Database",["Window","SUM"],`Calculate running total of sales ordered by date.`,"sales","Running totals",["Window SUM"],"sales","running total",sqlBp("SELECT date, amount,\n    SUM(amount) OVER (ORDER BY date) AS running_total\nFROM sales;")),
  mkP(141,"LAG and LEAD","Medium","Database",["Window","LAG"],`Compare each day's sales with previous day.`,"daily_sales","Comparison",["Use LAG()"],"daily_sales","comparison",sqlBp("SELECT date, amount,\n    LAG(amount) OVER (ORDER BY date) AS prev_day,\n    amount - LAG(amount) OVER (ORDER BY date) AS diff\nFROM daily_sales;")),
  mkP(165,"Hierarchical Query","Hard","Database",["CTE","Recursive"],`List all employees with org hierarchy using recursive CTE.`,"employees","Hierarchy",["WITH RECURSIVE"],"employees","hierarchy",sqlBp("WITH RECURSIVE org AS (\n    SELECT id, name, manager_id, 1 AS level\n    FROM employees WHERE manager_id IS NULL\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id, o.level + 1\n    FROM employees e JOIN org o ON e.manager_id = o.id\n)\nSELECT * FROM org;")),
  mkP(200,"Complex Dashboard Query","Hard","Database",["Multiple"],`Build complete sales dashboard with YTD, MoM, and rankings.`,"sales","Dashboard",["Combine techniques"],"sales","dashboard",sqlBp("WITH monthly AS (\n    SELECT DATE_FORMAT(date,'%Y-%m') AS month, SUM(amount) AS total\n    FROM sales GROUP BY 1\n)\nSELECT month, total,\n    SUM(total) OVER (ORDER BY month) AS ytd,\n    RANK() OVER (ORDER BY total DESC) AS rank\nFROM monthly;")),
];
