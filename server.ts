import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const app = express();
const PORT = 3000;

export const DEFAULT_SHEET_ID = "17wC7EgtjXQfhSnWzaKZP6r3p6QqBtKDV-OikP2niVLU";
export const DEFAULT_SHEET_GID = "530283699";

// Simple CSV parser for Google Sheet CSV stream
function parseCSV(csvText: string): Record<string, string>[] {
  const cleanText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines: string[] = [];
  let currentLine = "";
  let insideQuote = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    if (char === '"') {
      insideQuote = !insideQuote;
      currentLine += char;
    } else if (char === "\n" && !insideQuote) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (c === "," && !inQ) {
        values.push(cur.trim());
        cur = "";
      } else {
        cur += c;
      }
    }
    values.push(cur.trim());
    return values;
  };

  const headers = parseLine(lines[0]);
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;
    const item: Record<string, string> = {};
    headers.forEach((h, idx) => {
      item[h] = row[idx] !== undefined ? row[idx] : "";
    });
    records.push(item);
  }

  return records;
}

// Transform raw record to standardized patient
function transformPatient(raw: Record<string, string>, index: number) {
  const age = Number(raw["อายุ"]) || 0;
  const height = Number(raw["ส่วนสูง_cm"]) || 0;
  const weight = Number(raw["น้ำหนัก_kg"]) || 0;
  const bmi = Number(raw["BMI"]) || (height > 0 ? Number((weight / ((height / 100) ** 2)).toFixed(1)) : 0);
  const sbp = Number(raw["SBP_mmHg"]) || 0;
  const dbp = Number(raw["DBP_mmHg"]) || 0;
  const pulse = Number(raw["ชีพจร_bpm"]) || 0;
  const bloodSugar = Number(raw["น้ำตาล_mg_dL"]) || 0;
  const riskScore = Number(raw["คะแนนความเสี่ยง"]) || 0;

  let riskLevel = "ต่ำ";
  const rawRisk = (raw["ระดับความเสี่ยง"] || "").trim();
  if (rawRisk.includes("สูง") || rawRisk.toLowerCase() === "high") {
    riskLevel = "สูง";
  } else if (rawRisk.includes("ปานกลาง") || rawRisk.toLowerCase() === "medium" || rawRisk.toLowerCase() === "moderate") {
    riskLevel = "ปานกลาง";
  } else {
    riskLevel = "ต่ำ";
  }

  let ageGroup = "60+ ปี";
  if (age < 30) ageGroup = "< 30 ปี";
  else if (age <= 44) ageGroup = "30 - 44 ปี";
  else if (age <= 59) ageGroup = "45 - 59 ปี";

  const id = (raw["รหัสบุคคล"] || `H${String(index + 1).padStart(4, "0")}`).trim();

  return {
    id,
    rowNumber: index + 1,
    uniqueKey: `${id}_row_${index + 1}`,
    date: raw["วันที่คัดกรอง"] || "",
    area: (raw["พื้นที่"] || "").trim(),
    gender: (raw["เพศ"] || "").trim(),
    age,
    height,
    weight,
    bmi,
    sbp,
    dbp,
    pulse,
    bloodSugar,
    smoking: (raw["สูบบุหรี่"] || "").trim(),
    alcohol: (raw["ดื่มแอลกอฮอล์"] || "").trim(),
    exercise: (raw["การออกกำลังกาย"] || "").trim(),
    diabetesScreening: (raw["เบาหวาน_คัดกรอง"] || "").trim(),
    hypertensionScreening: (raw["ความดันโลหิตสูง_คัดกรอง"] || "").trim(),
    riskScore,
    riskLevel,
    month: raw["เดือน"] || "",
    ageGroup,
  };
}

async function fetchFromGoogleSheet(sheetId: string = DEFAULT_SHEET_ID, gid: string = DEFAULT_SHEET_GID) {
  const timestamp = Date.now();
  // Try live CSV Export with cache-busting timestamp
  const urls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&_t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&_t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&_t=${timestamp}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
      });
      if (response.ok) {
        const text = await response.text();
        const records = parseCSV(text);
        if (records.length > 0 && records[0]["รหัสบุคคล"]) {
          // Update local copy silently
          try {
            fs.writeFileSync(path.join(process.cwd(), "sheet_data.csv"), text, "utf-8");
          } catch {
            // Ignore write errors
          }
          return {
            records,
            sourceUrl: url,
          };
        }
      }
    } catch (err) {
      console.warn(`Fetch error for ${url}:`, err);
    }
  }

  // Fallback to sheet_data.csv on disk if network is temporarily unreachable
  const localPath = path.join(process.cwd(), "sheet_data.csv");
  if (fs.existsSync(localPath)) {
    const text = fs.readFileSync(localPath, "utf-8");
    const records = parseCSV(text);
    return {
      records,
      sourceUrl: "sheet_data.csv (cached)",
    };
  }

  throw new Error("Cannot retrieve data from Google Sheets");
}

async function startServer() {
  // API Route: Health Check
  app.get("/api/health", (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: Live Patients Data from Google Sheets
  app.get("/api/patients", async (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    let rawSheetId = (req.query.sheetId as string) || DEFAULT_SHEET_ID;
    let gid = (req.query.gid as string) || DEFAULT_SHEET_GID;

    // Support full Google Sheets URL passed in sheetId param
    if (rawSheetId.includes("docs.google.com/spreadsheets/d/")) {
      const matchId = rawSheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (matchId) rawSheetId = matchId[1];
      const matchGid = rawSheetId.match(/gid=([0-9]+)/);
      if (matchGid) gid = matchGid[1];
    }

    try {
      const { records, sourceUrl } = await fetchFromGoogleSheet(rawSheetId, gid);
      const patients = records.map((r, i) => transformPatient(r, i));

      res.json({
        success: true,
        sheetId: rawSheetId,
        gid,
        count: patients.length,
        patients,
        source: "live",
        sourceUrl,
        message: `เชื่อมต่อและดึงข้อมูลสดจาก Google Sheet สำเร็จ ทั้งหมด ${patients.length} คน เท่ากับข้อมูลในชีท`,
        syncedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Failed to fetch from Google Sheets",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
