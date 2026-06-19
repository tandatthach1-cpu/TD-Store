package com.apichinh.backend.response;

import com.apichinh.backend.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<UserDTO> users; // Danh sách người dùng (nếu cần)
    private UserDTO user; // Người dùng cụ thể (nếu cần)
}
