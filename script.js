// ==========================================
//   مولّد QR - الكود الرئيسي
// ==========================================

// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function () {

    // ====== العناصر ======
    const textInput     = document.getElementById('text-input');
    const sizeInput     = document.getElementById('size-input');
    const colorDark     = document.getElementById('color-dark');
    const colorLight    = document.getElementById('color-light');
    const generateBtn   = document.getElementById('generate-btn');
    const qrcodeDiv     = document.getElementById('qrcode');
    const actionsDiv    = document.getElementById('actions');
    const downloadBtn   = document.getElementById('download-btn');
    const copyBtn       = document.getElementById('copy-btn');

    // ====== توليد QR ======
    generateBtn.addEventListener('click', function () {
        const text = textInput.value.trim();

        // تحقق من وجود نص
        if (text === '') {
            alert('⚠️ الرجاء إدخال نص أو رابط أولاً');
            textInput.focus();
            return;
        }

        // حجم الـ QR (بحد أدنى وأقصى)
        let size = parseInt(sizeInput.value) || 300;
        if (size < 100) size = 100;
        if (size > 1000) size = 1000;

        // ألوان
        const darkColor  = colorDark.value;
        const lightColor = colorLight.value;

        // مسح النتيجة القديمة
        qrcodeDiv.innerHTML = '';

        // توليد QR جديد
        try {
            new QRCode(qrcodeDiv, {
                text: text,
                width: size,
                height: size,
                colorDark: darkColor,
                colorLight: lightColor,
                correctLevel: QRCode.CorrectLevel.H
            });

            // إظهار أزرار الإجراءات
            actionsDiv.style.display = 'flex';

        } catch (error) {
            alert('❌ حدث خطأ أثناء توليد QR: ' + error.message);
        }
    });

    // ====== تحميل الصورة ======
    downloadBtn.addEventListener('click', function () {
        const canvas = qrcodeDiv.querySelector('canvas');
        const img    = qrcodeDiv.querySelector('img');

        let dataURL = '';

        if (canvas) {
            dataURL = canvas.toDataURL('image/png');
        } else if (img && img.src) {
            dataURL = img.src;
        } else {
            alert('⚠️ لا يوجد QR للتحميل');
            return;
        }

        // إنشاء رابط تحميل
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // ====== نسخ الصورة ======
    copyBtn.addEventListener('click', async function () {
        const canvas = qrcodeDiv.querySelector('canvas');
        const img    = qrcodeDiv.querySelector('img');

        try {
            let blob = null;

            if (canvas) {
                blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            } else if (img && img.src) {
                const response = await fetch(img.src);
                blob = await response.blob();
            }

            if (!blob) {
                alert('⚠️ لا يوجد QR للنسخ');
                return;
            }

            // نسخ إلى الحافظة
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            alert('✅ تم نسخ الصورة إلى الحافظة');

        } catch (error) {
            alert('❌ فشل النسخ: ' + error.message);
        }
    });

    // ====== توليد QR عند الضغط على Enter ======
    textInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });

});