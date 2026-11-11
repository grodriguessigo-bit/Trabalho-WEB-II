package com.web2.trabalhoFinal.service;

import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.dto.CreateEmployeeDTO;
import com.web2.trabalhoFinal.dto.EmployeeDTO;
import com.web2.trabalhoFinal.dto.UpdateEmployeeDTO;
import com.web2.trabalhoFinal.entities.Employee;
import com.web2.trabalhoFinal.repository.EmployeeRepository;
import com.web2.trabalhoFinal.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PersonRepository personRepository;
    private final PasswordService passwordService;
    public EmployeeService(EmployeeRepository employeeRepository, PersonRepository personRepository, PasswordService passwordService) {
        this.employeeRepository = employeeRepository;
        this.personRepository = personRepository;
        this.passwordService = passwordService;
    }

    @Transactional
    public ApiResponse<EmployeeDTO> salvar(CreateEmployeeDTO dto) {
        LocalDate hoje = LocalDate.now();

        if (dto.email() == null || dto.email().isBlank())
            return new ApiResponse<>("Email não pode ser vazio", false);
        if(personRepository.existsByEmail(dto.email()))
            return new ApiResponse<>("Email já cadastrado", false);
        if (dto.name() == null || dto.name().isBlank())
            return new ApiResponse<>("Nome não pode ser vazio", false);
        if (dto.birthDate() == null)
            return new ApiResponse<>("Data de nascimento é obrigatória", false);
        if (dto.birthDate().isBefore(hoje.minusYears(120)))
            return new ApiResponse<>("Data de nascimento inválida", false);
        if (dto.password() == null || dto.password().isBlank())
            return new ApiResponse<>("Senha não pode ser vazia", false);
        if (dto.birthDate().isAfter(hoje))
            return new ApiResponse<>("Data de nascimento não pode ser no futuro", false);

        Employee employee = new Employee();
        employee.setName(dto.name());
        employee.setEmail(dto.email());
        employee.setBirthDate(dto.birthDate());
        employee.setActive(true);
        String salt = passwordService.generateSalt();
        employee.setSalt(salt);
        employee.setPassword(passwordService.hashPassword(dto.password(), salt));

        Employee salvo = employeeRepository.save(employee);

        EmployeeDTO employeeDTO = new EmployeeDTO(
                salvo.getId(), salvo.getName(), salvo.getEmail(),
                salvo.getBirthDate(), salvo.isActive());

        return new ApiResponse<>(employeeDTO, "Funcionário salvo com sucesso", true);
    }

    @Transactional
    public ApiResponse<EmployeeDTO> atualizar(Long id, UpdateEmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null)
            return new ApiResponse<>("Funcionário não encontrado", false);

        LocalDate hoje = LocalDate.now();

        if (dto.email() == null || dto.email().isBlank())
            return new ApiResponse<>("Email não pode ser vazio", false);
        if (dto.name() == null || dto.name().isBlank())
            return new ApiResponse<>("Nome não pode ser vazio", false);
        if (dto.birthDate() == null)
            return new ApiResponse<>("Data de nascimento é obrigatória", false);
        if (dto.birthDate().isAfter(hoje))
            return new ApiResponse<>("Data de nascimento não pode ser no futuro", false);
        if (dto.birthDate().isBefore(hoje.minusYears(120)))
            return new ApiResponse<>("Data de nascimento inválida", false);
        if (personRepository.existsByEmailAndOtherId(dto.email(), id))
            return new ApiResponse<>("Email já cadastrado", false);

        employee.setName(dto.name());
        employee.setEmail(dto.email());
        employee.setBirthDate(dto.birthDate());

        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            String salt = passwordService.generateSalt();
            employee.setSalt(salt);
            employee.setPassword(passwordService.hashPassword(dto.newPassword(), salt));
        }

        Employee salvo = employeeRepository.save(employee);
        return new ApiResponse<>(toDTO(salvo), "Funcionário atualizado com sucesso", true);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<EmployeeDTO>> listar() {
        List<EmployeeDTO> lista = employeeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();

        return new ApiResponse<>(lista, "Funcionários listados com sucesso", true);
    }

    @Transactional(readOnly = true)
    public ApiResponse<EmployeeDTO> buscarPorId(Long id) {
        return employeeRepository.findById(id)
                .map(e -> new ApiResponse<>(toDTO(e), "Funcionário encontrado", true))
                .orElse(new ApiResponse<>("Funcionário não encontrado", false));
    }

    private EmployeeDTO toDTO(Employee e) {
        return new EmployeeDTO(e.getId(), e.getName(), e.getEmail(),
                e.getBirthDate(), e.isActive());
    }

    @Transactional
    public ApiResponse<EmployeeDTO> desativar(Long id, Long idSolicitante) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null)
            return new ApiResponse<>("Funcionário não encontrado", false);

        if (!employee.isActive())
            return new ApiResponse<>("Funcionário já está desativado", false);

        if (idSolicitante != null && idSolicitante.equals(id))
            return new ApiResponse<>("Você não pode desativar a si próprio", false);

        if (employeeRepository.countByActiveTrue() <= 1)
            return new ApiResponse<>("Não é possível desativar o último funcionário ativo", false);

        employee.setActive(false);
        Employee salvo = employeeRepository.save(employee);

        return new ApiResponse<>(toDTO(salvo), "Funcionário desativado com sucesso", true);
    }
}