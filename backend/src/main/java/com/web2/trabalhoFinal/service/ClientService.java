package com.web2.trabalhoFinal.service;
import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Client;
import br.com.caelum.stella.validation.CPFValidator;
import br.com.caelum.stella.validation.InvalidStateException;
import com.web2.trabalhoFinal.repository.ClientRepository;
import org.springframework.stereotype.Service;

// aqui onde vão ficar todas as validações da classe cliente.
@Service
public class ClientService {

    private ClientRepository clientRepository;

    public ApiResponse<Client> validarCliente(Client client){

        CPFValidator cpfValidator = new CPFValidator();

        try
        {
            if (!cpfValidator.invalidMessagesFor(client.getCpf()).isEmpty())
                return new ApiResponse<>(null, "CPF informado é inválido", false);
            if(client.getPhone().isBlank())
                return new ApiResponse<>(null, "Campo phone está vazio", false);

            Client clientSalvo = clientRepository.save(client);
            return new ApiResponse<>(clientSalvo, "Sucesso ao cadastrar cliente", true);
        }

        catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
