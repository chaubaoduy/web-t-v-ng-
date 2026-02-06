# Hướng dẫn Cài đặt & Chạy ứng dụng (Full Stack)

## ⚠️ QUAN TRỌNG: Cài đặt Node.js trước!
Lỗi `'npm' is not recognized` xuất hiện do máy bạn chưa cài Node.js.
Đây là công cụ bắt buộc để chạy code React và Server.

1.  Truy cập: **[https://nodejs.org/](https://nodejs.org/)**
2.  Tải xuống phiên bản **LTS** (Recommended for most users).
3.  Cài đặt file vừa tải (Nhấn Next liên tục cho đến khi xong).
4.  **TẮT** cửa sổ này đi và mở lại để máy nhận lệnh `npm`.

---

Bạn đã chuyển đổi cấu trúc dự án sang mô hình Client-Server. Hãy làm theo các bước sau để khởi chạy:

## 1. Cài đặt Backend (Server)
Mở terminal (PowerShell hoặc CMD) tại thư mục `server`:
```bash
cd d:\Antigravity\visual-vocab\server
npm install
```
Sau khi cài xong, chạy server:
```bash
node server.js
```
> Server sẽ chạy tại `http://localhost:3000`. Hãy giữ cửa sổ này mở.

## 2. Cài đặt Frontend (Client)
Mở một cửa sổ terminal **mới** (khác cửa sổ server), và đi vào thư mục `client`:
```bash
cd d:\Antigravity\visual-vocab\client
npm install
```
Sau khi cài xong, chạy ứng dụng:
```bash
npm run dev
```
> Ứng dụng sẽ chạy tại `http://localhost:5173`. Nhấn vào link để mở trên trình duyệt.

## 3. Lưu ý
Hiện tại ứng dụng đang ở trạng thái **khung sườn (Skeleton)**.
- Bạn sẽ thấy giao diện Web mới nhưng chưa có các chức năng cũ (Học từ, Game...).
- Sau khi bạn xác nhận đã chạy thành công 2 bước trên, mình sẽ tiếp tục đưa code của các chức năng vào đúng vị trí mới.
