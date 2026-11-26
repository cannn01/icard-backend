const express = require('express');
const cors = require('cors');
const vCardsJS = require('vcards-js');
const path = require('path');

const app = express();
app.use(cors());
// Tăng dung lượng JSON để nhận file ảnh upload dạng Base64
app.use(express.json({ limit: '10mb' }));

app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

let userProfile = {
  id: "candong",
  name: "Tô Đông Cẩn",
  title: "Data & Software Engineer",
  company: "Tech Architecture Team",
  greeting: "Chào bạn! Rất vui được gặp và kết nối cùng bạn hôm nay.",
  avatar: "https://picsum.photos/200",
  cover: "https://picsum.photos/600/200",
  theme: "dark",
  phone: "0901234567",
  email: "can.todong@example.com",
  zalo: "0901234567",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  facebook: "https://facebook.com",
  tags: ["Data Engineer", "React Native", "Docker", "SQL Server", "SSIS"]
};

app.get('/api/profile/:id', (req, res) => res.json(userProfile));

app.post('/api/profile/:id', (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ success: true, profile: userProfile });
});

app.get('/api/contact/:id/vcard', (req, res) => {
  const vCard = vCardsJS();
  vCard.firstName = userProfile.name;
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
    changeLog: "Cập nhật tính năng tải ảnh trực tiếp & nâng cấp Theme Dark/Light"
  });
});

// Trang Web hiển thị công khai (Tự động nhận diện Theme Dark/Light)
app.get('/p/:id', (req, res) => {
  const isDark = userProfile.theme === 'dark';
  const bgColor = isDark ? '#0F172A' : '#F1F5F9';
  const cardColor = isDark ? '#1E293B' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';
  const boxBg = isDark ? '#334155' : '#F8FAFC';

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
        body { font-family: -apple-system, sans-serif; background: ${bgColor}; color: ${textColor}; margin: 0; padding: 15px; display: flex; justify-content: center; }
        .card { background: ${cardColor}; border-radius: 24px; max-width: 400px; width: 100%; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .cover { height: 110px; background: url('${userProfile.cover}') center/cover no-repeat; }
        .avatar-box { margin-top: -50px; text-align: center; }
        .avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid ${cardColor}; object-fit: cover; }
        .content { padding: 20px; text-align: center; }
        .name { font-size: 22px; font-weight: 800; margin: 5px 0 0 0; }
        .title { font-size: 14px; color: ${subTextColor}; margin-top: 4px; }
        .company { font-size: 13px; color: ${subTextColor}; margin-top: 2px; }
        .greeting-box { background: ${boxBg}; border-left: 4px solid #6366F1; padding: 12px; border-radius: 10px; font-size: 13px; font-style: italic; margin: 15px 0; text-align: left; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px; }
        .tag { background: #EEF2FF; color: #4F46E5; font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 600; }
        .btn-save { background: #FACC15; color: #0F172A; font-weight: 800; padding: 14px; border-radius: 30px; text-decoration: none; display: block; width: 100%; font-size: 15px; box-shadow: 0 4px 12px rgba(250,204,21,0.4); }
        .links-list { margin-top: 20px; text-align: left; }
        .link-item { display: flex; align-items: center; padding: 12px; background: ${boxBg}; border-radius: 12px; margin-bottom: 8px; text-decoration: none; color: ${textColor}; font-weight: 600; font-size: 14px; }
        .link-item span { margin-right: 12px; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="cover"></div>
        <div class="avatar-box">
          <img src="${userProfile.avatar}" class="avatar" />
        </div>
        <div class="content">
          <h2 class="name">${userProfile.name}</h2>
          <div class="title">${userProfile.title}</div>
          <div class="company">🏢 ${userProfile.company}</div>

          <div class="greeting-box">💬 <b>Lời chào NFC:</b> "${userProfile.greeting}"</div>
          <div class="tags">${tagsHtml}</div>

          <a href="/api/contact/${userProfile.id}/vcard" class="btn-save">👤+ Save Contact to Phone</a>

          <div class="links-list">
            <a href="tel:${userProfile.phone}" class="link-item"><span>📞</span> Gọi ngay: ${userProfile.phone}</a>
            <a href="https://zalo.me/${userProfile.zalo}" target="_blank" class="link-item"><span>💬</span> Chat Zalo: ${userProfile.zalo}</a>
            <a href="mailto:${userProfile.email}" class="link-item"><span>✉️</span> Email: ${userProfile.email}</a>
            <a href="${userProfile.github}" target="_blank" class="link-item"><span>💻</span> GitHub Hồ sơ</a>
            <a href="${userProfile.linkedin}" target="_blank" class="link-item"><span>💼</span> LinkedIn Hồ sơ</a>
            <a href="${userProfile.facebook}" target="_blank" class="link-item"><span>📘</span> Facebook Cá nhân</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Online port ${PORT}`));