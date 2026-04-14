const BASE = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f4f5; }
  </style>
`;

function wrapper(content: string) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE}</head>
<body style="background:#f4f4f5;padding:32px 16px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#000;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <p style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;margin-bottom:4px;">The Business Clock</p>
            <p style="color:#9ca3af;font-size:13px;">ساعة العمل</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:40px;border-right:1px solid #e5e7eb;border-left:1px solid #e5e7eb;">
            ${content}
          </td>
        </tr>

        <!-- Spam notice -->
        <tr>
          <td style="background:#fefce8;border:1px solid #fde68a;border-radius:0 0 0 0;padding:14px 40px;">
            <p style="color:#92400e;font-size:12px;text-align:center;">
              💡 إذا لم يصلك هذا البريد في صندوق الوارد، تحقق من مجلد <strong>البريد غير المرغوب (Spam/Junk)</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="color:#9ca3af;font-size:11px;">هذا البريد أُرسل تلقائياً من The Business Clock</p>
            <p style="color:#d1d5db;font-size:11px;margin-top:4px;">© ${new Date().getFullYear()} The Business Clock — جميع الحقوق محفوظة</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Confirm email (Supabase sends this) ──
export function confirmEmailTemplate(confirmUrl: string) {
  return wrapper(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;background:#f0fdf4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:28px;">✉️</span>
      </div>
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin-bottom:8px;">تأكيد بريدك الإلكتروني</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;">مرحباً بك في The Business Clock!<br>اضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك.</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${confirmUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 40px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
        تأكيد البريد الإلكتروني ←
      </a>
    </div>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">
      إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد.
    </p>
  `);
}

// ── Password reset ──
export function resetPasswordTemplate(resetUrl: string) {
  return wrapper(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:56px;height:56px;background:#fff7ed;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:28px;">🔐</span>
      </div>
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin-bottom:8px;">إعادة تعيين كلمة المرور</h1>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;">تلقينا طلباً لإعادة تعيين كلمة مرور حسابك.<br>اضغط على الزر أدناه لإنشاء كلمة مرور جديدة.</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${resetUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 40px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
        إعادة تعيين كلمة المرور ←
      </a>
    </div>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">
      إذا لم تطلب ذلك، يمكنك تجاهل هذا البريد — لن يتغير حسابك.
    </p>
    <p style="color:#d1d5db;font-size:11px;text-align:center;margin-top:8px;">
      ينتهي هذا الرابط خلال 24 ساعة.
    </p>
  `);
}

// ── Contact form message (to admin) ──
export function contactMessageTemplate(data: {
  name: string; company?: string; email: string; phone?: string; message: string;
}) {
  const rows = [
    ["الاسم", data.name],
    ["البريد الإلكتروني", data.email],
    data.phone ? ["رقم الهاتف", data.phone] : null,
    data.company ? ["الشركة", data.company] : null,
  ].filter(Boolean) as [string, string][];

  const tableRows = rows.map(([label, val], i) =>
    `<tr style="background:${i % 2 === 0 ? "#fff" : "#f9fafb"};">
      <td style="padding:10px 14px;font-weight:600;color:#374151;font-size:13px;width:40%;border:1px solid #e5e7eb;">${label}</td>
      <td style="padding:10px 14px;color:#111827;font-size:13px;border:1px solid #e5e7eb;">${val}</td>
    </tr>`
  ).join("");

  return wrapper(`
    <div style="margin-bottom:24px;">
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:4px;">رسالة تواصل جديدة 💬</h1>
      <p style="color:#6b7280;font-size:13px;">وصلتك رسالة من نموذج التواصل في الموقع</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      ${tableRows}
    </table>

    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-top:8px;">
      <p style="font-size:12px;font-weight:600;color:#6b7280;margin-bottom:8px;">الرسالة</p>
      <p style="font-size:14px;color:#111827;line-height:1.7;white-space:pre-line;">${data.message}</p>
    </div>
  `);
}

// ── Survey result notification (to admin) ──
export function surveyResultTemplate(data: {
  name: string; email: string; phone?: string;
  surveyType: string; language: string;
  totalScore: number; percentage: number;
  age?: string; businessType?: string; capital?: string;
  projectAge?: string; staffCount?: string;
}) {
  const typeLabel: Record<string, string> = {
    explorers: "مستكشف", entrepreneurs: "رائد أعمال", companies: "صاحب شركة",
  };

  const rows = [
    ["الاسم", data.name],
    ["البريد الإلكتروني", data.email],
    ["رقم الهاتف", data.phone || "—"],
    ["نوع الاختبار", typeLabel[data.surveyType] || data.surveyType],
    ["اللغة", data.language === "ar" ? "عربي" : "English"],
    data.age ? ["العمر", data.age] : null,
    data.businessType ? ["نوع العمل", data.businessType] : null,
    data.capital ? ["رأس المال", data.capital] : null,
    data.projectAge ? ["عمر المشروع", data.projectAge + " سنوات"] : null,
    data.staffCount ? ["عدد الموظفين", data.staffCount] : null,
  ].filter(Boolean) as [string, string][];

  const tableRows = rows.map(([label, val], i) =>
    `<tr style="background:${i % 2 === 0 ? "#fff" : "#f9fafb"};">
      <td style="padding:10px 14px;font-weight:600;color:#374151;font-size:13px;width:40%;border:1px solid #e5e7eb;">${label}</td>
      <td style="padding:10px 14px;color:#111827;font-size:13px;border:1px solid #e5e7eb;">${val}</td>
    </tr>`
  ).join("");

  return wrapper(`
    <div style="margin-bottom:24px;">
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:4px;">نتيجة اختبار جديدة 📋</h1>
      <p style="color:#6b7280;font-size:13px;">تم إرسال نتيجة اختبار جاهزية جديدة</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      ${tableRows}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding-left:8px;">
          <div style="background:#000;color:#fff;padding:20px;border-radius:12px;text-align:center;">
            <p style="font-size:12px;opacity:0.7;margin-bottom:6px;">المجموع</p>
            <p style="font-size:28px;font-weight:700;">${data.totalScore}<span style="font-size:14px;opacity:0.6;"> / 360</span></p>
          </div>
        </td>
        <td width="50%" style="padding-right:8px;">
          <div style="background:#1d4ed8;color:#fff;padding:20px;border-radius:12px;text-align:center;">
            <p style="font-size:12px;opacity:0.7;margin-bottom:6px;">النسبة</p>
            <p style="font-size:28px;font-weight:700;">${data.percentage}%</p>
          </div>
        </td>
      </tr>
    </table>
  `);
}
