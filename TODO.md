# TODO - Đổi package backend

- [ ] Đồng bộ package trong `backend/src/main/java/com/apichinh/backend/**`
  - [ ] Đổi `package com.daohuybac.backend...` -> `package com.apichinh.backend...`
  - [ ] Đổi toàn bộ `import com.daohuybac.backend...` -> `import com.apichinh.backend...`
  - [ ] Đổi annotation/refs nếu có (nếu phát hiện còn chuỗi daohuybac)

- [ ] Đồng bộ test
  - [ ] Đổi folder `backend/src/test/java/com/daohuybac/backend/` -> `backend/src/test/java/com/apichinh/backend/`
  - [ ] Đổi `package com.daohuybac.backend;` -> `package com.apichinh.backend;`

- [ ] (Tuỳ chọn) Đổi tên class `HbawscBackendApplication` -> `tandatBackendApplication` nếu còn yêu cầu trong codebase

- [ ] Build kiểm tra
  - [ ] Chạy compile/test Maven (mvn) nếu môi trường có mvn

