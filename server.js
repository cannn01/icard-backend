const express = require('express');
const cors = require('cors');
const vCardsJS = require('vcards-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// Dữ liệu Profile đầy đủ
let userProfile = {
  id: "candong",
  name: "Tô Đông Cẩn",
  title: "Data & Software Engineer",
  company: "Tech Architecture Team",
  bio: "Chuyên phát triển hệ thống ETL, Data Pipeline & Ứng dụng Di động.",
  phone: "0901234567",
  email: "can.todong@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  bankQr: "https://img.vietqr.io/image/970422-123456789-compact.png", // Demo VietQR
  tags: ["Data Engineer", "React Native", "Docker", "SQL Server", "SSIS"]
};

app.get('/api/profile/:id', (req, res) => res.json(userProfile));

app.post('/api/profile/:id', (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ success: true, profile: userProfile });
});

// API Tải vCard lưu danh bạ
app.get('/api/contact/:id/vcard', (req, res) => {
  const vCard = vCardsJS();
  vCard.firstName = "Đông Cẩn";
  vCard.lastName = "Tô";
  vCard.organization = userProfile.company;
  vCard.title = userProfile.title;
  vCard.workEmail = userProfile.email;
  vCard.workPhone = userProfile.phone;
  vCard.url = userProfile.github;

  res.set('Content-Type', 'text/vcard; charset=utf-8');
  res.set('Content-Disposition', `attachment; filename="${userProfile.id}.vcf"`);
  res.send(vCard.getFormattedString());
});

app.get('/api/version', (req, res) => {
  res.json({
    latestVersion: "1.0.1",
    apkUrl: "/downloads/app-release.apk",
    changeLog: "Cập nhật giao diện chuyên nghiệp và tính năng nâng cao"
  });
});

// Web Viewer hiển thị công khai cực đẹp cho người nhận (Mobile-first UI)
app.get('/p/:id', (req, res) => {
  const tagsHtml = userProfile.tags.map(t => `<span class="tag">${t}</span>`).join('');
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${userProfile.name} - I-Card</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F3F4F6; margin: 0; padding: 15px; display: flex; justify-content: center; }
        .card { background: white; border-radius: 24px; max-width: 400px; width: 100%; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        .cover { height: 120px; background: linear-gradient(135deg, #4F46E5, #9333EA); }
        .avatar-box { margin-top: -50px; text-align: center; }
        .avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid white; object-fit: cover; }
        .content { padding: 20px; text-align: center; }
        .name { font-size: 22px; font-weight: 800; color: #111827; margin: 5px 0 0 0; }
        .title { font-size: 14px; color: #4B5563; margin-top: 4px; font-weight: 500; }
        .company { font-size: 13px; color: #6B7280; margin-top: 2px; }
        .bio { font-size: 13px; color: #4B5563; margin: 12px 0; line-height: 1.4; background: #F9FAFB; padding: 10px; border-radius: 10px; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px; }
        .tag { background: #EEF2FF; color: #4F46E5; font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 600; }
        .btn-save { background: #FACC15; color: #111827; font-weight: 700; padding: 14px; border-radius: 30px; text-decoration: none; display: block; width: 100%; font-size: 15px; box-shadow: 0 4px 12px rgba(250,204,21,0.4); }
        .links-list { margin-top: 20px; text-align: left; }
        .link-item { display: flex; align-items: center; padding: 12px; background: #F9FAFB; border-radius: 12px; margin-bottom: 8px; text-decoration: none; color: #1F2937; font-weight: 600; font-size: 14px; }
        .link-item span { margin-right: 10px; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="cover"></div>
        <div class="avatar-box">
          <img src="https://picsum.photos/200" class="avatar" />
        </div>
        <div class="content">
          <h2 class="name">${userProfile.name}</h2>
          <div class="title">${userProfile.title}</div>
          <div class="company">🏢 ${userProfile.company}</div>
          
          <div class="bio">${userProfile.bio}</div>
          <div class="tags">${tagsHtml}</div>

          <a href="/api/contact/${userProfile.id}/vcard" class="btn-save">👤+ Save Contact to Phone</a>

          <div class="links-list">
            <a href="tel:${userProfile.phone}" class="link-item"><span>📞</span> Gọi điện: ${userProfile.phone}</a>
            <a href="https://zalo.me/${userProfile.phone}" class="link-item"><span>💬</span> Nhắn tin Zalo</a>
            <a href="mailto:${userProfile.email}" class="link-item"><span>✉️</span> Gửi Email</a>
            <a href="${userProfile.github}" target="_blank" class="link-item"><span>💻</span> Hồ sơ GitHub</a>
            <a href="${userProfile.linkedin}" target="_blank" class="link-item"><span>💼</span> Hồ sơ LinkedIn</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server I-Card Online tại Port ${PORT}`));