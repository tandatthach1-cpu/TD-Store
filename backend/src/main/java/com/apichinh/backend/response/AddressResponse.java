package com.daohuybac.backend.response;

import com.daohuybac.backend.dto.AddressDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<AddressDTO> addresses; // Danh sách địa chỉ (nếu cần)
    private AddressDTO address; // Địa chỉ cụ thể (nếu cần)
}
