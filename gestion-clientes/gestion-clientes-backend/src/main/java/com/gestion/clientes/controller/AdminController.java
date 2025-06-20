
package com.gestion.clientes.controller;

import com.gestion.clientes.model.Usuario;
import com.gestion.clientes.response.ResponseHandler;
import com.gestion.clientes.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Tomi
 */
@RestController
@RequestMapping("admin/")
public class AdminController {
    
    @Autowired
    private UsuarioService usuarioService;
    
        @GetMapping("/usuarios")
    public ResponseEntity<Object> listAllUsuarios() {
          return ResponseHandler.responseBuilder("Usuario Creado con exito", HttpStatus.OK, usuarioService.listAllUsuarios());  
   
    }
    
//      @PostMapping("/usuarios")
//    public ResponseEntity<Object> crearUsuario(@Valid @RequestBody Usuario usuario) {
//        System.out.println("Datos Recibidos: " + usuario);
//        return ResponseHandler.responseBuilder("Usuario Creado con exito", HttpStatus.OK, usuarioService.saveUsuario(usuario));  
//    }
       
     @GetMapping("/usuarios/{id}")
public ResponseEntity<Object> getUsuarioById(@PathVariable Long id) {
    return ResponseHandler.responseBuilder("Datos del usuario solicitado", HttpStatus.OK, usuarioService.getUsuarioById(id));
}

    @PutMapping("/usuarios/{id}")
public ResponseEntity<Object> actualizarUsuario(@PathVariable Long id,@RequestBody Usuario usuarioRequest){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, usuarioService.actualizarUsuario(id, usuarioRequest));
}

    @DeleteMapping("/usuarios/{id}")
ResponseEntity<Object> deleteUsuario(@PathVariable Long id){
   
     return ResponseHandler.responseBuilder("Datos del usuario eliminado", HttpStatus.OK, usuarioService.deleteUsuario(id));
}

    
    @PutMapping("/set-admin/{id}")
public ResponseEntity<Object> setAdmin(@PathVariable Long id){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, usuarioService.changeRoleToAdmin(id));
}
    
    
    @PutMapping("/set-paciente/{id}")
public ResponseEntity<Object> setPaciente(@PathVariable Long id){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, usuarioService.changeRoleToPaciente(id));
}
    
    
    
    @PutMapping("/set-doctor/{id}")
public ResponseEntity<Object> setDoctor(@PathVariable Long id){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, usuarioService.changeRoleToDoctor(id));
}
    
    
    
    






}