import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import axios from 'axios';
import { WA_NUMBER, WA_TOKEN } from '../global/environment';

const token = WA_TOKEN
const idNumber = WA_NUMBER


export const usuariosConectados = new UsuariosLista();


export const nodeECG = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('event_name', (payload : any) => {
        io.emit('data', payload );
    });

    cliente.on('event_temp', (payload : any) => {
        io.emit('data_temp', payload );
    });

    cliente.on('notificacion', (payload : any) => {
        const mensaje    = payload.mensaje
        let numero = payload.numero
        if (payload.numero == "525567860817" || payload.numero == "525574267822"){
            numero = payload.numero
        } else {
            numero = "525567860817"
        }
        var data = JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: numero,
            type: "text",
            text: {
                preview_url: false,
                body: mensaje
                }
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
            });
    });

}

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}


export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

    });

}

// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (  payload: { nombre: string  }  ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

    });

}


// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });

}