import fs from 'fs';
import path from 'path';

// --- Helpers & Types ---
const DATA_DIR = path.join(process.cwd(), 'public/data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple seeded PRNG
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const random = mulberry32(12345); // deterministic

function randBetween(min: number, max: number) {
  return min + random() * (max - min);
}

function generateGrid(bbox: [number, number, number, number], cols: number, rows: number) {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const cellWidth = (maxLng - minLng) / cols;
  const cellHeight = (maxLat - minLat) / rows;
  const features: any[] = [];
  
  // Gaussian hotspots for prospectivity
  const hotspots = [
    { x: 10, y: 10, intensity: 0.8, spread: 5 },
    { x: 30, y: 30, intensity: 0.9, spread: 4 },
    { x: 25, y: 15, intensity: 0.7, spread: 6 },
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lng = minLng + c * cellWidth;
      const lat = minLat + r * cellHeight;
      
      let baseP = 0;
      for (const h of hotspots) {
        const distSq = Math.pow(c - h.x, 2) + Math.pow(r - h.y, 2);
        baseP += h.intensity * Math.exp(-distSq / (2 * Math.pow(h.spread, 2)));
      }
      
      const noise = (random() - 0.5) * 0.2;
      const p_rf = Math.min(Math.max(baseP + noise, 0), 1);
      const p_xgb = Math.min(Math.max(baseP + noise + (random() - 0.5)*0.1, 0), 1);
      const p_wsm = Math.min(Math.max((p_rf + random()*0.3) * 0.8, 0), 1);
      
      let cls = "low";
      if (p_xgb > 0.66) cls = "high";
      else if (p_xgb > 0.33) cls = "medium";
      
      features.push({
        type: "Feature",
        id: `cell_${r}_${c}`,
        geometry: {
          type: "Polygon",
          coordinates: [[
            [lng, lat],
            [lng + cellWidth, lat],
            [lng + cellWidth, lat + cellHeight],
            [lng, lat + cellHeight],
            [lng, lat]
          ]]
        },
        properties: {
          id: `cell_${r}_${c}`,
          p_wsm: parseFloat(p_wsm.toFixed(3)),
          p_rf: parseFloat(p_rf.toFixed(3)),
          p_xgb: parseFloat(p_xgb.toFixed(3)),
          class: cls,
          confidence: parseFloat(randBetween(0.5, 0.95).toFixed(2)),
          lithology: random() > 0.5 ? "Schist" : "Quartzite",
          fault_dist_m: Math.floor(randBetween(50, 2000)),
          ndvi: parseFloat(randBetween(0.1, 0.8).toFixed(2)),
          ndmi: parseFloat(randBetween(-0.2, 0.6).toFixed(2)),
          lst_c: parseFloat(randBetween(25, 45).toFixed(1)),
          slope_deg: parseFloat(randBetween(0, 35).toFixed(1))
        }
      });
    }
  }
  return features;
}

// --- Main Generation ---
function main() {
  const bbox: [number, number, number, number] = [80.0, 21.55, 80.3, 21.85];
  const gridFeatures = generateGrid(bbox, 40, 40);

  // 1. prospectivity.geojson
  fs.writeFileSync(path.join(DATA_DIR, 'prospectivity.geojson'), JSON.stringify({
    type: "FeatureCollection",
    features: gridFeatures
  }, null, 2));

  // 2. shap.json
  const shapData: Record<string, any[]> = {};
  gridFeatures.forEach(f => {
    shapData[f.properties.id] = [
      { feature: "Fault Distance", value: randBetween(-0.1, 0.3) },
      { feature: "Lithology", value: randBetween(-0.05, 0.2) },
      { feature: "Slope", value: randBetween(-0.1, 0.1) },
      { feature: "NDVI", value: randBetween(-0.1, 0.05) },
      { feature: "LST", value: randBetween(-0.05, 0.05) }
    ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  });
  fs.writeFileSync(path.join(DATA_DIR, 'shap.json'), JSON.stringify(shapData, null, 2));

  // 3. occurrences.geojson
  const occurrences = {
    type: "FeatureCollection",
    features: Array.from({ length: 8 }).map((_, i) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [randBetween(80.05, 80.25), randBetween(21.6, 21.8)]
      },
      properties: { name: `Occurrence ${i + 1}`, type: "Known Pit" }
    }))
  };
  fs.writeFileSync(path.join(DATA_DIR, 'occurrences.geojson'), JSON.stringify(occurrences, null, 2));

  // 4. leases.geojson
  const leases = {
    type: "FeatureCollection",
    features: Array.from({ length: 4 }).map((_, i) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [randBetween(80.02, 80.28), randBetween(21.57, 21.82)]
      },
      properties: { "mine name": `MOIL Lease ${String.fromCharCode(65 + i)}` }
    }))
  };
  fs.writeFileSync(path.join(DATA_DIR, 'leases.geojson'), JSON.stringify(leases, null, 2));

  // 5. faults.geojson
  const faults = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[80.05, 21.6], [80.15, 21.7], [80.28, 21.75]]
        },
        properties: { name: "Main NE Fault" }
      }
    ]
  };
  fs.writeFileSync(path.join(DATA_DIR, 'faults.geojson'), JSON.stringify(faults, null, 2));

  // 6. drill_targets.json
  const targets = Array.from({ length: 5 }).map((_, i) => ({
    rank: i + 1,
    lat: randBetween(21.6, 21.8),
    lng: randBetween(80.05, 80.25),
    score: parseFloat(randBetween(0.85, 0.98).toFixed(2)),
    rationale: "High structural complexity intersecting competent lithology."
  })).sort((a, b) => b.score - a.score);
  fs.writeFileSync(path.join(DATA_DIR, 'drill_targets.json'), JSON.stringify(targets, null, 2));

  // 7. production.json
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const production = {
    mines: Array.from({ length: 3 }).map((_, i) => {
      const isMonsoon = (m: string) => ["Jul", "Aug", "Sep"].includes(m);
      return {
        id: `m${i+1}`,
        name: `Tirodi Complex ${i+1}`,
        months: months.map(m => {
          const planned = 10000 + randBetween(-500, 500);
          const drop = isMonsoon(m) ? randBetween(1000, 3000) : randBetween(0, 500);
          const predicted = planned - drop;
          return {
            month: m,
            planned: Math.round(planned),
            predicted: Math.round(predicted),
            lower: Math.round(predicted * 0.8),
            upper: Math.round(predicted * 1.2)
          };
        }),
        shortfall_t: Math.round(randBetween(500, 2500)),
        risk: i === 0 ? "High" : i === 1 ? "Medium" : "Low",
        drivers: [
          { factor: "Rainfall Anomaly", impact: randBetween(0.3, 0.6) },
          { factor: "Equipment Downtime", impact: randBetween(0.1, 0.3) },
          { factor: "Manpower Shortage", impact: randBetween(0.05, 0.2) }
        ].sort((a, b) => b.impact - a.impact)
      };
    })
  };
  fs.writeFileSync(path.join(DATA_DIR, 'production.json'), JSON.stringify(production, null, 2));

  // 8. alerts.json
  const alerts = [
    { id: "a1", severity: "high", mine: "Tirodi Complex 1", driver: "Rainfall", date: "2026-09-15", message: "Heavy rainfall predicted to halt pit ops." },
    { id: "a2", severity: "medium", mine: "Tirodi Complex 2", driver: "Equipment", date: "2026-09-18", message: "Excavator EX-04 due for critical maintenance." }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'alerts.json'), JSON.stringify(alerts, null, 2));

  // 9. kpis.json
  const kpis = [
    { id: "k1", label: "High-Prospectivity Area", value: "45.2", unit: "km²", trend: 2.1, status: "good" },
    { id: "k2", label: "Known Mn Occurrences", value: "24", trend: 0, status: "good" },
    { id: "k3", label: "Model Confidence (AUC)", value: "0.89", trend: 5.4, status: "good" },
    { id: "k4", label: "Est. Prod. Shortfall", value: "2,450", unit: "t", trend: -12.5, status: "critical" }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'kpis.json'), JSON.stringify(kpis, null, 2));

  // 10. scenario_model.json
  const scenarioModel = {
    baseline_tonnes: 120000,
    coefficients: {
      equipment_availability: 500, // +1% avail = +500t
      blasting_delay_days: -1200,  // +1 day delay = -1200t
      rainfall_anomaly: -800,      // +1% rain = -800t
      manpower: 300                // +1% manpower = +300t
    }
  };
  fs.writeFileSync(path.join(DATA_DIR, 'scenario_model.json'), JSON.stringify(scenarioModel, null, 2));

  console.log("Mock data generated successfully in public/data/");
}

main();
