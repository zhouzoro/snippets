-- PO|C
-- P = partitioning - custid
-- O = Ordering     - orderdate desc, orderid desc
-- C = Coverage     - empid

create index idx_poc on Sales.Orders(custid, orderdate desc, orderid desc) include(empid);


-- low density:
-- 101000,000 custs x 10 orders
--seek per cust - 3000,000 random reads
--scan          - 30,000   sequential reads
with c as
(
  select custid, orderid, orderdate, empid,
    ROW_NUMBER() over (partition by custid order by orderdate desc, orderid desc) as rownum
  from Sales.Orders
)
select custid, orderid, orderdate, empid
from c
where rownum <= 4;


-- high density:
-- 10 custs x 1000,000 orders
--seek per cust - 30 random reads
--scan          - 30,000   sequential reads

select c.custid, c.companyname, a.*
from Sales.Customers as c
  cross apply ( select top (3) orderid, orderdate, empid
                from Sales.Orders as o
                where o.custid = c.custid
                order by orderdate desc, orderid desc ) as a
  
  

select *
from sales.Orders
where orderdate = ;

declare @dt as datetime = sysdatetime();
go

create function dbo.endofyear (@dt as datetime) returns datetime
as 
begin
  return DATEADD(year, DATEDIFF(year, '18991231', @dt),'18991231');

end;
go
select DATEADD(year, DATEDIFF(year, '18991231', @dt),'18991231');
