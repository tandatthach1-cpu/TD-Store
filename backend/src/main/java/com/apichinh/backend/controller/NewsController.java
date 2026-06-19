package com.apichinh.backend.controller;

import com.apichinh.backend.dto.NewsDTO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*") // Cho phép tất cả các origin, bạn có thể cấu hình cụ thể hơn
public class NewsController {

    // Dữ liệu giả định, bạn sẽ thay thế bằng dữ liệu từ cơ sở dữ liệu thực tế
    private List<NewsDTO> dummyNews = Arrays.asList(
            new NewsDTO(1L, "Đánh giá chi tiết iPhone 15 Pro Max sau 6 tháng sử dụng", "Liệu đây có còn là chiếc điện thoại đáng mua nhất thời điểm hiện tại?", "https://via.placeholder.com/300x200", "15/05/2024", "Đánh giá"),
            new NewsDTO(2L, "Cách tối ưu pin cho Samsung Galaxy S24 Ultra cực đơn giản", "Chia sẻ 5 mẹo giúp bạn kéo dài thời gian sử dụng pin lên đến 2 ngày.", "https://via.placeholder.com/300x200", "12/05/2024", "Mẹo vặt"),
            new NewsDTO(3L, "Sự khác biệt giữa màn hình LTPO và LTPS trên điện thoại", "Hiểu rõ hơn về công nghệ màn hình để chọn được chiếc điện thoại ưng ý.", "https://via.placeholder.com/300x200", "10/05/2024", "Kiến thức"),
            new NewsDTO(4L, "Apple ra mắt bản cập nhật iOS 17.5 với nhiều tính năng mới", "Cùng điểm qua những thay đổi đáng chú ý nhất trong bản cập nhật lần này.", "https://via.placeholder.com/300x200", "08/05/2024", "Tin tức")
    );

    @GetMapping
    public List<NewsDTO> getAllNews() {
        // Trả về danh sách tin tức
        return dummyNews;
    }

    // Bạn có thể thêm các endpoint khác như /news/{id} để lấy chi tiết tin tức
}