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
    photo: "assets/works/generator-avr-diode-speedcard.jpg",
    detailPhoto: "assets/works/generator-avr-diode-speedcard.jpg",
    tr: {
      title: "Güç & Dağıtım Sistemleri",
      lead: "Main switchboard'dan emergency genset'e — gemin elektrik omurgasının tamamı",
      summary: "Bulker filonun elektrik kalbi: jeneratör, ana/yardımcı pano, busbar, transformer, AVR, shaft generator, shore connection. Arıza tespiti, bakım, retrofit, commissioning — hepsinde class-kabul dokümantasyonla.",
      chips: ["MSB / ESB", "AVR / PMS", "Shaft Gen", "Shore Power"],
      items: [
        { h: "Main Switchboard (MSB) bakım & retrofit", d: "ACB/MCCB test, busbar torque kontrolü, insulation, termografi, panel etiketleme, class raporu" },
        { h: "Emergency Switchboard (ESB) test", d: "Emergency genset auto-start, load sharing, synchronization, SOLAS test protokolü" },
        { h: "Ana & Yardımcı Jeneratör servisi", d: "AVR arızası, exciter, diyot grubu, voltaj regülasyonu, load testing, overhaul" },
        { h: "Shaft Generator (PTO) commissioning", d: "VFD, clutch control, voltage/frequency matching, class attendance" },
        { h: "Transformer testleri", d: "440/220V dry-type ve oil-type transformer insulation, turns ratio, polarity" },
        { h: "Shore Power (OPS) retrofit", d: "AB FuelEU Maritime uyumu, cold ironing bağlantısı, class pre-approval" },
        { h: "Busbar & Distribution Board", d: "Section board, group starter panel, motor control center (MCC)" },
        { h: "Synchroscope & parallel operation", d: "Jeneratör paralel çalışma tuning, reverse power protection" }
      ],
      cta: "Güç sistemi talebi oluştur"
    },
    en: {
      title: "Power & Distribution Systems",
      lead: "From main switchboard to emergency genset — your vessel's electrical backbone",
      summary: "The electrical heart of your bulker fleet: generator, main/auxiliary panels, busbars, transformers, AVR, shaft generator, shore connection. Diagnosis, maintenance, retrofit, commissioning — all with class-accepted documentation.",
      chips: ["MSB / ESB", "AVR / PMS", "Shaft Gen", "Shore Power"],
      items: [
        { h: "Main Switchboard (MSB) maintenance & retrofit", d: "ACB/MCCB testing, busbar torque check, insulation, thermography, panel labeling, class reporting" },
        { h: "Emergency Switchboard (ESB) testing", d: "Emergency genset auto-start, load sharing, synchronization, SOLAS test protocol" },
        { h: "Main & Auxiliary Generator service", d: "AVR faults, exciter, diode bank, voltage regulation, load testing, overhaul" },
        { h: "Shaft Generator (PTO) commissioning", d: "VFD, clutch control, voltage/frequency matching, class attendance" },
        { h: "Transformer testing", d: "440/220V dry-type and oil-type insulation, turns ratio, polarity" },
        { h: "Shore Power (OPS) retrofit", d: "EU FuelEU Maritime compliance, cold ironing connection, class pre-approval" },
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
    photo: "assets/works/motor-overhaul.jpg",
    detailPhoto: "assets/works/motor-overhaul.jpg",
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
    photo: "assets/works/radar-magnetron-replacement.jpg",
    detailPhoto: "assets/works/radar-magnetron-replacement.jpg",
    tr: {
      title: "Navigasyon & İletişim (GMDSS)",
      lead: "Köprü ekipmanlarının tamamı — radar, ECDIS, gyro, GMDSS",
      summary: "Modern bulker köprüsünün 15+ ayrı sistemi. Radar magnetron, ECDIS güncelleme, gyro drift, GMDSS yıllık test, VDR download — tek elden.",
      chips: ["Radar", "ECDIS", "Gyro", "GMDSS"],
      items: [
        { h: "Radar (S-Band & X-Band)", d: "Magnetron değişim, scanner motoru, trigger board, performance monitor testi" },
        { h: "ECDIS arıza & update", d: "Chart update, sensor interface, route planning hatası, class onaylı backup" },
        { h: "Gyro Compass + repeater", d: "Drift kompanzasyonu, repeater senkronizasyonu, standby gyro transfer" },
        { h: "Autopilot + Rate of Turn", d: "Heading control tuning, off-course alarm, rudder feedback" },
        { h: "AIS + VDR (Voyage Data Recorder)", d: "Yıllık performance test, data download, class attendance" },
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
        { h: "ECDIS faults & updates", d: "Chart updates, sensor interface, route planning errors, class-approved backup" },
        { h: "Gyro Compass + repeater", d: "Drift compensation, repeater synchronization, standby gyro transfer" },
        { h: "Autopilot + Rate of Turn", d: "Heading control tuning, off-course alarm, rudder feedback" },
        { h: "AIS + VDR (Voyage Data Recorder)", d: "Annual performance test, data download, class attendance" },
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
    photo: "assets/works/ams-system-card-replacement.jpg",
    detailPhoto: "assets/works/ams-system-card-replacement.jpg",
    tr: {
      title: "Otomasyon & Kontrol Sistemleri",
      lead: "AMS, IAS, PLC, SCADA — geminin sinir sistemi",
      summary: "Alarm Monitoring, Integrated Automation, PLC/SCADA, PMS — class onaylı UMS/E0 sisteminin her bileşeni. Arıza tespit, retrofit, yazılım güncelleme.",
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
      summary: "Alarm Monitoring, Integrated Automation, PLC/SCADA, PMS — every component of class-approved UMS/E0 operation. Fault diagnosis, retrofit, software updates.",
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
    photo: "assets/works/water-mist-system.jpg",
    detailPhoto: "assets/works/water-mist-system.jpg",
    tr: {
      title: "Güvenlik Sistemleri",
      lead: "Fire detection, CO2, PA/GA, gas detection — SOLAS uyum",
      summary: "Fire detection panelinden CO2/water mist'e, Public Address'den gaz dedektörüne kadar SOLAS Ch. II-2 kapsamındaki her güvenlik sistemi — class onaylı test ve sertifikasyonla.",
      chips: ["Fire Alarm", "CO2 / Water Mist", "PA/GA", "Gas Detection"],
      items: [
        { h: "Fire Detection Panel (conventional + addressable)", d: "Consilium, Autronica, Apollo, Notifier — loop test, detector değişim, class attendance" },
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
      summary: "Every safety system under SOLAS Ch. II-2 — fire detection panel, CO2/water mist, Public Address, gas detectors — with class-approved testing and certification.",
      chips: ["Fire Alarm", "CO2 / Water Mist", "PA/GA", "Gas Detection"],
      items: [
        { h: "Fire Detection Panel (conventional + addressable)", d: "Consilium, Autronica, Apollo, Notifier — loop test, detector replacement, class attendance" },
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
    photo: "assets/hero/engine-room.jpg",
    detailPhoto: "assets/hero/engine-room.jpg",
    tr: {
      title: "Aydınlatma & Seyir Fenerleri",
      lead: "Navigation lights + LED retrofit + kargo ambarı aydınlatması",
      summary: "Seyir fenerleri (masthead, side, stern, anchor, NUC), deck ve kargo ambarı aydınlatması, acil aydınlatma, LED retrofit — class kural 3/12 uyumlu.",
      chips: ["Nav Lights", "LED Retrofit", "Cargo Hold", "Emergency"],
      items: [
        { h: "Navigation Lights + Control Panel", d: "Masthead, side, stern, anchor, NUC, RAM — class kuralına uyum" },
        { h: "Deck & Accommodation LED retrofit", d: "Enerji tasarrufu %50-70, CII rating iyileşmesi, class onaylı fixture" },
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
        { h: "Deck & Accommodation LED retrofit", d: "50-70% energy savings, CII rating improvement, class-approved fixtures" },
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
    photo: "assets/cert/acb-mccb-test.jpg",
    detailPhoto: "assets/cert/acb-mccb-test.jpg",
    tr: {
      title: "Test & Sertifikasyon",
      lead: "SVERKER 900 + Megger + OMICRON — class kabul raporlama",
      summary: "ACB/MCCB testinden insulation resistance'a, protection relay'den HV switchboard'a — tüm test ekipmanları kalibrasyon sertifikalı, raporlar 8 class otoritesine uygun format.",
      chips: ["ACB/MCCB", "Insulation", "Protection Relay", "Thermography"],
      items: [
        { h: "ACB / MCCB Test", d: "Mekanik + elektrik + koruma fonksiyonları — SVERKER 900 ile, BV/DNV/ABS formatlı rapor" },
        { h: "Insulation Resistance (Megger)", d: "500V-5000V test, trend grafikleri, moisture analiz, polarization index" },
        { h: "Protection Relay Test", d: "Overcurrent, earth fault, differential, distance — coordination study" },
        { h: "HV Switchboard Commissioning", d: "1000V üstü sistem — yalnızca HV sertifikalı personel ile" },
        { h: "Termografik İnceleme", d: "FLIR thermal imager ile hotspot tespiti, loose connection bulgu raporu" },
        { h: "Cable Continuity & Meggering", d: "Yeni inşa commissioning, retrofit sonrası loop test" },
        { h: "Earth Fault Detection Test", d: "Insulation monitor, earth fault indicator, source localization" },
        { h: "Class-Ready Rapor Paketi", d: "DNV / BV / ABS / Lloyd's / TL / RINA / ClassNK / IRS formatında dokümantasyon" }
      ],
      cta: "Test talebi oluştur"
    },
    en: {
      title: "Testing & Certification",
      lead: "SVERKER 900 + Megger + OMICRON — class-accepted reporting",
      summary: "From ACB/MCCB testing to insulation resistance, from protection relays to HV switchboards — all test equipment calibration certified, reports formatted for 8 class authorities.",
      chips: ["ACB/MCCB", "Insulation", "Protection Relay", "Thermography"],
      items: [
        { h: "ACB / MCCB Testing", d: "Mechanical + electrical + protection functions — via SVERKER 900, BV/DNV/ABS formatted reports" },
        { h: "Insulation Resistance (Megger)", d: "500V-5000V testing, trend graphs, moisture analysis, polarization index" },
        { h: "Protection Relay Testing", d: "Overcurrent, earth fault, differential, distance — coordination study" },
        { h: "HV Switchboard Commissioning", d: "Systems above 1000V — HV-certified personnel only" },
        { h: "Thermographic Inspection", d: "FLIR thermal imager for hotspot detection, loose connection finding report" },
        { h: "Cable Continuity & Meggering", d: "New-build commissioning, post-retrofit loop testing" },
        { h: "Earth Fault Detection Testing", d: "Insulation monitor, earth fault indicator, source localization" },
        { h: "Class-Ready Report Package", d: "DNV / BV / ABS / Lloyd's / TL / RINA / ClassNK / IRS formatted documentation" }
      ],
      cta: "Request testing service"
    }
  },

  "commissioning-retrofit": {
    order: 8,
    icon: "wrench",
    category: "main",
    size: "card-half",
    photo: "assets/cert/busbar-kit-2.jpg",
    detailPhoto: "assets/cert/busbar-kit-2.jpg",
    tr: {
      title: "Commissioning & Retrofit",
      lead: "Yeni inşa + enerji retrofit + decarbonization uyum",
      summary: "Yeni inşa gemilerde FAT/SAT süpervizi, retrofit projelerinde class pre-approval, CII rating iyileştirme, shore power + battery hybrid + VFD retrofit.",
      chips: ["FAT/SAT", "VFD Retrofit", "LED Conversion", "Shore Power"],
      items: [
        { h: "Yeni İnşa Commissioning (FAT/SAT)", d: "Factory Acceptance Test, Harbour Test, Sea Trial — class attendance, punch list kapama" },
        { h: "VFD (Variable Frequency Drive) Retrofit", d: "Pompa/fan motor VFD dönüşümü, %15-30 enerji tasarrufu, CII iyileşmesi" },
        { h: "LED Conversion projesi", d: "Tam gemi LED dönüşümü, class onaylı fixture, ROI analizi" },
        { h: "Shore Power (OPS) retrofit", d: "AB limanları için 2030 hazırlığı, class pre-approval, sözleşme" },
        { h: "Battery / Hybrid retrofit feasibility", d: "DNV Battery Safety, class approval, EPC supervision" },
        { h: "Energy Monitoring System", d: "EU FuelEU uyum, CII veri toplama, dashboard kurulum" },
        { h: "Retrofit Engineering Drawing", d: "Cable schedule, SLD, terminal diagram revizyonu" },
        { h: "Cyber Security OT Retrofit (IACS E26/E27)", d: "Network segmentation, firewall, asset inventory, class onay" }
      ],
      cta: "Retrofit projesi görüş"
    },
    en: {
      title: "Commissioning & Retrofit",
      lead: "New build + energy retrofit + decarbonization compliance",
      summary: "FAT/SAT supervision on new-builds, class pre-approval on retrofits, CII rating improvements, shore power + battery hybrid + VFD retrofits.",
      chips: ["FAT/SAT", "VFD Retrofit", "LED Conversion", "Shore Power"],
      items: [
        { h: "New-Build Commissioning (FAT/SAT)", d: "Factory Acceptance Test, Harbour Test, Sea Trial — class attendance, punch list closure" },
        { h: "VFD (Variable Frequency Drive) Retrofit", d: "Pump/fan motor VFD conversion, 15-30% energy savings, CII improvement" },
        { h: "LED Conversion project", d: "Whole-ship LED conversion, class-approved fixtures, ROI analysis" },
        { h: "Shore Power (OPS) retrofit", d: "2030 readiness for EU ports, class pre-approval, contracting" },
        { h: "Battery / Hybrid retrofit feasibility", d: "DNV Battery Safety, class approval, EPC supervision" },
        { h: "Energy Monitoring System", d: "EU FuelEU compliance, CII data collection, dashboard installation" },
        { h: "Retrofit Engineering Drawings", d: "Cable schedule, SLD, terminal diagram revision" },
        { h: "OT Cyber Security Retrofit (IACS E26/E27)", d: "Network segmentation, firewall, asset inventory, class approval" }
      ],
      cta: "Discuss retrofit project"
    }
  },

  "emergency-remote": {
    order: 9,
    icon: "alert",
    category: "main",
    size: "card-third",
    photo: "assets/works/shaft-earthing-device.jpg",
    detailPhoto: "assets/works/shaft-earthing-device.jpg",
    tr: {
      title: "Acil Müdahale & Remote ETO",
      lead: "7/24 onboard + remote destek — off-hire önleme",
      summary: "Port'ta beklenmedik elektrik arızasına 24 saat içinde onboard müdahale, veya aylık abonelikle 7/24 uzaktan ETO Zoom/TeamViewer desteği. Off-hire günlük $8-15k, tek olay paketi amorti eder.",
      chips: ["24h Response", "Remote Desk", "Retainer"],
      items: [
        { h: "Acil Onboard Müdahale", d: "Tuzla + çevre liman 4 saat, Türkiye geneli 24 saat, global koordinasyon" },
        { h: "Remote ETO Desk (retainer)", d: "$450-900/gemi/ay — 15 dk yanıt, Zoom/TeamViewer, aylık rapor" },
        { h: "PSC Green Pass paketi", d: "72 saatte detention riskini kapatma — $3.5-6k/gemi sabit paket" },
        { h: "Class Survey Acil Hazırlık", d: "Sürveyör geldiğinde elektrik eksiklikleri kapama — 48 saat hedef" },
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
        { h: "Emergency Class Survey Prep", d: "Close electrical deficiencies before surveyor arrival — 48h target" },
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
    photo: "assets/cert/class-reporting.jpg",
    detailPhoto: "assets/cert/class-reporting.jpg",
    tr: {
      title: "Class & Sertifika Hazırlığı",
      lead: "8 class otoritesi için survey öncesi full hazırlık",
      summary: "Intermediate, Special, Annual survey öncesi 25-maddelik elektrik checklist, surveyor attendance, PSC hazırlık, CII rating destek, SOLAS Ch. II-1 uyum.",
      chips: ["Intermediate", "Special 5yr", "Annual", "PSC"],
      items: [
        { h: "Intermediate Survey Hazırlığı", d: "2.5 yılda bir — switchboard test, cable megger, emergency genset" },
        { h: "Special Survey (5 yıllık)", d: "Comprehensive — her ekipmanın full test + dokümantasyon" },
        { h: "Annual Survey Hazırlığı", d: "Her yıl — GMDSS, navigation lights, fire detection test" },
        { h: "PSC Elektrik Audit", d: "Paris/Tokyo MoU deficiency kapama, black/grey list bayrak" },
        { h: "CII Rating Destek", d: "D/E alan gemilerde elektrik tüketim optimizasyonu — C'ye yükseltme" },
        { h: "SOLAS Ch. II-1 Uyum", d: "Reg. 40-45 (elektrik sistem), Reg. 31-36 (bridge) compliance" },
        { h: "Surveyor Attendance", d: "Class surveyor ile birebir — BV, DNV, ABS, Lloyd's, TL, RINA, ClassNK, IRS" },
        { h: "Class Deficiency Kapama", d: "Gecikmiş condition of class / outstanding item takip" }
      ],
      cta: "Class hazırlık talep et"
    },
    en: {
      title: "Class & Certificate Preparation",
      lead: "Pre-survey preparation for 8 class authorities",
      summary: "25-point electrical checklist for Intermediate, Special and Annual surveys; surveyor attendance; PSC preparation; CII rating support; SOLAS Ch. II-1 compliance.",
      chips: ["Intermediate", "Special 5yr", "Annual", "PSC"],
      items: [
        { h: "Intermediate Survey Prep", d: "Every 2.5 years — switchboard test, cable megger, emergency genset" },
        { h: "Special Survey (5-year)", d: "Comprehensive — full test + documentation for every equipment" },
        { h: "Annual Survey Prep", d: "Every year — GMDSS, navigation lights, fire detection testing" },
        { h: "PSC Electrical Audit", d: "Paris/Tokyo MoU deficiency closure, black/grey list flags" },
        { h: "CII Rating Support", d: "Electrical consumption optimization on D/E rated ships — upgrade to C" },
        { h: "SOLAS Ch. II-1 Compliance", d: "Reg. 40-45 (electrical system), Reg. 31-36 (bridge) compliance" },
        { h: "Surveyor Attendance", d: "One-on-one with class surveyor — BV, DNV, ABS, Lloyd's, TL, RINA, ClassNK, IRS" },
        { h: "Class Deficiency Closure", d: "Overdue condition of class / outstanding item tracking" }
      ],
      cta: "Request class prep"
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
    "nav.services": "Hizmetler",
    "nav.blog": "Blog",
    "nav.certification": "Test & Sertifika",
    "nav.projects": "Projeler",
    "nav.about": "Hakkımızda",
    "nav.contact": "İletişim",
    "btn.login": "Yetkili Giriş",
    "btn.request": "Talep Oluştur",
    "btn.services": "Hizmetleri Gör",
    "hero.eyebrow": "Class Ready · Since 2012 · Pendik + Wyoming",
    "hero.title.a": "Bulker filolar için",
    "hero.title.b": "class-ready",
    "hero.title.c": "elektrotek partner.",
    "hero.sub": "Arıza müdahalesi, test & sertifikasyon, ETO desteği ve class denetim hazırlığı — 7/24, onboard veya remote, sekiz class otoritesine uygun dokümantasyonla.",
    "hero.trust.1": "servis verilen<br>gemi",
    "hero.trust.2": "class pass<br>oranı",
    "hero.trust.3": "onboard<br>yanıt",
    "hero.trust.4": "class<br>otoritesi",
    "hero.bento.big.kicker": "Canlı · Pendik TR",
    "hero.bento.big.title": "ACB Test + Class Rapor",
    "hero.bento.big.desc": "MV Aegean Trader — Bulker · Tuzla 2025-Q4<br>SVERKER 900 ile MCCB + ACB testi tamamlandı, BV formatlı rapor teslim edildi.",
    "hero.bento.1.title": "Remote Support",
    "hero.bento.2.title": "ETO Certified",
    "hero.bento.3.title": "Dual Coast",
    "hero.bento.4.title": "Port Coverage",
    "hero.bento.5.title": "High Voltage",
    "hero.bento.6.title": "Green Pass",
    "trust.label": "Class Otoriteleri & Müşteriler",
    "services.kicker": "01 · Hizmetler",
    "services.title.a": "Bulker'ın tüm elektrik ihtiyaçları.",
    "services.title.b": "Tek partner, 8 class otoritesi.",
    "services.sub": "Güç sistemlerinden navigasyona, otomasyondan güvenliğe — kuruyuk geminin elektrik üzerindeki her alanında 24 saat içinde Pendik'ten onboard, global limanda koordine müdahale.",
    "cert.kicker": "02 · Test & Sertifika",
    "cert.title": "Beş adımda class-ready rapor.",
    "cert.sub": "Tüm test ekipmanları kalibrasyon sertifikalı. Yürütülen çalışmalar class denetimlerinde kabul gören yöntem ve dokümantasyonla desteklenir.",
    "cert.process.title": "Süreç Akışı",
    "cert.process.sub": "Her adım class-kabul formatında belgelenir; sonuçlar yetkili kullanıcı panelinden gemi bazında takip edilebilir.",
    "cert.step.1": "Talep",
    "cert.step.1.sub": "Form/WhatsApp",
    "cert.step.2": "Planlama",
    "cert.step.2.sub": "Scope + ETA",
    "cert.step.3": "Onboard",
    "cert.step.3.sub": "Test + doküman",
    "cert.step.4": "Rapor",
    "cert.step.4.sub": "Class format",
    "cert.step.5": "Class",
    "cert.step.5.sub": "Submission",
    "cert.card.accred.title": "Akreditasyon",
    "cert.card.accred.desc": "DNV, BV, ABS, Lloyd's, TL, RINA, ClassNK, IRS ile uyumlu test protokolleri",
    "cert.card.equipment.title": "Ekipman Envanteri",
    "cert.card.equipment.desc": "SVERKER 900, Megger MIT, Fluke 1587, FLIR Thermal Imager — kalibrasyon sertifikalı",
    "cert.card.sample.title": "Örnek Rapor",
    "cert.card.sample.desc": "Class-kabul örnek sertifika PDF indir",
    "cert.card.sample.btn": "PDF İndir",
    "cert.card.panel.title": "Yetkili Panel",
    "cert.card.panel.desc": "Gemi bazında test tarihleri, sertifika arşivi, sonraki test vadesi",
    "cert.card.panel.btn": "Giriş",
    "projects.kicker": "03 · Projeler",
    "projects.title": "Son tamamlanan işler.",
    "projects.sub": "240+ gemide gerçekleştirilen servisten seçme vakalar — anonimleştirilmiş teknik detaylarla.",
    "about.kicker": "04 · Hakkımızda",
    "about.title.a": "İki kıta, bir ekip,",
    "about.title.b": "STCW III/6",
    "about.title.c": "yetkinliği.",
    "about.sub": "Pendik ofisimiz operasyonel merkez, Wyoming kaydımız global müşteriye USD faturalama ve 7/24 zaman dilimi kapsamı sağlar.",
    "about.pendik.kicker": "Operasyonel HQ",
    "about.pendik.title": "Pendik · İstanbul",
    "about.pendik.desc": "Tuzla + Yalova + Aliağa tersane bölgelerine 90 dakikada erişim, yerel test ekipmanı envanteri.",
    "about.wyoming.kicker": "Registered Office",
    "about.wyoming.title": "Sheridan · Wyoming · USA",
    "about.wyoming.desc": "LLC kayıtlı ticari varlık — global müşteri için USD faturalama, P&I + sigorta rapor kanalı.",
    "about.certs.kicker": "Core & Technical Certifications",
    "about.certs.title": "STCW III/6 ETO + HV Operations + Safety",
    "about.certs.clients": "Hizmet verilen firmalar: TP Offshore (TP OTC) · Polaris Denizcilik · Bright Denizcilik · Çebi Kaptan Denizcilik · MEDLOG (MSC Group) · Reederei NORD.",
    "cta.title": "Sonraki class survey'inizi garantiye alın.",
    "cta.sub": "25-maddelik \"Class Survey Electrical Checklist\" PDF'imizi ücretsiz gönderelim — son 12 ayda 40+ gemide kullandık.",
    "cta.btn.primary": "Checklist İste",
    "cta.btn.secondary": "WhatsApp",
    "contact.kicker": "05 · İletişim",
    "contact.title": "24 saat içinde geri dönüş.",
    "contact.sub": "Form, WhatsApp veya direkt telefonla. Mesai saatlerinde 4 saat, dışında 8 saat içinde cevap — form qualified lead ise 30 dakika.",
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
    "footer.tagline": "Class-ready elektrotek partner — bulker filolar için Tuzla ve global limanlarda.",
    "footer.services": "Hizmetler",
    "footer.company": "Şirket",
    "footer.contact": "İletişim",
    "footer.blog": "Blog",
    "footer.career": "Kariyer",
    "footer.rights": "© 2026 LEVENT MARINE LLC · TÜM HAKLARI SAKLIDIR",
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
    "profile.title": "Arkadan 12 yıl saha, önden class kabulü.",
    "profile.sub": "Türk ve uluslararası armatörlerle çalışılmış 240+ gemi, 6 farklı bayrak altında süren operasyonel deneyim ve STCW III/6 ETO + HV + güvenlik sertifikasyonu.",
    "profile.bg.title": "Professional Background",
    "profile.bg.desc": "12+ yıldır bulker, tanker, container ve offshore tipi gemilerde Electro-Technical Officer görevleri ve saha servisi. Tuzla, Yalova ve Aliağa tersane bölgelerinin yanı sıra global limanlarda onboard + remote destek, class denetim hazırlığı ve test-sertifikasyon süreçleri.",
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
    "profile.cta.sub": "İlk 15 dakikalık teknik konsültasyon ücretsiz — mevcut elektrik sorununuzu hızlıca değerlendirelim."
  },
  en: {
    "nav.services": "Services",
    "nav.blog": "Blog",
    "nav.certification": "Testing & Certification",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "btn.login": "Authorized Login",
    "btn.request": "Request Quote",
    "btn.services": "View Services",
    "hero.eyebrow": "Class Ready · Since 2012 · Pendik + Wyoming",
    "hero.title.a": "Class-ready electrotechnical",
    "hero.title.b": "partner",
    "hero.title.c": "for bulker fleets.",
    "hero.sub": "Fault response, testing & certification, ETO support, and class survey preparation — 24/7, onboard or remote, with documentation accepted by eight class authorities.",
    "hero.trust.1": "vessels<br>serviced",
    "hero.trust.2": "class pass<br>rate",
    "hero.trust.3": "onboard<br>response",
    "hero.trust.4": "class<br>authorities",
    "hero.bento.big.kicker": "Live · Pendik TR",
    "hero.bento.big.title": "ACB Test + Class Report",
    "hero.bento.big.desc": "MV Aegean Trader — Bulker · Tuzla 2025-Q4<br>MCCB + ACB testing completed with SVERKER 900, BV-formatted report delivered.",
    "hero.bento.1.title": "Remote Support",
    "hero.bento.2.title": "ETO Certified",
    "hero.bento.3.title": "Dual Coast",
    "hero.bento.4.title": "Port Coverage",
    "hero.bento.5.title": "High Voltage",
    "hero.bento.6.title": "Green Pass",
    "trust.label": "Class Authorities & Clients",
    "services.kicker": "01 · Services",
    "services.title.a": "Every electrical need of a bulker.",
    "services.title.b": "One partner, 8 class authorities.",
    "services.sub": "From power systems to navigation, automation to safety — every electrical domain on a dry-cargo vessel, with 24-hour onboard response from Pendik or coordinated global port attendance.",
    "cert.kicker": "02 · Testing & Certification",
    "cert.title": "Class-ready reports in five steps.",
    "cert.sub": "All test equipment calibration-certified. All work supported by methods and documentation accepted in class surveys.",
    "cert.process.title": "Process Flow",
    "cert.process.sub": "Each step documented in class-accepted format; results tracked per vessel from the authorized user panel.",
    "cert.step.1": "Request",
    "cert.step.1.sub": "Form/WhatsApp",
    "cert.step.2": "Planning",
    "cert.step.2.sub": "Scope + ETA",
    "cert.step.3": "Onboard",
    "cert.step.3.sub": "Test + docs",
    "cert.step.4": "Report",
    "cert.step.4.sub": "Class format",
    "cert.step.5": "Class",
    "cert.step.5.sub": "Submission",
    "cert.card.accred.title": "Accreditation",
    "cert.card.accred.desc": "Test protocols compatible with DNV, BV, ABS, Lloyd's, TL, RINA, ClassNK, IRS",
    "cert.card.equipment.title": "Equipment Inventory",
    "cert.card.equipment.desc": "SVERKER 900, Megger MIT, Fluke 1587, FLIR Thermal Imager — calibration certified",
    "cert.card.sample.title": "Sample Report",
    "cert.card.sample.desc": "Download a class-accepted sample certificate PDF",
    "cert.card.sample.btn": "Download PDF",
    "cert.card.panel.title": "Authorized Panel",
    "cert.card.panel.desc": "Test dates by vessel, certificate archive, next test deadline",
    "cert.card.panel.btn": "Sign In",
    "projects.kicker": "03 · Projects",
    "projects.title": "Recent completed work.",
    "projects.sub": "Selected cases from 240+ vessels — with anonymized technical details.",
    "about.kicker": "04 · About",
    "about.title.a": "Two continents, one team,",
    "about.title.b": "STCW III/6",
    "about.title.c": "qualification.",
    "about.sub": "Our Pendik office is the operational center; our Wyoming registration provides USD invoicing and 24/7 time-zone coverage for global clients.",
    "about.pendik.kicker": "Operational HQ",
    "about.pendik.title": "Pendik · Istanbul",
    "about.pendik.desc": "90-minute reach to Tuzla + Yalova + Aliağa shipyard regions, local test equipment inventory.",
    "about.wyoming.kicker": "Registered Office",
    "about.wyoming.title": "Sheridan · Wyoming · USA",
    "about.wyoming.desc": "Registered LLC — USD invoicing for global clients, P&I + insurance reporting channel.",
    "about.certs.kicker": "Core & Technical Certifications",
    "about.certs.title": "STCW III/6 ETO + HV Operations + Safety",
    "about.certs.clients": "Companies served: TP Offshore (TP OTC) · Polaris Denizcilik · Bright Denizcilik · Çebi Kaptan Denizcilik · MEDLOG (MSC Group) · Reederei NORD.",
    "cta.title": "Secure your next class survey.",
    "cta.sub": "We'll send our 25-point \"Class Survey Electrical Checklist\" PDF — used on 40+ vessels in the last 12 months.",
    "cta.btn.primary": "Request Checklist",
    "cta.btn.secondary": "WhatsApp",
    "contact.kicker": "05 · Contact",
    "contact.title": "Response within 24 hours.",
    "contact.sub": "Form, WhatsApp, or direct phone. Business hours 4h, outside 8h — qualified form leads get a 30-minute response.",
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
    "footer.tagline": "Class-ready electrotechnical partner — for bulker fleets in Tuzla and global ports.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.blog": "Blog",
    "footer.career": "Career",
    "footer.rights": "© 2026 LEVENT MARINE LLC · ALL RIGHTS RESERVED",
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
    "profile.title": "Twelve years in the field, class acceptance up front.",
    "profile.sub": "240+ vessels served with Turkish and international owners, operational experience under 6 flag states, and STCW III/6 ETO + HV + safety certification.",
    "profile.bg.title": "Professional Background",
    "profile.bg.desc": "12+ years of Electro-Technical Officer duties and field service on bulker, tanker, container and offshore vessels. Onboard + remote support across Tuzla, Yalova and Aliağa yards and global ports — class survey preparation, testing and certification.",
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
    "profile.cta.sub": "First 15-minute technical consultation is free — let's assess your current electrical issue quickly."
  }
};

/* ============== PROJECTS DATA ============== */
const PROJECTS = [
  { badge: "BV", type: "Handymax Bulker", loc: "Tuzla · 2025 Q4", img: "assets/cert/acb-mccb-test.jpg",
    tr: { h: "ACB + MCCB Retest & Class Report", p: "Special survey öncesi 14 ACB ve 32 MCCB testi, class kabul gören raporlama ile 48 saatte tamamlandı." },
    en: { h: "ACB + MCCB Retest & Class Report", p: "Before special survey, 14 ACBs and 32 MCCBs tested and reported in class-accepted format within 48 hours." }
  },
  { badge: "DNV", type: "Supramax Bulker", loc: "Çanakkale · 2025 Q3", img: "assets/works/generator-avr-diode-speedcard.jpg",
    tr: { h: "AVR Arıza + Shaft Earthing", p: "Jeneratör AVR arızasının 6 saatte teşhis + müdahalesi, shaft earthing set yenileme." },
    en: { h: "AVR Fault + Shaft Earthing", p: "Generator AVR fault diagnosed and repaired in 6 hours; shaft earthing set renewed." }
  },
  { badge: "ABS", type: "Container Feeder", loc: "Yalova · 2025 Q3", img: "assets/works/fire-alarm-system.jpg",
    tr: { h: "Fire Alarm + Water Mist Retrofit", p: "Eski fire detection panelinin class-onaylı modern sistemle değişimi ve FAT/SAT süpervizi." },
    en: { h: "Fire Alarm + Water Mist Retrofit", p: "Replacement of old fire detection panel with class-approved modern system and FAT/SAT supervision." }
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
    keys.forEach(key => {
      const s = SERVICES[key];
      const data = s[state.lang];
      const card = document.createElement('article');
      card.className = `card ${s.size} has-photo`;
      card.dataset.service = key;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const chipsHtml = (data.chips || []).map(c => `<span class="chip">${c}</span>`).join('');
      const altText = state.lang === 'tr' ? `${data.title} — servis görseli` : `${data.title} — service image`;
      card.innerHTML = `
        <div class="card-photo" aria-hidden="true"><img src="${s.photo}" alt="" loading="lazy" decoding="async"></div>
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
      <a href="#contact" class="btn btn-accent" data-close-drawer>${data.cta} →</a>
    `;

    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    history.pushState(null, '', '#service/' + key);

    content.querySelectorAll('[data-close-drawer]').forEach(el => {
      el.addEventListener('click', () => { setTimeout(closeDrawer, 100); });
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
    document.querySelectorAll('.card, .cert-small, .project, .about-card, .hb-card').forEach(el => {
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
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

    // Hamburger -> mobile nav (simple toggle)
    const hamburger = document.getElementById('hamburger');
    const mobileBar = document.getElementById('mobileNav');
    if (hamburger && mobileBar) {
      hamburger.addEventListener('click', () => mobileBar.classList.toggle('is-open'));
    }

    // Nav scrollspy
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const spyIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          const match = document.querySelector(`.nav a[href="#${e.target.id}"]`);
          if (match) match.classList.add('is-active');
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => spyIO.observe(s));

    // Deep link
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
