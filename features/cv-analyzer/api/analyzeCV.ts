import { GoogleGenAI } from "@google/genai";
import { CVAnalysisResult } from "../model/types";

export interface FileAttachment {
  base64: string;
  mimeType: string;
}

export const analyzeCV = async (
  apiKey: string,
  attachment: FileAttachment,
  language: string = 'tr'
): Promise<CVAnalysisResult> => {
  if (!apiKey) throw new Error("API Key gerekli");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    Sen bir profesyonel İK uzmanı ve ATS (Applicant Tracking System) analistisin.
    Yüklenen CV'yi detaylı analiz et ve aşağıdaki JSON formatında yanıt ver.
    YANIT DİLİ: ${language === 'tr' ? 'TÜRKÇE' : 'İNGİLİZCE (ENGLISH)'}

    {
      "scores": {
        "overall": 0-100 arası genel puan,
        "format": 0-100 arası format puanı,
        "content": 0-100 arası içerik puanı,
        "atsCompatibility": 0-100 arası ATS uyumluluk puanı,
        "keywords": 0-100 arası anahtar kelime puanı,
        "readability": 0-100 arası okunabilirlik puanı
      },
      "strengths": [
        {
          "id": "str-1",
          "title": "Güçlü yön başlığı (${language === 'tr' ? 'Türkçe' : 'English'})",
          "description": "Detaylı açıklama (${language === 'tr' ? 'Türkçe' : 'English'})",
          "category": "format|content|keywords|structure"
        }
      ],
      "improvements": [
        {
          "id": "imp-1",
          "title": "İyileştirme önerisi başlığı (${language === 'tr' ? 'Türkçe' : 'English'})",
          "description": "Detaylı açıklama ve nasıl düzeltileceği (${language === 'tr' ? 'Türkçe' : 'English'})",
          "priority": "high|medium|low",
          "category": "format|content|keywords|structure"
        }
      ],
      "summary": "CV'nin genel değerlendirmesi (2-3 cümle) (${language === 'tr' ? 'Türkçe' : 'English'})",
      "keywordsFound": ["bulunan", "anahtar", "kelimeler"],
      "keywordsMissing": ["eksik", "önerilen", "kelimeler"],
      "atsWarnings": ["ATS uyumluluk uyarıları (${language === 'tr' ? 'Türkçe' : 'English'})"]
    }

    DEĞERLENDİRME KRİTERLERİ (${language === 'tr' ? 'Türkçe olarak değerlendir' : 'Evaluated in English'}):
    
    1. FORMAT (format):
       - Tutarlı font kullanımı
       - Uygun margin ve boşluklar
       - Bölüm başlıkları net mi
       - Bullet point kullanımı
       - Tarih formatları tutarlı mı

    2. İÇERİK (content):
       - Profesyonel özet kalitesi
       - Deneyim açıklamalarında ölçülebilir başarılar
       - Action verb kullanımı
       - İlgili eğitim ve sertifikalar
       - Proje detayları yeterli mi

    3. ATS UYUMLULUĞU (atsCompatibility):
       - Standart bölüm başlıkları kullanılmış mı
       - Tablo veya grafik içermiyor mu
       - Uygun dosya formatı
       - Parseable layout
       - Header/Footer sorunları

    4. ANAHTAR KELİMELER (keywords):
       - Sektöre özgü terimler
       - Teknik beceriler
       - Soft skills
       - Pozisyona uygun kelimeler

    5. OKUNABİLİRLİK (readability):
       - Cümle uzunlukları
       - Paragraf yapısı
       - Jargon kullanımı
       - Genel akış

    JSON formatında yanıt ver, başka açıklama ekleme.
  `;

  const cleanBase64 = attachment.base64.replace(/^data:(.*);base64,/, "");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: attachment.mimeType,
            },
          },
          {
            text: "Bu CV'yi analiz et ve değerlendir.",
          },
        ],
      },
    ],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini'den yanıt alınamadı");

  // JSON parse
  let cleanText = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }

  const result: CVAnalysisResult = JSON.parse(cleanText);
  return result;
};
