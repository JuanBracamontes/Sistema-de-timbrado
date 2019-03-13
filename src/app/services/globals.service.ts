import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {

  constructor() { }

  checkuserLogged(){
    let usrLogged = sessionStorage.getItem('Nombre');
    if(!usrLogged){
        return false;
    }else{
      return true;
    }
  }

  validar_campos(campo:any){
    if(campo == '' || campo == null){
      return true;
    }
  }

  validarArreglo(array:any){
    if(array != null || array.length > 0){
      return true;
    }
  }

  convertDocnums(folios){

    let cadena = "";
    let folio = "";
    for(let i=0; i< folios.length;i++){
      if(i +1 == folios.length){
        folio = "'"+ folios[i].folio+"'";
      }else{
        folio = "'"+ folios[i].folio+"'"+",";
      }
      cadena += folio;
    }
    return cadena;
  }

  FacturasQuery(rango1:string,rango2:string):string{
    return `SELECT 
            DocNum AS Folio,
            CONVERT(CHAR,DocDate,103) as Fecha,
            CardName AS NombreCliente,
            CONVERT (VARCHAR,CAST(DocTotal AS MONEY),1) AS Total
            FROM OINV
            WHERE Printed = 'Y'
            AND DocNum BETWEEN '${rango1}' AND '${rango2}'
            AND CANCELED = 'N'
            AND DocSubType <> 'DN'
            AND DocDate BETWEEN '03/01/2019' AND GETDATE()`
  }

  FacturasQueryNoro(rango1:string,rango2:string){
    return `SELECT 
            DocNum AS Folio,
            CardName AS NombreCliente,
            CONVERT(CHAR,DocDate,103) AS Fecha,
            CASE 
              WHEN OINV.DocCur = 'MXP' THEN
              CONVERT (VARCHAR,CAST(DocTotal AS MONEY),1) 
              WHEN OINV.DocCur = 'USD' THEN 
              CONVERT (VARCHAR,CAST(DocTotalFC AS MONEY),1)
            END AS Total
            FROM OINV
            WHERE Printed = 'Y'
            AND DocNum BETWEEN '${rango1}' AND '${rango2}'
            AND CANCELED = 'N'
            AND DocSubType <> 'DN'
            AND DocDate BETWEEN '12/01/2018' AND GETDATE()
            ORDER BY Folio DESC`
  }

  PagosQuery(rango1:string,rango2:string):string{
    return `
            SELECT
            ORCT.DocNum                       as 'Folio',         --docnum del pago
            CONVERT(char,ORCT.DocDate,103)    as 'Fecha',         --fecha del pago
            OINV.CardName                     as 'NombreCliente',     --Nombre del cliente en la factura
            CONVERT(VARCHAR, CAST(SUM(RCT2.SumApplied) AS money), 1)as 'Total'
            FROM ORCT
            INNER JOIN RCT2 ON RCT2.DocNum   = ORCT.DocNum
            INNER JOIN OINV ON OINV.DocEntry = RCT2.DocEntry
            INNER JOIN OCRD ON OCRD.CardCode = OINV.CardCode
            WHERE
            ORCT.Canceled = 'N'     AND
            RCT2.InvType = 13       AND
            --OINV.DocSubType <> 'DN' AND
            (ORCT.U_Timbrado IS NULL OR ORCT.U_Timbrado <> 'Y')
            AND RCT2.SumApplied > 1
            AND ORCT.DocNum BETWEEN ${rango1} and ${rango2}
            AND ORCT.DocTotal>1 AND ORCT.Docdate between '08/28/2018' and GETDATE()
            GROUP BY ORCT.DocNum,ORCT.DocDate,OINV.CardName  
    `  ;
  }

  PagosQueryNoro(rango1:string,rango2:string):string{
    return `
          SELECT
          ORCT.DocNum                       as 'Folio',         --docnum del pago
          CONVERT(char,ORCT.DocDate,103)    as 'Fecha',         --fecha del pago
          OINV.CardName                     as 'NombreCliente',     --Nombre del cliente en la factura
          CASE 
            WHEN OINV.DocCur = 'MXP' THEN 
            CONVERT(VARCHAR, CAST(SUM(RCT2.SumApplied) AS money), 1)
            WHEN OINV.DocCur <> 'MXP' THEN
            CONVERT(VARCHAR, CAST(SUM(RCT2.AppliedFC) AS money), 1)
          END as 'Total'
          FROM ORCT
          INNER JOIN RCT2 ON RCT2.DocNum   = ORCT.DocNum
          INNER JOIN OINV ON OINV.DocEntry = RCT2.DocEntry
          INNER JOIN OCRD ON OCRD.CardCode = OINV.CardCode
          WHERE
          ORCT.Canceled = 'N'     AND
          RCT2.InvType = 13       AND
          --OINV.DocSubType <> 'DN' AND
          (ORCT.U_Timbrado IS NULL OR ORCT.U_Timbrado <> 'Y')
          AND RCT2.SumApplied > 1
          AND ORCT.DocNum BETWEEN '${rango1}' and '${rango2}'
          AND ORCT.DocTotal>1 AND ORCT.Docdate between '08/28/2018' and GETDATE()
          GROUP BY ORCT.DocNum,ORCT.DocDate,OINV.CardName,OINV.DocCur
    `  ;
  }

  PagosQueryTimbradoGrupal(cliente:string){
    if(cliente.indexOf(' ') >= 0){
      let cliente2 = cliente.replace(/\s/g, "");
      return `
            SELECT
            ORCT.DocNum                       as 'NumPago',         --docnum del pago
            CONVERT(char,ORCT.DocDate,103)    as 'FechaPago',         --fecha del pago
            OINV.CardName                     as 'NombreCliente',     --Nombre del cliente en la factura
            CONVERT(VARCHAR, CAST(SUM(RCT2.SumApplied) AS money), 1)as 'Total'
            FROM ORCT
            INNER JOIN RCT2 ON RCT2.DocNum   = ORCT.DocNum
            INNER JOIN OINV ON OINV.DocEntry = RCT2.DocEntry
            INNER JOIN OCRD ON OCRD.CardCode = OINV.CardCode
            WHERE
            ORCT.Canceled = 'N'     AND
            RCT2.InvType = 13       AND
            OINV.DocSubType <> 'DN' AND
            (ORCT.U_Timbrado IS NULL OR ORCT.U_Timbrado <> 'Y')
            AND RCT2.SumApplied > 1
            AND OCRD.LicTradNum IN ('${cliente}','${cliente2}')
            AND ORCT.DocTotal>1 AND ORCT.Docdate between '08/28/2018' and GETDATE()
            GROUP BY ORCT.DocNum,ORCT.DocDate,OINV.CardName  
      `
    }else{
      return `
            SELECT
            ORCT.DocNum                       as 'NumPago',         --docnum del pago
            CONVERT(char,ORCT.DocDate,103)    as 'FechaPago',         --fecha del pago
            OINV.CardName                     as 'NombreCliente',     --Nombre del cliente en la factura
            CONVERT(VARCHAR, CAST(SUM(RCT2.SumApplied) AS money), 1)as 'Total'
            FROM ORCT
            INNER JOIN RCT2 ON RCT2.DocNum   = ORCT.DocNum
            INNER JOIN OINV ON OINV.DocEntry = RCT2.DocEntry
            INNER JOIN OCRD ON OCRD.CardCode = OINV.CardCode
            WHERE
            ORCT.Canceled = 'N'     AND
            RCT2.InvType = 13       AND
            OINV.DocSubType <> 'DN' AND
            (ORCT.U_Timbrado IS NULL OR ORCT.U_Timbrado <> 'Y')
            AND RCT2.SumApplied > 1
            AND OCRD.LicTradNum = '${cliente}'
            AND ORCT.DocTotal>1 AND ORCT.Docdate between '08/28/2018' and GETDATE()
            GROUP BY ORCT.DocNum,ORCT.DocDate,OINV.CardName  
      `
    }

  }

  formatearMonto(Monto:any){
    Monto = Monto.replace(/,\s?/g, "");
    return Monto;
  }

  PermisosQuery(usuario:string){
    return `SELECT * FROM Usuarios WHERE Nombre = '${usuario}'`;
  }

  InsertDetallePagosQuery(DocNum:string,UUID:string,Monto:any,Usuario:string,Sucursal:string) {
    Monto = this.formatearMonto(Monto);
    return `INSERT INTO Detalles_Pagos VALUES (GETDATE(),'${DocNum}','N','${UUID}',${Monto},'${Usuario}','${Sucursal}')`;
  }

  InsertDetalleNCredito(DocNum:string,UUID:string,Monto:any,Usuario:string){
    Monto = this.formatearMonto(Monto);
    return `INSERT INTO Detalles_NCredito VALUES('${DocNum}','${UUID}','${Monto}','${Usuario}','N')`;
  }

  InsertDetalleNCargo(DocNum:string,UUID:string,Monto:any,Usuario:string){
    Monto = this.formatearMonto(Monto);
    return `INSERT INTO Detalles_NCargo VALUES('${DocNum}','${UUID}','${Monto}','${Usuario}','N');`;
  }

  InsertDetalleFacturasQuery(DocNum:string,UUID:string,Monto:any,Usuario:string){
    Monto = this.formatearMonto(Monto);
    return `INSERT INTO Detalles_Facturas VALUES (${DocNum},GETDATE(),'${Monto}','${UUID}','${Usuario}')`
  }

  InsertDocumentosCancelados(DocNum:string,motivo:string,uuid:string,usuario:string,tipoDocumento:any){
    return `INSERT INTO DocumentosCancelados VALUES (${DocNum},'${motivo}',GETDATE(),'${uuid}','${usuario}','${tipoDocumento}','N')`;
  }

  CancelarDocumentosQuery(documento:any,tabla:any,folio:any){
    if(documento == 'Factura' || documento == 'NCredito'){
      return `
          SELECT 
          DocNum as Folio,
          Printed AS Impreso, 
          CardName as Cliente, 
          CONVERT(VARCHAR, CAST(DocTotal AS money), 1)as Total,
          U_UUID as UUID 
          FROM ${tabla} 
          WHERE DocNum = '${folio}' 
          AND U_UUID <> 'NULL'
      `
    }else if(documento == 'NCargo'){
      return `
          SELECT 
          DocNum as Folio,
          Printed AS Impreso, 
          CardName as Cliente,  
          CONVERT(VARCHAR, CAST(DocTotal AS money), 1)as Total,
          U_UUID as UUID 
          FROM ${tabla} 
          WHERE DocNum = '${folio}' 
          AND DocSubType = 'DN'
          AND U_UUID <> 'NULL'
      `
    }else if(documento == 'Pago'){
      return `
            SELECT 
            DocNum as Folio,
            Printed AS Impreso, 
            CardName as Cliente,  
            CONVERT(VARCHAR, CAST(DocTotal AS money), 1)as Total,
            U_UUID as UUID 
            FROM ${tabla} 
            WHERE DocNum = '${folio}' 
            AND U_UUID <> 'NULL'
      `
    }
  }

  UpdatePrintedQuery(docnum:any,tabla:string){
    let query:string;
    if(tabla == 'OINV'){
      query = `UPDATE OINV SET PRINTED = 'Y' WHERE DocNum ='${docnum}' AND DocSubType = 'DN'`;
    }else if(tabla == 'ORIN'){
      query = `UPDATE ORIN SET PRINTED = 'Y' WHERE DOCNUM = '${docnum}'`;
    }
    return query;
  }

  obtenerCancelacionesPendientes(){
    return `SELECT * FROM DocumentosCancelados WHERE EnProceso = 'S'`;
  }

  actualizarCampoEnProceso(folio:any,motivo:string){
    return `UPDATE DocumentosCancelados SET EnProceso = 'N' WHERE Folio = '${folio}' and Motivo = '${motivo}'`;
  }

  ObtenerNotasCreditoQuery(rango1:string,rango2){
    return `SELECT 
            DocNum AS Folio,
            CONVERT(CHAR,DocDate,103) AS Fecha,
            CardName AS NombreCliente,
            CONVERT(VARCHAR,CAST(DocTotal AS MONEY),1)AS Total
            FROM ORIN
            WHERE CANCELED = 'N'
            AND PRINTED = 'Y'
            AND DocNum BETWEEN '${rango1}' AND '${rango2}'
            AND DocDate BETWEEN '03/01/2019' AND GETDATE()`
  }

  ObtenerNotasCreditoQueryNoro(rango1:string,rango2:string){
    return `SELECT 
            DocNum AS Folio,
            CONVERT(CHAR,DocDate,103) AS Fecha,
            CardName AS NombreCliente,
            CASE 
              WHEN ORIN.DocCur = 'MXP' THEN 
              CONVERT(VARCHAR,CAST(DocTotal AS MONEY),1)
              WHEN ORIN.DocCur <> 'MXP' THEN
              CONVERT(VARCHAR,CAST(DocTotalFC AS MONEY),1)
            END AS Total
            FROM ORIN
            WHERE CANCELED = 'N'  
            AND PRINTED = 'Y'
            AND DocNum BETWEEN '${rango1}' AND '${rango2}'
            AND DocDate BETWEEN '03/01/2019' AND GETDATE()`
  }

  ObtenerNotasCargoQuery(rango1:string,rango2:string){
    return `SELECT 
            DocNum AS Folio,
            CONVERT(CHAR,DocDate,103) AS Fecha,
            CardName AS NombreCliente,
            CONVERT(VARCHAR,CAST(DocTotal AS MONEY),1) AS Total
            FROM OINV
            WHERE CANCELED = 'N'
            AND PRINTED = 'Y'
            AND DocSubType = 'DN'
            AND DocNum BETWEEN '${rango1}' AND '${rango2}'
            AND DocDate BETWEEN '01/01/2019' AND GETDATE()`
  }

  ObtenerNotasCargoQueryNoro(rango1:string,rango2:string){
    return `SELECT 
            DocNum AS Folio,
            CONVERT(CHAR,DocDate,103) AS Fecha,
            CardName AS NombreCliente,
            CASE 
              WHEN OINV.DocCur = 'MXP' THEN 
              CONVERT(VARCHAR,CAST(DocTotal AS MONEY),1)
              WHEN OINV.DocCur <> 'MXP' THEN
              CONVERT(VARCHAR,CAST(DocTotalFC AS MONEY),1)
            END AS Total
            FROM OINV
            WHERE CANCELED = 'N'
            AND PRINTED = 'N'
            AND DocSubType = 'DN'
            AND DocNum BETWEEN '${rango1}' AND '${rango2}'
            AND DocDate BETWEEN '01/01/2018' AND GETDATE()`
  }

}




