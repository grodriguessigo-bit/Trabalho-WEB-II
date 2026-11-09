package com.web2.trabalhoFinal.service;
import com.web2.trabalhoFinal.dto.ApiResponse;
import com.web2.trabalhoFinal.entities.Address;
import com.web2.trabalhoFinal.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    @Autowired
    AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository){
        this.addressRepository = addressRepository;
    }

    public ApiResponse<Address> AddressSalvar(Address address){
        Address salvo = addressRepository.save(address);
        return new ApiResponse<>(salvo,"Endereço salvo com sucesso", true);
    }
}
