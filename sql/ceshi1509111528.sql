use master
create database ftr
go
use ftr 
alter table ftr1 add 
row3 varchar,
row4 varchar,
row5 varchar,
row6 varchar
go

exec sp_configure 'show advanced options',1
reconfigure
exec sp_configure 'Ad Hoc Distributed Queries',1
reconfigure
EXEC master.dbo.sp_MSset_oledb_prop N'Microsoft.ACE.OLEDB.12.0', N'AllowInProcess', 1
EXEC master.dbo.sp_MSset_oledb_prop N'Microsoft.ACE.OLEDB.12.0', N'DynamicParameters', 1


use ftr
SELECT * INTO ftr1 FROM OPENDATASOURCE('Microsoft.ACE.OLEDB.12.0',
 'Data Source=c:\zhouy\OPUS0906.xlsx;Extended Properties=Excel 12.0')...[Sheet1$]
 
 insert INTO OPENDATASOURCE('Microsoft.ACE.OLEDB.12.0',
 'Data Source=c:\zhouy\OPUS0911.xlsx;Extended Properties=Excel 12.0')...[Sheet1$] select * FROM ftr1
 
exec sp_configure 'Ad Hoc Distributed Queries',0
reconfigure
exec sp_configure 'show advanced options',0
reconfigure


