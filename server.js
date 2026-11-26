const express = require('express');
const cors = require('cors');
const vCardsJS = require('vcards-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// Profile cấu hình nâng cao
let userProfile = {
  id: "candong",
  name: "Tô Đông Cẩn",
  title: "Data & Software Engineer",
  company: "Tech Architecture Team",
  greeting: "Chào bạn! Rất vui được gặp và kết nối cùng bạn hôm nay.",
  gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z0N3J4ZHRxdWsybDNubHh4b2d5d3p0NmV0ZzEybzZ2czJzNWt6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vR16pumsCYTCA4U/giphy.gif",
  theme: "dark", // 'dark' | 'light' | 'gold'
  phone: "0901234567",
  email: "can.todong@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  zalo: "https://zalo.me/0901234567",
  facebook: "https://facebook.com",
  telegram: "https://t.me/candong",
  tags: ["Data Engineer", "React Native", "Docker", "SQL Server"]
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

// Trang Web hiển thị công khai cho người nhận quét QR / NFC
app.get('/p/:id', (req, res) => {
  const isDark = userProfile.theme === 'dark';
  const bgColor = isDark ? '#0F172A' : '#F8FAFC';
  const cardColor = isDark ? '#1E293B' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';

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
        .card { background: ${cardColor}; border-radius: 24px; max-width: 400px; width: 100%; padding: 20px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
        .gif-avatar { width: 110px; height: 110px; border-radius: 50%; border: 3px solid #6366F1; object-fit: cover; }
        .greeting-box { background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366F1; padding: 12px; border-radius: 8px; font-size: 13px; font-style: italic; margin: 15px 0; text-align: left; }
        .btn-action { display: flex; align-items: center; justify-content: center; background: #6366F1; color: white; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-bottom: 10px; font-size: 14px; }
        .btn-zalo { background: #0068FF; }
        .btn-vcard { background: #EAB308; color: #0F172A; }
        .location-info { font-size: 11px; opacity: 0.7; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="card">
        <img src="${userProfile.gifUrl}" class="gif-avatar" />
        <h2 style="margin: 10px 0 2px 0;">${userProfile.name}</h2>
        <div style="font-size: 14px; opacity: 0.8;">${userProfile.title}</div>
        <div style="font-size: 12px; opacity: 0.6;">🏢 ${userProfile.company}</div>

        <div class="greeting-box">
          💬 <b>Lời chào:</b> "${userProfile.greeting}"
        </div>

        <a href="/api/contact/${userProfile.id}/vcard" class="btn-action btn-vcard">👤 Save Contact to Phone</a>
        
        <a id="btnSendZalo" href="${userProfile.zalo}" target="_blank" class="btn-action btn-zalo">💬 Gửi lời chào lại qua Zalo</a>
        <a id="btnSendMail" href="mailto:${userProfile.email}?subject=Kết nối I-Card&body=${encodeURIComponent(userProfile.greeting)}" class="btn-action">✉️ Gửi Email kết nối</a>

        <div class="location-info" id="locText">📍 Đang định vị vị trí chạm...</div>
      </div>

      <script>
        // Tự động định vị GPS khi người nhận mở trang
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locStr = " (Vị trí chạm: " + lat.toFixed(4) + ", " + lng.toFixed(4) + ")";
            document.getElementById('locText').innerText = "📍 Vị trí chạm: " + lat.toFixed(4) + ", " + lng.toFixed(4);
            
            // Cập nhật link Zalo & Mail có đính kèm tọa độ vị trí
            var mailBtn = document.getElementById('btnSendMail');
            mailBtn.href = "mailto:${userProfile.email}?subject=Kết nối I-Card&body=" + encodeURIComponent("${userProfile.greeting}" + locStr);
          });
        }
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server I-Card nâng cấp chạy tại port ${PORT}`));