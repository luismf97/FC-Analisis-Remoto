
import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';
import MySQL from '../classes/mySql';
import axios from 'axios';
import { WA_NUMBER, WA_TOKEN, WA_VERYF } from '../global/environment';

const router = Router();
const mySql = new MySQL();

//Variables necesarias para usar la API de whatsapp
const token = WA_TOKEN;
const tokenVerify = WA_VERYF;
const idNumber = WA_NUMBER

/* Control de accesos por websockets */

// Servicio para obtener todos los IDs de los conectados por websockets
router.get('/usuarios', (  req: Request, res: Response ) => {
    const server = Server.instance;
    server.io.clients( ( err: any, clientes: string[] ) => {
        if ( err ) {
            return res.json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            clientes
        });
    });
});

router.get('/getUsuarios', ( req: Request, res: Response  ) => {

    const query = `SELECT U.Id, U.Name, U.Correo, U.Telefono, R.Rol
    FROM u507429014_esp.Usuarios AS U
    INNER JOIN u507429014_esp.Roles AS R
    ON U.Rol  = R.Id
    WHERE U.Activo = TRUE;`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
});

// Obtener usuarios por websockets
router.get('/usuarios/detalle', (  req: Request, res: Response ) => {
    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()[0]
    });  
});

/* Funciones para registro y consulta de pacientes */

//consultar Generos
router.get('/getGeneros', ( req: Request, res: Response  ) => {

    const query = `SELECT Id, Genero
    FROM u507429014_esp.Generos
    WHERE Activo = TRUE;`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
});

// registro de nuevos pacientes
router.post('/registrarPaciente', ( req: Request, res: Response  ) => {
    
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const genero = req.body.genero;
    const fecha = req.body.fecha;
    const telefono = req.body.telefono;

    const query = `
    SELECT Id
    FROM u507429014_esp.Pacientes
    WHERE Correo = '${correo}';`;

    const insert = `
    INSERT INTO u507429014_esp.Pacientes
    (Nombre, Nacimiento, Genero, Correo, Telefono, Activo)
    VALUES('${nombre}', '${fecha}', ${genero}, '${correo}', '${telefono}', TRUE);
    `

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            });
        }else{
            if(rows.length == 0){
                mySql.pool.query(insert, function(err:any, rows:any, fields:any){
                    if(err){
                        res.status(400).json({
                            ok: false,
                            err: {err}
                        });
                    }else {
                        res.json({
                            ok:true,
                            mensaje: "Paciente Registrado",
                        });
                    }
                })
            }
            else {
                res.json({
                    ok:true,
                    mensaje: "Ya se habia registrado el paciente"
                });
            }
        }
    })
});

// Consulta de pacientes
router.get('/pacientes', ( req: Request, res: Response  ) => {

    const query = `SELECT P.Id, P.Nombre, P.Nacimiento, G.Genero, P.Correo, P.Telefono
    FROM u507429014_esp.Pacientes AS P
    INNER JOIN u507429014_esp.Generos AS G
    ON P.Genero  = G.Id
    WHERE P.Activo = TRUE;`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
});




router.post('/guardarEcg', ( req: Request, res: Response  ) => {

    const paciente    = req.body.paciente;
    const medico    = req.body.medico;
    const datos    = req.body.datos;

    const insert = `
    INSERT INTO u507429014_esp.ECG
    (Usuario, Paciente, FechaRegistro, Datos, Activo) 
    VALUES ('${medico}', '${paciente}', NOW(), '${datos}', true)
    `;

    mySql.pool.query( insert , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                mensaje: "Data guardada"
            });
        }
    })
});

router.post('/guardarRegistro', ( req: Request, res: Response  ) => {

    const paciente    = req.body.paciente;
    const medico    = req.body.medico;
    const datos    = req.body.datos;
    const tipo    = req.body.tipo;

    const insert = `
    INSERT INTO u507429014_esp.Registros
    (Usuario, Paciente, Tipo, FechaRegistro, Datos, Activo) 
    VALUES ('${medico}', '${paciente}', '${tipo}', NOW(), '${datos}', true)
    `;

    mySql.pool.query( insert , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                mensaje: "Data guardada"
            });
        }
    })
});

router.post('/guardarTemp', ( req: Request, res: Response  ) => {

  const paciente    = req.body.paciente;
  const datos    = req.body.datos;
  const medico = req.body.medico;
  const insert = `
  INSERT INTO u507429014_esp.Temperatura 
  (Usuario, Paciente, FechaRegistro ,Datos, Activo) 
  VALUES ('${medico}', '${paciente}', NOW(), '${datos}', true)
  `;
  mySql.pool.query( insert , function(err:any, rows:any, fields:any) {
      if(err){
        //console.log(err)
          res.status(400).json({
              ok: false,
              err: {
                  err
              }
          })
      }else{
          res.json({
              ok:true,
              mensaje: "Data guardada"
          });
      }
  })
});

router.post('/borrarRegistro', ( req: Request, res: Response  ) => {

  const id    = req.body.id;
  const insert = `
  UPDATE u507429014_esp.ECG SET activo = false WHERE Id = '${id}'
  `;

  mySql.pool.query( insert , function(err:any, rows:any, fields:any) {
      if(err){
          res.status(400).json({
              ok: false,
              err: {
                  err
              }
          })
      }else{
          res.json({
              ok:true,
              mensaje: "Data guardada"
          });
      }
  })
});

router.post('/borrarRegistroTemp', ( req: Request, res: Response  ) => {

  const id    = req.body.id;

  const insert = `
  UPDATE u507429014_esp.Temperatura SET activo = false WHERE id = '${id}'
  `;

  mySql.pool.query( insert , function(err:any, rows:any, fields:any) {
      if(err){
          res.status(400).json({
              ok: false,
              err: {
                  err
              }
          })
      }else{
          res.json({
              ok:true,
              mensaje: "Data guardada"
          });
      }
  })
});

router.post('/borrarRegistroOtros', ( req: Request, res: Response  ) => {

    const id    = req.body.id;
    const insert = `
    UPDATE u507429014_esp.Registros SET activo = false WHERE id = '${id}'
    `;
  
    mySql.pool.query( insert , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                mensaje: "Data guardada"
            });
        }
    })
  });

router.get('/registros', ( req: Request, res: Response  ) => {

    const query = `
    SELECT ECG.Id, U.Name, P.Nombre, ECG.FechaRegistro, ECG.Datos, ECG.Activo
    FROM u507429014_esp.ECG ECG
    INNER JOIN u507429014_esp.Usuarios U
    ON U.Id  = ECG.Usuario 
    INNER JOIN u507429014_esp.Pacientes P
    ON P.Id = ECG.Paciente  
    WHERE u507429014_esp.ECG.Activo = true;`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
});

router.get('/registrosTemp', ( req: Request, res: Response  ) => {

  const query = `SELECT t.Id, u.Name , p.Nombre , t.FechaRegistro, t.Datos, t.Activo
  FROM u507429014_esp.Temperatura AS t
  INNER JOIN u507429014_esp.Usuarios AS u
  ON t.Usuario  = u.Id
  INNER JOIN u507429014_esp.Pacientes AS p
  ON t.Paciente  = p.Id
  WHERE t.Activo = TRUE`;

  mySql.pool.query( query , function(err:any, rows:any, fields:any) {
      if(err){
          res.status(400).json({
              ok: false,
              err: {
                  err
              }
          })
      }else{
          res.json({
              ok:true,
              rows
          });
      }
  })
});

router.get('/registrosOtros', ( req: Request, res: Response  ) => {

    const query = `SELECT t.Id, u.Name , p.Nombre , t.FechaRegistro, t.Datos, t.Activo
    FROM u507429014_esp.Registros AS t
    INNER JOIN u507429014_esp.Usuarios AS u
    ON t.Usuario  = u.Id
    INNER JOIN u507429014_esp.Pacientes AS p
    ON t.Paciente  = p.Id
    WHERE t.Activo = TRUE`;
  
    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
  });

router.get('/iniciar', ( req: Request, res: Response  ) => {
    res.json({
        ok: true,
        mensaje: "Inicia Registro"
    });
    const server = Server.instance;
    server.io.emit('ecg', {mensaje: "hola" } )
});

router.get('/otros', ( req: Request, res: Response  ) => {
    res.json({
        ok: true,
        mensaje: "Inicia Registro"
    });
    const server = Server.instance;
    server.io.emit('otros', {mensaje: "hola" } )
});

router.get('/detener', ( req: Request, res: Response  ) => {
    res.json({
        ok: true,
        mensaje: "Detiene Registro"
    });
    const server = Server.instance;
    server.io.emit('detener', {mensaje: "hola" } )

});

router.get('/bpm', ( req: Request, res: Response  ) => {
  res.json({
      ok: true,
      mensaje: "Inicio BPM"
  });
  const server = Server.instance;
  server.io.emit('bpm', {mensaje: "hola" } )

});

router.get('/iniciarTemp', ( req: Request, res: Response  ) => {
  res.json({
      ok: true,
      mensaje: "Inicio temp"
  });
  const server = Server.instance;
  server.io.emit('temp', {mensaje: "hola" } )

});

/* Configuramos router para uso de la API de whatsapp */

router.get("/webhook", (req: Request, res: Response) => {
    const VERIFY_TOKEN = tokenVerify;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        //console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });

router.post("/webhook", (req: Request, res: Response) => {
    let mensaje = "Recuerda que para hacer uso del sistema de mensajes y notificaciones de whatsapp puedes realizar la configuración en: https://faraday.fciencias.unam.mx/~resofisbio/analisis-remoto"
    if (req.body.object) {
      if (req.body.entry && req.body.entry[0].changes && req.body.entry[0].changes[0] && req.body.entry[0].changes[0].value.messages && req.body.entry[0].changes[0].value.messages[0]) {
        let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let number = req.body.entry[0].changes[0].value.messages[0].from;
        let from = number;
        if (number.length > 12) {
          from = number[0] + number[1] + number[3] + number[4] + number[5] + number[6] + number[7] + number[8] + number[9] + number[10] + number[11] + number[12];
        } else {
          from = number;
        }
            var data = JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "text",
            text: {
              preview_url: false,
              body: mensaje,
            },
          });
          var config = {
            method: "post",
            url:
              "https://graph.facebook.com/v12.0/" + phone_number_id + "/messages",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            data: data,
          };
          axios(config)
            .then(function (response) {
              //console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              //console.log(error);
            });
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

router.post("/enviarNotificacion", (req: Request, res: Response) => {
    const mensaje    = req.body.mensaje;
    const numero = req.body.numero
            var data = JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: numero,
            type: "text",
            text: {
              preview_url: false,
              body: mensaje,
            },
          });
          var config = {
            method: "post",
            url: "https://graph.facebook.com/v12.0/" + idNumber + "/messages",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            data: data,
          };
          axios(config).then(function (response) {
              //console.log(JSON.stringify(response.data));
              res.sendStatus(200);
            })
            .catch(function (error) {
              //console.log(error);
              res.sendStatus(404);
            });
  });

router.post("/wha", (req: Request, res: Response) => {
    const mensaje    = "POST"
    const numero = "525567860817"
    var data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: numero,
      type: "text",
      text: {
        preview_url: false,
        body: mensaje},
      });
    var config = {
      method: "post",
      url: "https://graph.facebook.com/v12.0/" + idNumber + "/messages",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token},
      data: data
      };
    axios(config).then(function (response) {
      //console.log(JSON.stringify(response.data));
      res.sendStatus(200);}).catch(function (error) {
        //console.log(error);
        res.sendStatus(404);
        });
});


/* Configuramos router para la seccción Auth (login y registro)  */

  //Get Roles
  router.get('/roles', ( req: Request, res: Response  ) => {

    const query = `SELECT Id, Rol
    FROM u507429014_esp.Roles
    WHERE Activo = TRUE`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
});

  //Post Nuevo Usuario (validación de registro)

  router.post('/registro', ( req: Request, res: Response  ) => {

    const nombre    = req.body.nombre;
    const correo = req.body.correo
    const rol    = req.body.rol;
    const telefono    = req.body.telefono;
    const password    = req.body.password;

    let query = `
    SELECT Id, Correo, Activo
    FROM u507429014_esp.Usuarios
    WHERE Correo = '${correo}'`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            if(rows.length == 0){

                let queryRegistro =   `
                INSERT INTO u507429014_esp.Usuarios
                (Name, Correo, Password, Telefono, Rol, Activo)
                VALUES('${nombre}', '${correo}', '${password}', '${telefono}', ${rol}, FALSE);`;

                mySql.pool.query( queryRegistro , function(err:any, rows:any, fields:any) {
                    if(err){
                        res.status(400).json({
                            ok: false,
                            err: {
                                err
                            }
                        })
                    }else{
                        res.json({
                            ok:true,
                            mensaje: "Su registro ha sido enviado. Un administrador aprobara su solicitud."
                        });
                    }
                })
            }
            else {
                res.json({
                ok: true,
                mensaje: "Este usuario ya se encuentra Registrado"
            })
            }
        }
    })
});

  //get usuario (validación si existe y conincide el password)

router.post('/login', ( req: Request, res: Response  ) => {
    const server = Server.instance;
    const correo    = req.body.correo;
    const password    = req.body.password;
    const query = `SELECT Id, Rol, Telefono
    FROM u507429014_esp.Usuarios
    WHERE Activo = TRUE
    AND Correo = '${correo}'
    AND Password = '${password}';
    `;
    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            if(rows.length == 0){
                res.status(400).json({
                    ok: false,
                    err: "Error de login",
                    rows
                })  
                } else{
                    res.json({
                        ok:true,
                        rows
                    });
                    server.io.emit('userConf', {mensaje: rows[0].Telefono } )
                }
        }
    })
});

router.post('/otroRegistroConf', ( req: Request, res: Response  ) => {
    const server = Server.instance;
    const datosPorPaquete = req.body.datosPorPaquete.toString();
    const numeroPaquetes    = req.body.numeroPaquetes.toString();
    const frecuencia    = req.body.frecuencia.toString();
    //console.log(datosPorPaquete,numeroPaquetes,frecuencia)
    server.io.emit('otroRegistroConf', {datosPorPaquete: datosPorPaquete, numeroPaquetes: numeroPaquetes, frecuencia:frecuencia})
    res.json({
        ok:true
    });
});

router.get('/dashboard', ( req: Request, res: Response  ) => {

    const query = `SELECT
    SUM(CASE WHEN tabla = 'u507429014_esp.Pacientes' THEN count ELSE 0 END) AS TotalPacientes,
    SUM(CASE WHEN tabla = 'u507429014_esp.Usuarios' THEN count ELSE 0 END) AS TotalUsuarios,
    SUM(CASE WHEN tabla = 'u507429014_esp.BPM' THEN count ELSE 0 END) AS TotalBPM,
    SUM(CASE WHEN tabla = 'u507429014_esp.Registros' THEN count ELSE 0 END) AS TotalRegistros,
    SUM(CASE WHEN tabla = 'u507429014_esp.Temperatura' THEN count ELSE 0 END) AS TotalTemperatura,
    SUM(CASE WHEN tabla = 'u507429014_esp.ECG' THEN count ELSE 0 END) AS TotalECG
  FROM (
    SELECT 'u507429014_esp.Pacientes' AS tabla, COUNT(*) AS count FROM u507429014_esp.Pacientes WHERE Activo = TRUE 
    UNION
    SELECT 'u507429014_esp.Usuarios' AS tabla, COUNT(*) AS count FROM u507429014_esp.Usuarios WHERE Activo = TRUE 
    UNION
    SELECT 'u507429014_esp.BPM' AS tabla, COUNT(*) AS count FROM u507429014_esp.BPM WHERE Activo = TRUE
    UNION
    SELECT 'u507429014_esp.Registros' AS tabla, COUNT(*) AS count FROM u507429014_esp.Registros  WHERE Activo = TRUE
    UNION
    SELECT 'u507429014_esp.Temperatura' AS tabla, COUNT(*) AS count FROM u507429014_esp.Temperatura  WHERE Activo = TRUE
    UNION
    SELECT 'u507429014_esp.ECG' AS tabla, COUNT(*) AS count FROM u507429014_esp.ECG  WHERE Activo = TRUE
  ) subquery`;

    mySql.pool.query( query , function(err:any, rows:any, fields:any) {
        if(err){
            res.status(400).json({
                ok: false,
                err: {
                    err
                }
            })
        }else{
            res.json({
                ok:true,
                rows
            });
        }
    })
});

export default router;


