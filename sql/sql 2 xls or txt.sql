/*Allow process on*/
exec sp_configure 'show advanced options',1
reconfigure
exec sp_configure 'Ad Hoc Distributed Queries',1
reconfigure
EXEC master.dbo.sp_MSset_oledb_prop N'Microsoft.ACE.OLEDB.12.0', N'AllowInProcess', 1
EXEC master.dbo.sp_MSset_oledb_prop N'Microsoft.ACE.OLEDB.12.0', N'DynamicParameters', 1


 /*Data transport between SQL Server databases and excel spread sheets.*/
 /*XLSX --> DB*/
SELECT * INTO NewXls FROM OPENROWSET('MICROSOFT.JET.OLEDB.4.0' ,
'Excel 5.0;HDR=YES;DATABASE=G:\Ê¾Àý\XLS¸ñÊ½.xls',sheet1$)

SELECT * INTO ftr1 FROM OPENDATASOURCE('Microsoft.ACE.OLEDB.12.0',
 'Data Source=c:\zhouy\OPUS0906.xlsx;Extended Properties=Excel 12.0')...[Sheet1$]
/*DB --> XLSX*/
insert INTO OPENDATASOURCE('Microsoft.ACE.OLEDB.12.0',
 'Data Source=c:\zhouy\OPUS0911.xlsx;Extended Properties=Excel 12.0')...[Sheet1$] select * FROM ftr1
/*An error would occur with the abscence of same head rows in the taget file.*/
go

/*Data transport between SQL Server databases and text files.*/
SELECT * INTO text1 FROM     
OPENDATASOURCE('MICROSOFT.JET.OLEDB.4.0','Text;DATABASE=c:"')[data#txt] 

INSERT INTO OPENDATASOURCE('MICROSOFT.JET.OLEDB.4.0','Text;DATABASE=c:"')[data#txt] SELECT * FROM text1

 INSERT INTO OPENROWSET('MICROSOFT.JET.OLEDB.4.0','Text;DATABASE=c:"', [data#txt]) SELECT * FROM text1 
 
 /*NOTE that it uses a "#" in file name for ".", head rows must match.*/
 go
 
/*Allow process off*/
exec sp_configure 'Ad Hoc Distributed Queries',0
reconfigure
exec sp_configure 'show advanced options',0
reconfigure
