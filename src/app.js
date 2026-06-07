const scenarios = [
  {
    id: "metro-soft-ground",
    name: "城市地铁软土穿越 / Urban metro in soft ground",
    chainage: "K12+380",
    method: "tbm",
    groundClass: "IV",
    crownSettlement: 28,
    convergence: 14,
    surfaceSettlement: 34,
    waterChange: 2.4,
    supportLag: 5.5,
    buildingDistance: 18,
    advanceRate: 12,
    facePressureDelta: 46
  },
  {
    id: "mountain-fault",
    name: "山岭隧道断层破碎带 / Mountain tunnel fault fracture zone",
    chainage: "YK48+920",
    method: "natm",
    groundClass: "V",
    crownSettlement: 42,
    convergence: 31,
    surfaceSettlement: 8,
    waterChange: 6.8,
    supportLag: 9,
    buildingDistance: 92,
    advanceRate: 3.5,
    facePressureDelta: 22
  },
  {
    id: "station-cutcover",
    name: "车站明挖邻近既有建筑 / Cut-and-cover station near existing buildings",
    chainage: "DK03+115",
    method: "cutcover",
    groundClass: "III",
    crownSettlement: 10,
    convergence: 8,
    surfaceSettlement: 58,
    waterChange: 3.2,
    supportLag: 2,
    buildingDistance: 9,
    advanceRate: 5,
    facePressureDelta: 14
  }
];

const references = [
  {
    name: "IfcOpenShell",
    url: "https://github.com/IfcOpenShell/IfcOpenShell",
    license: "LGPL/GPL",
    focus: "IFC/BIM 解析、几何与模型数据生态 / IFC/BIM parsing, geometry, and model data ecosystem",
    influence: "为后续接入 BIM 构件、衬砌环片、建筑物资产台账提供方向。 / A route for connecting BIM components, lining segments, and building asset registers."
  },
  {
    name: "PyNite",
    url: "https://github.com/JWock82/Pynite",
    license: "MIT",
    focus: "结构有限元、荷载组合、位移和内力结果 / Structural finite elements, load combinations, displacement, and force results",
    influence: "启发项目输出可解释工程结果，而不只展示抽象风险分。 / Encourages explainable engineering outputs instead of only abstract risk scores."
  },
  {
    name: "pyGIMLi",
    url: "https://github.com/gimli-org/pyGIMLi",
    license: "Apache-2.0",
    focus: "地球物理建模、反演、2D/3D 网格 / Geophysical modeling, inversion, and 2D/3D meshes",
    influence: "启发地质异常、富水带和探测结果与施工风险联动。 / Inspires linking geological anomalies, water-rich zones, and survey results with construction risk."
  },
  {
    name: "bedrock-ge",
    url: "https://github.com/bedrock-engineer/bedrock-ge",
    license: "Apache-2.0",
    focus: "岩土、AGS、BIM、地下工程数据 / Geotechnical, AGS, BIM, and underground engineering data",
    influence: "启发钻孔、地层、地下资产数据的统一整理。 / Inspires unified organization of boreholes, strata, and underground asset data."
  },
  {
    name: "openpile",
    url: "https://github.com/TchilDill/openpile",
    license: "开源 / Open source",
    focus: "桩基、土层、Winkler 梁模型 / Piles, soil layers, and Winkler beam models",
    influence: "启发支护结构与周边土体的简化响应建模。 / Inspires simplified response modeling between support structures and surrounding ground."
  },
  {
    name: "GeoEq",
    url: "https://geoeq.org/",
    license: "MIT",
    focus: "岩土公式、单位、可追溯计算 / Geotechnical formulas, units, and traceable calculations",
    influence: "启发在 README 中清楚说明指标单位、阈值和适用边界。 / Inspires clear units, thresholds, and applicability notes in documentation."
  }
];

const inputs = [
  "crownSettlement",
  "convergence",
  "surfaceSettlement",
  "waterChange",
  "supportLag",
  "buildingDistance",
  "advanceRate",
  "facePressureDelta"
];

const weightsByMethod = {
  tbm: {
    crownSettlement: 0.13,
    convergence: 0.09,
    surfaceSettlement: 0.18,
    waterChange: 0.12,
    supportLag: 0.1,
    buildingDistance: 0.16,
    advanceRate: 0.08,
    facePressureDelta: 0.14
  },
  natm: {
    crownSettlement: 0.18,
    convergence: 0.18,
    surfaceSettlement: 0.08,
    waterChange: 0.16,
    supportLag: 0.18,
    buildingDistance: 0.07,
    advanceRate: 0.07,
    facePressureDelta: 0.08
  },
  cutcover: {
    crownSettlement: 0.08,
    convergence: 0.07,
    surfaceSettlement: 0.22,
    waterChange: 0.16,
    supportLag: 0.12,
    buildingDistance: 0.22,
    advanceRate: 0.08,
    facePressureDelta: 0.05
  }
};

const driverLabels = {
  crownSettlement: "拱顶沉降 / Crown settlement",
  convergence: "周边收敛 / Convergence",
  surfaceSettlement: "地表沉降 / Surface settlement",
  waterChange: "水位变化 / Groundwater change",
  supportLag: "支护滞后 / Support lag",
  buildingDistance: "建筑物邻近 / Building proximity",
  advanceRate: "掘进速度 / Advance rate",
  facePressureDelta: "压力偏差 / Pressure deviation"
};

const state = { ...scenarios[0] };

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(metric, value) {
  const v = Number(value);
  const rules = {
    crownSettlement: () => clamp((v / 55) * 100, 0, 100),
    convergence: () => clamp((v / 42) * 100, 0, 100),
    surfaceSettlement: () => clamp((v / 70) * 100, 0, 100),
    waterChange: () => clamp((v / 7.5) * 100, 0, 100),
    supportLag: () => clamp((v / 12) * 100, 0, 100),
    buildingDistance: () => clamp(((55 - v) / 52) * 100, 0, 100),
    advanceRate: () => clamp(((v - 4) / 16) * 100, 0, 100),
    facePressureDelta: () => clamp((v / 110) * 100, 0, 100)
  };
  return rules[metric]();
}

function groundMultiplier(groundClass) {
  return { I: 0.76, II: 0.88, III: 1, IV: 1.14, V: 1.28 }[groundClass] || 1;
}

function evaluateRisk(current) {
  const weights = weightsByMethod[current.method];
  const drivers = inputs.map((metric) => {
    const normalized = normalize(metric, current[metric]);
    return {
      metric,
      label: driverLabels[metric],
      normalized,
      weighted: normalized * weights[metric]
    };
  });

  const weightedSum = drivers.reduce((sum, item) => sum + item.weighted, 0);
  const score = Math.round(clamp(weightedSum * groundMultiplier(current.groundClass), 0, 100));
  const sorted = [...drivers].sort((a, b) => b.weighted - a.weighted);
  return {
    score,
    drivers: sorted,
    level: getRiskLevel(score),
    response: getResponse(score),
    actions: buildActions(score, sorted, current)
  };
}

function getRiskLevel(score) {
  if (score >= 75) return { name: "极高风险 / Critical Risk", className: "danger", color: "#b8453f" };
  if (score >= 55) return { name: "高风险 / High Risk", className: "danger", color: "#b8453f" };
  if (score >= 35) return { name: "中风险 / Medium Risk", className: "warning", color: "#c7801c" };
  return { name: "低风险 / Low Risk", className: "normal", color: "#2d7d65" };
}

function getResponse(score) {
  if (score >= 75) return { code: "D", copy: "停工核查 / 专项处置 / Stop-and-review or special response" };
  if (score >= 55) return { code: "C", copy: "加密监测 / 参数复核 / Increase monitoring and review parameters" };
  if (score >= 35) return { code: "B", copy: "重点巡视 / 趋势跟踪 / Focused inspection and trend tracking" };
  return { code: "A", copy: "常规巡视 / Routine inspection" };
}

function buildActions(score, sorted, current) {
  const topMetrics = new Set(sorted.slice(0, 3).map((item) => item.metric));
  const actions = [];

  if (score >= 75) {
    actions.push({ level: "danger", text: "启动专项风险会商，复核监测点、施工参数和地质揭示记录，必要时暂停开挖面推进。 / Start a special risk review, verify monitoring points, construction parameters, and geological records, and pause excavation if needed." });
  } else if (score >= 55) {
    actions.push({ level: "danger", text: "将监测频率提升到当前班次级别，形成 24 小时趋势曲线并设置二级预警阈值。 / Increase monitoring to shift-level frequency, build 24-hour trend curves, and set secondary warning thresholds." });
  } else if (score >= 35) {
    actions.push({ level: "warning", text: "对主控因子设置连续三次增长触发条件，安排现场工程师复核测点和施工日志。 / Add a three-consecutive-rise trigger for key drivers and ask site engineers to verify measuring points and logs." });
  } else {
    actions.push({ level: "normal", text: "维持常规巡视，保留当前参数作为稳定工况样本。 / Keep routine inspection and preserve current parameters as a stable-condition sample." });
  }

  if (topMetrics.has("waterChange")) {
    actions.push({ level: "warning", text: "复核降水、止水帷幕和掌子面渗流情况，必要时增加超前地质预报或注浆试验段。 / Review dewatering, cut-off walls, and face seepage; add advance geological prediction or trial grouting if needed." });
  }
  if (topMetrics.has("supportLag") || topMetrics.has("convergence")) {
    actions.push({ level: "danger", text: "缩短初支闭合时间，检查钢拱架间距、锁脚锚杆和喷射混凝土厚度记录。 / Shorten primary-support closure time and check steel rib spacing, foot-lock bolts, and shotcrete thickness records." });
  }
  if (topMetrics.has("surfaceSettlement") || topMetrics.has("buildingDistance")) {
    actions.push({ level: "warning", text: "对邻近建筑物布设沉降、倾斜和裂缝巡检台账，并把保护对象纳入 BIM 资产清单。 / Add settlement, tilt, and crack inspection records for nearby buildings and include protected assets in the BIM register." });
  }
  if (current.method === "tbm" && topMetrics.has("facePressureDelta")) {
    actions.push({ level: "danger", text: "复核土仓压力、同步注浆量、盾尾间隙和姿态纠偏记录，避免超挖或欠压推进。 / Review chamber pressure, synchronous grouting volume, shield-tail gap, and attitude correction records to avoid over-excavation or under-pressure advance." });
  }
  if (topMetrics.has("advanceRate")) {
    actions.push({ level: "warning", text: "放缓掘进节奏，按地层变化重新校核进尺、循环开挖长度和支护封闭时序。 / Slow the advance rate and recalibrate footage, excavation round length, and support closure timing based on strata changes." });
  }

  return actions.slice(0, 5);
}

function applyScenario(id) {
  const scenario = scenarios.find((item) => item.id === id) || scenarios[0];
  Object.assign(state, scenario);
  syncControls();
  render();
}

function syncControls() {
  document.querySelector("#scenarioSelect").value = state.id;
  document.querySelector("#methodSelect").value = state.method;
  document.querySelector("#groundClass").value = state.groundClass;
  inputs.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.value = state[id];
    input.parentElement.querySelector("output").value = `${state[id]}`;
  });
}

function readControls() {
  state.method = document.querySelector("#methodSelect").value;
  state.groundClass = document.querySelector("#groundClass").value;
  inputs.forEach((id) => {
    state[id] = Number(document.querySelector(`#${id}`).value);
  });
}

function render() {
  readControls();
  const result = evaluateRisk(state);
  document.querySelector("#riskScore").textContent = result.score;
  document.querySelector("#riskScore").style.color = result.level.color;
  document.querySelector("#riskLevel").textContent = result.level.name;
  document.querySelector("#responseLevel").textContent = result.response.code;
  document.querySelector("#responseCopy").textContent = result.response.copy;
  document.querySelector("#primaryDriver").textContent = result.drivers[0].label;
  document.querySelector("#secondaryDriver").textContent = result.drivers[1].label;
  document.querySelector("#chainageLabel").textContent = state.chainage;
  document.querySelector("#timestamp").textContent = new Date().toLocaleString("zh-CN", { hour12: false });

  renderDrivers(result.drivers);
  renderActions(result.actions);
  drawSection(result);
}

function renderDrivers(drivers) {
  const host = document.querySelector("#drivers");
  host.innerHTML = "";
  drivers.forEach((driver) => {
    const row = document.createElement("div");
    const severity = driver.normalized >= 70 ? "is-danger" : driver.normalized >= 45 ? "is-warning" : "";
    row.className = `driver-row ${severity}`;
    row.innerHTML = `
      <div class="driver-top">
        <span>${driver.label}</span>
        <span>${Math.round(driver.normalized)} / 100</span>
      </div>
      <div class="bar"><span style="width: ${Math.round(driver.normalized)}%"></span></div>
    `;
    host.appendChild(row);
  });
}

function renderActions(actions) {
  const host = document.querySelector("#actions");
  host.innerHTML = "";
  actions.forEach((action) => {
    const item = document.createElement("li");
    item.className = action.level;
    item.textContent = action.text;
    host.appendChild(item);
  });
}

function drawSection(result) {
  const canvas = document.querySelector("#sectionCanvas");
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  drawSectionBackground(ctx, w, h);

  const buildingRisk = normalize("buildingDistance", state.buildingDistance);
  drawBuildings(ctx, w, h, buildingRisk);
  drawTunnel(ctx, w, h, result);
  drawMonitoringLines(ctx, w, h, result);
  drawSectionLegend(ctx, w, h, result);
}

function drawSectionBackground(ctx, w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.38);
  sky.addColorStop(0, "#eef4f1");
  sky.addColorStop(1, "#dce7e1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.42);

  const layers = [
    { y: 0.42, height: 0.1, color: "#cfd9d2", label: "Fill / 杂填土" },
    { y: 0.52, height: 0.16, color: "#bfcbc5", label: "Silty clay / 粉质黏土" },
    { y: 0.68, height: 0.32, color: "#aebcb6", label: "Weathered rock / 风化岩" }
  ];

  layers.forEach((layer, index) => {
    const y = h * layer.y;
    ctx.fillStyle = layer.color;
    ctx.fillRect(0, y, w, h * layer.height);
    ctx.strokeStyle = index === 0 ? "#8da0a8" : "rgba(115,132,137,0.45)";
    ctx.lineWidth = index === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.24, y - 12 + index * 5, w * 0.58, y + 10 - index * 3, w, y - 4);
    ctx.stroke();

    ctx.fillStyle = "rgba(54,70,78,0.36)";
    ctx.font = "600 11px Segoe UI, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(layer.label, 16, y + 22);
  });

  ctx.strokeStyle = "rgba(88,105,112,0.18)";
  ctx.lineWidth = 1;
  for (let x = 28; x < w; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, h * 0.43);
    ctx.lineTo(x + 22, h);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(71,90,96,0.42)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.42);
  ctx.bezierCurveTo(w * 0.18, h * 0.405, w * 0.38, h * 0.435, w * 0.54, h * 0.42);
  ctx.bezierCurveTo(w * 0.7, h * 0.405, w * 0.84, h * 0.43, w, h * 0.415);
  ctx.stroke();
}

function drawBuildings(ctx, w, h, buildingRisk) {
  const buildings = [
    { x: 0.075, width: 0.06, floors: 3, color: "#d8a34d" },
    { x: 0.17, width: 0.065, floors: 4, color: "#d59b3d" },
    { x: 0.275, width: 0.065, floors: 5, color: "#ce9140" },
    { x: 0.38, width: 0.07, floors: 5, color: "#d99f41" }
  ];
  const baseY = h * 0.42;

  buildings.forEach((building, i) => {
    const x = w * building.x;
    const bw = Math.max(34, w * building.width);
    const floorH = 18;
    const bh = building.floors * floorH + 18;

    ctx.fillStyle = "rgba(48,62,66,0.16)";
    ctx.beginPath();
    ctx.ellipse(x + bw * 0.58, baseY + 8, bw * 0.58, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = buildingRisk > 58 ? "#d79437" : building.color;
    drawRoundRect(ctx, x, baseY - bh, bw, bh, 2);
    ctx.fill();

    ctx.fillStyle = "rgba(120,76,30,0.22)";
    ctx.fillRect(x + bw - 6, baseY - bh + 4, 6, bh - 4);
    ctx.fillStyle = "#f8e9bb";
    for (let floor = 0; floor < building.floors; floor += 1) {
      const y = baseY - bh + 14 + floor * floorH;
      for (let col = 0; col < 2; col += 1) {
        ctx.fillRect(x + 10 + col * (bw * 0.42), y, Math.max(9, bw * 0.22), 8);
      }
    }

    ctx.strokeStyle = buildingRisk > 58 ? "rgba(184,69,63,0.55)" : "rgba(86,105,122,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + bw * 0.5, baseY);
    ctx.lineTo(w * (0.58 + i * 0.015), h * 0.64);
    ctx.stroke();
  });

  if (buildingRisk > 45) {
    ctx.fillStyle = "rgba(184,69,63,0.08)";
    ctx.beginPath();
    ctx.ellipse(w * 0.28, baseY + 2, w * 0.25, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTunnel(ctx, w, h, result) {
  const cx = w * 0.58;
  const cy = h * 0.655;
  const rx = Math.max(96, w * 0.175);
  const ry = Math.max(66, h * 0.17);

  ctx.save();
  ctx.shadowColor = "rgba(31,45,51,0.28)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "rgba(48,63,68,0.18)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry * 0.08, rx * 1.08, ry * 0.96, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const lining = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
  lining.addColorStop(0, "#ffffff");
  lining.addColorStop(0.5, "#f4f7f5");
  lining.addColorStop(1, "#d7e0dc");
  ctx.fillStyle = lining;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = result.level.color;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.strokeStyle = "rgba(86,105,122,0.35)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.94, ry * 0.94, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#25333a";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.7, ry * 0.67, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.ellipse(cx - rx * 0.18, cy - ry * 0.18, rx * 0.32, ry * 0.22, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(96,112,124,0.62)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12;
    const innerX = cx + Math.cos(angle) * rx * 0.72;
    const innerY = cy + Math.sin(angle) * ry * 0.7;
    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8 + Math.PI / 8;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * rx * 0.86, cy + Math.sin(angle) * ry * 0.86, 2.2, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = result.level.color;
  ctx.beginPath();
  ctx.roundRect?.(cx - 29, cy - 15, 58, 30, 8);
  if (!ctx.roundRect) {
    drawRoundRect(ctx, cx - 29, cy - 15, 58, 30, 8);
  }
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "800 15px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${result.score}`, cx, cy + 5);

  ctx.fillStyle = "rgba(37,51,58,0.72)";
  ctx.font = "700 11px Segoe UI, sans-serif";
  ctx.fillText("Risk / 风险", cx, cy + 32);
}

function drawMonitoringLines(ctx, w, h, result) {
  const cx = w * 0.58;
  const cy = h * 0.655;
  const settlement = normalize("surfaceSettlement", state.surfaceSettlement);
  const crown = normalize("crownSettlement", state.crownSettlement);
  const baseY = h * 0.42;

  ctx.fillStyle = "rgba(184,69,63,0.11)";
  ctx.beginPath();
  ctx.moveTo(w * 0.1, baseY);
  ctx.bezierCurveTo(w * 0.24, h * (0.43 + settlement / 520), w * 0.45, h * (0.49 + settlement / 350), w * 0.66, h * (0.45 + settlement / 520));
  ctx.bezierCurveTo(w * 0.75, h * 0.43, w * 0.84, h * 0.42, w * 0.9, baseY);
  ctx.lineTo(w * 0.9, baseY + 16);
  ctx.bezierCurveTo(w * 0.72, baseY + 36, w * 0.35, baseY + 45, w * 0.1, baseY + 10);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(184,69,63,0.78)";
  ctx.lineWidth = 2.5 + (settlement / 100) * 2.5;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, baseY);
  ctx.bezierCurveTo(w * 0.28, h * (0.455 + settlement / 520), w * 0.46, h * (0.50 + settlement / 360), w * 0.66, h * (0.455 + settlement / 520));
  ctx.bezierCurveTo(w * 0.76, h * 0.43, w * 0.83, h * 0.42, w * 0.9, baseY);
  ctx.stroke();

  ctx.setLineDash([5, 6]);
  ctx.strokeStyle = "rgba(49,95,159,0.62)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(w * 0.06, h * 0.36);
  ctx.bezierCurveTo(w * 0.28, h * 0.34, w * 0.48, h * 0.38, w * 0.72, h * 0.35);
  ctx.bezierCurveTo(w * 0.82, h * 0.34, w * 0.9, h * 0.355, w * 0.96, h * 0.34);
  ctx.stroke();
  ctx.setLineDash([]);

  const instrumentTop = cy - h * (0.28 + crown / 320);
  const crownPoint = cy - h * 0.17;
  ctx.strokeStyle = "rgba(22,122,139,0.86)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, crownPoint);
  ctx.lineTo(cx, instrumentTop);
  ctx.stroke();

  ctx.fillStyle = result.level.color;
  ctx.beginPath();
  ctx.arc(cx, instrumentTop, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f8fbf8";
  ctx.beginPath();
  ctx.arc(cx, crownPoint, 4, 0, Math.PI * 2);
  ctx.fill();

  drawCallout(ctx, cx + 12, instrumentTop - 8, `Crown ${state.crownSettlement} mm / 拱顶`);
  drawCallout(ctx, w * 0.74, baseY + 30, `Surface ${state.surfaceSettlement} mm / 地表`);
  drawCallout(ctx, w * 0.09, h * 0.345, "Water line / 水位线");
}

function drawSectionLegend(ctx, w, h, result) {
  const x = w - 178;
  const y = 18;
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  drawRoundRect(ctx, x, y, 156, 76, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(96,112,124,0.22)";
  ctx.stroke();

  ctx.fillStyle = "#25333a";
  ctx.font = "800 12px Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Section View / 剖面", x + 12, y + 22);
  ctx.fillStyle = result.level.color;
  ctx.fillRect(x + 12, y + 36, 22, 5);
  ctx.fillStyle = "#60707c";
  ctx.font = "600 11px Segoe UI, sans-serif";
  ctx.fillText(result.level.name, x + 42, y + 42);
  ctx.fillStyle = "rgba(184,69,63,0.78)";
  ctx.fillRect(x + 12, y + 56, 22, 4);
  ctx.fillStyle = "#60707c";
  ctx.fillText("Settlement / 沉降", x + 42, y + 62);
}

function drawCallout(ctx, x, y, text) {
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.strokeStyle = "rgba(96,112,124,0.2)";
  ctx.lineWidth = 1;
  const width = Math.min(168, Math.max(86, text.length * 5.4));
  drawRoundRect(ctx, x, y, width, 22, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#42525c";
  ctx.font = "700 10.5px Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(text, x + 8, y + 15);
}

function drawRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawHero() {
  const canvas = document.querySelector("#heroCanvas");
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  const w = rect.width;
  const h = rect.height;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#15282c");
  bg.addColorStop(0.55, "#1d3435");
  bg.addColorStop(1, "#243b35");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.018)";
  for (let x = 0; x < w; x += 44) {
    ctx.fillRect(x, 0, 1, h);
  }
  for (let y = 0; y < h; y += 44) {
    ctx.fillRect(0, y, w, 1);
  }

  drawHeroCity(ctx, w, h);
  drawHeroGround(ctx, w, h);
  drawHeroTunnel(ctx, w, h);
  drawHeroMonitoring(ctx, w, h);
}

function drawHeroCity(ctx, w, h) {
  const baseY = h * 0.33;
  const buildings = [
    { x: 0.56, floors: 5, width: 0.04 },
    { x: 0.61, floors: 7, width: 0.045 },
    { x: 0.675, floors: 4, width: 0.05 },
    { x: 0.735, floors: 6, width: 0.042 },
    { x: 0.79, floors: 8, width: 0.05 },
    { x: 0.86, floors: 5, width: 0.044 }
  ];

  buildings.forEach((building) => {
    const bw = w * building.width;
    const bh = building.floors * 17;
    const x = w * building.x;
    const y = baseY - bh;
    ctx.fillStyle = "rgba(147,177,166,0.2)";
    ctx.fillRect(x, y, bw, bh);
    ctx.strokeStyle = "rgba(196,221,211,0.16)";
    ctx.strokeRect(x, y, bw, bh);
    ctx.fillStyle = "rgba(218,235,226,0.3)";
    for (let row = 0; row < building.floors; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        ctx.fillRect(x + 8 + col * (bw * 0.42), y + 9 + row * 17, Math.max(5, bw * 0.18), 5);
      }
    }
  });
}

function drawHeroGround(ctx, w, h) {
  const surfaceY = h * 0.45;
  ctx.fillStyle = "rgba(81,112,99,0.45)";
  ctx.beginPath();
  ctx.moveTo(0, surfaceY + h * 0.1);
  ctx.bezierCurveTo(w * 0.2, surfaceY - 18, w * 0.45, surfaceY + 28, w * 0.72, surfaceY - 2);
  ctx.bezierCurveTo(w * 0.86, surfaceY - 18, w * 0.94, surfaceY - 36, w, surfaceY - 54);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(201,224,215,0.18)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i += 1) {
    const y = surfaceY + h * (0.08 + i * 0.1);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.26, y - 22 + i * 9, w * 0.55, y + 18 - i * 4, w, y - 14);
    ctx.stroke();
  }
}

function drawHeroTunnel(ctx, w, h) {
  const cx = w * 0.72;
  const cy = h * 0.64;
  const rx = Math.max(190, w * 0.19);
  const ry = Math.max(118, h * 0.2);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.32)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = "rgba(8,17,19,0.58)";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 1.08, ry * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(144,188,171,0.72)";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(211,232,223,0.25)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i += 1) {
    const angle = (Math.PI * 2 * i) / 16;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * rx * 0.82, cy + Math.sin(angle) * ry * 0.82);
    ctx.lineTo(cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(5,13,15,0.78)";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.72, ry * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(222,241,232,0.16)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.62, ry * 0.58, 0, Math.PI * 0.05, Math.PI * 0.95);
  ctx.stroke();
}

function drawHeroMonitoring(ctx, w, h) {
  const cx = w * 0.72;
  const cy = h * 0.64;
  const topY = h * 0.08;

  ctx.strokeStyle = "rgba(198,222,214,0.18)";
  ctx.lineWidth = 1.8;
  for (let i = -5; i <= 5; i += 1) {
    const x = cx + i * w * 0.035;
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(cx + i * w * 0.018, cy - h * 0.24);
    ctx.stroke();
  }

  const points = [
    [0.62, 0.26, "#9ed7c2"],
    [0.69, 0.21, "#d7ba7d"],
    [0.77, 0.28, "#9ed7c2"],
    [0.84, 0.22, "#d77b70"],
    [0.74, 0.43, "#9ed7c2"]
  ];
  points.forEach(([px, py, color]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(w * px, h * py, 3.2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(215,123,112,0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.55, h * 0.44);
  ctx.bezierCurveTo(w * 0.64, h * 0.48, w * 0.74, h * 0.5, w * 0.86, h * 0.43);
  ctx.stroke();
}

function renderReferences() {
  const host = document.querySelector("#referenceCards");
  references.forEach((reference) => {
    const card = document.createElement("article");
    card.className = "reference-card";
    card.innerHTML = `
      <h3>${reference.name}</h3>
      <p>${reference.focus}</p>
      <p>${reference.influence}</p>
      <div class="reference-meta">
        <span>${reference.license}</span>
        <a href="${reference.url}" target="_blank" rel="noreferrer">GitHub / 来源 / Source</a>
      </div>
    `;
    host.appendChild(card);
  });
}

function exportSnapshot() {
  const result = evaluateRisk(state);
  const snapshot = {
    project: "TunnelRiskStudio",
    scenario: state,
    evaluation: {
      score: result.score,
      level: result.level.name,
      response: result.response,
      drivers: result.drivers.map((item) => ({
        metric: item.metric,
        label: item.label,
        normalized: Math.round(item.normalized),
        weighted: Number(item.weighted.toFixed(2))
      })),
      actions: result.actions.map((item) => item.text)
    },
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tunnel-risk-${state.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function buildMarkdownReport() {
  const result = evaluateRisk(state);
  const driverRows = result.drivers
    .map((item) => `| ${item.label} | ${Math.round(item.normalized)} | ${item.weighted.toFixed(2)} |`)
    .join("\n");
  const actionRows = result.actions.map((item, index) => `${index + 1}. ${item.text}`).join("\n");

  return `# TunnelRiskStudio 风险研判报告 / Risk Assessment Report

- 场景 / Scenario: ${document.querySelector("#scenarioSelect").selectedOptions[0].textContent}
- 里程 / Chainage: ${state.chainage}
- 施工方法 / Construction method: ${document.querySelector("#methodSelect").selectedOptions[0].textContent}
- 围岩等级 / Ground class: ${state.groundClass}
- 综合风险 / Overall risk: ${result.score} / 100
- 风险等级 / Risk level: ${result.level.name}
- 建议响应 / Response: ${result.response.code} - ${result.response.copy}
- 生成时间 / Generated at: ${new Date().toLocaleString("zh-CN", { hour12: false })}

## 风险贡献 / Risk Drivers

| 因子 / Factor | 归一化风险 / Normalized risk | 加权贡献 / Weighted contribution |
| --- | ---: | ---: |
${driverRows}

## 处置建议 / Recommendations

${actionRows}

## 输入参数 / Input Parameters

\`\`\`json
${JSON.stringify(state, null, 2)}
\`\`\`

> 本报告由 TunnelRiskStudio 原型生成，仅用于工程研判演示和资料归档，不替代正式设计、监测预警标准或专家评审。
> This report is generated by the TunnelRiskStudio prototype for engineering demonstration and record keeping only. It does not replace formal design, monitoring standards, or expert review.
`;
}

function exportReport() {
  const blob = new Blob([buildMarkdownReport()], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tunnel-risk-report-${state.id}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV 至少需要表头和一行数据。 / CSV requires a header and at least one data row.");
  }

  const headers = lines[0].split(",").map((item) => item.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((item) => item.trim());
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });

  return rows;
}

function applyMonitoringRows(rows) {
  const latest = {};
  rows.forEach((row) => {
    const metric = row.metric;
    const value = Number(row.value);
    if (inputs.includes(metric) && Number.isFinite(value)) {
      latest[metric] = value;
    }
  });

  const applied = Object.keys(latest);
  if (!applied.length) {
    throw new Error("没有识别到可用指标。metric 需要匹配 README 中的字段名。 / No valid metric was found. The metric field must match the README field names.");
  }

  applied.forEach((metric) => {
    state[metric] = latest[metric];
  });
  syncControls();
  render();
  document.querySelector("#csvStatus").textContent = `已导入 ${rows.length} 行，更新 ${applied.length} 个指标 / Imported ${rows.length} rows and updated ${applied.length} metrics`;
}

function handleCsvImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      applyMonitoringRows(parseCsv(String(reader.result)));
    } catch (error) {
      document.querySelector("#csvStatus").textContent = error.message;
    }
  });
  reader.readAsText(file, "utf-8");
}

function boot() {
  const scenarioSelect = document.querySelector("#scenarioSelect");
  scenarios.forEach((scenario) => {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });

  scenarioSelect.addEventListener("change", (event) => applyScenario(event.target.value));
  document.querySelector("#methodSelect").addEventListener("change", render);
  document.querySelector("#groundClass").addEventListener("change", render);
  document.querySelector("#resetBtn").addEventListener("click", () => applyScenario(state.id));
  document.querySelector("#exportBtn").addEventListener("click", exportSnapshot);
  document.querySelector("#reportBtn").addEventListener("click", exportReport);
  document.querySelector("#csvInput").addEventListener("change", handleCsvImport);

  inputs.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.addEventListener("input", () => {
      input.parentElement.querySelector("output").value = input.value;
      render();
    });
  });

  renderReferences();
  applyScenario(scenarios[0].id);
  drawHero();
  window.addEventListener("resize", () => {
    drawHero();
    render();
  });
}

boot();
