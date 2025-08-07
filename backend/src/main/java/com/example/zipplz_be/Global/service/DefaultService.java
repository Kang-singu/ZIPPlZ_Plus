package com.example.zipplz_be.Global.service;

import com.example.zipplz_be.Global.dto.FieldDTO;
import com.example.zipplz_be.Global.dto.GugunDTO;
import com.example.zipplz_be.Global.dto.SidoDTO;

import java.util.List;

public interface DefaultService {
    List<SidoDTO> getSidoList();
    List<GugunDTO> getGugunList(int Sido);
    List<FieldDTO> getFieldList();
}
