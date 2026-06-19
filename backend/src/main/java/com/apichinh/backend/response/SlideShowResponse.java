package com.apichinh.backend.response;

import com.apichinh.backend.dto.SlideShowDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlideShowResponse {
    private boolean success; // Trạng thái thành công
    private String message; // Thông điệp trả về
    private List<SlideShowDTO> slideShows; // Danh sách slideshow (nếu cần)
    private SlideShowDTO slideShow; // Slideshow cụ thể (nếu cần)
}
