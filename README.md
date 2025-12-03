# CME Trading Clone - Hệ thống giao dịch trực tuyến

Dự án clone 1:1 từ https://cme-trading.online với đầy đủ chức năng Customer Web và Admin Web.

## 📋 Mô tả dự án

Hệ thống giao dịch trực tuyến hoàn chỉnh bao gồm:
- **Customer Web**: Ứng dụng web cho khách hàng cuối (Mobile-first design)
- **Admin Web**: Ứng dụng quản trị nội bộ
- **Backend API**: REST API với NestJS
- **Realtime Service**: WebSocket cho cập nhật thời gian thực
- **Worker Service**: Xử lý background jobs

## 🚀 Bắt đầu nhanh

```bash
# Cài đặt dependencies
pnpm install

# Chạy API backend
pnpm dev:api

# Chạy Customer Web
pnpm dev:customer
```

Xem chi tiết trong [DOCUMENTATION.md](./docs/DOCUMENTATION.md)

## 📚 Tài liệu tham khảo

- [Phân tích và báo cáo](./Phan_tich_va_bao_cao.md)
- [Báo cáo kỹ thuật](./cme_trading_clone_report_vi.md)
- [Thiết kế chi tiết](./design_full_report_vi.md)