
package com.gestion.clientes.controller;

import com.gestion.clientes.dto.DtoMapper;
import com.gestion.clientes.dto.UsuarioRequestDto;
import com.gestion.clientes.response.ResponseHandler;
import com.gestion.clientes.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Tomi
 */
// Todas las respuestas usan UsuarioSimpleDto para no exponer la contraseña
@RestController
@RequestMapping("admin/")
public class AdminController {

    @Autowired
    private AdminService usuarioService;


        @GetMapping("/usuarios")
    public ResponseEntity<Object> listAllUsuarios() {
          return ResponseHandler.responseBuilder("Listado de usuarios: ", HttpStatus.OK, DtoMapper.toUsuarioSimpleDtoList(usuarioService.listAllUsuarios()));

    }
    @GetMapping("/doctores")
    public ResponseEntity<Object> listAllDoctores() {
          return ResponseHandler.responseBuilder("Listado de doctores: ", HttpStatus.OK, DtoMapper.toUsuarioSimpleDtoList(usuarioService.listAllDoctores()));

    }
    @GetMapping("/pacientes")
    public ResponseEntity<Object> listAllPacientes() {
          return ResponseHandler.responseBuilder("Listado de pacientes: ", HttpStatus.OK, DtoMapper.toUsuarioSimpleDtoList(usuarioService.listAllPacientes()));

    }

    @PostMapping("/doctores")
public ResponseEntity<Object> crearDoctor(@RequestBody UsuarioRequestDto request) {
    return ResponseHandler.responseBuilder("Doctor creado con exito", HttpStatus.CREATED, DtoMapper.toUsuarioSimpleDto(usuarioService.saveDoctor(request.toUsuario())));
}

    @PostMapping("/pacientes")
public ResponseEntity<Object> crearPaciente(@RequestBody UsuarioRequestDto request) {
    return ResponseHandler.responseBuilder("Paciente creado con exito", HttpStatus.CREATED, DtoMapper.toUsuarioSimpleDto(usuarioService.savePaciente(request.toUsuario())));
}

     @GetMapping("/usuarios/{id}")
public ResponseEntity<Object> getUsuarioById(@PathVariable Long id) {
    return ResponseHandler.responseBuilder("Datos del usuario solicitado", HttpStatus.OK, DtoMapper.toUsuarioSimpleDto(usuarioService.getUsuarioById(id)));
}

    @PutMapping("/usuarios/{id}")
public ResponseEntity<Object> actualizarUsuario(@PathVariable Long id,@RequestBody UsuarioRequestDto usuarioRequest){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, DtoMapper.toUsuarioSimpleDto(usuarioService.actualizarUsuario(id, usuarioRequest.toUsuario())));
}

    @DeleteMapping("/usuarios/{id}")
ResponseEntity<Object> deleteUsuario(@PathVariable Long id){

     return ResponseHandler.responseBuilder("Datos del usuario eliminado", HttpStatus.OK, DtoMapper.toUsuarioSimpleDto(usuarioService.deleteUsuario(id)));
}

    @PutMapping("/set-admin/{id}")
public ResponseEntity<Object> setAdmin(@PathVariable Long id){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, DtoMapper.toUsuarioSimpleDto(usuarioService.changeRoleToAdmin(id)));
}


    @PutMapping("/set-paciente/{id}")
public ResponseEntity<Object> setPaciente(@PathVariable Long id){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, DtoMapper.toUsuarioSimpleDto(usuarioService.changeRoleToPaciente(id)));
}



    @PutMapping("/set-doctor/{id}")
public ResponseEntity<Object> setDoctor(@PathVariable Long id){
    return ResponseHandler.responseBuilder("Datos del usuario actualizado", HttpStatus.OK, DtoMapper.toUsuarioSimpleDto(usuarioService.changeRoleToDoctor(id)));
}

}
