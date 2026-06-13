/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { 
  ALL_PRICING_ITEMS, 
  CATEGORY_GROUPS, 
  TREATMENT_ITEMS, 
  EXAMINATION_ITEMS, 
  MEDICATION_ITEMS, 
  PricingItem, 
  formatPrice 
} from "./data";
import { 
  Search, 
  RotateCcw, 
  Printer, 
  Plus, 
  Minus, 
  Check, 
  Moon, 
  Sun, 
  FileText, 
  Info, 
  FileCheck, 
  Heart, 
  TrendingUp, 
  CheckSquare, 
  Square,
  Activity,
  ClipboardList,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Maximize2,
  X,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SelectionState {
  isSelected: boolean;
  quantity: number;
  isNight: boolean;
}

const PROTOCOLS = [
  {
    id: "strong",
    name: "強刺激 (長/短效排卵針)",
    items: [
      { id: "elonva_150", qty: 1 },
      { id: "gonal_450", qty: 2 },
      { id: "cetrotide", qty: 5 },
      { id: "ovidrel", qty: 1 }
    ]
  },
  {
    id: "mild",
    name: "溫和刺激 (短效排卵針)",
    items: [
      { id: "gonal_450", qty: 2 },
      { id: "cetrotide", qty: 3 },
      { id: "ovidrel", qty: 1 }
    ]
  },
  {
    id: "natural",
    name: "自然週期 (排卵藥)",
    items: [
      { id: "clomid", qty: 10 },
      { id: "letrozole", qty: 10 },
      { id: "ovidrel", qty: 1 }
    ]
  }
];

const PRESETS = [
  {
    id: "preset_ivf_standard",
    name: "取卵療程",
    desc: "",
    items: [
      { id: "opu", qty: 1, night: false },
      { id: "sperm_prep", qty: 1, night: false },
      { id: "insemination", qty: 1, night: false },
      { id: "embryo_culture", qty: 1, night: false },
      { id: "cryo_embryo_egg", qty: 1, night: false },
      { id: "blastocyst_biopsy", qty: 1, night: false },
      { id: "pgs", qty: 1, night: false },
      { id: "lh", qty: 1, night: false },
      { id: "e2", qty: 1, night: false },
      { id: "p4", qty: 1, night: false },
      { id: "autoimmune_7", qty: 1, night: false },
      { id: "protein_s", qty: 1, night: false },
      { id: "lymphocyte_marker", qty: 1, night: false },
      { id: "igg", qty: 1, night: false },
      { id: "tnf_alpha", qty: 1, night: false },
      { id: "cbc", qty: 1, night: false },
      { id: "blood_type", qty: 1, night: false },
      { id: "hiv_combo", qty: 1, night: false },
      { id: "rpr_vdrl", qty: 1, night: false },
      { id: "us_scan", qty: 1, night: false }
    ]
  },
  {
    id: "preset_ivf_pgs",
    name: "植入療程",
    desc: "",
    items: [
      { id: "thaw_embryo_egg", qty: 1, night: false },
      { id: "embryo_transfer", qty: 1, night: false },
      { id: "lh", qty: 1, night: false },
      { id: "e2", qty: 1, night: false },
      { id: "p4", qty: 1, night: false },
      { id: "lymphocyte_marker", qty: 1, night: false },
      { id: "igg", qty: 1, night: false },
      { id: "tnf_alpha", qty: 1, night: false },
      { id: "cbc", qty: 1, night: false }
    ]
  }
];

export default function App() {
  const [selectedState, setSelectedState] = useState<Record<string, SelectionState>>({});
  const [activeTab, setActiveTab] = useState<string>("treatment");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stimulationProtocol, setStimulationProtocol] = useState<string>("strong");
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Initialize selectedState helper if empty
  const toggleItem = (itemId: string) => {
    setSelectedState(prev => {
      const current = prev[itemId];
      if (current && current.isSelected) {
        return {
          ...prev,
          [itemId]: { ...current, isSelected: false }
        };
      } else {
        return {
          ...prev,
          [itemId]: {
            isSelected: true,
            quantity: current?.quantity || 1,
            isNight: current?.isNight || false
          }
        };
      }
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedState(prev => {
      const current = prev[itemId] || { isSelected: false, quantity: 1, isNight: false };
      const newQty = Math.max(1, current.quantity + delta);
      return {
        ...prev,
        [itemId]: {
          ...current,
          quantity: newQty
        }
      };
    });
  };

  const setQuantity = (itemId: string, value: number) => {
    const cleanValue = Math.max(1, Math.floor(value));
    setSelectedState(prev => {
      const current = prev[itemId] || { isSelected: false, quantity: 1, isNight: false };
      return {
        ...prev,
        [itemId]: {
          ...current,
          quantity: cleanValue
        }
      };
    });
  };

  const toggleNight = (itemId: string) => {
    setSelectedState(prev => {
      const current = prev[itemId] || { isSelected: false, quantity: 1, isNight: false };
      return {
        ...prev,
        [itemId]: {
          ...current,
          isNight: !current.isNight
        }
      };
    });
  };

  const resetAllSelections = () => {
    setSelectedState({});
    setSearchQuery("");
  };

  const applyPreset = (preset: typeof PRESETS[0], stimulationId?: string) => {
    const newState: Record<string, SelectionState> = {};
    preset.items.forEach(item => {
      newState[item.id] = {
        isSelected: true,
        quantity: item.qty,
        isNight: !!item.night
      };
    });

    if (preset.id === "preset_ivf_standard" && stimulationId) {
      setStimulationProtocol(stimulationId);
    }

    setSelectedState(newState);
  };

  // Compute selected items statistics
  const selectedList = useMemo(() => {
    return ALL_PRICING_ITEMS.filter(item => selectedState[item.id]?.isSelected);
  }, [selectedState]);

  const selectedCountByCategory = useMemo(() => {
    const count = { treatment: 0, examination: 0, medication: 0 };
    TREATMENT_ITEMS.forEach(item => {
      if (selectedState[item.id]?.isSelected) count.treatment++;
    });
    EXAMINATION_ITEMS.forEach(item => {
      if (selectedState[item.id]?.isSelected) count.examination++;
    });
    MEDICATION_ITEMS.forEach(item => {
      if (selectedState[item.id]?.isSelected) count.medication++;
    });
    return count;
  }, [selectedState]);

  // Total Cost Calculation
  const totalCost = useMemo(() => {
    return selectedList.reduce((sum, item) => {
      const state = selectedState[item.id];
      const qty = state?.quantity || 1;
      const isNight = state?.isNight || false;
      const pricePerUnit = (isNight && item.hasNightOption && item.nightPrice) 
        ? item.nightPrice 
        : item.basePrice;
      return sum + (pricePerUnit * qty);
    }, 0);
  }, [selectedList, selectedState]);

  // Grouped search and display
  const filteredAndGroupedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Helper to filter individual lists
    const filterList = (items: PricingItem[]) => {
      if (!query) return items;
      return items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.englishName && item.englishName.toLowerCase().includes(query)) ||
        (item.spec && item.spec.toLowerCase().includes(query)) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    };

    const treatments = filterList(TREATMENT_ITEMS);
    const examinations = filterList(EXAMINATION_ITEMS);
    const medications = filterList(MEDICATION_ITEMS);

    return {
      treatment: {
        all: treatments,
        groups: [
          { name: "輔助生殖技術 (ART)", key: "all", list: treatments }
        ]
      },
      examination: {
        all: examinations,
        groups: [
          { name: "荷爾蒙相關血液檢查 (Hormone Panel)", key: "hormone", list: examinations.filter(i => i.category === "hormone") },
          { name: "免疫血栓相關血液檢查 (Immune & Thrombosis)", key: "immune", list: examinations.filter(i => i.category === "immune") },
          { name: "其他血液及常規檢查 (Routine Blood Works)", key: "other_blood", list: examinations.filter(i => i.category === "other_blood") },
          { name: "臨床檢查及治療 (Diagnostic & Treatment)", key: "exam_treatment", list: examinations.filter(i => i.category === "exam_treatment") }
        ].filter(g => g.list.length > 0)
      },
      medication: {
        all: medications,
        groups: [
          { name: "排卵相關藥物 / 排卵針劑", key: "ovulation", list: medications.filter(i => i.category === "ovulation") },
          { name: "黃體功能與著床輔助", key: "progesterone", list: medications.filter(i => i.category === "progesterone") },
          { name: "其他臨床輔助藥物", key: "other_med", list: medications.filter(i => i.category === "other_med") },
          { name: "其他", key: "other", list: medications.filter(i => i.category === "other") }
        ].filter(g => g.list.length > 0)
      }
    };
  }, [searchQuery]);

  const [copied, setCopied] = useState<boolean>(false);

  const textDetails = useMemo(() => {
    const lines: string[] = [];
    lines.push("━━━━━━━━━━━━━━━━━━━━━");
    lines.push("   送子鳥診所 療程費用初估表");
    lines.push("━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`估算日期：${new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}`);
    lines.push("-------------------------------------");
    lines.push("【已選療程與項目詳情】");
    
    if (selectedList.length === 0) {
      lines.push("（尚未選取任何療程項目）");
    } else {
      selectedList.forEach((item, index) => {
        const state = selectedState[item.id];
        const qty = state?.quantity || 1;
        const isNight = state?.isNight || false;
        const unitPrice = (isNight && item.hasNightOption && item.nightPrice) 
          ? item.nightPrice 
          : item.basePrice;
        const subTotal = unitPrice * qty;
        
        let detailStr = `${index + 1}. ${item.name}`;
        if (item.englishName) {
          detailStr += ` (${item.englishName})`;
        }
        lines.push(detailStr);
        
        let specStr = `   數量: ${qty} | 小計: ${formatPrice(subTotal)}`;
        if (isNight) {
          specStr += " | 時段: 夜間 (17點後)";
        }
        if (item.spec) {
          specStr += ` (${item.spec})`;
        }
        lines.push(specStr);
      });
    }
    
    lines.push("-------------------------------------");
    const hasOpu = !!selectedState["opu"]?.isSelected;
    const hasTransfer = !!selectedState["embryo_transfer"]?.isSelected;

    if (hasOpu && hasTransfer) {
      const protocolName = stimulationProtocol === "strong" ? "強刺激 (長/短效排卵針)" :
                           stimulationProtocol === "mild" ? "溫和刺激 (短效排卵針)" : "自然週期 (排卵藥)";
      const medNote = stimulationProtocol === "strong" ? "約 NT$ 80,000 ~ 110,000" :
                      stimulationProtocol === "mild" ? "約 NT$ 70,000 ~ 80,000" : "約 NT$ 5,000";
      
      const opuMin = stimulationProtocol === "strong" ? 80000 : stimulationProtocol === "mild" ? 70000 : 5000;
      const opuMax = stimulationProtocol === "strong" ? 110000 : stimulationProtocol === "mild" ? 80000 : 5000;
      
      const transferMin = 30000;
      const transferMax = 50000;
      
      const totalMin = totalCost + opuMin + transferMin;
      const totalMax = totalCost + opuMax + transferMax;

      lines.push(`手術與檢驗項目預估：${formatPrice(totalCost)}`);
      lines.push(`🧬 排卵刺激方案：${protocolName}`);
      lines.push(`💉 備註排卵針劑藥物：${medNote}`);
      lines.push(`💉 備註植入針劑藥物：約 NT$ 30,000 ~ 50,000`);
      lines.push(`📈 加計針劑後預估總費用範圍：${formatPrice(totalMin)} ~ ${formatPrice(totalMax)}`);
    } else if (hasOpu) {
      const protocolName = stimulationProtocol === "strong" ? "強刺激 (長/短效排卵針)" :
                           stimulationProtocol === "mild" ? "溫和刺激 (短效排卵針)" : "自然週期 (排卵藥)";
      const medNote = stimulationProtocol === "strong" ? "約 NT$ 80,000 ~ 110,000" :
                      stimulationProtocol === "mild" ? "約 NT$ 70,000 ~ 80,000" : "約 NT$ 5,000";
      const addMin = stimulationProtocol === "strong" ? 80000 : stimulationProtocol === "mild" ? 70000 : 5000;
      const addMax = stimulationProtocol === "strong" ? 110000 : stimulationProtocol === "mild" ? 80000 : 5000;
      
      lines.push(`手術與檢驗項目預估：${formatPrice(totalCost)}`);
      lines.push(`🧬 排卵刺激方案：${protocolName}`);
      lines.push(`💉 備註針劑藥物：${medNote}`);
      
      const totalRange = addMin === addMax 
        ? `${formatPrice(totalCost + addMin)}` 
        : `${formatPrice(totalCost + addMin)} ~ ${formatPrice(totalCost + addMax)}`;
      lines.push(`📈 加計針劑後預估總費用範圍：${totalRange}`);
    } else if (hasTransfer) {
      lines.push(`手術與檢驗項目預估：${formatPrice(totalCost)}`);
      lines.push(`💉 備註植入針劑藥物：約 NT$ 30,000 ~ 50,000`);
      lines.push(`📈 加計針劑後預估總費用範圍：${formatPrice(totalCost + 30000)} ~ ${formatPrice(totalCost + 50000)}`);
    } else {
      lines.push(`療程費用預估總額：${formatPrice(totalCost)}`);
    }
    lines.push("━━━━━━━━━━━━━━━━━━━━━");
    lines.push("⚠️ 聲明：本明細表之價格僅供門診及客戶之療程初估參考。實際費用將依據個人體質、實際用藥劑量、看診時段以及本院實際開立處方為準。所有費用皆為新台幣 (TWD) 單位。");
    lines.push("━━━━━━━━━━━━━━━━━━━━━");
    
    return lines.join("\n");
  }, [selectedList, selectedState, totalCost, stimulationProtocol]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(textDetails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error("無法複製文字：", err);
    });
  };

  const isSearching = searchQuery.trim().length > 0;

  const activeCategoryItems = useMemo(() => {
    if (activeTab === "treatment") return filteredAndGroupedItems.treatment;
    if (activeTab === "examination") return filteredAndGroupedItems.examination;
    return filteredAndGroupedItems.medication;
  }, [activeTab, filteredAndGroupedItems]);

  return (
    <div className="min-h-screen bg-warm-beige text-warm-dark selection:bg-medical-200">
      
      {/* Clinically Designed Header banner */}
      <header className="bg-medical-800 text-white relative overflow-hidden border-b border-medical-900 print:hidden">
        <div className="absolute inset-0 bg-radial-gradient-cover opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
          
          {/* Clinic Brand Element */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">送子鳥診所療程費用初估工具</h1>
          </div>
          
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Items Selection & Presets (8 Columns on desktop) */}
          <div className="lg:col-span-8 space-y-6 print:hidden">
            
            {/* Presets Box (Oocyte retrieval protocols and PGT-A choices) */}
            <section className="bg-warm-card rounded-2xl border border-warm-border p-4 md:p-5 shadow-xs relative overflow-hidden" id="info-section">
              <div className="absolute right-0 top-0 w-24 h-24 bg-medical-50/50 rounded-bl-full pointer-events-none -z-1" />
              <h2 className="text-base md:text-lg font-extrabold text-medical-800 flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-coral-600" /> 
                快速選擇療程
              </h2>
              
              <div>
                <p className="text-xs font-bold text-medical-800 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-600 animate-pulse" />
                  套用常見常規與特別篩選套裝方案：
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRESETS.map((preset) => {
                    const isOpu = preset.id === "preset_ivf_standard";
                    
                    return (
                      <div
                        key={preset.id}
                        className="p-4 rounded-xl border border-[#DCD3C1] bg-white shadow-xs flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <span className="font-black text-[20px] md:text-[24px] text-medical-900 flex items-center gap-2 tracking-tight leading-snug">
                            <span className="w-2.5 h-2.5 rounded-full bg-coral-600" />
                            {preset.name}
                          </span>
                          
                          {/* Render stimulation protocol dropdown if layout matches Oocyte retrieval */}
                          {isOpu && (
                            <div className="pt-1 pb-1" onClick={(e) => e.stopPropagation()}>
                              <label className="block text-[10px] font-black text-coral-600 uppercase tracking-wider mb-1">
                                🧬 請設定排卵刺激方案 
                              </label>
                              <select
                                value={stimulationProtocol}
                                onChange={(e) => setStimulationProtocol(e.target.value)}
                                className="w-full bg-warm-beige/30 px-3 py-2 rounded-xl border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-medical-800/20 focus:border-medical-800 font-bold transition text-warm-dark cursor-pointer"
                              >
                                {PROTOCOLS.map((protocol) => (
                                  <option key={protocol.id} value={protocol.id}>
                                    {protocol.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
 
                        <button
                          onClick={() => applyPreset(preset, isOpu ? stimulationProtocol : undefined)}
                          className="w-full mt-5 bg-medical-800 hover:bg-medical-900 text-white font-extrabold text-sm py-2.5 px-4 rounded-xl shadow-sm transition cursor-pointer text-center flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
                          id={`btn-apply-${preset.id}`}
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span>載入此估計療程</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* TAB Navigation & Search System */}
            <div className="bg-warm-card rounded-2xl border border-warm-border p-4 shadow-xs sticky top-4 z-40">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Responsive Category Tabs */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto" id="tabs-navigation">
                  {CATEGORY_GROUPS.map((category) => {
                    const isSelected = activeTab === category.id;
                    const badgeCount = category.id === "treatment" ? selectedCountByCategory.treatment :
                                       category.id === "examination" ? selectedCountByCategory.examination :
                                       selectedCountByCategory.medication;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer relative flex items-center gap-2 ${
                          isSelected 
                            ? "bg-medical-800 text-white shadow-md shadow-medical-800/20" 
                            : "bg-warm-beige/60 hover:bg-warm-beige/90 text-medical-800"
                        }`}
                        id={`tab-${category.id}`}
                      >
                        {category.id === "treatment" && <Stethoscope className="w-4 h-4" />}
                        {category.id === "examination" && <Activity className="w-4 h-4" />}
                        {category.id === "medication" && <ClipboardList className="w-4 h-4" />}
                        {category.name}
                        {badgeCount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                            isSelected ? "bg-coral-600 text-white" : "bg-coral-100 text-coral-700"
                          }`}>
                            {badgeCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-dark/60 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="搜尋項目名稱 / 英文..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-warm-beige/50 pl-9 pr-8 py-1.5 rounded-xl border border-warm-border text-sm font-medium focus:bg-warm-card focus:outline-none focus:ring-2 focus:ring-medical-800/20 focus:border-medical-800 transition"
                    id="search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-warm-dark/40 hover:text-warm-dark"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Main Interactive Items Shelf */}
            <div className="space-y-8" id="items-shelf">
              {(() => {
                // Reusable Card Component
                const renderItemCard = (item: PricingItem) => {
                  const state = selectedState[item.id] || { isSelected: false, quantity: 1, isNight: false };
                  const isSelected = state.isSelected;
                  const currentPrice = (state.isNight && item.hasNightOption && item.nightPrice) 
                    ? item.nightPrice 
                    : item.basePrice;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`rounded-xl border p-4 transition group cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? "bg-medical-50/40 border-[#065A60] shadow-sm shadow-medical-800/10 ring-1 ring-[#065A60]/10" 
                          : "bg-warm-card border-warm-border hover:border-warm-dark/25 hover:shadow-xs"
                      }`}
                      id={`card-${item.id}`}
                    >
                      <div>
                        {/* Top line with Checkbox, Title and Pricing Spec */}
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 flex-shrink-0" id={`checkbox-con-${item.id}`}>
                              {isSelected ? (
                                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-medical-800 text-white shadow-xs">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="block w-5 h-5 rounded-md border-2 border-warm-border group-hover:border-warm-dark/40 bg-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-medical-900 tracking-tight leading-snug">
                                {item.name}
                              </h4>
                              {item.englishName && (
                                <p className="text-[11px] font-mono text-warm-dark/50 leading-tight">
                                  {item.englishName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="font-mono font-bold text-sm text-medical-800">
                              {formatPrice(currentPrice)}
                            </span>
                            {item.isCustomMultiplier && (
                              <span className="text-[10px] text-warm-dark/60 font-semibold block">
                                / {item.unitText || "pcs"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Specs and details notes */}
                        {(item.spec || item.notes) && (
                          <p className="text-xs text-warm-dark/70 mt-1 pl-7 font-light">
                            {item.spec && <span className="font-medium text-medical-800/80 mr-1.5 bg-medical-50 px-1 py-0.5 rounded text-[11px]">{item.spec}</span>}
                            {item.notes}
                          </p>
                        )}
                      </div>

                      {/* ADJUSTMENT DRAWERS (Quantity / Night shifts) inside Selected Cards */}
                      {isSelected && (
                        <div 
                          className="mt-3 pt-3 border-t border-[#065A60]/15 flex flex-wrap items-center justify-between gap-3"
                          onClick={(e) => e.stopPropagation()} // stop toggle select on adjusting properties
                        >
                          {/* 1. Nights options toggle (If supported) */}
                          {item.hasNightOption ? (
                            <button
                              onClick={() => toggleNight(item.id)}
                              className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                                state.isNight 
                                  ? "bg-coral-100 text-coral-700 border-coral-200" 
                                  : "bg-warm-beige/40 text-warm-dark/70 border-warm-border hover:bg-warm-beige/75"
                              }`}
                              id={`night-toggle-${item.id}`}
                              title="設定為17點後的夜間收費項目"
                            >
                              {state.isNight ? (
                                <>
                                  <Moon className="w-3 h-3 text-coral-600 fill-coral-500" />
                                  <span>夜間 (+{(item.nightPrice || 0) - item.basePrice})</span>
                                </>
                              ) : (
                                <>
                                  <Sun className="w-3 h-3 text-yellow-600" />
                                  <span>日間門診</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="text-[10px] font-semibold text-warm-dark/45">預設常規時段</div>
                          )}

                          {/* 2. Quantity selector */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-warm-dark/60 mr-1">設估劑量 / 數量</span>
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 bg-warm-beige hover:bg-warm-border rounded-lg flex items-center justify-center text-warm-dark transition cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={state.quantity}
                              onChange={(e) => setQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-10 h-7 bg-white text-center rounded-lg border border-warm-border text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-medical-800"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 bg-warm-beige hover:bg-warm-border rounded-lg flex items-center justify-center text-warm-dark transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                };

                // Search Result Grouping Layout
                if (isSearching) {
                  const matchesTreatment = filteredAndGroupedItems.treatment.all;
                  const matchesExamination = filteredAndGroupedItems.examination.all;
                  const matchesMedication = filteredAndGroupedItems.medication.all;
                  const totalMatches = matchesTreatment.length + matchesExamination.length + matchesMedication.length;

                  if (totalMatches === 0) {
                    return (
                      <div className="bg-warm-card rounded-2xl border border-warm-border p-12 text-center text-warm-dark/60">
                        <Info className="w-8 h-8 text-warm-dark/40 mx-auto mb-2" />
                        <p className="font-bold text-sm">找不到任何相符的項目：「{searchQuery}」</p>
                        <p className="text-xs mt-1 text-warm-dark/50">系統已一次性聯大檢索：療程項目、檢查費用、藥物和針劑</p>
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="text-xs text-medical-800 hover:underline font-bold mt-3 cursor-pointer"
                        >
                          重設清除搜尋項目
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="bg-medical-50/50 p-4 rounded-xl border border-medical-805/10 text-xs text-medical-800 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span>🔍 連鎖搜尋模式：同時搜尋全部 3 大類別（療程、檢查、藥物）</span>
                        <span className="bg-medical-800 text-white px-2.5 py-0.5 rounded-full text-center self-start sm:self-auto">匹配結果：共 {totalMatches} 項</span>
                      </div>

                      {matchesTreatment.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-medical-800 tracking-widest uppercase pl-1.5 border-l-2 border-coral-600 flex items-center gap-1.5">
                            療程項目 (ART) 搜尋結果
                            <span className="text-[10px] text-warm-dark/55">({matchesTreatment.length} 項符合)</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {matchesTreatment.map((item) => renderItemCard(item))}
                          </div>
                        </div>
                      )}

                      {matchesExamination.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-medical-800 tracking-widest uppercase pl-1.5 border-l-2 border-coral-600 flex items-center gap-1.5">
                            檢查費用 搜尋結果
                            <span className="text-[10px] text-warm-dark/55">({matchesExamination.length} 項符合)</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {matchesExamination.map((item) => renderItemCard(item))}
                          </div>
                        </div>
                      )}

                      {matchesMedication.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-medical-800 tracking-widest uppercase pl-1.5 border-l-2 border-coral-600 flex items-center gap-1.5">
                            針劑及藥物 搜尋結果
                            <span className="text-[10px] text-warm-dark/55">({matchesMedication.length} 項符合)</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {matchesMedication.map((item) => renderItemCard(item))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Default tabs rendering
                return activeCategoryItems.groups.map((group) => (
                  <div key={group.key} className="space-y-4">
                    
                    {/* Header of Subcategory Group */}
                    {activeTab !== "treatment" && (
                      <h3 className="text-xs font-bold text-medical-800 tracking-widest uppercase pl-1 border-l-2 border-coral-600 mt-6 flex items-center gap-1.5">
                        {group.name}
                        <span className="text-[10px] font-normal text-warm-dark/55">({group.list.length} 項)</span>
                      </h3>
                    )}

                    {/* Grid Layout containing beautiful item cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.list.map((item) => renderItemCard(item))}
                    </div>

                  </div>
                ));
              })()}
            </div>

          </div>

          {/* RIGHT SIDE: Real-time Live Receipt Form Summary (4 Columns on desktop) */}
          <div className="lg:col-span-4 sticky top-4 z-30">
            <aside className="bg-[#F5F1E8] text-warm-dark rounded-2xl p-6 shadow-xl border border-[#DCD3C1] border-2 flex flex-col justify-between min-h-[480px]">
              
              <div>
                
                {/* Header title */}
                <div className="flex items-center justify-between border-b border-[#DCD3C1] pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-coral-600" />
                    <h3 className="font-extrabold text-base tracking-tight text-medical-805 text-medical-800">費用預算明細</h3>
                  </div>
                  
                  {selectedList.length > 0 && (
                    <button
                      onClick={resetAllSelections}
                      className="text-xs text-warm-dark/60 hover:text-coral-600 font-bold flex items-center gap-1 transition cursor-pointer"
                      id="btn-sidebar-reset"
                      title="重置所有選擇"
                    >
                      <RotateCcw className="w-3 h-3 text-coral-600" />
                      <span>清除重設</span>
                    </button>
                  )}
                </div>

                {/* Selected items list area */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none custom-scrollbar">
                  {selectedList.length === 0 ? (
                    <div className="py-12 text-center text-warm-dark/50 space-y-3">
                      <ClipboardList className="w-12 h-12 stroke-[1.2] mx-auto text-warm-dark/30" />
                      <p className="text-sm font-bold text-warm-dark/80">尚未選取任何療程或檢驗</p>
                      <p className="text-xs text-warm-dark/65 tracking-tight leading-relaxed">請在左側選擇項目，系統將在此為您進行實時加總計算與項目明細化。</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedList.map((item) => {
                        const state = selectedState[item.id];
                        const qty = state?.quantity || 1;
                        const isNight = state?.isNight || false;
                        const unitPrice = (isNight && item.hasNightOption && item.nightPrice) 
                          ? item.nightPrice 
                          : item.basePrice;
                        const itemTotal = unitPrice * qty;

                        return (
                          <div 
                            key={item.id} 
                            className="text-xs flex items-start justify-between gap-3 border-b border-warm-border/30 pb-2 hover:bg-white/40 p-1.5 rounded-md transition text-warm-dark"
                          >
                            <div className="space-y-1 flex-1">
                              <span className="font-bold text-warm-dark leading-tight block">
                                {item.name}
                              </span>
                              <div className="text-[10px] text-warm-dark/60 flex items-center gap-2 flex-wrap">
                                <span>單價: {formatPrice(unitPrice)}</span>
                                {isNight && (
                                  <span className="bg-coral-100 text-coral-700 px-1 py-0.2 rounded text-[9px] font-black">夜間</span>
                                )}
                                <div className="flex items-center gap-1 bg-white border border-[#DCD3C1] rounded-lg px-1.5 py-0.5 ml-auto">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="p-0.5 text-warm-dark hover:text-coral-600 hover:bg-warm-beige/50 rounded transition cursor-pointer"
                                    title="減少數量"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="font-black font-mono text-xs px-1 min-w-[12px] text-center">{qty}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="p-0.5 text-warm-dark hover:text-coral-600 hover:bg-warm-beige/50 rounded transition cursor-pointer"
                                    title="增加數量"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-start mt-0.5">
                              <span className="font-mono text-medical-805 font-bold block whitespace-nowrap text-[#065A60]">
                                {formatPrice(itemTotal)}
                              </span>
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="p-1 text-warm-dark/40 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition cursor-pointer flex items-center justify-center"
                                title="刪除項目"
                                id={`delete-selected-${item.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom calculations & primary actions */}
              <div className="mt-6 pt-4 border-t border-[#DCD3C1] space-y-4">
                
                {/* Real-time sum count */}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-warm-dark/80 font-bold">
                    {(selectedState["opu"]?.isSelected || selectedState["embryo_transfer"]?.isSelected) ? "手術與檢驗估計" : "療程預估總額"}
                  </span>
                  <span className={`${(selectedState["opu"]?.isSelected || selectedState["embryo_transfer"]?.isSelected) ? "text-xl font-bold" : "text-3xl font-black"} font-mono text-medical-800 tracking-tight`}>
                    {formatPrice(totalCost)}
                  </span>
                </div>

                {/* Stimulation Protocol Drug Cost Note & Range */}
                {(selectedState["opu"]?.isSelected || selectedState["embryo_transfer"]?.isSelected) && (
                  <div className="bg-white/90 rounded-xl p-3 border border-[#DCD3C1] space-y-2 text-xs">
                    {selectedState["opu"]?.isSelected && (
                      <div className="flex justify-between items-center text-warm-dark">
                        <span className="font-extrabold text-[11px] text-medical-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral-600 animate-pulse" />
                          加計排卵針劑 ({
                            stimulationProtocol === "strong" ? "強刺激" :
                            stimulationProtocol === "mild" ? "溫和刺激" : "自然週期"
                          })
                        </span>
                        <span className="font-mono font-black text-coral-600 text-[11px]">
                          {
                            stimulationProtocol === "strong" ? "+ NT$ 80,000 ~ 110,000" :
                            stimulationProtocol === "mild" ? "+ NT$ 70,000 ~ 80,000" : "+ NT$ 5,000"
                          }
                        </span>
                      </div>
                    )}

                    {selectedState["embryo_transfer"]?.isSelected && (
                      <div className="flex justify-between items-center text-warm-dark">
                        <span className="font-extrabold text-[11px] text-medical-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral-600 animate-pulse" />
                          加計植入針劑藥物
                        </span>
                        <span className="font-mono font-black text-coral-600 text-[11px]">
                          + NT$ 30,000 ~ 50,000
                        </span>
                      </div>
                    )}

                    <div className="text-[10px] text-warm-dark/80 leading-relaxed border-t border-warm-border/30 pt-1.5 flex justify-between items-baseline">
                      <span className="font-extrabold text-medical-800">預估總費用範圍</span>
                      <span className="font-mono text-base font-black text-[#065A60]">
                        {(() => {
                          const hasOpu = selectedState["opu"]?.isSelected;
                          const hasTransfer = selectedState["embryo_transfer"]?.isSelected;
                          
                          const opuMin = hasOpu ? (stimulationProtocol === "strong" ? 80000 : stimulationProtocol === "mild" ? 70000 : 5000) : 0;
                          const opuMax = hasOpu ? (stimulationProtocol === "strong" ? 110000 : stimulationProtocol === "mild" ? 80000 : 5000) : 0;
                          
                          const transMin = hasTransfer ? 30000 : 0;
                          const transMax = hasTransfer ? 50000 : 0;
                          
                          const totalMin = totalCost + opuMin + transMin;
                          const totalMax = totalCost + opuMax + transMax;
                          
                          return totalMin === totalMax 
                            ? `${formatPrice(totalMin)}` 
                            : `${formatPrice(totalMin)} ~ ${formatPrice(totalMax)}`;
                        })()}
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-warm-dark/75 bg-white/75 p-3 rounded-xl border border-[#DCD3C1] leading-relaxed">
                  ⚠️ 聲明：本明細表之價格僅供門診及客戶之療程初估參考。實際費用將依據個人體質、實際用藥劑量、看診時段以及本院實際開立處方為準。所有費用皆為新台幣 (TWD) 單位。
                </p>

                {/* Actions row */}
                <div className="flex gap-2">
                  <button
                    disabled={selectedList.length === 0}
                    onClick={() => setShowExportModal(true)}
                    className="flex-1 bg-coral-600 hover:bg-coral-700 text-white font-black text-sm py-3.5 rounded-xl shadow-md cursor-pointer text-center flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:pointer-events-none"
                    id="btn-main-export"
                  >
                    <FileText className="w-4 h-4" />
                    <span>導出文字明細</span>
                  </button>
                </div>

              </div>

            </aside>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 py-12 mt-12 border-t border-warm-border text-center text-sm text-warm-dark/60 print:hidden">
        <p className="font-extrabold tracking-widest text-[#065A60] text-base md:text-lg mb-1 leading-relaxed">陪你勇敢到最後</p>
        <p className="font-bold tracking-widest text-coral-600 text-sm md:text-base">愛與希望的守護者</p>
      </footer>

      {/* EXPORT TEXT DETAILS MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="export-modal">
            
            {/* Dark modal overlay */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
              onClick={() => setShowExportModal(false)}
            />

            <div className="flex min-h-full items-center justify-center p-4">
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-xl border border-warm-border"
              >
                
                {/* Modal Title header */}
                <div className="bg-medical-805 text-white bg-medical-800 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-coral-500" />
                    <span className="font-bold text-sm">導出療程費用文字明細</span>
                  </div>
                  <button 
                    onClick={() => setShowExportModal(false)}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-6 space-y-4">
                  <div className="text-xs text-[#065A60] bg-medical-50/70 p-3.5 rounded-xl border border-medical-200/50 leading-relaxed font-semibold">
                    💡 系統已為您產生適合快速傳送的**純文字版費用明細**。可點擊下方按鈕一鍵複製，隨時可貼上至 LINE、簡訊或電子郵件發送給客人參考。
                  </div>

                  <div className="relative">
                    <textarea
                      readOnly
                      value={textDetails}
                      rows={14}
                      className="w-full bg-[#F5F1E8]/30 p-4 rounded-xl border border-warm-border text-xs font-mono text-warm-dark focus:outline-none resize-none leading-relaxed select-all animate-fade-in"
                      id="export-text-area"
                    />
                  </div>
                </div>

                {/* Footer action row */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-warm-border">
                  <span className="text-xs">
                    {copied ? (
                      <span className="text-green-600 font-bold flex items-center gap-1 animate-pulse">
                        <Check className="w-4 h-4 stroke-[3]" /> 已成功複製明細到剪貼簿！
                      </span>
                    ) : (
                      <span className="text-warm-dark/50">所有內容皆依據當前選擇自動生成</span>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="px-4 py-2 border border-warm-border text-warm-dark font-medium text-xs rounded-xl hover:bg-warm-beige/30 transition cursor-pointer"
                    >
                      關閉視窗
                    </button>
                    <button
                      onClick={handleCopyText}
                      className="px-5 py-2 bg-coral-600 hover:bg-coral-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                      id="btn-copy-raw-text"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>已複製！</span>
                        </>
                      ) : (
                        <>
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>一鍵複製文字明細</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
