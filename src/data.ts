/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PricingItem {
  id: string;
  name: string;
  englishName?: string;
  spec?: string;
  basePrice: number;
  highlightPriceText?: string;
  hasNightOption?: boolean;
  nightPrice?: number;
  isCustomMultiplier?: boolean; // dynamic count (e.g. per pill, per egg)
  unitText?: string; // "顆", "月", "年" etc
  notes?: string;
  category: string; // e.g. "assisted_repro", "hormone", "immune", "other_blood", "exam_treatment", "ovulation", "progesterone", "other_med", "other"
}

export interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "treatment",
    name: "療程項目 (ART)",
    description: "人工受孕、取卵手術、胚胎培養、冷凍與植入等輔助生殖技術",
    color: "medical",
  },
  {
    id: "examination",
    name: "檢查費用",
    description: "荷爾蒙、免疫血栓、術前篩檢與超音波、子宮鏡等檢查與治療",
    color: "medical",
  },
  {
    id: "medication",
    name: "針劑及藥物",
    description: "排卵針劑、黃體功能輔助及其他抗凝血、免疫調節藥物與診斷證明",
    color: "medical",
  },
];

export const TREATMENT_ITEMS: PricingItem[] = [
  {
    id: "iui_gradient",
    name: "人工受孕術 (濃度梯度法)",
    englishName: "IUI for gradient density",
    basePrice: 9000,
    hasNightOption: true,
    nightPrice: 12300,
    category: "assisted_repro",
    notes: "夜間 (17點後) 價格為 12,300 元"
  },
  {
    id: "iui_swimup",
    name: "人工受孕術 (上泳法)",
    englishName: "IUI for swim-up",
    basePrice: 11000,
    hasNightOption: true,
    nightPrice: 14300,
    category: "assisted_repro",
    notes: "夜間 (17點後) 價格為 14,300 元"
  },
  {
    id: "opu",
    name: "取卵手術",
    englishName: "OPU",
    basePrice: 47000,
    hasNightOption: true,
    nightPrice: 57000,
    category: "assisted_repro",
    notes: "含麻醉、耗材、卵子處理費。夜間 (17點後) 57,000 元"
  },
  {
    id: "sperm_prep",
    name: "精蟲處理",
    englishName: "Sperm preparation",
    basePrice: 6500,
    category: "assisted_repro",
    notes: "篩選活動力佳之精蟲進行受精"
  },
  {
    id: "insemination",
    name: "受精費用",
    englishName: "Insemination",
    basePrice: 36000,
    category: "assisted_repro",
    notes: "依卵子數與精蟲狀況進行自然受精與顯微注射"
  },
  {
    id: "embryo_culture",
    name: "胚胎培養",
    englishName: "Embryo culture",
    basePrice: 40000,
    category: "assisted_repro",
    notes: "胚胎培養 0-7 天"
  },
  {
    id: "cryo_embryo_egg",
    name: "冷凍胚胎 / 卵子",
    englishName: "Cryoembryo / egg",
    basePrice: 26000,
    category: "assisted_repro"
  },
  {
    id: "thaw_embryo_egg",
    name: "解凍胚胎 / 卵子",
    englishName: "Thawing of embryo/egg",
    basePrice: 11000,
    category: "assisted_repro",
    notes: "植入或受精費用另計"
  },
  {
    id: "embryo_transfer",
    name: "胚胎植入",
    englishName: "Embryo Transfer",
    basePrice: 30000,
    hasNightOption: true,
    nightPrice: 40000,
    category: "assisted_repro",
    notes: "植入前超音波、抽血、藥物、針劑費用另計(含雷射輔助孵化)。夜間(17點後) 40,000 元"
  },
  {
    id: "blastocyst_biopsy",
    name: "胚胎切片費",
    englishName: "Blastocyst biopsy",
    basePrice: 4500,
    isCustomMultiplier: true,
    unitText: "顆",
    category: "assisted_repro",
    notes: "含採樣耗材及技術費，按顆計費"
  },
  {
    id: "pgs",
    name: "胚胎著床前染色體篩檢 (PGS)",
    englishName: "PGS",
    basePrice: 20000,
    isCustomMultiplier: true,
    unitText: "顆",
    category: "assisted_repro",
    notes: "染色體數量異常篩檢，按顆計費"
  },
  {
    id: "pgd",
    name: "胚胎著床前基因診斷 (PGD)",
    englishName: "PGD",
    basePrice: 116000,
    category: "assisted_repro",
    notes: "避免單基因遺傳疾病的風險。探針製作：50,000 元、送檢：66,000 元/次"
  },
  {
    id: "igene_single",
    name: "愛基因遺傳疾病帶因篩檢 (單人)",
    englishName: "iGene (Single)",
    basePrice: 28000,
    category: "assisted_repro",
    notes: "檢測個人是否帶有遺傳性致病基因"
  },
  {
    id: "igene_couple",
    name: "愛基因遺傳疾病帶因篩檢 (雙人)",
    englishName: "iGene (Couple)",
    basePrice: 52000,
    category: "assisted_repro",
    notes: "檢測夫妻雙方是否帶有遺傳性致病基因"
  },
  {
    id: "era",
    name: "子宮內膜接受度檢測套組 (ERA)",
    englishName: "ERA",
    basePrice: 50000,
    category: "assisted_repro",
    notes: "協助診斷子宮內膜最佳著床時間點"
  },
  {
    id: "cryo_sperm",
    name: "冷凍精蟲",
    englishName: "Cryosperm",
    basePrice: 10500,
    category: "assisted_repro"
  },
  {
    id: "thaw_sperm",
    name: "解凍精蟲",
    englishName: "Thawing-sperm",
    basePrice: 7500,
    category: "assisted_repro",
    notes: "含精蟲處理術"
  },
  {
    id: "mesa_tese",
    name: "副睪 / 睪丸取精術",
    englishName: "MESA / TESE",
    basePrice: 46000,
    category: "assisted_repro",
    notes: "由泌尿專科醫師進行手術（含麻醉、耗材、精蟲處理費，不分單雙側）"
  },
  {
    id: "cryo_preserv_month",
    name: "冷凍保存費 (月繳)",
    englishName: "Cryopreservation (Monthly)",
    basePrice: 1000,
    isCustomMultiplier: true,
    unitText: "月",
    category: "assisted_repro",
    notes: "此費用自首批入庫日起算，按院區及種類(精/卵/胚)分開計費，月繳限APP綁定信用卡自動扣款"
  },
  {
    id: "cryo_preserv_year",
    name: "冷凍保存費 (年繳特惠)",
    englishName: "Cryopreservation (Yearly)",
    basePrice: 10000,
    isCustomMultiplier: true,
    unitText: "年",
    category: "assisted_repro",
    notes: "到期已無凍存者，繳款費用將扣除已使用天數按原價(33元/天)計算後退款，當月不補不退"
  }
];

export const EXAMINATION_ITEMS: PricingItem[] = [
  // 荷爾蒙相關
  {
    id: "amh",
    name: "抗穆勒氏管激素",
    englishName: "AMH",
    basePrice: 1000,
    category: "hormone"
  },
  {
    id: "prl",
    name: "泌乳激素",
    englishName: "PRL",
    basePrice: 400,
    category: "hormone"
  },
  {
    id: "tsh",
    name: "甲狀腺刺激激素",
    englishName: "TSH",
    basePrice: 400,
    category: "hormone"
  },
  {
    id: "lh",
    name: "黃體刺激激素",
    englishName: "LH",
    basePrice: 400,
    category: "hormone"
  },
  {
    id: "e2",
    name: "雌激素",
    englishName: "E2",
    basePrice: 500,
    category: "hormone"
  },
  {
    id: "p4",
    name: "黃體素",
    englishName: "P4",
    basePrice: 400,
    category: "hormone"
  },
  {
    id: "free_t4",
    name: "游離四碘甲狀腺素",
    englishName: "Free T4",
    basePrice: 500,
    category: "hormone"
  },
  {
    id: "fsh",
    name: "卵泡刺激激素",
    englishName: "FSH",
    basePrice: 400,
    category: "hormone"
  },
  {
    id: "testosterone",
    name: "睪固酮",
    englishName: "Testosterone",
    basePrice: 350,
    category: "hormone"
  },

  // 免疫血栓相關
  {
    id: "autoimmune_3",
    name: "免疫篩檢套組 (3項)",
    englishName: "Auto-immune 3",
    basePrice: 2400,
    category: "immune",
    notes: "常用免疫抗體篩檢常規組合"
  },
  {
    id: "autoimmune_7",
    name: "免疫篩檢套組 (7項)",
    englishName: "Auto-immune 7",
    basePrice: 7000,
    category: "immune",
    notes: "完整版免疫系統異常抗體篩檢"
  },
  {
    id: "aps_set",
    name: "APS套組 (抗磷脂抗體)",
    englishName: "APS套組",
    basePrice: 3400,
    category: "immune"
  },
  {
    id: "lupus_anticoag",
    name: "狼瘡抗凝血因子",
    englishName: "Lupus anticoagulant",
    basePrice: 1200,
    category: "immune"
  },
  {
    id: "protein_s",
    name: "S蛋白",
    englishName: "Protein S",
    basePrice: 3500,
    category: "immune"
  },
  {
    id: "lymphocyte_marker",
    name: "淋巴球表面標記",
    englishName: "Lymphocyte surface marker",
    basePrice: 3400,
    category: "immune"
  },
  {
    id: "igg",
    name: "免疫球蛋白 G",
    englishName: "Immunoglobulin G(IgG)",
    basePrice: 500,
    category: "immune"
  },
  {
    id: "tnf_alpha",
    name: "腫瘤壞死因子-α",
    englishName: "TNF-α",
    basePrice: 2100,
    category: "immune"
  },
  {
    id: "d_dimer",
    name: "D-D雙合試驗",
    englishName: "D-dimer",
    basePrice: 800,
    category: "immune"
  },

  // 其他血液檢查
  {
    id: "routine_special",
    name: "術前 (特殊) 抽血套組",
    englishName: "Routine",
    basePrice: 2380,
    category: "other_blood"
  },
  {
    id: "cbc",
    name: "血液常規檢查",
    englishName: "CBC",
    basePrice: 300,
    category: "other_blood"
  },
  {
    id: "blood_type",
    name: "血型篩檢 (ABO+Rh)",
    englishName: "ABO+Rh",
    basePrice: 150,
    category: "other_blood"
  },
  {
    id: "hiv_combo",
    name: "後天免疫不全症候群抗體-篩檢",
    englishName: "HIV Ag/Ab Combo",
    basePrice: 500,
    category: "other_blood"
  },
  {
    id: "rpr_vdrl",
    name: "梅毒篩檢",
    englishName: "RPR/VDRL",
    basePrice: 150,
    category: "other_blood"
  },
  {
    id: "beta_hcg",
    name: "絨毛膜促性腺激素-β亞單體",
    englishName: "β-hCG",
    basePrice: 450,
    category: "other_blood"
  },
  {
    id: "b_hepatitis",
    name: "B肝抗原抗體",
    englishName: "Anti-HBsAb/Anti-HBc IgG/HBsAg",
    basePrice: 800,
    category: "other_blood"
  },
  {
    id: "alt_creatinine",
    name: "肝腎功能檢測",
    englishName: "ALT/Creatinine",
    basePrice: 240,
    category: "other_blood"
  },
  {
    id: "chromosome",
    name: "血液染色體檢查 (單人)",
    englishName: "Chromosome",
    basePrice: 6500,
    category: "other_blood"
  },

  // 檢查及治療
  {
    id: "us_scan",
    name: "腹部 / 陰道超音波",
    englishName: "Transabdominal/Transvaginal Ultrasound",
    basePrice: 600,
    category: "exam_treatment",
    notes: "單次"
  },
  {
    id: "hsg",
    name: "子宮輸卵管攝影",
    englishName: "HSG",
    basePrice: 2500,
    category: "exam_treatment"
  },
  {
    id: "h_scopy_check",
    name: "子宮鏡檢查 (僅檢查)",
    englishName: "H-Scopy (Check Only)",
    basePrice: 7000,
    category: "exam_treatment",
    notes: "若含治療，費用為 12,000 元"
  },
  {
    id: "h_scopy_treatment",
    name: "子宮鏡檢查 (檢查與治療)",
    englishName: "H-Scopy (Diagnostic & Operative)",
    basePrice: 12000,
    category: "exam_treatment",
    notes: "包含瘜肉切除或子宮腔沾黏分離等治療"
  },
  {
    id: "pathology",
    name: "子宮鏡治療病理化驗費",
    englishName: "Pathology",
    basePrice: 1800,
    category: "exam_treatment",
    notes: "經醫師判斷是否送檢"
  },
  {
    id: "hsa",
    name: "子宮內抗生素投藥",
    englishName: "HSA",
    basePrice: 400,
    category: "exam_treatment",
    notes: "視情況通常介於 300 ~ 500 元"
  },
  {
    id: "semen_analysis",
    name: "WHO 標準精液分析",
    englishName: "WHO semen analysis",
    basePrice: 2000,
    hasNightOption: true,
    nightPrice: 2450,
    category: "exam_treatment",
    notes: "夜間 (17點後) 費用為 2,450 元"
  },
  {
    id: "urine_pregnancy",
    name: "尿液懷孕試驗",
    englishName: "Urine pregnancy test",
    basePrice: 250,
    category: "exam_treatment"
  }
];

export const MEDICATION_ITEMS: PricingItem[] = [
  // 排卵相關
  {
    id: "elonva_150",
    name: "長效型伊諾娃 (Elonva) 150 ug",
    spec: "150 ug",
    basePrice: 31680,
    category: "ovulation"
  },
  {
    id: "gonal_150",
    name: "果納芬 (Gonal-F) 150 IU",
    spec: "150 IU (單型)",
    basePrice: 3000,
    category: "ovulation"
  },
  {
    id: "gonal_450",
    name: "果納芬 (Gonal-F) 450 IU",
    spec: "450 IU (筆型)",
    basePrice: 7950,
    category: "ovulation"
  },
  {
    id: "pergov_150",
    name: "倍孕力 (Pergoveris) 150 IU",
    spec: "150 IU (粉劑)",
    basePrice: 3240,
    category: "ovulation"
  },
  {
    id: "pergov_300",
    name: "倍孕力 (Pergoveris) 300 IU",
    spec: "300 IU (筆型)",
    basePrice: 7120,
    category: "ovulation"
  },
  {
    id: "pergov_450",
    name: "倍孕力 (Pergoveris) 450 IU",
    spec: "450 IU (筆型)",
    basePrice: 10690,
    category: "ovulation"
  },
  {
    id: "cetrotide",
    name: "欣得泰 (Cetrotide) 0.25 mg",
    spec: "Cetrorelix 0.25 mg",
    basePrice: 2000,
    category: "ovulation"
  },
  {
    id: "decapeptyl",
    name: "弟凱得 (Decapeptyl) 3.75 mg",
    spec: "Triptorelin 3.75 mg",
    basePrice: 495,
    category: "ovulation"
  },
  {
    id: "ovidrel",
    name: "克得諾 (Ovidrel)",
    spec: "r-hCG 250 mg/0.5 mL",
    basePrice: 1600,
    category: "ovulation"
  },
  {
    id: "clomid",
    name: "排卵藥 克羅米芬 (Clomid)",
    spec: "Clomiphene Citrate 50 mg",
    basePrice: 20,
    category: "ovulation"
  },
  {
    id: "letrozole",
    name: "復乳納膜衣錠 (Letrozole)",
    spec: "Femara Film-Coated Tablets 2.5 mg",
    basePrice: 100,
    category: "ovulation"
  },
  {
    id: "provera",
    name: "普維拉錠 (Provera)",
    spec: "5mg",
    basePrice: 5,
    category: "ovulation"
  },

  // 黃體功能輔助
  {
    id: "urogestan_100",
    name: "優潔通 (Urogestan) 100mg",
    spec: "Urogestan-100",
    basePrice: 17,
    category: "progesterone"
  },
  {
    id: "urogestan_200",
    name: "優潔通 (Urogestan) 200mg",
    spec: "Urogestan-200",
    basePrice: 34,
    category: "progesterone"
  },
  {
    id: "progesterone_inj",
    name: "黃體油針 (Progesterone) 50mg",
    spec: "Progesterone 50mg",
    basePrice: 80,
    category: "progesterone"
  },
  {
    id: "prolutex_inj",
    name: "黃體水針 (Prolutex) 25mg",
    spec: "Prolutex 25mg",
    basePrice: 460,
    category: "progesterone"
  },
  {
    id: "crinone_gel",
    name: "快孕隆陰道凝膠 (Crinone) 8%",
    spec: "Crinone 8%",
    basePrice: 295,
    category: "progesterone"
  },

  // 其他藥物
  {
    id: "estrade",
    name: "益斯得 (Estrade) 2mg",
    spec: "Estrade 2mg",
    basePrice: 5,
    category: "other_med"
  },
  {
    id: "premarin_tab",
    name: "普力馬林錠 (Premarin) 0.625mg",
    spec: "Premarin 0.625mg",
    basePrice: 25,
    category: "other_med"
  },
  {
    id: "premarin_cream",
    name: "普力馬林陰道乳膏 (Premarin) 14g",
    spec: "Premarin Vaginal Cream 14g",
    basePrice: 300,
    category: "other_med"
  },
  {
    id: "divigel",
    name: "迪維舒凝膠 (Divigel) 0.1%",
    spec: "Divigel 0.1% gel",
    basePrice: 20,
    category: "other_med"
  },
  {
    id: "tamoxifen",
    name: "諾瓦得士錠 (Tamoxifen)",
    spec: "Tamoxifen 10mg",
    basePrice: 20,
    category: "other_med"
  },
  {
    id: "bokey",
    name: "伯基 (Bokey) 100mg",
    spec: "Bokey 100mg",
    basePrice: 5,
    category: "other_med"
  },
  {
    id: "plavix",
    name: "保栓通膜衣錠 (Plavix)",
    spec: "Plavix",
    basePrice: 72,
    category: "other_med"
  },
  {
    id: "dostinex",
    name: "過乳降錠 (Dostinex) 0.5mg",
    spec: "Dostinex 0.5mg",
    basePrice: 300,
    category: "other_med"
  },
  {
    id: "eltroxin",
    name: "昂特欣錠 (Eltroxin) 50 mcg",
    spec: "Eltroxin TM Tablets 50 mcg",
    basePrice: 5,
    category: "other_med"
  },
  {
    id: "plaquenil",
    name: "奎寧 / 必賴克廔 (Plaquenil)",
    spec: "Plaquenil tablets 200mg",
    basePrice: 5,
    category: "other_med"
  },
  {
    id: "clexane",
    name: "肝素 (Clexane) 6000IU",
    spec: "Clexane 6000IU",
    basePrice: 220,
    category: "other_med"
  },
  {
    id: "fragmin",
    name: "弗列明 (Fragmin) 5000IU",
    spec: "Fragmin 5000IU",
    basePrice: 150,
    category: "other_med"
  },
  {
    id: "arixtra",
    name: "愛栓通 (Arixtra)",
    spec: "Arixtra",
    basePrice: 580,
    category: "other_med"
  },
  {
    id: "viagra_single",
    name: "威而鋼 (單顆)",
    spec: "Viagra 單顆",
    basePrice: 500,
    category: "other_med"
  },
  {
    id: "viagra_pack",
    name: "威而鋼 (4顆/盒)",
    spec: "Viagra 4顆(盒)",
    basePrice: 1500,
    category: "other_med"
  },
  {
    id: "voren",
    name: "非炎腸溶錠 (Voren)",
    spec: "Voren",
    basePrice: 5,
    category: "other_med"
  },
  {
    id: "ivig_2_5g",
    name: "免疫球蛋白 IVIG (2.5g)",
    spec: "IVIG 2.5g/10g",
    basePrice: 6500,
    category: "other_med"
  },
  {
    id: "ivig_10g",
    name: "免疫球蛋白 IVIG (10g)",
    spec: "IVIG 2.5g/10g",
    basePrice: 26000,
    category: "other_med"
  },
  {
    id: "benlysta",
    name: "奔麗生注射液 (Benlysta)",
    spec: "Benlysta",
    basePrice: 22000,
    category: "other_med"
  },
  {
    id: "humira",
    name: "復邁注射劑 (Humira) 40mg",
    spec: "Humira 40mg",
    basePrice: 17000,
    category: "other_med"
  },
  {
    id: "cimzia",
    name: "欣勝亞注射劑 (Cimzia) 200mg",
    spec: "Cimzia 200mg",
    basePrice: 17000,
    category: "other_med"
  },
  {
    id: "vagi_guard",
    name: "婦淨康益生菌",
    spec: "VAGI-Gurad",
    basePrice: 1200,
    category: "other_med"
  },
  {
    id: "eliquis",
    name: "艾必克 (Eliquis) 5mg",
    spec: "Eliquis 5mg",
    basePrice: 57,
    category: "other_med"
  },
  {
    id: "asazipam",
    name: "安思平 (Asazipam) 50mg",
    spec: "Asazipam 50mg",
    basePrice: 25,
    category: "other_med"
  },
  {
    id: "cividoid",
    name: "喜美凝膠 (Cividoid)",
    spec: "Cividoid gel",
    basePrice: 35,
    category: "other_med"
  },
  {
    id: "atosiban",
    name: "孕保寧 (Atosiban)",
    spec: "Atosiban 37.5mg/5ml",
    basePrice: 5000,
    category: "other_med"
  },
  {
    id: "compesolon",
    name: "康速龍錠 (Compesolon) 5mg",
    spec: "Compesolon 5mg",
    basePrice: 5,
    category: "other_med"
  },
  {
    id: "buscopan",
    name: "保勝康錠 (Buscopan) 10mg",
    spec: "Buscopan(Fucon) 10mg",
    basePrice: 5,
    category: "other_med"
  },

  // 其他非藥物類別但列在最後 (診斷書等)
  {
    id: "med_record",
    name: "調閱病歷費",
    englishName: "Medical record retrieval",
    basePrice: 200,
    category: "other"
  },
  {
    id: "cert_diagnosis",
    name: "診斷證明書費",
    englishName: "Certificate of diagnosis",
    basePrice: 100,
    category: "other"
  }
];

export const ALL_PRICING_ITEMS: PricingItem[] = [
  ...TREATMENT_ITEMS,
  ...EXAMINATION_ITEMS,
  ...MEDICATION_ITEMS,
];

export function getItemsByTab(tabId: string): PricingItem[] {
  switch (tabId) {
    case "treatment":
      return TREATMENT_ITEMS;
    case "examination":
      return EXAMINATION_ITEMS;
    case "medication":
      return MEDICATION_ITEMS;
    default:
      return [];
  }
}

export function formatPrice(num: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
