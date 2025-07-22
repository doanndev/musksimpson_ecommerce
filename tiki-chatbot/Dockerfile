# Sử dụng image Python chính thức
FROM python:3.10-slim

# Tạo thư mục làm việc
WORKDIR /app

# Copy venv đã cài sẵn từ máy host vào image
COPY venv ./venv

# Copy mã nguồn
COPY . .

# Thiết lập biến môi trường để dùng venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH=\"/app/venv/Scripts:/app/venv/bin:$PATH\"

# Expose port
EXPOSE 8000

# Chạy server FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]