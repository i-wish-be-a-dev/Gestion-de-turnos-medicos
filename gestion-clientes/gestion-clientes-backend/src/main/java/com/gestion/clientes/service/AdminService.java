
package com.gestion.clientes.service;

import com.gestion.clientes.model.Role;
import com.gestion.clientes.model.Usuario;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface AdminService {

    List<Usuario> listAllDoctores();

    List<Usuario> listAllPacientes();

    List<Usuario> listAllUsuarios();

    Usuario getUsuarioById(Long id);
    
    Usuario actualizarUsuario(Long id, Usuario usuarioRequest);

    Usuario saveUsuario(Usuario usuario);

    Usuario createUsuarioConRol (Usuario usuario, Role roleName);

    Usuario savePaciente(Usuario usuario);

    Usuario saveDoctor(Usuario usuario);

    Usuario saveAdmin(Usuario usuario);

    Usuario deleteUsuario(Long id);
    
    Usuario findByUsername(String username); 

    Usuario changeRoleToPaciente(Long id);

    Usuario changeRoleToDoctor(Long id);
    
    Usuario changeRoleToAdmin(Long id);
    
}
