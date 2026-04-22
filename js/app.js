/* =========================================================
   LEVENT MARINE — v2 Application
   i18n + services data + drawer + theme + reveal + form
   ========================================================= */

/* ============== SERVICE DATA (bulker odaklı geniş katalog) ============== */
const SERVICES = {
  "power-distribution": {
    order: 1,
    icon: "bolt",
    category: "main",
    size: "card-lg",
    photo: "assets/services/power-distribution.jpg",
    detailPhoto: "assets/services/power-distribution.jpg",
    tr: {
      title: "Güç & Dağıtım Sistemleri",
      lead: "Main switchboard'dan emergency genset'e — gemin elektrik omurgasının tamamı",
      summary: "Bulker filonun elektrik kalbi: jeneratör, ana/yardımcı pano, busbar, transformer, AVR, shaft generator, shore connection. Arıza tespiti, bakım, retrofit, commissioning — hepsinde standart formatta dokümantasyonla.",
      chips: ["MSB / ESB", "AVR / PMS", "Shaft Gen", "Shore Power"],
      items: [
        { h: "Main Switchboard (MSB) bakım & retrofit", d: "ACB/MCCB test, busbar torque kontrolü, insulation, termografi, panel etiketleme, test raporu" },
        { h: "Emergency Switchboard (ESB) test", d: "Emergency genset auto-start, load sharing, synchronization, SOLAS test protokolü" },
        { h: "Ana & Yardımcı Jeneratör servisi", d: "AVR arızası, exciter, diyot grubu, voltaj regülasyonu, load testing, overhaul" },
        { h: "Shaft Generator (PTO) commissioning", d: "VFD, clutch control, voltage/frequency matching, survey attendance" },
        { h: "Transformer testleri", d: "440/220V dry-type ve oil-type transformer insulation, turns ratio, polarity" },
        { h: "Shore Power (OPS) retrofit", d: "AB FuelEU Maritime uyumu, cold ironing bağlantısı, pre-approval koordinasyonu" },
        { h: "Busbar & Distribution Board", d: "Section board, group starter panel, motor control center (MCC)" },
        { h: "Synchroscope & parallel operation", d: "Jeneratör paralel çalışma tuning, reverse power protection" }
      ],
      cta: "Güç sistemi talebi oluştur"
    },
    en: {
      title: "Power & Distribution Systems",
      lead: "From main switchboard to emergency genset — your vessel's electrical backbone",
      summary: "The electrical heart of your bulker fleet: generator, main/auxiliary panels, busbars, transformers, AVR, shaft generator, shore connection. Diagnosis, maintenance, retrofit, commissioning — all closed with a standard-format report.",
      chips: ["MSB / ESB", "AVR / PMS", "Shaft Gen", "Shore Power"],
      items: [
        { h: "Main Switchboard (MSB) maintenance & retrofit", d: "ACB/MCCB testing, busbar torque check, insulation, thermography, panel labeling, test reporting" },
        { h: "Emergency Switchboard (ESB) testing", d: "Emergency genset auto-start, load sharing, synchronization, SOLAS test protocol" },
        { h: "Main & Auxiliary Generator service", d: "AVR faults, exciter, diode bank, voltage regulation, load testing, overhaul" },
        { h: "Shaft Generator (PTO) commissioning", d: "VFD, clutch control, voltage/frequency matching, survey attendance" },
        { h: "Transformer testing", d: "440/220V dry-type and oil-type insulation, turns ratio, polarity" },
        { h: "Shore Power (OPS) retrofit", d: "EU FuelEU Maritime compliance, cold ironing connection, pre-approval koordinasyonu" },
        { h: "Busbar & Distribution Boards", d: "Section boards, group starter panels, motor control centers (MCC)" },
        { h: "Synchroscope & parallel operation", d: "Generator parallel operation tuning, reverse power protection" }
      ],
      cta: "Request power system service"
    }
  },

  "propulsion-motors": {
    order: 2,
    icon: "cog",
    category: "main",
    size: "card-md",
    photo: "assets/services/propulsion-motors.jpg",
    detailPhoto: "assets/services/propulsion-motors.jpg",
    tr: {
      title: "Tahrik & Motor Sistemleri",
      lead: "Ana makine elektriğinden bow thruster ve deck machinery'ye",
      summary: "Bulker'ın hareket etmesini sağlayan her elektrik motoru: ana makine starting/monitoring, bow thruster, deck vinçleri, hatch cover motorları, vinç/winch, pompa motorları.",
      chips: ["Bow Thruster", "Deck Crane", "Hatch Motors", "Winch"],
      items: [
        { h: "Ana Makine elektrik ekipmanı", d: "Starting air distributor, turning gear motor, jacket cooling pump, LO pump motors" },
        { h: "Bow Thruster motor servisi", d: "Starter, VFD, motor winding test, hub pitch control, class commissioning" },
        { h: "Deck Crane (bulker özel) servisi", d: "Main/aux hoist, slewing, overload protection, VFD arıza, limit switch kalibrasyonu" },
        { h: "Hatch Cover motorları", d: "Hydraulic pump drive motor, limit switch, cover open/close sequence" },
        { h: "Windlass & Mooring Winch", d: "Motor starter, brake solenoid, emergency stop, band brake feedback" },
        { h: "Pompa motorları (ballast / bilge / fire / GS)", d: "Insulation test, bearing vibration, rewinding koordinasyonu" },
        { h: "Air Compressor motor", d: "Starter, temperature protection, auto start/stop logic" },
        { h: "Motor sarımı (partner)", d: "Arızalı büyük motor rewinding, balansı, test — onaylı atölyelerde koordinasyon" }
      ],
      cta: "Motor servisi talep et"
    },
    en: {
      title: "Propulsion & Motor Systems",
      lead: "From main engine electrics to bow thruster and deck machinery",
      summary: "Every electric motor that keeps your bulker moving: main engine starting/monitoring, bow thruster, deck cranes, hatch covers, windlass/winches, pump motors.",
      chips: ["Bow Thruster", "Deck Crane", "Hatch Motors", "Winch"],
      items: [
        { h: "Main Engine electrical equipment", d: "Starting air distributor, turning gear motor, jacket cooling pump, LO pump motors" },
        { h: "Bow Thruster motor service", d: "Starter, VFD, motor winding test, hub pitch control, class commissioning" },
        { h: "Deck Crane (bulker specific) service", d: "Main/aux hoist, slewing, overload protection, VFD fault, limit switch calibration" },
        { h: "Hatch Cover motors", d: "Hydraulic pump drive motor, limit switches, cover open/close sequence" },
        { h: "Windlass & Mooring Winch", d: "Motor starter, brake solenoid, emergency stop, band brake feedback" },
        { h: "Pump motors (ballast / bilge / fire / GS)", d: "Insulation test, bearing vibration, rewinding coordination" },
        { h: "Air Compressor motor", d: "Starter, temperature protection, auto start/stop logic" },
        { h: "Motor rewinding (partner)", d: "Faulty large-motor rewinding, balancing, testing — coordinated at approved workshops" }
      ],
      cta: "Request motor service"
    }
  },

  "navigation-comms": {
    order: 3,
    icon: "radar",
    category: "main",
    size: "card-md",
    photo: "assets/services/navigation-comms.jpg",
    detailPhoto: "assets/services/navigation-comms.jpg",
    tr: {
      title: "Navigasyon & İletişim (GMDSS)",
      lead: "Köprü ekipmanlarının tamamı — radar, ECDIS, gyro, GMDSS",
      summary: "Modern bulker köprüsünün 15+ ayrı sistemi. Radar magnetron, ECDIS güncelleme, gyro drift, GMDSS yıllık test, VDR download — tek elden.",
      chips: ["Radar", "ECDIS", "Gyro", "GMDSS"],
      items: [
        { h: "Radar (S-Band & X-Band)", d: "Magnetron değişim, scanner motoru, trigger board, performance monitor testi" },
        { h: "ECDIS arıza & update", d: "Chart update, sensor interface, route planning hatası, sahada onaylı backup" },
        { h: "Gyro Compass + repeater", d: "Drift kompanzasyonu, repeater senkronizasyonu, standby gyro transfer" },
        { h: "Autopilot + Rate of Turn", d: "Heading control tuning, off-course alarm, rudder feedback" },
        { h: "AIS + VDR (Voyage Data Recorder)", d: "Yıllık performance test, data download, survey attendance" },
        { h: "GMDSS yıllık test", d: "VHF DSC, MF/HF DSC, Inmarsat-C, EPIRB & SART, NAVTEX" },
        { h: "Echo Sounder & Speed Log", d: "Doppler kalibrasyonu, transducer değişim" },
        { h: "Bridge integration & IBS", d: "Integrated Bridge System interface, conning display tuning" }
      ],
      cta: "Bridge servisi talep et"
    },
    en: {
      title: "Navigation & Communication (GMDSS)",
      lead: "Complete bridge equipment — radar, ECDIS, gyro, GMDSS",
      summary: "15+ distinct systems on the modern bulker bridge. Radar magnetron, ECDIS updates, gyro drift, GMDSS annual testing, VDR downloads — from a single source.",
      chips: ["Radar", "ECDIS", "Gyro", "GMDSS"],
      items: [
        { h: "Radar (S-Band & X-Band)", d: "Magnetron replacement, scanner motor, trigger board, performance monitor testing" },
        { h: "ECDIS faults & updates", d: "Chart updates, sensor interface, route planning errors, approved backup" },
        { h: "Gyro Compass + repeater", d: "Drift compensation, repeater synchronization, standby gyro transfer" },
        { h: "Autopilot + Rate of Turn", d: "Heading control tuning, off-course alarm, rudder feedback" },
        { h: "AIS + VDR (Voyage Data Recorder)", d: "Annual performance test, data download, survey attendance" },
        { h: "GMDSS annual testing", d: "VHF DSC, MF/HF DSC, Inmarsat-C, EPIRB & SART, NAVTEX" },
        { h: "Echo Sounder & Speed Log", d: "Doppler calibration, transducer replacement" },
        { h: "Bridge integration & IBS", d: "Integrated Bridge System interface, conning display tuning" }
      ],
      cta: "Request bridge service"
    }
  },

  "automation-control": {
    order: 4,
    icon: "cpu",
    category: "main",
    size: "card-md",
    photo: "assets/services/automation-control.jpg",
    detailPhoto: "assets/services/automation-control.jpg",
    tr: {
      title: "Otomasyon & Kontrol Sistemleri",
      lead: "AMS, IAS, PLC, SCADA — geminin sinir sistemi",
      summary: "Alarm Monitoring, Integrated Automation, PLC/SCADA, PMS — sahada onaylı UMS/E0 sisteminin her bileşeni. Arıza tespit, retrofit, yazılım güncelleme.",
      chips: ["AMS", "IAS", "PLC/SCADA", "PMS"],
      items: [
        { h: "Alarm Monitoring System (AMS)", d: "Kongsberg K-Chief, Praxis Mega-Guard, ABB 800xA retrofit/tuning" },
        { h: "Integrated Automation System (IAS)", d: "Configuration, graphics editor, operator workstation, redundancy testing" },
        { h: "Power Management System (PMS)", d: "Load sharing, black-out recovery, heavy consumer management" },
        { h: "PLC/SCADA arıza & retrofit", d: "Siemens S7, Allen-Bradley, ABB AC500 — yazılım update, I/O kart değişimi" },
        { h: "Tank Level Monitoring", d: "Radar/servo gauge, capacitive probe, loading computer interface" },
        { h: "Temperature & Pressure sensors", d: "Pt100, thermocouple, 4-20mA loop test, transmitter kalibrasyonu" },
        { h: "Valve Actuator (elektrik/pneumatik)", d: "Modulating/on-off actuator, limit switch, position feedback" },
        { h: "Boiler & Incinerator control", d: "Flame failure, combustion control, safety interlock test" }
      ],
      cta: "Otomasyon servisi talep et"
    },
    en: {
      title: "Automation & Control Systems",
      lead: "AMS, IAS, PLC, SCADA — the ship's nervous system",
      summary: "Alarm Monitoring, Integrated Automation, PLC/SCADA, PMS — every component of approved UMS/E0 operation. Fault diagnosis, retrofit, software updates.",
      chips: ["AMS", "IAS", "PLC/SCADA", "PMS"],
      items: [
        { h: "Alarm Monitoring System (AMS)", d: "Kongsberg K-Chief, Praxis Mega-Guard, ABB 800xA retrofit/tuning" },
        { h: "Integrated Automation System (IAS)", d: "Configuration, graphics editor, operator workstation, redundancy testing" },
        { h: "Power Management System (PMS)", d: "Load sharing, black-out recovery, heavy consumer management" },
        { h: "PLC/SCADA faults & retrofit", d: "Siemens S7, Allen-Bradley, ABB AC500 — software update, I/O card replacement" },
        { h: "Tank Level Monitoring", d: "Radar/servo gauge, capacitive probe, loading computer interface" },
        { h: "Temperature & Pressure sensors", d: "Pt100, thermocouple, 4-20mA loop test, transmitter calibration" },
        { h: "Valve Actuator (electric/pneumatic)", d: "Modulating/on-off actuator, limit switch, position feedback" },
        { h: "Boiler & Incinerator control", d: "Flame failure, combustion control, safety interlock test" }
      ],
      cta: "Request automation service"
    }
  },

  "safety-systems": {
    order: 5,
    icon: "shield",
    category: "main",
    size: "card-wide",
    photo: "assets/services/safety-systems.jpg",
    detailPhoto: "assets/services/safety-systems.jpg",
    tr: {
      title: "Güvenlik Sistemleri",
      lead: "Fire detection, CO2, PA/GA, gas detection — SOLAS uyum",
      summary: "Fire detection panelinden CO2/water mist'e, Public Address'den gaz dedektörüne kadar SOLAS Ch. II-2 kapsamındaki her güvenlik sistemi — sahada onaylı test ve sertifikasyonla.",
      chips: ["Fire Alarm", "CO2 / Water Mist", "PA/GA", "Gas Detection"],
      items: [
        { h: "Fire Detection Panel (conventional + addressable)", d: "Consilium, Autronica, Apollo, Notifier — loop test, detector değişim, survey attendance" },
        { h: "CO2 / HI-FOG / Water Mist", d: "Release panel, pilot cylinder test, delay timer, discharge alarm" },
        { h: "General Alarm & Fire Alarm", d: "Siren, rotating beacon, break glass call points, bell/horn coverage test" },
        { h: "Public Address (PA) System", d: "Amplifier, speaker line impedance, emergency override, DGS monitoring" },
        { h: "Gas Detection (bulker kargo hold)", d: "Fixed gas detection, personal monitor, calibration, false alarm tuning" },
        { h: "Engine Room Water Spray", d: "Section valve, alarm interlock, flow switch test" },
        { h: "CCTV Cargo Hold Monitoring", d: "IP camera, NVR, monitor, loading operation guidance" },
        { h: "Emergency Lighting & Exit Signs", d: "Battery backup test, 10 dk / 3 hr endurance, manual override" }
      ],
      cta: "Güvenlik sistemi servisi"
    },
    en: {
      title: "Safety Systems",
      lead: "Fire detection, CO2, PA/GA, gas detection — SOLAS compliance",
      summary: "Every safety system under SOLAS Ch. II-2 — fire detection panel, CO2/water mist, Public Address, gas detectors — with approved testing and certification.",
      chips: ["Fire Alarm", "CO2 / Water Mist", "PA/GA", "Gas Detection"],
      items: [
        { h: "Fire Detection Panel (conventional + addressable)", d: "Consilium, Autronica, Apollo, Notifier — loop test, detector replacement, survey attendance" },
        { h: "CO2 / HI-FOG / Water Mist", d: "Release panel, pilot cylinder test, delay timer, discharge alarm" },
        { h: "General Alarm & Fire Alarm", d: "Siren, rotating beacon, break glass call points, bell/horn coverage test" },
        { h: "Public Address (PA) System", d: "Amplifier, speaker line impedance, emergency override, DGS monitoring" },
        { h: "Gas Detection (bulker cargo hold)", d: "Fixed gas detection, personal monitor, calibration, false alarm tuning" },
        { h: "Engine Room Water Spray", d: "Section valve, alarm interlock, flow switch test" },
        { h: "CCTV Cargo Hold Monitoring", d: "IP camera, NVR, monitor, loading operation guidance" },
        { h: "Emergency Lighting & Exit Signs", d: "Battery backup test, 10 min / 3 hr endurance, manual override" }
      ],
      cta: "Request safety system service"
    }
  },

  "lighting-nav-lights": {
    order: 6,
    icon: "sun",
    category: "main",
    size: "card-third",
    photo: "assets/services/lighting-nav-lights.jpg",
    detailPhoto: "assets/services/lighting-nav-lights.jpg",
    tr: {
      title: "Aydınlatma & Seyir Fenerleri",
      lead: "Navigation lights + LED retrofit + kargo ambarı aydınlatması",
      summary: "Seyir fenerleri (masthead, side, stern, anchor, NUC), deck ve kargo ambarı aydınlatması, acil aydınlatma, LED retrofit — class kural 3/12 uyumlu.",
      chips: ["Nav Lights", "LED Retrofit", "Cargo Hold", "Emergency"],
      items: [
        { h: "Navigation Lights + Control Panel", d: "Masthead, side, stern, anchor, NUC, RAM — class kuralına uyum" },
        { h: "Deck & Accommodation LED retrofit", d: "Enerji tasarrufu %50-70, CII rating iyileşmesi, sahada onaylı fixture" },
        { h: "Cargo Hold Lighting", d: "Yük operasyonu aydınlatması, Ex-proof gerekliliği, bulker spesifik" },
        { h: "Engine Room Lighting", d: "Main + emergency lighting, battery battery, test prosedürü" },
        { h: "Helideck / Searchlight (varsa)", d: "Projektör motor, fokus, intensity control" },
        { h: "Exit Sign & Emergency Route", d: "Photoluminescent strip, battery-backed sign, kontrol" }
      ],
      cta: "LED retrofit teklifi"
    },
    en: {
      title: "Lighting & Navigation Lights",
      lead: "Navigation lights + LED retrofit + cargo hold lighting",
      summary: "Navigation lights (masthead, side, stern, anchor, NUC), deck and cargo hold lighting, emergency lighting, LED retrofit — compliant with class Rule 3/12.",
      chips: ["Nav Lights", "LED Retrofit", "Cargo Hold", "Emergency"],
      items: [
        { h: "Navigation Lights + Control Panel", d: "Masthead, side, stern, anchor, NUC, RAM — class rule compliance" },
        { h: "Deck & Accommodation LED retrofit", d: "50-70% energy savings, CII rating improvement, approved fixtures" },
        { h: "Cargo Hold Lighting", d: "Cargo operation lighting, Ex-proof requirements, bulker-specific" },
        { h: "Engine Room Lighting", d: "Main + emergency lighting, battery backup, test procedure" },
        { h: "Helideck / Searchlight (if equipped)", d: "Projector motor, focus, intensity control" },
        { h: "Exit Sign & Emergency Route", d: "Photoluminescent strip, battery-backed sign, inspection" }
      ],
      cta: "Request LED retrofit quote"
    }
  },

  "testing-certification": {
    order: 7,
    icon: "check",
    category: "main",
    size: "card-half",
    photo: "assets/services/testing-certification.jpg",
    detailPhoto: "assets/services/testing-certification.jpg",
    tr: {
      title: "Test & Sertifikasyon",
      lead: "SVERKER 900 + Megger + OMICRON — standart formatta test raporu",
      summary: "ACB/MCCB testinden insulation resistance'a, protection relay'den HV switchboard'a — tüm test ekipmanları kalibrasyon sertifikalı, raporlar standart test formatında PDF.",
      chips: ["ACB/MCCB", "Insulation", "Protection Relay", "Thermography"],
      items: [
        { h: "ACB / MCCB Test", d: "Mekanik + elektrik + koruma fonksiyonları — SVERKER 900 ile, BV/DNV/ABS formatlı rapor" },
        { h: "Insulation Resistance (Megger)", d: "500V-5000V test, trend grafikleri, moisture analiz, polarization index" },
        { h: "Protection Relay Test", d: "Overcurrent, earth fault, differential, distance — coordination study" },
        { h: "HV Switchboard Commissioning", d: "1000V üstü sistem — yalnızca HV sertifikalı personel ile" },
        { h: "Termografik İnceleme", d: "FLIR thermal imager ile hotspot tespiti, loose connection bulgu raporu" },
        { h: "Cable Continuity & Meggering", d: "Yeni inşa commissioning, retrofit sonrası loop test" },
        { h: "Earth Fault Detection Test", d: "Insulation monitor, earth fault indicator, source localization" },
        { h: "Standart Test Raporu", d: "PDF formatında test raporu — gemi dosyası, armatör, sigorta veya denetim kanalında kullanılabilir" }
      ],
      cta: "Test talebi oluştur"
    },
    en: {
      title: "Testing & Certification",
      lead: "SVERKER 900 + Megger + OMICRON — class-accepted reporting",
      summary: "From ACB/MCCB testing to insulation resistance, from protection relays to HV switchboards — calibration-certified equipment, standard-format test reports delivered as PDF.",
      chips: ["ACB/MCCB", "Insulation", "Protection Relay", "Thermography"],
      items: [
        { h: "ACB / MCCB Testing", d: "Mechanical + electrical + protection functions — via SVERKER 900, BV/DNV/ABS formatted reports" },
        { h: "Insulation Resistance (Megger)", d: "500V-5000V testing, trend graphs, moisture analysis, polarization index" },
        { h: "Protection Relay Testing", d: "Overcurrent, earth fault, differential, distance — coordination study" },
        { h: "HV Switchboard Commissioning", d: "Systems above 1000V — HV-certified personnel only" },
        { h: "Thermographic Inspection", d: "FLIR thermal imager for hotspot detection, loose connection finding report" },
        { h: "Cable Continuity & Meggering", d: "New-build commissioning, post-retrofit loop testing" },
        { h: "Earth Fault Detection Testing", d: "Insulation monitor, earth fault indicator, source localization" },
        { h: "Standard Test Report", d: "PDF-format test report usable in the vessel file, owner's office, insurer channel or surveyor review" }
      ],
      cta: "Request testing service"
    }
  },

  "commissioning-retrofit": {
    order: 8,
    icon: "wrench",
    category: "main",
    size: "card-half",
    photo: "assets/services/commissioning-retrofit.jpg",
    detailPhoto: "assets/services/commissioning-retrofit.jpg",
    tr: {
      title: "Commissioning & Retrofit",
      lead: "Yeni inşa + enerji retrofit + decarbonization uyum",
      summary: "Yeni inşa gemilerde FAT/SAT süpervizi, retrofit projelerinde pre-approval koordinasyonu, CII rating iyileştirme, shore power + battery hybrid + VFD retrofit.",
      chips: ["FAT/SAT", "VFD Retrofit", "LED Conversion", "Shore Power"],
      items: [
        { h: "Yeni İnşa Commissioning (FAT/SAT)", d: "Factory Acceptance Test, Harbour Test, Sea Trial — survey attendance, punch list kapama" },
        { h: "VFD (Variable Frequency Drive) Retrofit", d: "Pompa/fan motor VFD dönüşümü, %15-30 enerji tasarrufu, CII iyileşmesi" },
        { h: "LED Conversion projesi", d: "Tam gemi LED dönüşümü, sahada onaylı fixture, ROI analizi" },
        { h: "Shore Power (OPS) retrofit", d: "AB limanları için 2030 hazırlığı, pre-approval koordinasyonu, sözleşme" },
        { h: "Battery / Hybrid retrofit feasibility", d: "DNV Battery Safety, approval, EPC supervision" },
        { h: "Energy Monitoring System", d: "EU FuelEU uyum, CII veri toplama, dashboard kurulum" },
        { h: "Retrofit Engineering Drawing", d: "Cable schedule, SLD, terminal diagram revizyonu" },
        { h: "Cyber Security OT Retrofit (IACS E26/E27)", d: "Network segmentation, firewall, asset inventory, class onay" }
      ],
      cta: "Retrofit projesi görüş"
    },
    en: {
      title: "Commissioning & Retrofit",
      lead: "New build + energy retrofit + decarbonization compliance",
      summary: "FAT/SAT supervision on new-builds, pre-approval koordinasyonu on retrofits, CII rating improvements, shore power + battery hybrid + VFD retrofits.",
      chips: ["FAT/SAT", "VFD Retrofit", "LED Conversion", "Shore Power"],
      items: [
        { h: "New-Build Commissioning (FAT/SAT)", d: "Factory Acceptance Test, Harbour Test, Sea Trial — survey attendance, punch list closure" },
        { h: "VFD (Variable Frequency Drive) Retrofit", d: "Pump/fan motor VFD conversion, 15-30% energy savings, CII improvement" },
        { h: "LED Conversion project", d: "Whole-ship LED conversion, approved fixtures, ROI analysis" },
        { h: "Shore Power (OPS) retrofit", d: "2030 readiness for EU ports, pre-approval koordinasyonu, contracting" },
        { h: "Battery / Hybrid retrofit feasibility", d: "DNV Battery Safety, approval, EPC supervision" },
        { h: "Energy Monitoring System", d: "EU FuelEU compliance, CII data collection, dashboard installation" },
        { h: "Retrofit Engineering Drawings", d: "Cable schedule, SLD, terminal diagram revision" },
        { h: "OT Cyber Security Retrofit (IACS E26/E27)", d: "Network segmentation, firewall, asset inventory, approval" }
      ],
      cta: "Discuss retrofit project"
    }
  },

  "emergency-remote": {
    order: 9,
    icon: "alert",
    category: "main",
    size: "card-third",
    photo: "assets/services/emergency-remote.jpg",
    detailPhoto: "assets/services/emergency-remote.jpg",
    tr: {
      title: "Acil Müdahale & Remote ETO",
      lead: "7/24 onboard + remote destek — off-hire önleme",
      summary: "Port'ta beklenmedik elektrik arızasına 24 saat içinde onboard müdahale, veya aylık abonelikle 7/24 uzaktan ETO Zoom/TeamViewer desteği. Off-hire günlük $8-15k, tek olay paketi amorti eder.",
      chips: ["24h Response", "Remote Desk", "Retainer"],
      items: [
        { h: "Acil Onboard Müdahale", d: "Tuzla + çevre liman 4 saat, Türkiye geneli 24 saat, global koordinasyon" },
        { h: "Remote ETO Desk (retainer)", d: "$450-900/gemi/ay — 15 dk yanıt, Zoom/TeamViewer, aylık rapor" },
        { h: "PSC Green Pass paketi", d: "72 saatte detention riskini kapatma — $3.5-6k/gemi sabit paket" },
        { h: "Acil Survey Hazırlığı", d: "Sörveyör geldiğinde elektrik eksiklikleri kapama — 48 saat hedef" },
        { h: "P&I / Insurance Survey desteği", d: "Elektrik kaynaklı hasarda hızlı root-cause, hasar raporu" },
        { h: "Telefonla 1. Yanıt (ücretsiz)", d: "İlk 15 dk WhatsApp tanı — sık rastlanan arızalar için yönlendirme" }
      ],
      cta: "Acil destek için ara"
    },
    en: {
      title: "Emergency Response & Remote ETO",
      lead: "24/7 onboard + remote support — prevent off-hire",
      summary: "Onboard response within 24 hours for unexpected electrical faults in port, or monthly subscription for 24/7 remote ETO via Zoom/TeamViewer. Off-hire costs $8-15k/day — a single incident package pays for itself.",
      chips: ["24h Response", "Remote Desk", "Retainer"],
      items: [
        { h: "Emergency Onboard Response", d: "Tuzla + nearby ports 4h, Turkey nationwide 24h, global coordination" },
        { h: "Remote ETO Desk (retainer)", d: "$450-900/vessel/month — 15 min response, Zoom/TeamViewer, monthly report" },
        { h: "PSC Green Pass package", d: "Close detention risk within 72 hours — $3.5-6k/vessel fixed package" },
        { h: "Emergency Survey Prep", d: "Close electrical deficiencies before surveyor arrival — 48h target" },
        { h: "P&I / Insurance Survey support", d: "Rapid root-cause on electrical damage, damage reporting" },
        { h: "Phone 1st response (free)", d: "Free 15 min WhatsApp triage — guidance for common issues" }
      ],
      cta: "Call for emergency support"
    }
  },

  "class-prep": {
    order: 10,
    icon: "award",
    category: "main",
    size: "card-third",
    photo: "assets/services/class-prep.jpg",
    detailPhoto: "assets/services/class-prep.jpg",
    tr: {
      title: "Survey & PSC Hazırlığı",
      lead: "Denetim öncesi elektrik eksik kapama — PSC, Intermediate, Special, Annual",
      summary: "Denetim geldiğinde paniklememek için önceden tarama: 25 maddelik elektrik kontrol listesi, PSC hazırlık, CII destek, SOLAS Ch. II-1 uyum — surveyor geldiğinde geminin hazır olduğu bir durum bırakırız.",
      chips: ["Intermediate", "Special 5yr", "Annual", "PSC"],
      items: [
        { h: "Intermediate Survey Hazırlığı", d: "2.5 yılda bir — switchboard test, cable megger, emergency genset" },
        { h: "Special Survey (5 yıllık)", d: "Kapsamlı — her ekipmanın tam test + dokümantasyon" },
        { h: "Annual Survey Hazırlığı", d: "Her yıl — GMDSS, navigation lights, fire detection test" },
        { h: "PSC Elektrik Audit", d: "Paris/Tokyo MoU eksiklik kapama, detention riski önleme" },
        { h: "CII Rating Destek", d: "D/E alan gemilerde elektrik tüketim optimizasyonu — C'ye yükseltme" },
        { h: "SOLAS Ch. II-1 Uyum", d: "Reg. 40-45 (elektrik sistem), Reg. 31-36 (köprü) uyumu" },
        { h: "Surveyor Attendance", d: "Sörveyör ziyaretinde birebir koordinasyon, teknik yanıt desteği" },
        { h: "Eksik Kapama Takibi", d: "Gecikmiş condition of class / outstanding item'ların kapatılması" }
      ],
      cta: "Survey hazırlığı talep et"
    },
    en: {
      title: "Survey & PSC Preparation",
      lead: "Closing electrical findings before the surveyor arrives — PSC, Intermediate, Special, Annual",
      summary: "We sweep the ship ahead of inspection so nothing is a surprise: 25-point electrical checklist, PSC prep, CII support, SOLAS Ch. II-1 compliance — the vessel is in a surveyor-ready state on day one.",
      chips: ["Intermediate", "Special 5yr", "Annual", "PSC"],
      items: [
        { h: "Intermediate Survey Prep", d: "Every 2.5 years — switchboard test, cable megger, emergency genset" },
        { h: "Special Survey (5-year)", d: "Comprehensive — full test + documentation for every item" },
        { h: "Annual Survey Prep", d: "Every year — GMDSS, navigation lights, fire detection testing" },
        { h: "PSC Electrical Audit", d: "Paris/Tokyo MoU deficiency closure, detention risk reduction" },
        { h: "CII Rating Support", d: "Electrical consumption optimization on D/E rated ships — upgrade to C" },
        { h: "SOLAS Ch. II-1 Compliance", d: "Reg. 40-45 (electrical system), Reg. 31-36 (bridge) compliance" },
        { h: "Surveyor Attendance", d: "One-on-one coordination during surveyor visit, on-site technical response" },
        { h: "Deficiency Closure", d: "Tracking overdue condition-of-class / outstanding items through to closure" }
      ],
      cta: "Request survey prep"
    }
  }
};

/* ============== ICON SVGs ============== */
const ICONS = {
  bolt: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  cog: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  radar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v10l7 3"/></svg>',
  cpu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
  shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><path d="M9 12l2 2 4-4"/></svg>',
  sun: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  check: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  wrench: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  alert: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22h20L12 2z"/><path d="M12 9v4M12 17h.01"/></svg>',
  award: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 12.8L17 22l-5-3-5 3 1.5-9.2"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  theme: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>',
  menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  "arrow-up-right": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>'
};

/* ============== I18N ============== */
const I18N = {
  tr: {
    "nav.home": "Ana sayfa",
    "nav.services": "Hizmetler",
    "nav.certification": "Test & Rapor",
    "nav.projects": "Referans işler",
    "nav.about": "Kurumsal",
    "nav.contact": "İletişim",
    "nav.gallery": "Galeri",
    "nav.dock.cert": "Test",
    "dock.subtitle": "Elektroteknik Servis",
    "scroll.hint": "Keşfet",
    "btn.login": "Class / firma girişi",
    "btn.request": "Servis talebi",
    "btn.services": "Hizmet kataloğu",
    "hero.kpi.1.label": "Filo tipi",
    "hero.kpi.1.value": "Bulker & genel kargo",
    "hero.kpi.2.label": "Operasyon",
    "hero.kpi.2.value": "Tuzla · Pendik",
    "hero.kpi.3.label": "Hat",
    "hero.kpi.3.value": "7/24",
    "hero.kpi.4.label": "Saha",
    "hero.kpi.4.value": "2012'den beri",
    "hero.eyebrow": "Marine elektrik & otomasyon servisi · Pendik + Wyoming · 2012'den beri",
    "hero.title.a": "Köprüden makine dairesine:",
    "hero.title.b": "otomasyon ve elektrik kontrol",
    "hero.title.c": "arızalarında sahada müdahale.",
    "hero.sub": "PLC/SCADA, alarm ve entegre otomasyondan güç dağıtımı, jeneratör ve motora kadar — gemide oluşan her türlü kontrol ve elektrik arızasında teşhis, onarım, test ve devreye alma. “Elektrik kesildi” değil; sensör, pano, yazılım ve güç zinciri üzerinde çalışıyoruz. 7/24 onboard; Tuzla merkezli, dünya limanlarında koordineli ekip.",
    "hero.trust.1": "gemide<br>müdahale",
    "hero.trust.2": "saatte<br>Tuzla'dan onboard",
    "hero.trust.3": "7/24<br>hattı",
    "hero.trust.4": "yıllık<br>saha deneyimi",
    "hero.bento.big.kicker": "Son Müdahale · Tuzla",
    "hero.bento.big.title": "Jeneratör AVR + Shaft Earthing",
    "hero.bento.big.desc": "MV Aegean Trader — Supramax Bulker · Tuzla 2025-Q4<br>AVR arızası 6 saatte teşhis + müdahale, shaft earthing set yenilendi — gemi sefere çıktı.",
    "hero.bento.1.title": "Remote ETO",
    "hero.bento.2.title": "ETO Sertifikalı",
    "hero.bento.3.title": "Tuzla + Wyoming",
    "hero.bento.4.title": "Global Liman",
    "hero.bento.5.title": "HV ≤1000V",
    "hero.bento.6.title": "Hızlı Müdahale",
    "trust.label": "Son dönemde çalıştığımız firmalar",
    "services.kicker": "Hizmetler",
    "services.title.a": "Otomasyon, güç, tahrik, navigasyon —",
    "services.title.b": "10 hizmet, aynı kart düzeni.",
    "services.sub": "Her kart aynı boyutta; saha fotoğrafı üzerinde başlık ve özet. Tıklayınca kapsam, ekipman ve süreç detayı açılır. Arıza müdahalesi, bakım, test ve retrofit — hızlı teşhis ve yedek parça koordinasyonu.",
    "cert.kicker": "Test & Rapor",
    "cert.title": "Ekipmanımız, yöntemimiz, raporumuz.",
    "cert.sub": "Saha testleri kalibrasyon sertifikalı ekipmanla yapılır. Çalışma sonunda standart formatta rapor — gemi, firma veya sigorta kanalında kullanılabilir.",
    "cert.process.title": "Süreç Akışı",
    "cert.process.sub": "Her adım belgelenir; sonuçlar firma ekibiyle paylaşılır, gemi dosyasında arşivlenir.",
    "cert.step.1": "Talep",
    "cert.step.1.sub": "Form/WhatsApp",
    "cert.step.2": "Planlama",
    "cert.step.2.sub": "Kapsam + ETA",
    "cert.step.3": "Onboard",
    "cert.step.3.sub": "Müdahale + test",
    "cert.step.4": "Rapor",
    "cert.step.4.sub": "PDF teslim",
    "cert.step.5": "Takip",
    "cert.step.5.sub": "Arşiv + sonraki",
    "cert.card.accred.title": "Saha Tecrübesi",
    "cert.card.accred.desc": "12+ yıl bulker, tanker, container ve offshore — saha arıza müdahalesi, test ve retrofit.",
    "cert.card.equipment.title": "Test Ekipmanı",
    "cert.card.equipment.desc": "SVERKER 900, Megger MIT, Fluke 1587, FLIR Thermal Imager — kalibrasyon sertifikalı.",
    "cert.card.sample.title": "Örnek Rapor",
    "cert.card.sample.desc": "Standart test raporu PDF indir.",
    "cert.card.sample.btn": "PDF İndir",
    "cert.card.panel.title": "Yetkili Panel",
    "cert.card.panel.desc": "Gemi bazında test tarihleri, rapor arşivi, sonraki test vadesi.",
    "cert.card.panel.btn": "Class / firma girişi →",
    "projects.kicker": "İşler",
    "projects.title": "Son sahadaki müdahaleler.",
    "projects.sub": "Tuzla, Yalova, Aliağa ve global limanlarda gerçekleştirilen seçme işler — teknik detaylarla.",
    "gallery.kicker": "Saha",
    "gallery.title": "Panodan motora, köprüden deck'e.",
    "gallery.sub": "Gerçek müdahalelerden kareler — her biri onboard.",
    "about.kicker": "Hakkımızda",
    "about.title.a": "İki kıta,",
    "about.title.b": "bir ekip,",
    "about.title.c": "sahada 12 yıl.",
    "about.sub": "Pendik ofisimiz operasyonel merkez. Wyoming kaydımız global müşteriye USD faturalama ve 7/24 zaman dilimi kapsamı sağlar.",
    "about.pendik.kicker": "Operasyonel HQ",
    "about.pendik.title": "Pendik · İstanbul",
    "about.pendik.desc": "Tuzla + Yalova + Aliağa tersanelerine 90 dakikada erişim, yerel test ekipmanı envanteri.",
    "about.wyoming.kicker": "Registered Office",
    "about.wyoming.title": "Sheridan · Wyoming · USA",
    "about.wyoming.desc": "LLC kayıtlı ticari varlık — global müşteri için USD faturalama, P&I + sigorta rapor kanalı.",
    "about.certs.kicker": "Sertifikasyon",
    "about.certs.title": "STCW III/6 ETO + HV Operations + Güvenlik",
    "about.certs.clients": "Çalıştığımız firmalar: TP Offshore (TP OTC) · Polaris Denizcilik · Bright Denizcilik · Çebi Kaptan Denizcilik · MEDLOG (MSC Group) · Reederei NORD.",
    "cta.title": "Köprü veya makine dairesinde arıza mı?",
    "cta.sub": "Elektrik ve otomasyon için kontrol listemizi WhatsApp'tan gönderelim — mühendisinizle 15 dakikalık yapılandırılmış teşhis, onarım süresini ciddi ölçüde kısaltır.",
    "cta.btn.primary": "Kontrol Listesi",
    "cta.btn.secondary": "WhatsApp",
    "contact.kicker": "İletişim",
    "contact.title": "24 saat içinde geri dönüş.",
    "contact.sub": "Form, WhatsApp veya direkt telefon. Mesai saatlerinde 4 saat, dışında 8 saat içinde cevap.",
    "contact.form.title": "Servis Talebi",
    "contact.form.name": "Ad Soyad",
    "contact.form.company": "Firma / Filo",
    "contact.form.email": "E-posta",
    "contact.form.phone": "Telefon",
    "contact.form.vessel": "Gemi adı / IMO",
    "contact.form.class": "Class",
    "contact.form.service": "Hizmet tipi",
    "contact.form.urgency": "Aciliyet",
    "contact.form.urgency.high": "Yüksek (24h)",
    "contact.form.urgency.medium": "Orta (7 gün)",
    "contact.form.urgency.low": "Düşük (planlı)",
    "contact.form.message": "Mesajınız",
    "contact.form.submit": "Talep Gönder",
    "contact.usa.title": "USA",
    "contact.tr.title": "Türkiye",
    "footer.tagline": "Marine elektrik arıza servisi — Tuzla ve global limanlarda, bulker ve genel kargo filolar için.",
    "footer.services": "Hizmetler",
    "footer.company": "Şirket",
    "footer.contact": "İletişim",
    "footer.career": "Kariyer",
    "footer.rights": "© 2026 LEVENT MARINE LLC · TÜM HAKLARI SAKLIDIR",
    "footer.link.profile": "Profil",
    "login.title": "Yetkili Kullanıcı Girişi",
    "login.type": "Giriş Türü",
    "login.class": "Class Seç",
    "login.company": "Firma Seç",
    "login.password": "Parola",
    "login.submit": "Giriş Yap",
    "login.close": "Kapat",
    "form.status.sending": "Gönderiliyor…",
    "form.status.success": "Talebiniz alındı. 24 saat içinde dönüş yapacağız.",
    "form.status.fallback": "Sunucuya ulaşılamadı. WhatsApp penceresi açılıyor — mesajı göndererek tamamlayın.",
    "form.status.invalid": "Lütfen işaretli alanları kontrol edin.",
    "form.err.required": "Bu alan zorunlu.",
    "form.err.email": "Geçerli bir e-posta girin.",
    "profile.back": "Ana Sayfa",
    "profile.kicker": "Professional Background",
    "profile.title": "Arkadan 12 yıl saha, önünde tek numara.",
    "profile.sub": "Türk ve uluslararası armatörlerle çalışılmış filolar; altı farklı bayrak altında operasyonel deneyim ve STCW III/6 ETO + HV + güvenlik sertifikasyonu.",
    "profile.bg.title": "Sahada 12+ Yıl",
    "profile.bg.desc": "12+ yıldır bulker, tanker, container ve offshore tipi gemilerde Electro-Technical Officer görevleri ve saha servisi. Tuzla, Yalova ve Aliağa tersane bölgelerinin yanı sıra global limanlarda onboard + remote destek, arıza müdahalesi, test ve commissioning.",
    "profile.clients.title": "Hizmet Verilen Firmalar",
    "profile.certs.kicker": "Certifications & Qualifications",
    "profile.certs.title": "Tüm sertifikalar aktif ve güncel.",
    "profile.cert.core": "Core Certification",
    "profile.cert.core.title": "ETO — STCW Reg. III/6",
    "profile.cert.core.desc": "Electro-Technical Officer — uluslararası geçerli STCW Reg. III/6 sertifikası",
    "profile.cert.academic": "Academic",
    "profile.cert.academic.title": "Control Systems Technology",
    "profile.cert.academic.desc": "Üniversite düzeyinde otomasyon ve kontrol sistemleri eğitimi",
    "profile.cert.special": "Special Recognition",
    "profile.cert.special.title": "Blue Homeland Service",
    "profile.cert.special.desc": "TP Offshore tarafından verilen hizmet sertifikası",
    "profile.cert.stack": "Technical & Safety",
    "profile.cert.stack.title": "Full STCW + HV Operations Stack",
    "profile.cta.title": "Filonuzu bir araya getirelim.",
    "profile.cta.sub": "İlk 15 dakikalık teknik konsültasyon ücretsiz — mevcut elektrik veya otomasyon arızanızı hızlıca değerlendirelim."
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.certification": "Testing & Reports",
    "nav.projects": "Projects",
    "nav.about": "Company",
    "nav.contact": "Contact",
    "nav.gallery": "Gallery",
    "nav.dock.cert": "Cert",
    "dock.subtitle": "Marine Electrical",
    "scroll.hint": "Explore",
    "btn.login": "Class / company login",
    "btn.request": "Service request",
    "btn.services": "Service catalog",
    "hero.kpi.1.label": "Fleet focus",
    "hero.kpi.1.value": "Bulker & general cargo",
    "hero.kpi.2.label": "Operations hub",
    "hero.kpi.2.value": "Tuzla · Pendik",
    "hero.kpi.3.label": "Hotline",
    "hero.kpi.3.value": "24/7",
    "hero.kpi.4.label": "In the field",
    "hero.kpi.4.value": "Since 2012",
    "hero.eyebrow": "Marine electrical & automation service · Pendik + Wyoming · Since 2012",
    "hero.title.a": "Bridge to engine room:",
    "hero.title.b": "automation & electrical control",
    "hero.title.c": "faults — fixed in the field.",
    "hero.sub": "PLC/SCADA, alarm and integrated automation through power distribution, generators and motors — diagnosis, repair, testing and commissioning for every control and electrical fault. We work on sensors, panels, software and the power chain—not just “the lights went out.” 24/7 onboard; Tuzla-based with coordinated attendance worldwide.",
    "hero.trust.1": "vessels<br>serviced",
    "hero.trust.2": "hours onboard<br>from Tuzla",
    "hero.trust.3": "24/7<br>hotline",
    "hero.trust.4": "years of<br>field experience",
    "hero.bento.big.kicker": "Latest Job · Tuzla",
    "hero.bento.big.title": "Generator AVR + Shaft Earthing",
    "hero.bento.big.desc": "MV Aegean Trader — Supramax Bulker · Tuzla 2025-Q4<br>AVR fault diagnosed and repaired in 6 hours; shaft earthing set renewed — vessel sailed on schedule.",
    "hero.bento.1.title": "Remote ETO",
    "hero.bento.2.title": "ETO Certified",
    "hero.bento.3.title": "Tuzla + Wyoming",
    "hero.bento.4.title": "Global Ports",
    "hero.bento.5.title": "HV ≤1000V",
    "hero.bento.6.title": "Fast Response",
    "trust.label": "Recent clients we've worked with",
    "services.kicker": "Services",
    "services.title.a": "Automation, power, propulsion, navigation —",
    "services.title.b": "ten services, one uniform layout.",
    "services.sub": "Every card is the same size with a field photo, title and summary. Click for scope, equipment and process detail. Fault response, maintenance, testing and retrofit — fast diagnosis and spare-part coordination.",
    "cert.kicker": "Testing & Reports",
    "cert.title": "Our kit, our method, our report.",
    "cert.sub": "Field tests performed with calibration-certified equipment. Work is closed with a standard-format PDF report — usable by the vessel, the fleet office, or the insurer.",
    "cert.process.title": "Process Flow",
    "cert.process.sub": "Every step documented; results shared with the fleet team and archived in the vessel file.",
    "cert.step.1": "Request",
    "cert.step.1.sub": "Form/WhatsApp",
    "cert.step.2": "Plan",
    "cert.step.2.sub": "Scope + ETA",
    "cert.step.3": "Onboard",
    "cert.step.3.sub": "Repair + test",
    "cert.step.4": "Report",
    "cert.step.4.sub": "PDF delivery",
    "cert.step.5": "Follow-up",
    "cert.step.5.sub": "Archive + next",
    "cert.card.accred.title": "Field Experience",
    "cert.card.accred.desc": "12+ years on bulker, tanker, container and offshore — hundreds of fault responses, tests and retrofits.",
    "cert.card.equipment.title": "Test Equipment",
    "cert.card.equipment.desc": "SVERKER 900, Megger MIT, Fluke 1587, FLIR Thermal Imager — calibration certified.",
    "cert.card.sample.title": "Sample Report",
    "cert.card.sample.desc": "Download a standard test report PDF.",
    "cert.card.sample.btn": "Download PDF",
    "cert.card.panel.title": "Authorized Panel",
    "cert.card.panel.desc": "Per-vessel test dates, report archive, next-test deadline.",
    "cert.card.panel.btn": "Class / company login →",
    "projects.kicker": "Work",
    "projects.title": "Recent field jobs.",
    "projects.sub": "Selected work from Tuzla, Yalova, Aliağa and global ports — with technical details.",
    "gallery.kicker": "Field",
    "gallery.title": "From switchboard to motor, bridge to deck.",
    "gallery.sub": "Frames from real jobs — each one shot onboard.",
    "about.kicker": "About",
    "about.title.a": "Two continents,",
    "about.title.b": "one team,",
    "about.title.c": "12 years in the field.",
    "about.sub": "Our Pendik office is the operational center. Our Wyoming registration provides USD invoicing and 24/7 time-zone coverage for global clients.",
    "about.pendik.kicker": "Operational HQ",
    "about.pendik.title": "Pendik · Istanbul",
    "about.pendik.desc": "90-minute reach to Tuzla + Yalova + Aliağa shipyard regions, local test equipment inventory.",
    "about.wyoming.kicker": "Registered Office",
    "about.wyoming.title": "Sheridan · Wyoming · USA",
    "about.wyoming.desc": "Registered LLC — USD invoicing for global clients, P&I + insurance reporting channel.",
    "about.certs.kicker": "Certifications",
    "about.certs.title": "STCW III/6 ETO + HV Operations + Safety",
    "about.certs.clients": "Companies we've worked with: TP Offshore (TP OTC) · Polaris Denizcilik · Bright Denizcilik · Çebi Kaptan Denizcilik · MEDLOG (MSC Group) · Reederei NORD.",
    "cta.title": "Fault on the bridge or in the engine room?",
    "cta.sub": "We'll send our electrical and automation triage checklist via WhatsApp — 15 minutes of structured diagnosis with your engineer typically cuts repair time sharply.",
    "cta.btn.primary": "Get the Checklist",
    "cta.btn.secondary": "WhatsApp",
    "contact.kicker": "Contact",
    "contact.title": "Response within 24 hours.",
    "contact.sub": "Form, WhatsApp, or direct phone. Business hours 4h, outside 8h.",
    "contact.form.title": "Service Request",
    "contact.form.name": "Full Name",
    "contact.form.company": "Company / Fleet",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.vessel": "Vessel name / IMO",
    "contact.form.class": "Class",
    "contact.form.service": "Service type",
    "contact.form.urgency": "Urgency",
    "contact.form.urgency.high": "High (24h)",
    "contact.form.urgency.medium": "Medium (7 days)",
    "contact.form.urgency.low": "Low (planned)",
    "contact.form.message": "Your message",
    "contact.form.submit": "Send Request",
    "contact.usa.title": "USA",
    "contact.tr.title": "Turkey",
    "footer.tagline": "Marine electrical repair service — in Tuzla and global ports, for bulker and general-cargo fleets.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.career": "Career",
    "footer.rights": "© 2026 LEVENT MARINE LLC · ALL RIGHTS RESERVED",
    "footer.link.profile": "Profile",
    "login.title": "Authorized User Login",
    "login.type": "Login Type",
    "login.class": "Select Class",
    "login.company": "Select Company",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.close": "Close",
    "form.status.sending": "Sending…",
    "form.status.success": "Request received. We will respond within 24 hours.",
    "form.status.fallback": "Server unreachable. Opening WhatsApp — send the message to complete.",
    "form.status.invalid": "Please check the highlighted fields.",
    "form.err.required": "This field is required.",
    "form.err.email": "Enter a valid email.",
    "profile.back": "Home",
    "profile.kicker": "Professional Background",
    "profile.title": "Twelve years in the field, one number to call.",
    "profile.sub": "Fleets with Turkish and international owners; operational experience under six flag states, with STCW III/6 ETO + HV + safety certification.",
    "profile.bg.title": "12+ Years in the Field",
    "profile.bg.desc": "12+ years of Electro-Technical Officer duties and field service on bulker, tanker, container and offshore vessels. Onboard + remote support across Tuzla, Yalova and Aliağa yards and global ports — fault response, testing and commissioning.",
    "profile.clients.title": "Companies Served",
    "profile.certs.kicker": "Certifications & Qualifications",
    "profile.certs.title": "All certifications active and current.",
    "profile.cert.core": "Core Certification",
    "profile.cert.core.title": "ETO — STCW Reg. III/6",
    "profile.cert.core.desc": "Electro-Technical Officer — internationally valid STCW Reg. III/6 certificate",
    "profile.cert.academic": "Academic",
    "profile.cert.academic.title": "Control Systems Technology",
    "profile.cert.academic.desc": "University-level automation and control systems education",
    "profile.cert.special": "Special Recognition",
    "profile.cert.special.title": "Blue Homeland Service",
    "profile.cert.special.desc": "Service certificate awarded by TP Offshore",
    "profile.cert.stack": "Technical & Safety",
    "profile.cert.stack.title": "Full STCW + HV Operations Stack",
    "profile.cta.title": "Let's align your fleet.",
    "profile.cta.sub": "First 15-minute technical consultation is free — let's assess your current electrical or automation issue quickly."
  }
};

/* ============== PROJECTS DATA ============== */
const PROJECTS = [
  { badge: "BV", type: "Handymax Bulker", loc: "Tuzla · 2025 Q4", img: "assets/cert/acb-mccb-test.jpg",
    tr: { h: "ACB + MCCB Retest & Rapor", p: "Special survey öncesi 14 ACB ve 32 MCCB testi, standart formatta rapor ile 48 saatte tamamlandı." },
    en: { h: "ACB + MCCB Retest & Report", p: "Before special survey, 14 ACBs and 32 MCCBs tested and delivered with a standard-format report within 48 hours." }
  },
  { badge: "DNV", type: "Supramax Bulker", loc: "Çanakkale · 2025 Q3", img: "assets/works/generator-avr-diode-speedcard.jpg",
    tr: { h: "AVR Arıza + Shaft Earthing", p: "Jeneratör AVR arızasının 6 saatte teşhis + müdahalesi, shaft earthing set yenileme." },
    en: { h: "AVR Fault + Shaft Earthing", p: "Generator AVR fault diagnosed and repaired in 6 hours; shaft earthing set renewed." }
  },
  { badge: "ABS", type: "Container Feeder", loc: "Yalova · 2025 Q3", img: "assets/works/fire-alarm-system.jpg",
    tr: { h: "Fire Alarm + Water Mist Retrofit", p: "Eski fire detection panelinin onaylı modern sistemle değişimi ve FAT/SAT süpervizi." },
    en: { h: "Fire Alarm + Water Mist Retrofit", p: "Replacement of old fire detection panel with approved modern system and FAT/SAT supervision." }
  },
  { badge: "LR", type: "Kamsarmax Bulker", loc: "Pendik · 2025 Q2", img: "assets/works/motor-overhaul.jpg",
    tr: { h: "Motor Overhaul & Alignment", p: "Ana jeneratör motoru overhaul, hizalama, yük testi — off-hire 48 saatten 24'e indirildi." },
    en: { h: "Motor Overhaul & Alignment", p: "Main generator motor overhauled, aligned, load tested — off-hire reduced from 48 to 24 hours." }
  },
  { badge: "TL", type: "Oil/Chem Tanker", loc: "Aliağa · 2025 Q2", img: "assets/works/radar-magnetron-replacement.jpg",
    tr: { h: "Radar Magnetron + Bridge Test", p: "Gyro + radar commissioning, ECDIS interface doğrulama, bridge integration testi." },
    en: { h: "Radar Magnetron + Bridge Test", p: "Gyro + radar commissioning, ECDIS interface verification, bridge integration test." }
  },
  { badge: "RINA", type: "Panamax Bulker", loc: "Tuzla · 2025 Q1", img: "assets/works/ams-system-card-replacement.jpg",
    tr: { h: "PMS Retrofit + Load Sharing", p: "Power Management System yazılım güncelleme, 3 jeneratör load share tuning." },
    en: { h: "PMS Retrofit + Load Sharing", p: "Power Management System software upgrade, 3-generator load share tuning." }
  },
  { badge: "BV", type: "Handysize Bulker", loc: "Tuzla · 2024 Q4", img: "assets/cert/insulation-testing.jpg",
    tr: { h: "Insulation Trend & Megger Test", p: "500–5000V Megger ile polarization index, 5 yıllık insulation trend grafiği — class formatında raporlama." },
    en: { h: "Insulation Trend & Megger Test", p: "500–5000V Megger with polarization index, 5-year insulation trend analysis — class-formatted reporting." }
  },
  { badge: "DNV", type: "Capesize Bulker", loc: "Istanbul Bosphorus · 2024 Q4", img: "assets/works/crane-panel-speed-control.jpg",
    tr: { h: "Deck Crane Panel + VFD", p: "4 deck crane elektrik pano yenileme, VFD retrofit, overload kalibrasyonu." },
    en: { h: "Deck Crane Panel + VFD", p: "4 deck crane electrical panel renewal, VFD retrofit, overload calibration." }
  }
];

/* ============== APP INIT ============== */
(function () {
  const state = {
    lang: localStorage.getItem('levent.lang') || 'tr',
    theme: localStorage.getItem('levent.theme') || 'light'
  };

  document.documentElement.setAttribute('data-theme', state.theme);
  document.documentElement.setAttribute('lang', state.lang);

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || key;
  }

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const html = t(key);
      if (html.includes('<br>') || html.includes('<em>') || html.includes('<strong>')) {
        el.innerHTML = html;
      } else {
        el.textContent = html;
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr').split(':');
      const attr = spec[0];
      const key = spec[1];
      el.setAttribute(attr, t(key));
    });
  }

  /* ============== RENDER SERVICES ============== */
  function renderServices() {
    const grid = document.getElementById('bentoGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const keys = Object.keys(SERVICES).sort((a, b) => SERVICES[a].order - SERVICES[b].order);
    keys.forEach((key) => {
      const s = SERVICES[key];
      const data = s[state.lang];
      const card = document.createElement('article');
      card.className = 'card has-photo';
      card.dataset.service = key;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const chipsHtml = (data.chips || []).map(c => `<span class="chip">${c}</span>`).join('');
      const altText = state.lang === 'tr' ? `${data.title} — servis görseli` : `${data.title} — service image`;
      card.innerHTML = `
        <div class="card-photo" aria-hidden="true"><img src="${s.photo}" alt="" width="1200" height="800" loading="lazy" decoding="async"></div>
        <span class="card-arrow">${ICONS['arrow-up-right']}</span>
        <div class="card-icon">${ICONS[s.icon] || ICONS.bolt}</div>
        <h3>${data.title}</h3>
        <p>${data.lead}</p>
        <div class="card-chips">${chipsHtml}</div>
      `;
      card.setAttribute('aria-label', altText);
      card.addEventListener('click', () => openServiceDrawer(key));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openServiceDrawer(key); }
      });
      grid.appendChild(card);
    });
  }

  /* ============== RENDER PROJECTS ============== */
  function renderProjects() {
    const scroll = document.getElementById('projectsScroll');
    if (!scroll) return;
    scroll.innerHTML = '';
    PROJECTS.forEach(p => {
      const data = p[state.lang];
      const el = document.createElement('article');
      el.className = 'project has-photo';
      const projAlt = `${data.h} · ${p.type} · ${p.loc}`;
      el.innerHTML = `
        <div class="project-img">
          <img src="${p.img}" alt="${projAlt}" loading="lazy" decoding="async">
          <span class="project-badge">${p.badge}</span>
        </div>
        <div class="project-meta"><span>${p.type}</span><span>${p.loc}</span></div>
        <h4>${data.h}</h4>
        <p>${data.p}</p>
      `;
      scroll.appendChild(el);
    });
  }

  /* ============== DRAWER ============== */
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');

  function openServiceDrawer(key) {
    const s = SERVICES[key];
    if (!s) return;
    const data = s[state.lang];
    const hero = document.getElementById('drawerHero');
    const content = document.getElementById('drawerContent');
    const kicker = document.getElementById('drawerKicker');

    const heroSrc = s.detailPhoto || s.photo;
    const heroAlt = state.lang === 'tr' ? `${data.title} — detay görseli` : `${data.title} — detail image`;
    hero.innerHTML = `<img src="${heroSrc}" alt="${heroAlt}" loading="lazy" decoding="async">`;
    kicker.textContent = data.title;

    const chipsHtml = data.chips.map(c => `<span class="chip">${c}</span>`).join('');
    const itemsHtml = data.items.map(i => `<li><strong>${i.h}</strong> — ${i.d}</li>`).join('');

    content.innerHTML = `
      <h2>${data.title}</h2>
      <p class="lead">${data.summary}</p>
      <div class="drawer-chips">${chipsHtml}</div>
      <h3>${state.lang === 'tr' ? 'Kapsam' : 'Scope'}</h3>
      <ul>${itemsHtml}</ul>
      <button type="button" class="btn btn-primary" data-panel="contact" data-close-drawer>${data.cta} →</button>
    `;

    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    history.pushState(null, '', '#service/' + key);

    content.querySelectorAll('[data-close-drawer]').forEach(el => {
      el.addEventListener('click', () => {
        const panel = el.dataset.panel;
        setTimeout(() => {
          closeDrawer();
          if (panel) showShellPanel(panel);
        }, 100);
      });
    });
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (location.hash.startsWith('#service/')) history.pushState(null, '', ' ');
  }

  /* ============== THEME ============== */
  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('levent.theme', state.theme);
  }

  /* ============== LANGUAGE ============== */
  function setLang(lang) {
    if (lang === state.lang) return;
    state.lang = lang;
    localStorage.setItem('levent.lang', lang);
    document.documentElement.setAttribute('lang', lang);
    applyI18n();
    renderServices();
    renderProjects();
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
  }

  /* ============== REVEAL ============== */
  function setupReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .cert-small, .project, .about-card, .hb-card, .rail-nav .nav-tab').forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ============== COUNT-UP ============== */
  function setupCountUp() {
    const items = document.querySelectorAll('[data-count]');
    const done = new WeakSet();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || done.has(e.target)) return;
        done.add(e.target);
        const target = parseFloat(e.target.dataset.count);
        const suffix = e.target.dataset.suffix || '';
        const prefix = e.target.dataset.prefix || '';
        const duration = 1400;
        const start = performance.now();
        function tick(time) {
          const p = Math.min((time - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          const display = val < 10 ? val.toFixed(1).replace(/\.0$/, '') : Math.round(val);
          e.target.textContent = prefix + display + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    items.forEach(el => io.observe(el));
  }

  /* ============== CONTACT FORM ============== */
  function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    const requiredIds = ['f-name', 'f-email', 'f-message'];

    function clearErrors() {
      form.querySelectorAll('.field-error').forEach(n => n.remove());
      form.querySelectorAll('.is-invalid').forEach(n => n.classList.remove('is-invalid'));
    }
    function addError(inputId, key) {
      const input = document.getElementById(inputId);
      if (!input) return;
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      const span = document.createElement('span');
      span.className = 'field-error';
      span.textContent = t(key);
      input.parentElement.appendChild(span);
    }
    function setStatus(kind, key) {
      if (!status) return;
      status.className = 'form-status is-' + kind;
      status.textContent = t(key);
    }
    function validate() {
      clearErrors();
      let ok = true;
      requiredIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
          addError(id, 'form.err.required');
          ok = false;
        }
      });
      const email = document.getElementById('f-email');
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        addError('f-email', 'form.err.email');
        ok = false;
      }
      return ok;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) {
        setStatus('error', 'form.status.invalid');
        const firstBad = form.querySelector('.is-invalid');
        if (firstBad) firstBad.focus();
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = t('form.status.sending');
      submitBtn.disabled = true;
      setStatus('pending', 'form.status.sending');

      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error('API not ready');
        setStatus('success', 'form.status.success');
        form.reset();
      } catch (err) {
        setStatus('error', 'form.status.fallback');
        const text = encodeURIComponent(
          `SERVİS TALEBİ\nAd: ${data.name}\nFirma: ${data.company || '-'}\nE-posta: ${data.email}\nTel: ${data.phone || '-'}\nGemi/IMO: ${data.vessel || '-'}\nClass: ${data.class || '-'}\nHizmet: ${data.service || '-'}\nAciliyet: ${data.urgency || '-'}\nMesaj: ${data.message || '-'}`
        );
        window.open(`https://wa.me/905376507776?text=${text}`, '_blank', 'noopener');
      } finally {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
    });

    form.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => {
        if (el.classList.contains('is-invalid')) {
          el.classList.remove('is-invalid');
          el.removeAttribute('aria-invalid');
          const err = el.parentElement.querySelector('.field-error');
          if (err) err.remove();
        }
      });
    });
  }

  /* ============== LOGIN MODAL (mevcut davranış) ============== */
  function setupLogin() {
    const btn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('loginClose');
    const typeSel = document.getElementById('loginType');
    const classBox = document.getElementById('classSelectBox');
    const companyBox = document.getElementById('companySelectBox');
    const submit = document.getElementById('loginSubmit');
    const errorEl = document.getElementById('loginError');
    const passEl = document.getElementById('loginPass');

    if (!btn || !modal) return;

    btn.addEventListener('click', () => { modal.classList.add('is-open'); });
    closeBtn.addEventListener('click', () => { modal.classList.remove('is-open'); errorEl.textContent = ''; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });

    function updateVisibility() {
      const v = typeSel.value;
      classBox.style.display = v === 'CLASS' ? 'block' : 'none';
      companyBox.style.display = v === 'COMPANY' ? 'block' : 'none';
    }
    typeSel.addEventListener('change', updateVisibility);
    updateVisibility();

    submit.addEventListener('click', async () => {
      errorEl.textContent = '';
      const payload = {
        type: typeSel.value,
        password: passEl.value
      };
      if (payload.type === 'CLASS') payload.class = document.getElementById('loginClass').value;
      if (payload.type === 'COMPANY') payload.company = document.getElementById('loginCompany').value;

      try {
        const resp = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.token) localStorage.setItem('levent.token', data.token);
          window.location.href = 'authorized.html';
        } else {
          const err = await resp.json().catch(() => ({}));
          errorEl.textContent = err.message || (state.lang === 'tr' ? 'Giriş başarısız.' : 'Login failed.');
        }
      } catch (err) {
        errorEl.textContent = state.lang === 'tr' ? 'Sunucuya ulaşılamadı.' : 'Server unreachable.';
      }
    });
  }

  const SHELL_PANELS = ['home', 'services', 'certification', 'gallery', 'projects', 'about', 'contact'];

  function showShellPanel(id) {
    if (!SHELL_PANELS.includes(id)) return;
    document.querySelectorAll('.shell-panel').forEach(p => {
      p.classList.toggle('is-active', p.dataset.panel === id);
    });
    document.querySelectorAll('[data-panel].nav-tab').forEach(tab => {
      tab.classList.toggle('is-active', tab.dataset.panel === id);
    });
    const stage = document.getElementById('shellStage');
    if (stage) {
      const active = stage.querySelector('.shell-panel.is-active');
      if (active) active.scrollTop = 0;
    }
    try {
      const base = window.location.pathname + window.location.search;
      if (id === 'home') {
        history.replaceState(null, '', base);
      } else {
        history.replaceState(null, '', base + '#' + id);
      }
    } catch (e) { /* ignore */ }
    document.querySelectorAll('.shell-panel.is-active .reveal').forEach(el => el.classList.add('is-visible'));
  }

  function parseShellHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h || h.startsWith('service/')) return null;
    if (SHELL_PANELS.includes(h)) return h;
    return null;
  }

  /* ============== EVENT BINDINGS ============== */
  function bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Lang buttons
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.addEventListener('click', () => setLang(b.dataset.lang));
    });

    // Drawer close
    const drawerCloseBtn = document.getElementById('drawerClose');
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Mobile slide-in menu (header yok — FAB)
    const hamburger = document.getElementById('hamburger');
    const mobileSheet = document.getElementById('mobileSheet');
    const mobileBackdrop = document.getElementById('mobileSheetBackdrop');
    function setMobileSheet(open) {
      if (!mobileSheet || !mobileBackdrop || !hamburger) return;
      mobileSheet.classList.toggle('is-open', open);
      mobileBackdrop.classList.toggle('is-open', open);
      mobileSheet.setAttribute('aria-hidden', open ? 'false' : 'true');
      mobileBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      const shell = document.body.classList.contains('shell');
      document.body.style.overflow = open || shell ? 'hidden' : '';
    }
    if (hamburger && mobileSheet) {
      hamburger.addEventListener('click', () => setMobileSheet(!mobileSheet.classList.contains('is-open')));
    }
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => setMobileSheet(false));
    }
    document.querySelectorAll('.mobile-sheet-nav .nav-tab, .mobile-sheet-nav .nav-tab--external').forEach(el => {
      el.addEventListener('click', () => setMobileSheet(false));
    });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      closeDrawer();
      if (mobileSheet && mobileSheet.classList.contains('is-open')) setMobileSheet(false);
    });

    const themeMobile = document.getElementById('themeToggleMobile');
    if (themeMobile) themeMobile.addEventListener('click', toggleTheme);

    const loginBtnMobile = document.getElementById('loginBtnMobile');
    const loginModal = document.getElementById('loginModal');
    if (loginBtnMobile && loginModal) {
      loginBtnMobile.addEventListener('click', () => { loginModal.classList.add('is-open'); setMobileSheet(false); });
    }

    // Tek ekran kabuk: panel tetikleyicileri
    document.querySelectorAll('[data-panel]:not(.shell-panel)').forEach(el => {
      if (el.tagName === 'A' && el.getAttribute('href') && !el.getAttribute('href').startsWith('#')) return;
      el.addEventListener('click', e => {
        const pid = el.dataset.panel;
        if (!pid) return;
        e.preventDefault();
        showShellPanel(pid);
      });
    });

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const raw = href.slice(1);
      if (raw.startsWith('service/')) return;
      if (SHELL_PANELS.includes(raw)) {
        e.preventDefault();
        showShellPanel(raw);
      }
    });

    window.addEventListener('hashchange', () => {
      if (location.hash.startsWith('#service/')) {
        const key = location.hash.split('/')[1];
        openServiceDrawer(key);
        return;
      }
      const fromHash = parseShellHash();
      if (fromHash) showShellPanel(fromHash);
    });

    const initialPanel = parseShellHash();
    if (initialPanel) {
      showShellPanel(initialPanel);
    } else {
      showShellPanel('home');
    }

    // Deep link: servis çekmecesi
    if (location.hash.startsWith('#service/')) {
      const key = location.hash.split('/')[1];
      setTimeout(() => openServiceDrawer(key), 300);
    }
  }

  /* ============== GO ============== */
  document.addEventListener('DOMContentLoaded', () => {
    // Sync active lang button
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === state.lang);
    });
    applyI18n();
    renderServices();
    renderProjects();
    setupReveal();
    setupCountUp();
    setupForm();
    setupLogin();
    bindEvents();
  });
})();
