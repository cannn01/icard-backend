const express = require('express');
const cors = require('cors');
const vCardsJS = require('vcards-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Thư mục chứa file APK để tải bản cập nhật tự động
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

const userProfile = {
  id: "candong",
  name: "Tô Đông Cẩn",
  title: "Data & Software Engineer",
  company: "Tech Architecture Team",
  email: "can.todong@example.com",
  phone: "0901234567",
  website: "https://github.com",
  linkedin: "https://linkedin.com"
};

// 1. API lấy thông tin Profile cho App Mobile
app.get('/api/profile/:id', (req, res) => {
  res.json(userProfile);
});

// 2. API sinh và tải về file vCard (.vcf) lưu danh bạ
app.get('/api/contact/:id/vcard', (req, res) => {
  const vCard = vCardsJS();
  vCard.firstName = "Đông Cẩn";
  vCard.lastName = "Tô";
  vCard.organization = userProfile.company;
  vCard.title = userProfile.title;
  vCard.workEmail = userProfile.email;
  vCard.workPhone = userProfile.phone;
  vCard.url = userProfile.website;

  res.set('Content-Type', 'text/vcard; charset=utf-8');
  res.set('Content-Disposition', `attachment; filename="${userProfile.id}.vcf"`);
  res.send(vCard.getFormattedString());
});

// 3. API kiểm tra phiên bản APK mới nhất (Auto-Update)
app.get('/api/version', (req, res) => {
  res.json({
    latestVersion: "1.0.1",
    apkUrl: "http://localhost:3000/downloads/app-release.apk",
    changeLog: "Sửa lỗi giao diện và cập nhật tính năng chia sẻ NFC"
  });
});

// 4. Trang Web hiển thị công khai khi đối phương Quét QR / Touch NFC
app.get('/p/:id', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${userProfile.name} - I-Card</title>
      <style>
        body { font-family: sans-serif; background: #F3F4F6; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .card { background: white; border-radius: 16px; padding: 24px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .avatar { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 12px; }
        .btn-save { background: #FACC15; color: #111; font-weight: bold; padding: 12px 24px; border-radius: 25px; text-decoration: none; display: inline-block; margin: 16px 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <img src="https://picsum.photos/200" class="avatar" />
        <h2>${userProfile.name}</h2>
        <p style="color: #6B7280; margin-top: -10px;">${userProfile.title}</p>
        <a href="/api/contact/${userProfile.id}/vcard" class="btn-save">👤 Save Contact</a>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend Server đang chạy tại port ${PORT}`));