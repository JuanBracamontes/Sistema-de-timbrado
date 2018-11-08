import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {

  constructor() { }


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

  PagosQuery(rango1:string,rango2:string):string{
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
            AND ORCT.DocNum BETWEEN ${rango1} and ${rango2}
            AND ORCT.DocTotal>1 AND ORCT.Docdate between '08/28/2018' and GETDATE()
            GROUP BY ORCT.DocNum,ORCT.DocDate,OINV.CardName  
    `  ;
  }

  PagosQueryNoro(rango1:string,rango2:string):string{
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
            AND ORCT.DocNum BETWEEN ${rango1} and ${rango2}
            AND ORCT.DocTotal>1 AND ORCT.Docdate between '08/28/2018' and GETDATE()
            GROUP BY ORCT.DocNum,ORCT.DocDate,OINV.CardName  
    `  ;
  }

  PagosQueryTimbradoGrupal(cliente:string){
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

  PermisosQuery(usuario:string){
    return `SELECT * FROM Usuarios WHERE Nombre = '${usuario}'`;
  }

  InsertDetallePagosQuery(DocNum:string,UUID:String,Monto:any,Usuario:string,Sucursal:string) {
    Monto = Monto.replace(/,\s?/g, "");
    return `INSERT INTO Detalles_Pagos VALUES (GETDATE(),'${DocNum}','N','${UUID}',${Monto},'${Usuario}','${Sucursal}')`;
  }

  InsertDocumentosCancelados(DocNum:string,motivo:string,uuid:string,usuario:string,tipoDocumento:any){
    return `INSERT INTO DocumentosCancelados VALUES (${DocNum},'${motivo}',GETDATE(),'${uuid}','${usuario}','${tipoDocumento}')`;
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
      query = `UPDATE ${tabla} SET PRINTED = 'Y' WHERE DocNum ='${docnum}' AND DocSubType = 'DN'`;
    }else if(tabla == 'ORIN'){
      query = `UPDATE ${tabla} SET PRINTED = 'Y' WHERE DOCNUM = '${docnum}'`;
    }
    return query;
  }



}
