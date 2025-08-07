package com.example.zipplz_be.Global.service;

import com.example.zipplz_be.Global.dto.FieldDTO;
import com.example.zipplz_be.Global.dto.GugunDTO;
import com.example.zipplz_be.Global.dto.SidoDTO;
import com.example.zipplz_be.Global.repository.FieldRepository;
import com.example.zipplz_be.Global.repository.LocalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultServiceImpl implements DefaultService {

    private final LocalRepository localRepository;
    private final FieldRepository fieldRepository;

    public DefaultServiceImpl(LocalRepository localRepository, FieldRepository fieldRepository) {
        this.localRepository = localRepository;
        this.fieldRepository = fieldRepository;
    }

    @Override
    public List<SidoDTO> getSidoList() {
        return localRepository.getSidoList();
    }

    @Override
    public List<GugunDTO> getGugunList(int Sido) {
        return localRepository.getGugunList(Sido);
    }

    @Override
    public List<FieldDTO> getFieldList() {
        return fieldRepository.getFields();
    }
}
