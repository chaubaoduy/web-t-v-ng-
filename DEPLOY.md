# Hướng Dẫn Deploy Website

Do môi trường hiện tại chưa cài đặt Git và Node.js, hệ thống không thể tự động deploy. Vui lòng làm theo các bước sau để đưa website lên internet.

## 1. Cài đặt Git (Nếu chưa có)
- Tải về tại: [git-scm.com](https://git-scm.com/downloads)
- Sau khi cài đặt, mở Terminal (PowerShell hoặc Command Prompt) và kiểm tra: `git --version`

## 2. Đưa code lên GitHub
1. **Khởi tạo Git**:
   Mở terminal tại thư mục dự án `d:\Antigravity\visual-vocab` và chạy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Tạo Repository trên GitHub**:
   - Truy cập [github.com/new](https://github.com/new).
   - Đặt tên repository (ví dụ: `visual-vocab`).
   - Nhấn **Create repository**.

3. **Liên kết và Push code**:
   Copy các lệnh từ GitHub (phần "...or push an existing repository from the command line") và chạy tại terminal:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/visual-vocab.git
   git branch -M main
   git push -u origin main
   ```

## 3. Deploy (Chọn 1 trong 2 cách)

### Cách A: Netlify (Khuyên dùng - Đơn giản nhất)
1. Truy cập [app.netlify.com](https://app.netlify.com).
2. Đăng nhập và chọn **Add new site** -> **Import from existing project**.
3. Chọn **GitHub**.
4. Chọn repository `visual-vocab` bạn vừa tạo.
5. Nhấn **Deploy site**.
6. Netlify sẽ cấp cho bạn một URL dạng `https://xxx.netlify.app`.

### Cách B: Vercel
1. Truy cập [vercel.com/new](https://vercel.com/new).
2. Chọn repository `visual-vocab` và nhấn **Import**.
3. Ở phần cấu hình, giữ nguyên mặc định (đã có file `vercel.json` hỗ trợ).
4. Nhấn **Deploy**.
5. Vercel sẽ trả về URL dạng `https://xxx.vercel.app`.

### Cách C: GitHub Pages
1. Tại repository trên GitHub, vào **Settings** -> **Pages**.
2. Tại mục **Build and deployment**, phần Source chọn **Deploy from a branch**.
3. Branch chọn **main**, folder chọn **/(root)**.
4. Nhấn **Save**.
5. Đợi vài phút, URL sẽ hiện ra ở trên cùng trang này.
