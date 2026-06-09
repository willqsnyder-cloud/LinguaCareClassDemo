import { useState, useMemo, useRef } from "react";

const NAV = "#001F3F";
const ACC = "#2ECC71";

const SCREENS = { LIBRARY: "LIBRARY", LANG: "LANG", HIPAA: "HIPAA", FORM: "FORM", REVIEW: "REVIEW" };

const T = {
  English: { hipaaTitle:"HIPAA Privacy Notice", name:"Full Name", namePh:"Enter full name", dob:"Date of Birth", dobFormat:"MM/DD/YYYY", complaint:"Chief Complaint", complaintPh:"Describe your main concern", pain:"Pain Level (1–10)", submit:"Submit Securely", hipaa:"Your health information is protected under HIPAA. Data is processed securely and never stored on this device.", ack:"Acknowledge & Continue", yes:"Yes", no:"No", describe:"Please describe...", required:"is required", timeout:"Session will timeout soon", dismiss:"Dismiss", selectPh:"— Select —", fields:{ surgeries:{label:"Major Surgeries and Dates",ph:"List surgeries..."}, family_hx:{label:"Family Medical History",ph:"List family history..."}, alcohol:{label:"Do you drink alcohol?"}, alcohol_freq:{label:"How often do you drink?",ph:"e.g. weekly"}, smoking:{label:"Do you smoke cigarettes?"}, smoke_freq:{label:"How often do you smoke?",ph:"e.g. 5/day"}, rx_drugs:{label:"Prescription drugs for non-medical reasons?"}, illegal:{label:"Do you take illegal drugs?"} }},
  Spanish: { hipaaTitle:"Aviso de Privacidad HIPAA", name:"Nombre Completo", namePh:"Ingrese su nombre completo", dob:"Fecha de Nacimiento", dobFormat:"DD/MM/AAAA", complaint:"Motivo de Consulta", complaintPh:"Ej: dolor de cabeza, fiebre", pain:"Nivel de Dolor (1–10)", submit:"Enviar de Forma Segura", hipaa:"Su información de salud está protegida bajo HIPAA. Los datos se procesan de forma segura y nunca se almacenan en este dispositivo.", ack:"Reconocer y Continuar", yes:"Sí", no:"No", describe:"Por favor describa...", required:"es obligatorio", timeout:"La sesión expirará pronto", dismiss:"Cerrar", selectPh:"— Seleccionar —", fields:{ surgeries:{label:"Cirugías Mayores y Fechas",ph:"Liste cirugías..."}, family_hx:{label:"Historia Familiar de Enfermedades",ph:"Liste antecedentes..."}, alcohol:{label:"¿Bebe alcohol?"}, alcohol_freq:{label:"¿Con qué frecuencia bebe?",ph:"Ej: semanalmente"}, smoking:{label:"¿Fuma cigarrillos?"}, smoke_freq:{label:"¿Con qué frecuencia fuma?",ph:"Ej: 5 por día"}, rx_drugs:{label:"¿Medicamentos recetados por razones no médicas?"}, illegal:{label:"¿Consume drogas ilegales?"} }},
  French:  { hipaaTitle:"Avis de Confidentialité HIPAA", name:"Nom Complet", namePh:"Entrez votre nom complet", dob:"Date de Naissance", dobFormat:"JJ/MM/AAAA", complaint:"Motif de Consultation", complaintPh:"Ex: mal de tête, fièvre", pain:"Niveau de Douleur (1–10)", submit:"Soumettre en Toute Sécurité", hipaa:"Vos informations de santé sont protégées par la loi HIPAA. Les données sont traitées en toute sécurité.", ack:"Reconnaître et Continuer", yes:"Oui", no:"Non", describe:"Veuillez décrire...", required:"est obligatoire", timeout:"La session expirera bientôt", dismiss:"Fermer", selectPh:"— Sélectionner —", fields:{ surgeries:{label:"Chirurgies Majeures et Dates",ph:"Listez les chirurgies..."}, family_hx:{label:"Antécédents Familiaux",ph:"Listez les antécédents..."}, alcohol:{label:"Consommez-vous de l'alcool?"}, alcohol_freq:{label:"À quelle fréquence buvez-vous?",ph:"Ex: chaque semaine"}, smoking:{label:"Fumez-vous des cigarettes?"}, smoke_freq:{label:"À quelle fréquence fumez-vous?",ph:"Ex: 5/jour"}, rx_drugs:{label:"Médicaments sur ordonnance à des fins non médicales?"}, illegal:{label:"Prenez-vous des drogues illicites?"} }},
  German:  { hipaaTitle:"HIPAA Datenschutzhinweis", name:"Vollständiger Name", namePh:"Vollständigen Namen eingeben", dob:"Geburtsdatum", dobFormat:"TT.MM.JJJJ", complaint:"Hauptbeschwerde", complaintPh:"z.B. Kopfschmerzen, Fieber", pain:"Schmerzgrad (1–10)", submit:"Sicher Einreichen", hipaa:"Ihre Gesundheitsdaten sind durch HIPAA geschützt. Die Daten werden sicher verarbeitet.", ack:"Bestätigen und Fortfahren", yes:"Ja", no:"Nein", describe:"Bitte beschreiben...", required:"ist erforderlich", timeout:"Die Sitzung läuft bald ab", dismiss:"Schließen", selectPh:"— Auswählen —", fields:{ surgeries:{label:"Größere Operationen und Daten",ph:"Operationen auflisten..."}, family_hx:{label:"Familiäre Vorerkrankungen",ph:"Anamnese beschreiben..."}, alcohol:{label:"Trinken Sie Alkohol?"}, alcohol_freq:{label:"Wie oft trinken Sie?",ph:"z.B. wöchentlich"}, smoking:{label:"Rauchen Sie Zigaretten?"}, smoke_freq:{label:"Wie oft rauchen Sie?",ph:"z.B. 5 pro Tag"}, rx_drugs:{label:"Verschreibungspflichtige Medikamente aus nicht-medizinischen Gründen?"}, illegal:{label:"Nehmen Sie illegale Drogen?"} }},
};

// FIX 3: Significantly expanded TRANSLATIONS_BACK dictionary
const TRANSLATIONS_BACK = {
  // Yes / No
  "sí":"Yes","si":"Yes","oui":"Yes","ja":"Yes",
  "no":"No","non":"No","nein":"No",
  // Never
  "nunca":"Never","nunca.":"Never","jamais":"Never","jamais.":"Never","nie":"Never","nie.":"Never",
  // Always
  "siempre":"Always","toujours":"Always","immer":"Always",
  // Sometimes
  "a veces":"Sometimes","parfois":"Sometimes","manchmal":"Sometimes","algunas veces":"Sometimes","de vez en cuando":"Sometimes","de temps en temps":"Sometimes","ab und zu":"Sometimes","gelegentlich":"Occasionally",
  // Weekly
  "semanalmente":"Weekly","cada semana":"Weekly","chaque semaine":"Weekly","chaque semane":"Weekly","chaque semain":"Weekly","chaque semaîne":"Weekly","wöchentlich":"Weekly","wochentlich":"Weekly","wochtenlicht":"Weekly","wochtlich":"Weekly","woechentlich":"Weekly","wöchentich":"Weekly","wochentich":"Weekly","cada semana.":"Weekly",
  // Daily
  "diariamente":"Daily","todos los días":"Daily","chaque jour":"Daily","tous les jours":"Daily","täglich":"Daily","taglich":"Daily","taeglich":"Daily","jeden tag":"Daily",
  // Occasionally
  "ocasionalmente":"Occasionally","occasionnellement":"Occasionally","de vez en cuando":"Occasionally",
  // Rarely
  "raramente":"Rarely","rara vez":"Rarely","rarement":"Rarely","selten":"Rarely","casi nunca":"Rarely","presque jamais":"Rarely","kaum":"Rarely",
  // Monthly
  "mensualmente":"Monthly","cada mes":"Monthly","chaque mois":"Monthly","monatlich":"Monthly",
  // None / Never used
  "ninguno":"None","ninguna":"None","aucun":"None","aucune":"None","keine":"None","keiner":"None","nenhum":"None","nada":"None","rien":"None","nichts":"None",
  // Not applicable
  "no aplica":"N/A","no aplicable":"N/A","non applicable":"N/A","nicht zutreffend":"N/A","n/a":"N/A",
  // Symptoms — Spanish
  "dolor de cabeza":"Headache","cefalea":"Headache",
  "fiebre":"Fever",
  "tos":"Cough","tos seca":"Dry cough","tos con flema":"Productive cough",
  "fatiga":"Fatigue","cansancio":"Fatigue","agotamiento":"Exhaustion",
  "náuseas":"Nausea","nauseas":"Nausea","vómitos":"Vomiting","vomito":"Vomiting",
  "mareos":"Dizziness","vértigo":"Vertigo","vertigo":"Vertigo",
  "dolor de pecho":"Chest pain","dolor en el pecho":"Chest pain",
  "dificultad para respirar":"Shortness of breath","falta de aire":"Shortness of breath",
  "dolor de garganta":"Sore throat",
  "dolor de espalda":"Back pain","dolor lumbar":"Lower back pain",
  "dolor abdominal":"Abdominal pain","dolor de estómago":"Stomach pain",
  "erupción cutánea":"Rash","sarpullido":"Rash",
  "hinchazón":"Swelling","inflamación":"Inflammation",
  "estreñimiento":"Constipation","diarrea":"Diarrhea",
  "pérdida de apetito":"Loss of appetite","sin apetito":"No appetite",
  "insomnio":"Insomnia","no puedo dormir":"Difficulty sleeping",
  "ansiedad":"Anxiety","depresión":"Depression","depresion":"Depression",
  "presión alta":"High blood pressure","hipertensión":"Hypertension",
  "diabetes":"Diabetes","asma":"Asthma","artritis":"Arthritis",
  "entumecimiento":"Numbness","hormigueo":"Tingling","entumecimiento y hormigueo":"Numbness and tingling",
  "visión borrosa":"Blurred vision","vista borrosa":"Blurred vision","visión nublada":"Blurred vision",
  "palpitaciones":"Palpitations","latidos irregulares":"Irregular heartbeat","corazón acelerado":"Racing heart",
  "ardor al orinar":"Burning urination","dolor al orinar":"Painful urination","frecuencia urinaria":"Urinary frequency","orina frecuente":"Frequent urination","incontinencia":"Incontinence",
  "dolor muscular":"Muscle pain","dolores musculares":"Muscle pain","calambres":"Muscle cramps","calambres musculares":"Muscle cramps","tensión muscular":"Muscle tension",
  // Symptoms — French
  "mal de tête":"Headache","maux de tête":"Headache","migraine":"Migraine",
  "fièvre":"Fever",
  "toux":"Cough","toux sèche":"Dry cough","toux grasse":"Productive cough",
  "fatigue":"Fatigue","épuisement":"Exhaustion",
  "nausée":"Nausea","nausées":"Nausea","vomissements":"Vomiting",
  "vertiges":"Dizziness","vertige":"Dizziness",
  "douleur thoracique":"Chest pain","douleur à la poitrine":"Chest pain",
  "essoufflement":"Shortness of breath","difficulté à respirer":"Shortness of breath",
  "mal de gorge":"Sore throat",
  "mal de dos":"Back pain","douleur dorsale":"Back pain",
  "douleur abdominale":"Abdominal pain","mal au ventre":"Stomach pain",
  "éruption cutanée":"Rash","eruption cutanee":"Rash",
  "gonflement":"Swelling",
  "constipation":"Constipation","diarrhée":"Diarrhea","diarrhee":"Diarrhea",
  "perte d'appétit":"Loss of appetite",
  "insomnie":"Insomnia",
  "anxiété":"Anxiety","anxiete":"Anxiety","dépression":"Depression","depression":"Depression",
  "hypertension":"Hypertension",
  "diabète":"Diabetes","diabete":"Diabetes","asthme":"Asthma","arthrite":"Arthritis",
  "engourdissement":"Numbness","fourmillements":"Tingling","picotements":"Tingling","engourdissement et fourmillements":"Numbness and tingling",
  "vue trouble":"Blurred vision","vision trouble":"Blurred vision","vision floue":"Blurred vision","vue floue":"Blurred vision",
  "palpitations":"Palpitations","battements irreguliers":"Irregular heartbeat","battements irréguliers":"Irregular heartbeat","coeur qui bat vite":"Racing heart",
  "brûlure urinaire":"Burning urination","brulure urinaire":"Burning urination","douleur en urinant":"Painful urination","envie fréquente d'uriner":"Frequent urination","envie frequente d'uriner":"Frequent urination","incontinence":"Incontinence",
  "douleur musculaire":"Muscle pain","douleurs musculaires":"Muscle pain","crampes":"Muscle cramps","crampes musculaires":"Muscle cramps","tension musculaire":"Muscle tension",
  // Symptoms — German
  "kopfschmerzen":"Headache","kopfschmerz":"Headache",
  "fieber":"Fever",
  "husten":"Cough","trockener husten":"Dry cough",
  "müdigkeit":"Fatigue","mudigkeit":"Fatigue","erschöpfung":"Exhaustion","erschopfung":"Exhaustion",
  "übelkeit":"Nausea","ubelkeit":"Nausea","erbrechen":"Vomiting",
  "schwindel":"Dizziness","schwindelig":"Dizzy",
  "brustschmerzen":"Chest pain","brustschmerz":"Chest pain",
  "kurzatmigkeit":"Shortness of breath","atemnot":"Shortness of breath",
  "halsschmerzen":"Sore throat",
  "rückenschmerzen":"Back pain","ruckenschmerzen":"Back pain",
  "bauchschmerzen":"Abdominal pain","magenschmerzen":"Stomach pain",
  "hautausschlag":"Rash","ausschlag":"Rash",
  "schwellung":"Swelling",
  "verstopfung":"Constipation","durchfall":"Diarrhea",
  "appetitverlust":"Loss of appetite","kein appetit":"No appetite",
  "schlaflosigkeit":"Insomnia",
  "angst":"Anxiety","depression":"Depression",
  "bluthochdruck":"High blood pressure","hypertonie":"Hypertension",
  "diabetes":"Diabetes","asthma":"Asthma","arthritis":"Arthritis",
  "taubheitsgefühl":"Numbness","taubheitsgefuhl":"Numbness","kribbeln":"Tingling","kribbelgefühl":"Tingling","kribbelgefuhl":"Tingling","taubheit und kribbeln":"Numbness and tingling",
  "verschwommenes sehen":"Blurred vision","unscharfes sehen":"Blurred vision","sehstörungen":"Vision problems","sehstorungen":"Vision problems",
  "herzrasen":"Racing heart","herzstolpern":"Palpitations","herzrhythmusstörungen":"Heart palpitations","herzrhythmusstorungen":"Heart palpitations","unregelmäßiger herzschlag":"Irregular heartbeat","unregelmasiger herzschlag":"Irregular heartbeat",
  "brennen beim wasserlassen":"Burning urination","schmerzen beim wasserlassen":"Painful urination","häufiges wasserlassen":"Frequent urination","haufiges wasserlassen":"Frequent urination","inkontinenz":"Incontinence","harndrang":"Urinary urgency",
  "muskelschmerzen":"Muscle pain","muskelschmerz":"Muscle pain","muskelkrämpfe":"Muscle cramps","muskelkrampfe":"Muscle cramps","muskelverspannung":"Muscle tension","verspannungen":"Muscle tension",
  // German clinical terms
  "latexallergie":"Latex allergy","latex allergie":"Latex allergy",
  "schilddrüsenprobleme":"Thyroid problems","schilddrusenprobleme":"Thyroid problems","schilddrüse":"Thyroid","schilddrusenproblem":"Thyroid problem",
  "schilddrüsenunterfunktion":"Hypothyroidism","schilddrüsenüberfunktion":"Hyperthyroidism",
  "herzerkrankung":"Heart disease","herzprobleme":"Heart problems","herzinfarkt":"Heart attack","herzinsuffizienz":"Heart failure",
  "schlaganfall":"Stroke","epilepsie":"Epilepsy","krampfanfälle":"Seizures","krampfanfalle":"Seizures",
  "nierenerkrankung":"Kidney disease","lebererkrankung":"Liver disease","magenprobleme":"Stomach problems",
  "osteoporose":"Osteoporosis","fibromyalgie":"Fibromyalgia","rheuma":"Rheumatism","lupus":"Lupus",
  "penicillinallergie":"Penicillin allergy","aspirinallergie":"Aspirin allergy","sulfonamidallergie":"Sulfa allergy",
  "allergie gegen penicillin":"Penicillin allergy","penicillin allergie":"Penicillin allergy","penicillin-allergie":"Penicillin allergy",
  "herzerkrankungen":"Heart conditions","herzkrankheit":"Heart disease","herzkrankheiten":"Heart conditions","herzbeschwerden":"Heart complaints",
  "keine allergien bekannt":"No known allergies","keine medikamentenallergien":"No medication allergies",
  "keine operationen":"No surgeries","keine voroperationen":"No prior surgeries",
  "keine familienerkrankungen":"No family history","keine bekannten erkrankungen":"No known conditions",
  "blutdrucktabletten":"Blood pressure medication","blutverdünner":"Blood thinners","insulintherapie":"Insulin therapy",
  "appendektomie":"Appendectomy","blinddarmentfernung":"Appendix removal","gallenblasenentfernung":"Gallbladder removal",
  "knieersatz":"Knee replacement","hüftprothese":"Hip replacement","kaiserschnitt":"Cesarean section",
  "raucher":"Smoker","nichtraucher":"Non-smoker","ex-raucher":"Former smoker","gelegentlich":"Occasionally",
  // Spanish clinical terms
  "alergia al látex":"Latex allergy","alergia latex":"Latex allergy",
  "problemas de tiroides":"Thyroid problems","tiroides":"Thyroid","hipotiroidismo":"Hypothyroidism","hipertiroidismo":"Hyperthyroidism",
  "enfermedad cardíaca":"Heart disease","enfermedad cardiaca":"Heart disease","problemas del corazón":"Heart problems","infarto":"Heart attack",
  "condición cardíaca":"Heart condition","condicion cardiaca":"Heart condition","condiciones cardíacas":"Heart conditions","problemas cardíacos":"Heart problems","padecimiento cardíaco":"Heart condition",
  "derrame cerebral":"Stroke","epilepsia":"Epilepsy","convulsiones":"Seizures",
  "enfermedad renal":"Kidney disease","enfermedad hepática":"Liver disease","enfermedad hepatica":"Liver disease",
  "osteoporosis":"Osteoporosis","fibromialgia":"Fibromyalgia","reumatismo":"Rheumatism",
  "alergia a la penicilina":"Penicillin allergy","alergia a la aspirina":"Aspirin allergy",
  "alergia penicilina":"Penicillin allergy","alergia al penicillin":"Penicillin allergy","alergia penicillin":"Penicillin allergy",
  "sin alergias conocidas":"No known allergies","sin cirugías previas":"No prior surgeries",
  "anticoagulantes":"Blood thinners","insulina":"Insulin","cesárea":"Cesarean section",
  "fumador":"Smoker","no fumador":"Non-smoker","ex fumador":"Former smoker",
  // French clinical terms
  "allergie au latex":"Latex allergy","allergie latex":"Latex allergy",
  "problèmes thyroïdiens":"Thyroid problems","thyroïde":"Thyroid","hypothyroïdie":"Hypothyroidism","hyperthyroïdie":"Hyperthyroidism",
  "maladie cardiaque":"Heart disease","problèmes cardiaques":"Heart problems","crise cardiaque":"Heart attack",
  "condition cardiaque":"Heart condition","conditions cardiaques":"Heart conditions","maladie du coeur":"Heart disease","probleme cardiaque":"Heart problem","affection cardiaque":"Heart condition",
  "accident vasculaire cérébral":"Stroke","avc":"Stroke","épilepsie":"Epilepsy","convulsions":"Seizures",
  "maladie rénale":"Kidney disease","maladie hépatique":"Liver disease",
  "ostéoporose":"Osteoporosis","fibromyalgie":"Fibromyalgia","rhumatisme":"Rheumatism",
  "allergie à la pénicilline":"Penicillin allergy","allergie à l'aspirine":"Aspirin allergy",
  "allergie penicilline":"Penicillin allergy","allergie pénicilline":"Penicillin allergy","allergie au penicillin":"Penicillin allergy",
  "aucune allergie connue":"No known allergies","aucune chirurgie antérieure":"No prior surgeries",
  "anticoagulants":"Blood thinners","insuline":"Insulin","césarienne":"Cesarean section",
  "fumeur":"Smoker","non-fumeur":"Non-smoker","ancien fumeur":"Former smoker",
  "selten":"Rarely","peu souvent":"Rarely","poco frecuente":"Rarely",
  "normalmente":"Normally","generalmente":"Generally","usualmente":"Usually",
  "normalement":"Normally","généralement":"Generally","generalement":"Generally",
  "normalerweise":"Normally","gewöhnlich":"Usually","gewohnlich":"Usually",
  // Manner adverbs
  "socialmente":"Socially","socialement":"Socially","sozial":"Socially",
  "moderadamente":"Moderately","modérément":"Moderately","moderement":"Moderately","mäßig":"Moderately","masig":"Moderately",
  "levemente":"Mildly","légèrement":"Mildly","legerement":"Mildly","leicht":"Mildly",
  "gravemente":"Severely","sévèrement":"Severely","severement":"Severely","schwer":"Severely",
  // Quantities
  "poco":"A little","un poco":"A little","un peu":"A little","ein wenig":"A little","etwas":"A little",
  "mucho":"A lot","beaucoup":"A lot","viel":"A lot","sehr viel":"A lot",
  "ninguno":"None","rien":"None","nichts":"None",
  // Quantity per day — slash notation (e.g. "9 / jour", "5/jour", "3/tag", "2/día")
  "/ jour":"per day","/ day":"per day","/ tag":"per day","/ día":"per day","/jour":"per day","/day":"per day","/tag":"per day","/día":"per day","/dia":"per day",
  "/ semaine":"per week","/ woche":"per week","/ semana":"per week","/semaine":"per week","/woche":"per week","/semana":"per week",
  "par jour":"per day","pro tag":"per day","al día":"per day","al dia":"per day","por día":"per day","por dia":"per day",
  "par semaine":"per week","pro woche":"per week","a la semana":"per week","por semana":"per week",
  "1 zigarette pro tag":"1 cigarette per day","1 cigarettes pour jour":"1 cigarette per day",
  "5 cigarrillos al día":"5 cigarettes per day","5 cigarettes par jour":"5 cigarettes per day",
  "5 zigaretten pro tag":"5 cigarettes per day",
  "10 cigarrillos al día":"10 cigarettes per day","10 cigarettes par jour":"10 cigarettes per day",
  // Common free-text answers
  "ninguna cirugía":"No surgeries","sin cirugías":"No surgeries","aucune chirurgie":"No surgeries","keine operationen":"No surgeries",
  "ninguna alergia":"No allergies","sin alergias":"No allergies","aucune allergie":"No allergies","keine allergien":"No allergies",
  "ningún medicamento":"No medications","sin medicamentos":"No medications","aucun médicament":"No medications","keine medikamente":"No medications",
  "sin antecedentes":"No history","aucun antécédent":"No history","keine vorerkrankungen":"No history",
  "no sé":"Unknown","je ne sais pas":"Unknown","ich weiß nicht":"Unknown","ich weiss nicht":"Unknown",
  "sano":"Healthy","en buena salud":"In good health","en bonne santé":"In good health","en bonne sante":"In good health","gesund":"Healthy",
};

// Strip diacritics so "mal de tete" matches "mal de tête", "nausees" matches "nausées", etc.
function stripDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Pre-build a diacritic-stripped version of TRANSLATIONS_BACK for fuzzy lookup
const TRANSLATIONS_BACK_STRIPPED = {};
for (const [k, v] of Object.entries(TRANSLATIONS_BACK)) {
  TRANSLATIONS_BACK_STRIPPED[stripDiacritics(k)] = v;
}

function translateBack(key, val, lang, fields) {
  if (lang === "English" || !val) return val;
  if (key === "dob" || key === "pain" || key === "name") return val;
  const lower = val.toLowerCase().trim();
  // Exact match with accents
  if (TRANSLATIONS_BACK[lower]) return TRANSLATIONS_BACK[lower];
  // Exact match without accents (e.g. "mal de tete" → "mal de tête" → "Headache")
  const stripped = stripDiacritics(lower);
  if (TRANSLATIONS_BACK_STRIPPED[stripped]) return TRANSLATIONS_BACK_STRIPPED[stripped];

  // Helper: given a raw value, extract any date/year annotations and translate the symptom part
  // Handles patterns like "palpitaciones - 2019", "latidos irregulares desde 2020", "Herzrasen (seit 2018)"
  function translateWithDate(raw) {
    const rawLower = raw.toLowerCase().trim();
    const rawStripped = stripDiacritics(rawLower);
    // Pull out trailing year or date annotations separated by common delimiters
    // Captures: "- 2019", "desde 2019", "since 2019", "seit 2019", "depuis 2019",
    //           "(2019)", "(since 2019)", "~ 2019", "approx 2019", "approximately 2019"
    const dateSuffixRe = /[\s\-–,;(]*(?:desde|since|seit|depuis|from|circa|approx(?:imately)?|~|around|environ|ungefähr|ungefahr|ab|van)?\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?\d{4}[)]*\s*(?:[-–]\s*(?:present|hoy|aujourd'?hui|heute|now|ongoing|actuel(?:lement)?|actualmente|aktuell))?$/i;
    const dateMatch = rawLower.match(dateSuffixRe);
    const dateSuffix = dateMatch ? val.slice(val.toLowerCase().lastIndexOf(dateMatch[0].trimStart())).trim() : "";
    const symptomPart = dateSuffix ? rawLower.slice(0, rawLower.lastIndexOf(dateMatch[0].trimStart())).replace(/[\s\-–,;(]+$/, "").trim() : rawLower;
    const symptomStripped = stripDiacritics(symptomPart);

    // Try exact match on symptom part
    if (TRANSLATIONS_BACK[symptomPart]) return TRANSLATIONS_BACK[symptomPart] + (dateSuffix ? " — " + dateSuffix : "");
    if (TRANSLATIONS_BACK_STRIPPED[symptomStripped]) return TRANSLATIONS_BACK_STRIPPED[symptomStripped] + (dateSuffix ? " — " + dateSuffix : "");
    // Try substring match on symptom part
    for (const [phrase, eng] of Object.entries(TRANSLATIONS_BACK)) {
      if (symptomPart.includes(phrase)) return eng + (dateSuffix ? " — " + dateSuffix : "");
    }
    for (const [phrase, eng] of Object.entries(TRANSLATIONS_BACK_STRIPPED)) {
      if (symptomStripped.includes(phrase)) return eng + (dateSuffix ? " — " + dateSuffix : "");
    }
    return null;
  }

  // Handle slash-notation quantities FIRST — must run before date-aware translation
  // so "5/jour", "3/tag", "2/día", "1/day" always preserve the number
  const slashMatch = lower.match(/^(\d+)\s*\/\s*(.+)$/);
  if (slashMatch) {
    const num = slashMatch[1], unit = slashMatch[2].trim();
    const unitStripped = stripDiacritics(unit);
    const unitKey = "/" + unit;
    const unitKeyStripped = "/" + unitStripped;
    if (TRANSLATIONS_BACK[unit]) return num + " " + TRANSLATIONS_BACK[unit];
    if (TRANSLATIONS_BACK_STRIPPED[unitStripped]) return num + " " + TRANSLATIONS_BACK_STRIPPED[unitStripped];
    if (TRANSLATIONS_BACK[unitKey]) return num + " " + TRANSLATIONS_BACK[unitKey];
    if (TRANSLATIONS_BACK_STRIPPED[unitKeyStripped]) return num + " " + TRANSLATIONS_BACK_STRIPPED[unitKeyStripped];
    const unitMap = { day:"per day", jour:"per day", tag:"per day", día:"per day", dia:"per day",
                      week:"per week", semaine:"per week", woche:"per week", semana:"per week",
                      month:"per month", mois:"per month", monat:"per month", mes:"per month" };
    if (unitMap[unitStripped]) return num + " " + unitMap[unitStripped];
  }
  const numMatch = lower.match(/^(\d+)\s+(.+)$/);
  if (numMatch) {
    const num = numMatch[1], rest = numMatch[2];
    const restStripped = stripDiacritics(rest);
    if (TRANSLATIONS_BACK[rest]) return num + " " + TRANSLATIONS_BACK[rest];
    if (TRANSLATIONS_BACK_STRIPPED[restStripped]) return num + " " + TRANSLATIONS_BACK_STRIPPED[restStripped];
  }

  // Try date-aware translation first
  const dateAware = translateWithDate(val);
  if (dateAware) return dateAware;

  // Multi-symptom: split on commas, semicolons, or newlines and translate each part
  const separatorRe = /[,;\n]+/;
  if (separatorRe.test(lower)) {
    const parts = val.split(separatorRe).map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      const translated = parts.map(p => {
        const t = translateWithDate(p);
        return t || p;
      });
      // Only return multi-part result if at least one part was translated
      if (translated.some((t, i) => t !== parts[i])) return translated.join(", ");
    }
  }

  // Substring match with accents (original fallback)
  for (const [phrase, eng] of Object.entries(TRANSLATIONS_BACK)) {
    if (lower.includes(phrase)) return eng;
  }
  // Substring match without accents
  for (const [phrase, eng] of Object.entries(TRANSLATIONS_BACK_STRIPPED)) {
    if (stripped.includes(phrase)) return eng;
  }
  // Fuzzy fallback for single-word typos (e.g. "wochtenlicht" → "wöchentlich")
  // Only applies to short single words — checks if any dictionary key shares enough characters
  if (!lower.includes(" ") && lower.length >= 5) {
    let bestKey = null, bestScore = 0;
    for (const key of Object.keys(TRANSLATIONS_BACK_STRIPPED)) {
      if (key.includes(" ") || Math.abs(key.length - stripped.length) > 4) continue;
      // Count matching characters at same positions
      let matches = 0;
      for (let i = 0; i < Math.min(key.length, stripped.length); i++) {
        if (key[i] === stripped[i]) matches++;
      }
      const score = matches / Math.max(key.length, stripped.length);
      if (score > 0.7 && score > bestScore) { bestScore = score; bestKey = key; }
    }
    if (bestKey) return TRANSLATIONS_BACK_STRIPPED[bestKey];
  }
  // Fuzzy fallback for multi-word phrases (e.g. "chaque semane" → "chaque semaine")
  // Only attempt if the input has spaces and is reasonably short
  if (lower.includes(" ") && lower.length >= 5 && lower.length <= 40) {
    let bestKey = null, bestScore = 0;
    for (const key of Object.keys(TRANSLATIONS_BACK_STRIPPED)) {
      if (!key.includes(" ") || Math.abs(key.length - stripped.length) > 5) continue;
      let matches = 0;
      for (let i = 0; i < Math.min(key.length, stripped.length); i++) {
        if (key[i] === stripped[i]) matches++;
      }
      const score = matches / Math.max(key.length, stripped.length);
      if (score > 0.75 && score > bestScore) { bestScore = score; bestKey = key; }
    }
    if (bestKey) return TRANSLATIONS_BACK_STRIPPED[bestKey];
  }
  return val;
}

const inputStyle = (err) => ({ width:"100%", padding:"14px", fontSize:16, borderRadius:8, border:`1.5px solid ${err?"red":"#d1d5db"}`, outline:"none", minHeight:48, boxSizing:"border-box", fontFamily:"Urbanist,sans-serif", color:NAV });

// FormField stays OUTSIDE PatientForm — critical rule
function FormField({ label, error, errorMsg, required, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontWeight:600, fontSize:17, color:NAV, marginBottom:6 }}>
        {label} {required && <span style={{ color:"red" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ color:"red", fontSize:14, marginTop:4 }}>{errorMsg || `${label} is required`}</p>}
    </div>
  );
}

function DateInput({ value, onChange, err, lang }) {
  const t = T[lang] || T.English;
  const [display, setDisplay] = useState(value || "");
  function handle(e) {
    const raw = e.target.value;
    setDisplay(raw);
    const sep = raw.includes(".") ? "." : "/";
    const parts = raw.split(sep);
    if (parts.length === 3) {
      let d, m, y;
      if (lang === "English") { [m,d,y] = parts; } else { [d,m,y] = parts; }
      if (d && m && y && y.length === 4) { onChange(y+"-"+m.padStart(2,"0")+"-"+d.padStart(2,"0")); return; }
    }
    onChange("");
  }
  return (
    <div>
      <input type="text" value={display} onChange={handle} placeholder={t.dobFormat} style={inputStyle(err)} />
      <p style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>Format: {t.dobFormat}</p>
    </div>
  );
}

function Header({ screen, onExit }) {
  const isStaff = screen === SCREENS.LIBRARY || screen === SCREENS.REVIEW;
  return (
    <header style={{ background:NAV, color:"white", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:26, color:ACC }}>🌐</span>
        {isStaff && <><span style={{ fontSize:20, fontWeight:700 }}>Lingua<span style={{ color:ACC }}>Care</span></span><span style={{ marginLeft:8, background:"rgba(255,255,255,0.15)", borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600, letterSpacing:1, textTransform:"uppercase" }}>CLINICIAN</span></>}
      </div>
      {screen !== SCREENS.LIBRARY && <button onClick={onExit} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.4)", color:"white", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontWeight:600, fontSize:14, minHeight:48 }}>🔒 Staff Exit</button>}
    </header>
  );
}

function PinModal({ onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  function check() { if (pin==="1234") { onSuccess(); } else { setErr(true); setPin(""); } }
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,31,63,0.85)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"white", borderRadius:16, width:"100%", maxWidth:360, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ background:"#f9fafb", padding:"16px 24px", borderBottom:"1px solid #e5e7eb", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:700, fontSize:17, color:NAV }}>🔒 Staff Authentication</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#9ca3af" }}>✕</button>
        </div>
        <div style={{ padding:24 }}>
          <label style={{ display:"block", fontWeight:600, fontSize:14, color:"#374151", marginBottom:8 }}>Enter Staff PIN</label>
          <input type="password" inputMode="numeric" autoFocus value={pin} onChange={e=>{setPin(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&check()} style={{ width:"100%", textAlign:"center", fontSize:28, letterSpacing:12, padding:12, border:`1.5px solid ${err?"red":"#d1d5db"}`, borderRadius:8, outline:"none", boxSizing:"border-box" }} placeholder="••••" />
          {err && <p style={{ color:"red", fontSize:14, marginTop:6, textAlign:"center" }}>Incorrect PIN</p>}
          <button onClick={check} style={{ width:"100%", background:NAV, color:"white", border:"none", borderRadius:8, padding:14, fontWeight:700, fontSize:16, cursor:"pointer", marginTop:16, minHeight:48 }}>Unlock</button>
        </div>
      </div>
    </div>
  );
}

function StaffLibrary({ templates, onStartSession, onNewTemplate }) {
  const [stage, setStage] = useState("idle");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [extractedCount, setExtractedCount] = useState(0);
  const [extractError, setExtractError] = useState("");

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    setExtractError("");
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => { setPreviewSrc(e.target.result); setStage("preview"); };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
      setStage("preview");
    }
  }

  function handleExtract() {
    setStage("extracting");
    setExtractError("");
    if (!previewSrc) { onNewTemplate(fileName, null); setStage("done"); return; }
    const base64 = previewSrc.split(",")[1];
    const mediaType = previewSrc.split(";")[0].replace("data:","") || "image/jpeg";
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Scan this medical intake form. Return ONLY a valid JSON array. Each object: {\"id\":\"snake_case\",\"label\":\"Short plain text label\",\"type\":\"text|date|select|yesno|textarea|note\",\"required\":true,\"category\":\"demographic|clinical\",\"options\":[]}. Rules: (1) Fill-in lines and single-cell table rows → type text. (2) Multi-row table sections (e.g. Allergies, Medications, Surgical History) → ONE textarea field with the section header as label, e.g. {\"id\":\"allergies\",\"label\":\"Allergies and Drug Reactions\",\"type\":\"textarea\"}. Do NOT emit one field per table column. (3) Yes/No checkbox pair → yesno. (4) Checkbox group 3+ options → select with options array of plain strings. (5) Date fields → date. (6) Instructional italic/bold text → note, required false. (7) Labels must be short plain text only — no parentheses, slashes, pipes, or special chars. Write SEVERITY as its own label if needed. (8) name and dob first if visible. Return ONLY [ ... ] with no explanation." }
        ]}]
      })
    })
    .then(r => r.json())
    .then(data => {
      // Surface any API-level error (auth failure, quota, etc.)
      if (data.error) {
        setExtractError("API error: " + (data.error.message || JSON.stringify(data.error)));
        setStage("error");
        return;
      }
      let raw = (data.content && data.content[0] ? data.content[0].text : "").trim();
      // Normalize smart/curly quotes
      raw = raw.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      // Remove literal newlines/tabs/carriage returns inside JSON string values
      raw = raw.replace(/"([^"]*)"/g, (match) =>
        match.replace(/\n/g, " ").replace(/\r/g, "").replace(/\t/g, " ")
      );
      // Strip any remaining unescaped control characters (0x00–0x1F) outside of \\uXXXX sequences
      raw = raw.replace(/[\x00-\x1F\x7F]/g, " ");
      const s = raw.indexOf("["), e = raw.lastIndexOf("]");
      if (s !== -1 && e !== -1) {
        let jsonStr = raw.slice(s, e + 1);
        // If response was truncated mid-array, attempt to salvage complete objects
        if (data.stop_reason === "max_tokens") {
          const lastComma = jsonStr.lastIndexOf(",{");
          if (lastComma !== -1) jsonStr = jsonStr.slice(0, lastComma) + "]";
        }
        try {
          const fields = JSON.parse(jsonStr);
          if (fields.length > 0) {
            setExtractedCount(fields.length);
            onNewTemplate(fileName, fields);
            setStage("done");
          } else {
            setExtractError("Claude returned 0 fields — try a clearer image.");
            setStage("error");
          }
        } catch(parseErr) {
          setExtractError("Parse error: " + parseErr.message + " — raw snippet: " + jsonStr.slice(0, 120));
          setStage("error");
        }
      } else {
        setExtractError("No JSON array found in response. Raw: " + raw.slice(0, 120));
        setStage("error");
      }
      setTimeout(() => window.scrollTo({top:0,behavior:"smooth"}), 150);
    })
    .catch(err => {
      setExtractError("Network error: " + (err.message || "Could not reach API."));
      setStage("error");
      setTimeout(() => window.scrollTo({top:0,behavior:"smooth"}), 150);
    });
  }

  function handleReset() { setStage("idle"); setPreviewSrc(null); setFileName(""); setExtractedCount(0); setExtractError(""); }

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 24px" }}>
      <h2 style={{ fontSize:26, fontWeight:700, marginBottom:24 }}>Form Library</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:40 }}>
        {templates.map(t => (
          <div key={t.id} style={{ background:t.isNew?"#f0fff4":"white", borderRadius:12, padding:24, border:t.isNew?`2px solid ${ACC}`:"1px solid #e5e7eb", transition:"all 1s" }}>
            <p style={{ fontWeight:700, fontSize:17, marginBottom:4, color:NAV }}>{t.name}</p>
            <p style={{ fontSize:13, color:"#888", marginBottom:14 }}>{t.fields} fields{t.isNew?" — just extracted":""}</p>
            <button onClick={() => onStartSession(t)} style={{ width:"100%", background:NAV, color:"white", border:"none", borderRadius:8, padding:"14px 0", fontWeight:700, fontSize:16, cursor:"pointer", minHeight:48 }}>Start Session</button>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>Or Upload a New Form</h2>
      <div style={{ border:`2px dashed ${isDragging?ACC:stage==="idle"?NAV:ACC}`, borderRadius:12, padding:40, textAlign:"center", background:isDragging?"#f0fff4":"#fafafa", transition:"all 0.2s" }}
        onDragOver={e=>{e.preventDefault();setIsDragging(true);}}
        onDragLeave={()=>setIsDragging(false)}
        onDrop={e=>{e.preventDefault();setIsDragging(false);handleFile(e.dataTransfer.files[0]);}}>
        {stage==="idle" && <>
          <div style={{ fontSize:48, color:ACC, marginBottom:12 }}>↑</div>
          <p style={{ fontWeight:700, color:NAV, fontSize:18, margin:"0 0 8px" }}>Drag and drop a form image here</p>
          <p style={{ color:"#888", fontSize:14, marginBottom:24 }}>Accepts JPG, PNG — LinguaCare reads any medical form</p>
          <label style={{ padding:"14px 32px", background:NAV, color:"white", borderRadius:8, fontSize:16, fontWeight:700, cursor:"pointer", display:"inline-block" }}>
            📁 Browse Files
            <input type="file" accept="image/*" onChange={e=>handleFile(e.target.files[0])} style={{ display:"none" }} />
          </label>
        </>}
        {stage==="preview" && <>
          {previewSrc && <img src={previewSrc} alt="preview" style={{ maxHeight:180, maxWidth:"100%", borderRadius:8, display:"block", margin:"0 auto 12px", boxShadow:"0 2px 12px rgba(0,0,0,0.1)" }} />}
          {!previewSrc && <div style={{ fontSize:56, marginBottom:12 }}>📄</div>}
          <p style={{ color:ACC, fontWeight:700, margin:"8px 0" }}>✓ {fileName}</p>
          <button onClick={handleExtract} style={{ marginTop:16, padding:"12px 28px", border:`2px solid ${NAV}`, background:"white", color:NAV, borderRadius:8, fontSize:16, fontWeight:700, cursor:"pointer", minHeight:48 }}>
            Extract Fields with LinguaCare
          </button>
          <br/>
          <button onClick={handleReset} style={{ marginTop:10, background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:13, textDecoration:"underline" }}>Choose a different file</button>
        </>}
        {stage==="extracting" && <>
          <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
          <p style={{ fontWeight:700, color:NAV, fontSize:18 }}>LinguaCare is reading your form...</p>
          <p style={{ color:ACC, fontSize:14, marginTop:8 }}>Identifying every field label, type, and structure</p>
          <p style={{ color:"#aaa", fontSize:12, marginTop:8 }}>Takes 5–10 seconds</p>
        </>}
        {stage==="done" && <>
          <div style={{ background:ACC, color:"white", padding:12, borderRadius:8, fontWeight:700, fontSize:16, marginBottom:12 }}>
            ✓ {extractedCount > 0 ? extractedCount : "Fields"} extracted successfully
          </div>
          <p style={{ color:NAV, margin:"8px 0" }}>↑ Your form has been added above.<br/>Click <strong>Start Session</strong> to begin.</p>
          <button onClick={handleReset} style={{ marginTop:12, background:"none", border:"none", color:"#888", cursor:"pointer", textDecoration:"underline", fontSize:14 }}>Upload another form</button>
        </>}
        {stage==="error" && <>
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:16, marginBottom:12 }}>
            <p style={{ fontWeight:700, color:"#dc2626", margin:"0 0 6px" }}>⚠️ Extraction Failed</p>
            <p style={{ color:"#b91c1c", fontSize:13, margin:0, wordBreak:"break-word" }}>{extractError}</p>
          </div>
          <button onClick={handleReset} style={{ marginTop:12, padding:"10px 24px", background:NAV, color:"white", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:14 }}>Try Again</button>
        </>}
      </div>
      <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:32 }}>🌐 LinguaCare — <span style={{ fontStyle:"italic" }}>Powered by Claude Vision</span></p>
    </div>
  );
}

function LanguageSelect({ onSelect, isTranslating, transLang, templateName }) {
  const LANGUAGES = [
    { key:"English", native:"English",  heading:"Please select your language",       translating:"Translating into English" },
    { key:"Spanish", native:"Español",  heading:"Por favor seleccione su idioma",    translating:"Traduciendo al Español..." },
    { key:"French",  native:"Français", heading:"Veuillez sélectionner votre langue",translating:"Traduction en Français..." },
    { key:"German",  native:"Deutsch",  heading:"Bitte wählen Sie Ihre Sprache",     translating:"Übersetzung ins Deutsch..." },
  ];
  const transEntry = LANGUAGES.find(l => l.key === transLang);
  return (
    <div style={{ maxWidth:480, margin:"0 auto", padding:"48px 24px", textAlign:"center" }}>
      {templateName && <div style={{ background:"#f0fff4", border:`1px solid ${ACC}`, borderRadius:8, padding:"8px 16px", marginBottom:24, fontSize:14, color:"#065f46", fontWeight:600 }}>📋 {templateName}</div>}
      {isTranslating ? (
        <div style={{ padding:32 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🔄</div>
          <p style={{ color:ACC, fontWeight:700, fontSize:18 }}>{transEntry ? transEntry.translating : "Translating..."}...</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom:32 }}>
            {LANGUAGES.map(({ key, heading }) => (
              <p key={key} style={{ margin:"4px 0", fontSize: key === "English" ? 26 : 15, fontWeight: key === "English" ? 700 : 400, color: key === "English" ? NAV : "#6b7280" }}>{heading}</p>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {LANGUAGES.map(({ key, native }) => (
              <button key={key} onClick={() => onSelect(key)} style={{ width:"100%", padding:"16px 0", fontSize:20, fontWeight:600, border:`2px solid ${NAV}`, borderRadius:12, background:"white", color:NAV, cursor:"pointer", minHeight:56 }}>
                {native}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HipaaNotice({ lang, onAck }) {
  const t = T[lang] || T.English;
  return (
    <div style={{ maxWidth:520, margin:"0 auto", padding:"48px 24px", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
      <h2 style={{ fontSize:26, fontWeight:700, color:NAV, marginBottom:16 }}>{t.hipaaTitle}</h2>
      <p style={{ color:"#555", fontSize:17, lineHeight:1.6, marginBottom:32 }}>{t.hipaa}</p>
      <button onClick={onAck} style={{ width:"100%", background:NAV, color:"white", border:"none", borderRadius:10, padding:"16px 0", fontSize:17, fontWeight:700, cursor:"pointer", minHeight:56 }}>{t.ack}</button>
    </div>
  );
}

// Translate any English field label into the patient language
const LABEL_MAP = {
  Spanish: {
    "patient name":"Nombre del Paciente","full name":"Nombre Completo","first name":"Nombre","last name":"Apellido","middle name":"Segundo Nombre",
    "spouse name":"Nombre del Cónyuge","spouse":"Cónyuge","maiden name":"Nombre de Soltera","spouse maiden name":"Apellido de Soltera del Cónyuge","maiden":"Apellido de Soltera",
    "date of birth":"Fecha de Nacimiento","birth date":"Fecha de Nacimiento","age":"Edad",
    "address":"Dirección","street":"Calle","city":"Ciudad","state":"Estado","zip":"Código Postal","zip code":"Código Postal",
    "phone":"Teléfono","phone number":"Número de Teléfono","cell":"Celular","home phone":"Teléfono de Casa","work phone":"Teléfono del Trabajo",
    "email":"Correo Electrónico","email address":"Correo Electrónico",
    "gender":"Género","sex":"Sexo","marital status":"Estado Civil","occupation":"Ocupación","employer":"Empleador",
    "emergency contact":"Contacto de Emergencia","emergency contact phone":"Teléfono de Contacto de Emergencia","emergency contact name":"Nombre de Contacto de Emergencia",
    "parent":"Padre/Madre","parent/legal guardian name":"Nombre del Padre o Tutor Legal","guardian":"Tutor Legal",
    "insurance":"Seguro Médico","insurance company":"Compañía de Seguro","insurance id":"ID de Seguro","policy":"Póliza","policy number":"Número de Póliza",
    "id#":"Número de ID","id number":"Número de ID","group":"Grupo","group number":"Número de Grupo","plan":"Plan",
    "policy holder":"Titular de la Póliza","policy holder's name":"Nombre del Titular de la Póliza",
    "chief complaint":"Motivo de Consulta","symptoms":"Síntomas","allergies":"Alergias","medications":"Medicamentos",
    "medical history":"Historia Médica","surgical history":"Historia Quirúrgica","family history":"Historia Familiar",
    "pain level":"Nivel de Dolor","pain":"Dolor","signature":"Firma","date":"Fecha","relationship":"Relación",
    "social security":"Número de Seguro Social","ssn":"Número de Seguro Social",
    "referring physician":"Médico Referente","primary care physician":"Médico de Cabecera",
    "preferred pharmacy":"Farmacia Preferida","pharmacy":"Farmacia","pharmacy name":"Nombre de Farmacia",
    "pharmacy phone":"Teléfono de Farmacia","pharmacy address":"Dirección de Farmacia",
    "reason for visit":"Motivo de Visita","reason for today's visit":"Motivo de la Visita de Hoy","visit reason":"Motivo de Visita",
    "chief concern":"Problema Principal","main concern":"Preocupación Principal","presenting complaint":"Queja Principal",
    "current medications":"Medicamentos Actuales","list medications":"Liste sus Medicamentos",
    "known allergies":"Alergias Conocidas","drug allergies":"Alergias a Medicamentos",
    "height":"Estatura","weight":"Peso","blood type":"Tipo de Sangre",
    "language":"Idioma","preferred language":"Idioma Preferido",
    "race":"Raza","ethnicity":"Etnicidad",
    "consent":"Consentimiento","patient signature":"Firma del Paciente",
    "today's date":"Fecha de Hoy","visit date":"Fecha de Visita",
    "secondary insurance":"Seguro Secundario","secondary insurance id":"ID de Seguro Secundario",
    "subscriber name":"Nombre del Suscriptor","subscriber id":"ID del Suscriptor",
    "copay":"Copago","deductible":"Deducible",
    "specific information requested":"Información Específica Solicitada","specific information":"Información Específica","information requested":"Información Solicitada",
    "purpose of disclosure":"Propósito de Divulgación","purpose":"Propósito","disclosure purpose":"Propósito de Divulgación",
    "other purpose":"Otro Propósito","other":"Otro",
    "release to":"Divulgar A","release information to":"Divulgar Información A","authorize release":"Autorizar Divulgación",
    "delivery method":"Método de Entrega","method of delivery":"Método de Entrega","send by":"Enviar Por",
    "release of information":"Divulgación de Información","authorization for release":"Autorización para Divulgación","medical records release":"Divulgación de Registros Médicos",
    "records requested":"Registros Solicitados","type of records":"Tipo de Registros","records to release":"Registros a Divulgar",
    "date of service":"Fecha de Servicio","dates of service":"Fechas de Servicio","date range":"Rango de Fechas","from date":"Fecha Desde","to date":"Fecha Hasta",
    "requestor":"Solicitante","requested by":"Solicitado Por","authorized by":"Autorizado Por","authorized representative":"Representante Autorizado",
    "fax":"Fax","fax number":"Número de Fax","pick up":"Recoger en Persona","mail":"Correo","electronic":"Electrónico","portal":"Portal",
    "expiration date":"Fecha de Vencimiento","expiration":"Vencimiento","valid until":"Válido Hasta",
    "right to revoke":"Derecho a Revocar","revoke":"Revocar","revocation":"Revocación",
    "facility name":"Nombre del Establecimiento","facility":"Establecimiento","clinic name":"Nombre de la Clínica","hospital name":"Nombre del Hospital","provider name":"Nombre del Proveedor",
  },
  French: {
    "patient name":"Nom du Patient","full name":"Nom Complet","first name":"Prénom","last name":"Nom de Famille","middle name":"Deuxième Prénom",
    "spouse name":"Nom du Conjoint","spouse":"Conjoint","maiden name":"Nom de Jeune Fille","spouse maiden name":"Nom de Jeune Fille du Conjoint","maiden":"Nom de Jeune Fille",
    "date of birth":"Date de Naissance","birth date":"Date de Naissance","age":"Âge",
    "address":"Adresse","street":"Rue","city":"Ville","state":"État","zip":"Code Postal","zip code":"Code Postal",
    "phone":"Téléphone","phone number":"Numéro de Téléphone","cell":"Portable","home phone":"Téléphone Domicile","work phone":"Téléphone Travail",
    "email":"Courriel","email address":"Adresse Courriel",
    "gender":"Genre","sex":"Sexe","marital status":"État Civil","occupation":"Profession","employer":"Employeur",
    "emergency contact":"Contact d'Urgence","emergency contact phone":"Téléphone Contact d'Urgence","emergency contact name":"Nom Contact d'Urgence",
    "parent":"Parent","parent/legal guardian name":"Nom du Parent ou Tuteur Légal","guardian":"Tuteur Légal",
    "insurance":"Assurance","insurance company":"Compagnie d'Assurance","insurance id":"ID d'Assurance","policy":"Police","policy number":"Numéro de Police",
    "id#":"Numéro d'ID","id number":"Numéro d'ID","group":"Groupe","group number":"Numéro de Groupe","plan":"Plan",
    "policy holder":"Titulaire de la Police","policy holder's name":"Nom du Titulaire de la Police",
    "chief complaint":"Motif de Consultation","symptoms":"Symptômes","allergies":"Allergies","medications":"Médicaments",
    "medical history":"Antécédents Médicaux","surgical history":"Antécédents Chirurgicaux","family history":"Antécédents Familiaux",
    "pain level":"Niveau de Douleur","pain":"Douleur","signature":"Signature","date":"Date","relationship":"Relation",
    "social security":"Numéro de Sécurité Sociale","ssn":"Numéro de Sécurité Sociale",
    "referring physician":"Médecin Référent","primary care physician":"Médecin Traitant",
    "preferred pharmacy":"Pharmacie Préférée","pharmacy":"Pharmacie","pharmacy name":"Nom de la Pharmacie",
    "pharmacy phone":"Téléphone de la Pharmacie","pharmacy address":"Adresse de la Pharmacie",
    "reason for visit":"Motif de la Visite","reason for today's visit":"Motif de la Visite d'Aujourd'hui","visit reason":"Motif de la Visite",
    "chief concern":"Problème Principal","main concern":"Préoccupation Principale","presenting complaint":"Plainte Principale",
    "current medications":"Médicaments Actuels","list medications":"Listez vos Médicaments",
    "known allergies":"Allergies Connues","drug allergies":"Allergies Médicamenteuses",
    "height":"Taille","weight":"Poids","blood type":"Groupe Sanguin",
    "language":"Langue","preferred language":"Langue Préférée",
    "consent":"Consentement","patient signature":"Signature du Patient",
    "today's date":"Date d'Aujourd'hui","visit date":"Date de la Visite",
    "secondary insurance":"Assurance Secondaire","subscriber name":"Nom de l'Abonné","subscriber id":"ID de l'Abonné",
    "copay":"Participation","deductible":"Franchise",
    "specific information requested":"Informations Spécifiques Demandées","specific information":"Informations Spécifiques","information requested":"Informations Demandées",
    "purpose of disclosure":"Objet de la Divulgation","purpose":"Objet","disclosure purpose":"Objet de la Divulgation",
    "other purpose":"Autre Objet","other":"Autre",
    "release to":"Divulguer À","release information to":"Divulguer les Informations À","authorize release":"Autoriser la Divulgation",
    "delivery method":"Méthode de Livraison","method of delivery":"Méthode de Livraison","send by":"Envoyer Par",
    "release of information":"Divulgation d'Informations","authorization for release":"Autorisation de Divulgation","medical records release":"Divulgation du Dossier Médical",
    "records requested":"Dossiers Demandés","type of records":"Type de Dossiers","records to release":"Dossiers à Divulguer",
    "date of service":"Date de Service","dates of service":"Dates de Service","date range":"Plage de Dates","from date":"Date De","to date":"Date À",
    "requestor":"Demandeur","requested by":"Demandé Par","authorized by":"Autorisé Par","authorized representative":"Représentant Autorisé",
    "fax":"Télécopie","fax number":"Numéro de Télécopie","pick up":"Récupérer en Personne","mail":"Courrier","electronic":"Électronique","portal":"Portail",
    "expiration date":"Date d'Expiration","expiration":"Expiration","valid until":"Valide Jusqu'au",
    "right to revoke":"Droit de Révoquer","revoke":"Révoquer","revocation":"Révocation",
    "facility name":"Nom de l'Établissement","facility":"Établissement","clinic name":"Nom de la Clinique","hospital name":"Nom de l'Hôpital","provider name":"Nom du Prestataire",
  },
  German: {
    "patient name":"Patientenname","full name":"Vollständiger Name","first name":"Vorname","last name":"Nachname","middle name":"Zweiter Vorname",
    "spouse name":"Name des Ehepartners","spouse":"Ehepartner","maiden name":"Geburtsname","spouse maiden name":"Geburtsname des Ehepartners","maiden":"Geburtsname",
    "date of birth":"Geburtsdatum","birth date":"Geburtsdatum","age":"Alter",
    "address":"Adresse","street":"Straße","city":"Stadt","state":"Bundesland","zip":"Postleitzahl","zip code":"Postleitzahl",
    "phone":"Telefon","phone number":"Telefonnummer","cell":"Mobiltelefon","home phone":"Haustelefon","work phone":"Arbeitstelefon",
    "email":"E-Mail","email address":"E-Mail-Adresse",
    "gender":"Geschlecht","sex":"Geschlecht","marital status":"Familienstand","occupation":"Beruf","employer":"Arbeitgeber",
    "emergency contact":"Notfallkontakt","emergency contact phone":"Notfallkontakt Telefon","emergency contact name":"Notfallkontakt Name",
    "parent":"Elternteil","parent/legal guardian name":"Name des Elternteils oder Vormund","guardian":"Vormund",
    "insurance":"Versicherung","insurance company":"Versicherungsgesellschaft","insurance id":"Versicherungs-ID","policy":"Police","policy number":"Policennummer",
    "id#":"ID-Nummer","id number":"ID-Nummer","group":"Gruppe","group number":"Gruppennummer","plan":"Plan",
    "policy holder":"Versicherungsnehmer","policy holder's name":"Name des Versicherungsnehmers",
    "chief complaint":"Hauptbeschwerde","symptoms":"Symptome","allergies":"Allergien","medications":"Medikamente",
    "medical history":"Krankengeschichte","surgical history":"Operationsgeschichte","family history":"Familienanamnese",
    "pain level":"Schmerzgrad","pain":"Schmerz","signature":"Unterschrift","date":"Datum","relationship":"Beziehung",
    "social security":"Sozialversicherungsnummer","ssn":"Sozialversicherungsnummer",
    "referring physician":"Überweisender Arzt","primary care physician":"Hausarzt",
    "preferred pharmacy":"Bevorzugte Apotheke","pharmacy":"Apotheke","pharmacy name":"Name der Apotheke",
    "pharmacy phone":"Apotheke Telefon","pharmacy address":"Apotheke Adresse",
    "reason for visit":"Grund des Besuchs","reason for today's visit":"Grund des heutigen Besuchs","visit reason":"Besuchsgrund",
    "chief concern":"Hauptanliegen","main concern":"Hauptsorge","presenting complaint":"Vorstellungsgrund",
    "current medications":"Aktuelle Medikamente","list medications":"Medikamente auflisten",
    "known allergies":"Bekannte Allergien","drug allergies":"Medikamentenallergien",
    "height":"Körpergröße","weight":"Gewicht","blood type":"Blutgruppe",
    "language":"Sprache","preferred language":"Bevorzugte Sprache",
    "consent":"Einwilligung","patient signature":"Unterschrift des Patienten",
    "today's date":"Heutiges Datum","visit date":"Besuchsdatum",
    "secondary insurance":"Zusatzversicherung","subscriber name":"Name des Versicherungsnehmers","subscriber id":"Versicherungsnehmer-ID",
    "copay":"Zuzahlung","deductible":"Selbstbehalt",
    "specific information requested":"Spezifische Angefragte Informationen","specific information":"Spezifische Informationen","information requested":"Angefragte Informationen",
    "purpose of disclosure":"Zweck der Offenlegung","purpose":"Zweck","disclosure purpose":"Zweck der Offenlegung",
    "other purpose":"Sonstiger Zweck","other":"Sonstiges",
    "release to":"Weitergabe An","release information to":"Informationen Weitergeben An","authorize release":"Weitergabe Genehmigen",
    "delivery method":"Liefermethode","method of delivery":"Liefermethode","send by":"Senden Per",
    "release of information":"Informationsweitergabe","authorization for release":"Genehmigung zur Weitergabe","medical records release":"Weitergabe der Krankenakte",
    "records requested":"Angefragte Unterlagen","type of records":"Art der Unterlagen","records to release":"Weiterzugebende Unterlagen",
    "date of service":"Behandlungsdatum","dates of service":"Behandlungsdaten","date range":"Datumsbereich","from date":"Von Datum","to date":"Bis Datum",
    "requestor":"Antragsteller","requested by":"Angefragt Von","authorized by":"Genehmigt Von","authorized representative":"Bevollmächtigter Vertreter",
    "fax":"Fax","fax number":"Faxnummer","pick up":"Persönlich Abholen","mail":"Post","electronic":"Elektronisch","portal":"Portal",
    "expiration date":"Ablaufdatum","expiration":"Ablauf","valid until":"Gültig Bis",
    "right to revoke":"Recht auf Widerruf","revoke":"Widerrufen","revocation":"Widerruf",
    "facility name":"Name der Einrichtung","facility":"Einrichtung","clinic name":"Name der Klinik","hospital name":"Name des Krankenhauses","provider name":"Name des Anbieters",
  }
};

// Smart placeholder by field type and content
const PH_MAP = {
  Spanish: { phone:"Ej: (555) 123-4567", email:"nombre@correo.com", date:"DD/MM/AAAA", name:"Ingrese su nombre", id:"Ingrese número", default:"Por favor escriba aquí..." },
  French:  { phone:"Ex: (555) 123-4567", email:"nom@courriel.com", date:"JJ/MM/AAAA", name:"Entrez votre nom", id:"Entrez le numéro", default:"Veuillez écrire ici..." },
  German:  { phone:"z.B. (555) 123-4567", email:"name@email.de", date:"TT.MM.JJJJ", name:"Namen eingeben", id:"Nummer eingeben", default:"Bitte hier schreiben..." },
  English: { phone:"e.g. (555) 123-4567", email:"name@email.com", date:"MM/DD/YYYY", name:"Enter your name", id:"Enter number", default:"Please write here..." },
};

// FIX 1: translateLabel now also tries converting snake_case id → spaced words as a fallback
function translateLabel(englishLabel, lang, fieldId) {
  if (lang === "English" || !englishLabel) return englishLabel;
  const dict = LABEL_MAP[lang];
  if (!dict) return englishLabel;
  // Try exact label match
  const lower = englishLabel.toLowerCase().trim();
  if (dict[lower]) return dict[lower];
  // Try partial match on label
  for (const [key, val] of Object.entries(dict)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  // FIX 1b: Try converting the snake_case field id to words and look that up
  if (fieldId) {
    const idAsWords = fieldId.replace(/_/g, " ").toLowerCase().trim();
    if (dict[idAsWords]) return dict[idAsWords];
    for (const [key, val] of Object.entries(dict)) {
      if (idAsWords.includes(key) || key.includes(idAsWords)) return val;
    }
  }
  return englishLabel;
}

// Keywords that reliably identify each known t.fields entry from Vision-extracted labels/ids.
// ORDER MATTERS: more specific entries must come before broader ones.
const FIELD_SIGNALS = {
  // Frequency follow-ups — require both a frequency word AND a substance word to avoid false matches
  alcohol_freq:["alcohol_freq","how often drink","how often do you drink","drink how often","if so how often drink",
                "cuánto bebe","cuanto bebe","frecuencia bebe","fréquence boi","wie oft trink",
                "alcohol how often","how often alcohol"],
  smoke_freq:  ["smoke_freq","how often smok","how often do you smok","smoke how often","if so how often smok",
                "cuánto fuma","cuanto fuma","frecuencia fuma","fréquence fum","wie oft rauch",
                "cigarette how often","how often cigarette"],
  // Yes/no parent fields
  alcohol:     ["alcohol","drink alcohol","bebe alcohol","trinken sie alkohol"],
  smoking:     ["smok","cigarette","cigarro","fumar","fum","rauchen","tabac"],
  rx_drugs:    ["prescription","receta","ordonnance","verschreib","non-medical","nonmedical","razones no médicas"],
  illegal:     ["illegal","ilícit","ilicit","drogas ilegales","drogues illicites","illegale drog"],
  surgeries:   ["surger","operacion","operation","cirugía","cirugias","chirurgi"],
  family_hx:   ["family hist","historia familiar","antécédents familiaux","familienanamnese","family medical","antecedentes familiares"],
};

// Generic frequency-signal words that need preceding-field context to resolve correctly
const GENERIC_FREQ_SIGNALS = ["if so, how often","if so how often","how often","how frequently","si es así","si oui","falls ja"];

// Returns the matched t.fields key.
// allFields + idx are optional — passed in to resolve ambiguous "If so, how often" labels by
// looking at what the preceding yesno field was about.
function matchKnownField(field, allFields, idx) {
  const haystack = ((field.id || "") + " " + (field.label || "")).toLowerCase();

  // First try the specific-signal table (requires substance word in label/id)
  for (const [key, signals] of Object.entries(FIELD_SIGNALS)) {
    if (signals.some(s => haystack.includes(s))) return key;
  }

  // Generic frequency follow-up: "If so, how often" / "How often" with no substance context.
  // Resolve by walking backwards to find the nearest yesno field.
  if (GENERIC_FREQ_SIGNALS.some(s => haystack.includes(s)) && allFields && idx != null) {
    for (let i = idx - 1; i >= 0; i--) {
      const prev = allFields[i];
      const prevHay = ((prev.id || "") + " " + (prev.label || "")).toLowerCase();
      if (FIELD_SIGNALS.alcohol.some(s => prevHay.includes(s))) return "alcohol_freq";
      if (FIELD_SIGNALS.smoking.some(s => prevHay.includes(s))) return "smoke_freq";
    }
    // If we still can't tell, default to alcohol_freq (first encountered)
    return "alcohol_freq";
  }

  return null;
}

function getFieldLabel(field, lang, allFields, idx) {
  const t = T[lang] || T.English;
  // Exact id matches for the 4 core demographic/clinical fields
  if (field.id === "name") return t.name;
  if (field.id === "dob") return t.dob;
  if (field.id === "complaint") return t.complaint;
  if (field.id === "pain") return t.pain;
  // Exact id match against t.fields (handles default template ids perfectly)
  if (t.fields && t.fields[field.id]) return t.fields[field.id].label;
  // Fuzzy match: Vision-extracted ids/labels like "do_you_drink_alcohol" → alcohol
  const matched = matchKnownField(field, allFields, idx);
  if (matched && t.fields && t.fields[matched]) return t.fields[matched].label;
  // Fall through: translate via LABEL_MAP dictionary
  return translateLabel(field.label, lang, field.id);
}

function getFieldPh(field, lang, allFields, idx) {
  const t = T[lang] || T.English;
  const ph = PH_MAP[lang] || PH_MAP.English;
  if (field.id === "name") return t.namePh;
  if (field.id === "complaint") return t.complaintPh;
  // Exact id match for placeholder
  if (t.fields && t.fields[field.id] && t.fields[field.id].ph) return t.fields[field.id].ph;
  // Fuzzy match for placeholder
  const matched = matchKnownField(field, allFields, idx);
  if (matched && t.fields && t.fields[matched] && t.fields[matched].ph) return t.fields[matched].ph;
  // Smart placeholder based on field label content
  const lower = (field.label || "").toLowerCase();
  if (lower.includes("phone") || lower.includes("tel")) return ph.phone;
  if (lower.includes("email")) return ph.email;
  if (lower.includes("date")) return ph.date;
  if (lower.includes("name") || lower.includes("maiden") || lower.includes("spouse") || lower.includes("guardian")) return ph.name;
  if (/\bid\b/.test(lower) || /\bnumber\b/.test(lower) || lower.includes("#")) return ph.id;
  if (field.type === "textarea") return t.describe || ph.default;
  if (field.type === "text") return "";
  return "";
}

// Full-sentence translations for common form notes and consent statements.
// Keys are lowercase English phrases (or substrings); values are per-language translations.
const NOTE_TRANSLATIONS = {
  Spanish: {
    "i certify that the above information is true and accurate and authorize release of medical information and payment of benefits":
      "Certifico que la información anterior es verdadera y precisa y autorizo la divulgación de información médica y el pago de beneficios.",
    "i certify that the above information is true and accurate":
      "Certifico que la información anterior es verdadera y precisa.",
    "authorize release of medical information":
      "Autorizo la divulgación de información médica.",
    "if the patient is a minor":
      "Si el paciente es menor de edad (menor de 18 años), proporcione la información del padre o tutor legal.",
    "under the age of 18":
      "menor de 18 años",
    "please provide information for the parent or legal guardian":
      "por favor proporcione la información del padre o tutor legal.",
    "i authorize the release of any medical information":
      "Autorizo la divulgación de cualquier información médica.",
    "i understand that i am responsible for payment":
      "Entiendo que soy responsable del pago de los servicios no cubiertos por mi seguro.",
    "i assign all insurance benefits":
      "Asigno todos los beneficios del seguro a este proveedor.",
    "by signing below i acknowledge":
      "Al firmar a continuación, reconozco que he leído y entendido la información anterior.",
    "i have read and understand":
      "He leído y entiendo la información anterior.",
    "i consent to treatment":
      "Doy mi consentimiento para el tratamiento.",
    "financial responsibility":
      "Responsabilidad financiera: el paciente es responsable de los cargos no cubiertos.",
    "this information will be kept confidential":
      "Esta información se mantendrá confidencial.",
    "please list any":
      "Por favor liste cualquier",
    "for office use only":
      "Solo para uso de la oficina.",
    "copy fee may be charged for medical records":
      "Se puede cobrar una tarifa de copia por los registros médicos.",
    "copy fee may be charged":
      "Se puede cobrar una tarifa de copia.",
    "a fee may be charged":
      "Se puede cobrar una tarifa.",
    "health record may include std hiv behavioral mental health alcohol and drug abuse information":
      "El expediente médico puede incluir información sobre ETS, VIH, salud mental conductual, alcohol y abuso de drogas.",
    "health record may include":
      "El expediente médico puede incluir",
    "std hiv behavioral mental health alcohol and drug abuse":
      "ETS, VIH, salud mental conductual, alcohol y abuso de drogas",
    "facility name":
      "Nombre del Establecimiento",
  },
  French: {
    "i certify that the above information is true and accurate and authorize release of medical information and payment of benefits":
      "Je certifie que les informations ci-dessus sont vraies et exactes et j'autorise la divulgation des informations médicales et le paiement des prestations.",
    "i certify that the above information is true and accurate":
      "Je certifie que les informations ci-dessus sont vraies et exactes.",
    "authorize release of medical information":
      "J'autorise la divulgation des informations médicales.",
    "if the patient is a minor":
      "Si le patient est mineur (moins de 18 ans), veuillez fournir les informations du parent ou tuteur légal.",
    "under the age of 18":
      "moins de 18 ans",
    "please provide information for the parent or legal guardian":
      "veuillez fournir les informations du parent ou tuteur légal.",
    "i authorize the release of any medical information":
      "J'autorise la divulgation de toute information médicale.",
    "i understand that i am responsible for payment":
      "Je comprends que je suis responsable du paiement des services non couverts par mon assurance.",
    "i assign all insurance benefits":
      "J'attribue toutes les prestations d'assurance à ce prestataire.",
    "by signing below i acknowledge":
      "En signant ci-dessous, je reconnais avoir lu et compris les informations ci-dessus.",
    "i have read and understand":
      "J'ai lu et je comprends les informations ci-dessus.",
    "i consent to treatment":
      "Je consens au traitement.",
    "financial responsibility":
      "Responsabilité financière : le patient est responsable des frais non couverts.",
    "this information will be kept confidential":
      "Ces informations resteront confidentielles.",
    "for office use only":
      "Réservé à l'usage du bureau.",
    "copy fee may be charged for medical records":
      "Des frais de copie peuvent être facturés pour les dossiers médicaux.",
    "copy fee may be charged":
      "Des frais de copie peuvent être facturés.",
    "a fee may be charged":
      "Des frais peuvent être facturés.",
    "health record may include std hiv behavioral mental health alcohol and drug abuse information":
      "Le dossier médical peut inclure des informations sur les IST, le VIH, la santé mentale comportementale, l'alcool et l'abus de drogues.",
    "health record may include":
      "Le dossier médical peut inclure",
    "std hiv behavioral mental health alcohol and drug abuse":
      "IST, VIH, santé mentale comportementale, alcool et abus de drogues",
    "facility name":
      "Nom de l'Établissement",
  },
  German: {
    "i certify that the above information is true and accurate and authorize release of medical information and payment of benefits":
      "Ich bestätige, dass die obigen Angaben wahr und korrekt sind, und ermächtige die Weitergabe von medizinischen Informationen und die Zahlung von Leistungen.",
    "i certify that the above information is true and accurate":
      "Ich bestätige, dass die obigen Angaben wahr und korrekt sind.",
    "authorize release of medical information":
      "Ich ermächtige die Weitergabe von medizinischen Informationen.",
    "if the patient is a minor":
      "Wenn der Patient minderjährig ist (unter 18 Jahre), geben Sie bitte die Informationen des Elternteils oder gesetzlichen Vormunds an.",
    "under the age of 18":
      "unter 18 Jahre",
    "please provide information for the parent or legal guardian":
      "geben Sie bitte die Informationen des Elternteils oder gesetzlichen Vormunds an.",
    "i authorize the release of any medical information":
      "Ich ermächtige die Weitergabe jeglicher medizinischer Informationen.",
    "i understand that i am responsible for payment":
      "Ich verstehe, dass ich für die Zahlung der nicht von meiner Versicherung gedeckten Leistungen verantwortlich bin.",
    "i assign all insurance benefits":
      "Ich weise alle Versicherungsleistungen diesem Anbieter zu.",
    "by signing below i acknowledge":
      "Mit meiner Unterschrift bestätige ich, dass ich die obigen Informationen gelesen und verstanden habe.",
    "i have read and understand":
      "Ich habe die obigen Informationen gelesen und verstanden.",
    "i consent to treatment":
      "Ich stimme der Behandlung zu.",
    "financial responsibility":
      "Finanzielle Verantwortung: Der Patient ist für nicht gedeckte Kosten verantwortlich.",
    "this information will be kept confidential":
      "Diese Informationen werden vertraulich behandelt.",
    "for office use only":
      "Nur für den Bürogebrauch.",
    "copy fee may be charged for medical records":
      "Für Krankenakten können Kopiergebühren erhoben werden.",
    "copy fee may be charged":
      "Es können Kopiergebühren erhoben werden.",
    "a fee may be charged":
      "Es können Gebühren erhoben werden.",
    "health record may include std hiv behavioral mental health alcohol and drug abuse information":
      "Die Krankenakte kann Informationen über STI, HIV, psychische Verhaltensgesundheit, Alkohol- und Drogenmissbrauch enthalten.",
    "health record may include":
      "Die Krankenakte kann Folgendes enthalten",
    "std hiv behavioral mental health alcohol and drug abuse":
      "STI, HIV, psychische Verhaltensgesundheit, Alkohol- und Drogenmissbrauch",
    "facility name":
      "Name der Einrichtung",
  },
};

// Translations for common select/dropdown option values extracted from forms by Vision.
const OPTION_TRANSLATIONS = {
  Spanish: {
    // Delivery method
    "please mail records":"Por favor envíe los registros por correo",
    "please fax records":"Por favor envíe los registros por fax",
    "mail records":"Enviar registros por correo",
    "fax records":"Enviar registros por fax",
    "pick up":"Recoger en persona",
    "electronic / portal":"Electrónico / Portal",
    "electronic":"Electrónico",
    "portal":"Portal",
    "email":"Correo electrónico",
    "mail":"Correo",
    "fax":"Fax",
    // Purpose of disclosure
    "treatment":"Tratamiento",
    "payment":"Pago",
    "healthcare operations":"Operaciones de atención médica",
    "personal use":"Uso personal",
    "legal":"Legal",
    "insurance":"Seguro",
    "research":"Investigación",
    "other":"Otro",
    "disability":"Discapacidad",
    "workers compensation":"Compensación laboral",
    "legal proceedings":"Procedimientos legales",
    "continuity of care":"Continuidad de atención",
    "continuation of care":"Continuación de atención",
    "referral":"Referido",
    "referred by":"Referido por",
    // Marital status
    "married":"Casado/a",
    "single":"Soltero/a",
    "divorced":"Divorciado/a",
    "widowed":"Viudo/a",
    "separated":"Separado/a",
    "domestic partner":"Pareja doméstica",
    // Employment
    "full time":"Tiempo completo",
    "part time":"Medio tiempo",
    "temporary":"Temporal",
    "seasonal":"Estacional",
    // Gender
    "male":"Masculino",
    "female":"Femenino",
    "non-binary":"No binario",
    "prefer not to say":"Prefiero no decirlo",
    // Yes/No
    "yes":"Sí",
    "no":"No",
  },
  French: {
    // Delivery method
    "please mail records":"Veuillez envoyer les dossiers par courrier",
    "please fax records":"Veuillez envoyer les dossiers par télécopie",
    "mail records":"Envoyer les dossiers par courrier",
    "fax records":"Envoyer les dossiers par télécopie",
    "pick up":"Récupérer en personne",
    "electronic / portal":"Électronique / Portail",
    "electronic":"Électronique",
    "portal":"Portail",
    "email":"Courriel",
    "mail":"Courrier",
    "fax":"Télécopie",
    // Purpose of disclosure
    "treatment":"Traitement",
    "payment":"Paiement",
    "healthcare operations":"Opérations de soins de santé",
    "personal use":"Usage personnel",
    "legal":"Juridique",
    "insurance":"Assurance",
    "research":"Recherche",
    "other":"Autre",
    "disability":"Invalidité",
    "workers compensation":"Indemnisation des travailleurs",
    "legal proceedings":"Procédures judiciaires",
    "continuity of care":"Continuité des soins",
    "continuation of care":"Continuation des soins",
    "referral":"Référence",
    "referred by":"Référé par",
    // Marital status
    "married":"Marié(e)",
    "single":"Célibataire",
    "divorced":"Divorcé(e)",
    "widowed":"Veuf/Veuve",
    "separated":"Séparé(e)",
    "domestic partner":"Partenaire domestique",
    // Employment
    "full time":"Temps plein",
    "part time":"Temps partiel",
    "temporary":"Temporaire",
    "seasonal":"Saisonnier",
    // Gender
    "male":"Masculin",
    "female":"Féminin",
    "non-binary":"Non-binaire",
    "prefer not to say":"Préfère ne pas répondre",
    // Yes/No
    "yes":"Oui",
    "no":"Non",
  },
  German: {
    // Delivery method
    "please mail records":"Bitte senden Sie die Unterlagen per Post",
    "please fax records":"Bitte senden Sie die Unterlagen per Fax",
    "mail records":"Unterlagen per Post senden",
    "fax records":"Unterlagen per Fax senden",
    "pick up":"Persönlich abholen",
    "electronic / portal":"Elektronisch / Portal",
    "electronic":"Elektronisch",
    "portal":"Portal",
    "email":"E-Mail",
    "mail":"Post",
    "fax":"Fax",
    // Purpose of disclosure
    "treatment":"Behandlung",
    "payment":"Zahlung",
    "healthcare operations":"Gesundheitsversorgung",
    "personal use":"Persönliche Nutzung",
    "legal":"Rechtlich",
    "insurance":"Versicherung",
    "research":"Forschung",
    "other":"Sonstiges",
    "disability":"Behinderung",
    "workers compensation":"Arbeiterentschädigung",
    "legal proceedings":"Gerichtsverfahren",
    "continuity of care":"Kontinuität der Versorgung",
    "continuation of care":"Fortsetzung der Versorgung",
    "referral":"Überweisung",
    "referred by":"Überwiesen von",
    // Marital status
    "married":"Verheiratet",
    "single":"Ledig",
    "divorced":"Geschieden",
    "widowed":"Verwitwet",
    "separated":"Getrennt",
    "domestic partner":"Lebenspartner",
    // Employment
    "full time":"Vollzeit",
    "part time":"Teilzeit",
    "temporary":"Vorübergehend",
    "seasonal":"Saisonal",
    // Gender
    "male":"Männlich",
    "female":"Weiblich",
    "non-binary":"Nicht-binär",
    "prefer not to say":"Keine Angabe",
    // Yes/No
    "yes":"Ja",
    "no":"Nein",
  },
};

function translateOption(option, lang) {
  if (lang === "English" || !option) return option;
  const dict = OPTION_TRANSLATIONS[lang];
  if (!dict) return option;
  const lower = option.toLowerCase().trim();
  if (dict[lower]) return dict[lower];
  // Partial match for longer options
  for (const [key, val] of Object.entries(dict)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  // Fall back to translateLabel for anything not in the options dict
  return translateLabel(option, lang, "");
}

// Translate a full note sentence. Tries longest-match first so more specific
// phrases take priority over shorter substrings.
function translateNote(text, lang) {
  if (lang === "English" || !text) return text;
  const dict = NOTE_TRANSLATIONS[lang];
  if (!dict) return text;
  const lower = text.toLowerCase().trim();
  // Try exact match first
  if (dict[lower]) return dict[lower];
  // Try longest-matching substring (sort keys by length desc)
  const sorted = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    if (lower.includes(phrase)) return dict[phrase];
  }
  // Fall back to word-by-word label translation for shorter notes
  return translateLabel(text, lang, "");
}
// Only treat a field as a date if its id or label clearly signals it is one.
const DATE_SIGNALS = ["dob","date_of_birth","birth_date","visit_date","today_date","date"];
const DATE_LABEL_SIGNALS = ["date of birth","birth date","visit date","today's date","date"];
function sanitizeFieldType(field) {
  if (field.type !== "date") return field.type;
  const idLower = (field.id || "").toLowerCase();
  const labelLower = (field.label || "").toLowerCase();
  const isRealDate =
    DATE_SIGNALS.some(s => idLower === s || idLower.endsWith("_" + s) || idLower.startsWith(s + "_")) ||
    DATE_LABEL_SIGNALS.some(s => labelLower.includes(s));
  return isRealDate ? "date" : "text";
}

function PatientForm({ lang, onSubmit, templateName, fieldDefs }) {
  const t = T[lang] || T.English;

  // Assign stable unique ids ONCE on mount using useRef — never recomputed on re-render.
  // This is critical: errs/values are keyed by these ids, so they must never change.
  const fieldsRef = useRef(null);
  if (!fieldsRef.current) {
    const seen = {};
    fieldsRef.current = (fieldDefs || []).map((f) => {
      const base = (f.id || "field").replace(/__\d+$/, "");
      seen[base] = (seen[base] || 0) + 1;
      return { ...f, id: seen[base] === 1 ? base : base + "__" + seen[base] };
    });
  }
  const fields = fieldsRef.current;

  const [values, setValues] = useState({});
  const [errs, setErrs] = useState({});

  function change(id, val) { setValues(p=>({...p,[id]:val})); setErrs(p=>({...p,[id]:false})); }

  function handleSubmit() {
    const newErrs = {};
    fields.forEach(f => {
      const fieldType = sanitizeFieldType(f);
      const isRequired = fieldType !== "note" && f.required !== false;
      if (isRequired && !values[f.id]) newErrs[f.id] = true;
    });
    setErrs(newErrs);
    if (!Object.keys(newErrs).length) {
      // Strip dedup suffix before handing data to provider review
      const clean = {};
      fields.forEach(f => { clean[f.id.replace(/__\d+$/, "")] = values[f.id]; });
      onSubmit(clean);
    }
  }

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"32px 24px" }}>
      {templateName && <div style={{ background:"#f0fff4", border:`1px solid ${ACC}`, borderRadius:8, padding:"10px 16px", marginBottom:24, fontSize:14, color:"#065f46", fontWeight:600 }}>📋 {templateName}</div>}
      {fields.map((field, idx) => {
        const fieldType = sanitizeFieldType(field);
        // Notes render as a styled callout block, not a form input
        if (fieldType === "note") {
          return (
            <div key={field.id} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderLeft:"4px solid #3b82f6", borderRadius:8, padding:"12px 16px", marginBottom:20, fontSize:14, color:"#1e40af", fontStyle:"italic", lineHeight:1.5 }}>
              ℹ️ {translateNote(field.label, lang)}
            </div>
          );
        }
        // Use the index-suffixed field.id as both React key and values/errs key — guaranteed unique
        return (
        <FormField key={field.id} label={getFieldLabel(field, lang, fields, idx)} error={errs[field.id]} errorMsg={`${getFieldLabel(field, lang, fields, idx)} ${t.required || "is required"}`} required={field.required !== false && sanitizeFieldType(field) !== "note"}>
          {fieldType === "text" && <input type="text" value={values[field.id]||""} onChange={e=>change(field.id,e.target.value)} style={inputStyle(errs[field.id])} placeholder={getFieldPh(field,lang,fields,idx)} />}
          {fieldType === "date" && <DateInput value={values[field.id]||""} onChange={v=>change(field.id,v)} err={errs[field.id]} lang={lang} />}
          {fieldType === "textarea" && <textarea value={values[field.id]||""} onChange={e=>change(field.id,e.target.value)} rows={3} style={{...inputStyle(errs[field.id]),resize:"vertical",minHeight:80}} placeholder={getFieldPh(field,lang,fields,idx)} />}
          {fieldType === "select" && <select value={values[field.id]||""} onChange={e=>change(field.id,e.target.value)} style={inputStyle(errs[field.id])}><option value="">{t.selectPh || "— Select —"}</option>{(field.options||[]).map(o=><option key={o} value={o}>{translateOption(o, lang)}</option>)}</select>}
          {fieldType === "yesno" && <div style={{ display:"flex", gap:24, marginTop:4 }}>{[t.yes||"Yes",t.no||"No"].map(opt=><label key={opt} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:16 }}><input type="radio" name={field.id} value={opt} checked={values[field.id]===opt} onChange={()=>change(field.id,opt)} style={{ width:18, height:18, accentColor:NAV }} />{opt}</label>)}</div>}
        </FormField>
        );
      })}
      <button onClick={handleSubmit} style={{ width:"100%", background:NAV, color:"white", border:"none", borderRadius:10, padding:"16px 0", fontSize:17, fontWeight:700, cursor:"pointer", minHeight:56, marginTop:16 }}>{t.submit}</button>
    </div>
  );
}

// FIX 2: Helper to prettify a raw snake_case id into Title Case Words
// Used as the last fallback in ProviderReview so we never show raw ids like "insurance_id"
function prettifyId(id) {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function ProviderReview({ lang, formData, fieldDefs, onClear }) {
  const isNonEnglish = lang !== "English";
  const fields = fieldDefs || [];
  const labelMap = {};
  // Build labelMap from English field labels (f.label is always English from extraction)
  fields.forEach(f => { labelMap[f.id] = f.label; });
  const tEn = T.English;
  if (labelMap.name) labelMap.name = tEn.name;
  if (labelMap.dob) labelMap.dob = tEn.dob;
  if (labelMap.complaint) labelMap.complaint = tEn.complaint;
  if (labelMap.pain) labelMap.pain = tEn.pain;
  if (tEn.fields) Object.keys(tEn.fields).forEach(k => { if (labelMap[k]) labelMap[k] = tEn.fields[k].label; });

  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"32px 24px" }}>
      {isNonEnglish && <div style={{ background:"#f0fff4", border:"1px solid #2ECC71", borderLeft:"4px solid #2ECC71", borderRadius:8, padding:16, display:"flex", gap:12, marginBottom:16 }}>
        <span style={{ fontSize:20 }}>🌐</span>
        <div><p style={{ fontWeight:700, color:"#065f46", margin:0 }}>Translation Complete — {lang} → English</p><p style={{ color:"#047857", fontSize:14, margin:"4px 0 0" }}>Patient responses translated by Claude AI.</p></div>
      </div>}
      <div style={{ background:"#fffbeb", border:"1px solid #f59e0b", borderLeft:"4px solid #f59e0b", borderRadius:8, padding:16, display:"flex", gap:12, marginBottom:24 }}>
        <span style={{ fontSize:20 }}>⚠️</span>
        <div><p style={{ fontWeight:700, color:"#92400e", margin:0 }}>AI-Generated Content</p><p style={{ color:"#b45309", fontSize:14, margin:"4px 0 0" }}>Requires Clinical Review Before EHR Entry</p></div>
      </div>
      <div style={{ background:"white", borderRadius:12, border:"1px solid #e5e7eb", padding:24, marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:700, color:NAV, borderBottom:"1px solid #e5e7eb", paddingBottom:14, marginBottom:14 }}>Translated Intake Summary</h2>
        {Object.entries(formData).map(([key, val]) => {
          const translated = translateBack(key, val, lang, fields);
          const fieldDef = fields.find(f => f.id === key);
          const isYesNo = fieldDef && fieldDef.type === "yesno";
          const isFreeText = fieldDef && (fieldDef.type === "text" || fieldDef.type === "textarea");
          const isName = key === "name";
          const isDob = key === "dob" || key === "pain";
          const wasTranslated = isNonEnglish && (translated !== val || isYesNo);
          const needsReview = isNonEnglish && isFreeText && translated === val && !isName;
          // FIX 2: use prettifyId as last-resort fallback so raw snake_case ids never show
          const displayLabel = labelMap[key] || prettifyId(key);
          return (
            <div key={key} style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:16, borderBottom:"1px solid #f3f4f6", padding:"12px 0", alignItems:"start" }}>
              <span style={{ fontWeight:600, color:"#6b7280", textTransform:"uppercase", fontSize:13 }}>{displayLabel}</span>
              <div>
                <span style={{ color:NAV, fontWeight:600 }}>{translated}</span>
                {wasTranslated && !needsReview && <span style={{ marginLeft:8, background:"#dcfce7", color:"#166534", fontSize:11, fontWeight:700, padding:"2px 6px", borderRadius:4 }}>✓ TRANSLATED</span>}
                {needsReview && <span style={{ marginLeft:8, background:"#fef3c7", color:"#92400e", fontSize:11, fontWeight:700, padding:"2px 6px", borderRadius:4 }}>REVIEW</span>}
                {isNonEnglish && isName && <span style={{ marginLeft:8, background:"#f1f5f9", color:"#64748b", fontSize:11, fontWeight:600, padding:"2px 6px", borderRadius:4 }}>ORIGINAL</span>}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onClear} style={{ width:"100%", background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:10, padding:"16px 0", fontSize:16, fontWeight:700, cursor:"pointer", minHeight:48 }}>Clear &amp; New Patient</button>
    </div>
  );
}

const DEFAULT_FIELDS = [
  { id:"name", label:"Full Name", type:"text", required:true, category:"demographic" },
  { id:"dob", label:"Date of Birth", type:"date", required:true, category:"demographic" },
  { id:"complaint", label:"Chief Complaint", type:"text", required:true, category:"clinical" },
  { id:"pain", label:"Pain Level (1–10)", type:"select", required:true, category:"clinical", options:["1","2","3","4","5","6","7","8","9","10"] },
];

// New Patient Registration Form — Page 1: Patient Information + Insurance
const NEW_PATIENT_FIELDS_P1 = [
  { id:"name",             label:"Name (Last, First, Middle)", type:"text",     required:true,  category:"demographic", options:[] },
  { id:"maiden",           label:"Maiden Name",                type:"text",     required:false, category:"demographic", options:[] },
  { id:"address",          label:"Address",                    type:"text",     required:true,  category:"demographic", options:[] },
  { id:"city",             label:"City",                       type:"text",     required:true,  category:"demographic", options:[] },
  { id:"state",            label:"State",                      type:"text",     required:true,  category:"demographic", options:[] },
  { id:"zip",              label:"Zip",                        type:"text",     required:true,  category:"demographic", options:[] },
  { id:"dob",              label:"Date of Birth",              type:"date",     required:true,  category:"demographic", options:[] },
  { id:"ssn",              label:"SSN",                        type:"text",     required:false, category:"demographic", options:[] },
  { id:"phone",            label:"Phone Number",               type:"text",     required:true,  category:"demographic", options:[] },
  { id:"email",            label:"Email Address",              type:"text",     required:false, category:"demographic", options:[] },
  { id:"occupation",       label:"Occupation",                 type:"text",     required:false, category:"demographic", options:[] },
  { id:"employer",         label:"Employer",                   type:"text",     required:false, category:"demographic", options:[] },
  { id:"marital_status",   label:"Marital Status",             type:"select",   required:false, category:"demographic", options:["Married","Single","Divorced","Widowed"] },
  { id:"spouse_name",      label:"Spouse Name (Last, First, Middle)", type:"text", required:false, category:"demographic", options:[] },
  { id:"spouse_maiden",    label:"Spouse Maiden Name",         type:"text",     required:false, category:"demographic", options:[] },
  { id:"emergency_contact",label:"Emergency Contact",          type:"text",     required:true,  category:"demographic", options:[] },
  { id:"relationship",     label:"Relationship",               type:"text",     required:false, category:"demographic", options:[] },
  { id:"emergency_phone",  label:"Emergency Contact Phone",    type:"text",     required:true,  category:"demographic", options:[] },
  { id:"minor_note",       label:"If the Patient is a minor (under the age of 18), please provide information for the parent or legal guardian.", type:"note", required:false, category:"demographic", options:[] },
  { id:"guardian_name",    label:"Parent/Legal Guardian Name", type:"text",     required:false, category:"demographic", options:[] },
  { id:"guardian_phone",   label:"Parent/Legal Guardian Phone",type:"text",     required:false, category:"demographic", options:[] },
  { id:"insurance_company",label:"Insurance Company",          type:"text",     required:false, category:"demographic", options:[] },
  { id:"insurance_id",     label:"ID#",                        type:"text",     required:false, category:"demographic", options:[] },
  { id:"plan",             label:"Plan",                       type:"text",     required:false, category:"demographic", options:[] },
  { id:"group",            label:"Group",                      type:"text",     required:false, category:"demographic", options:[] },
  { id:"policy_holder",    label:"Policy Holder's Name",       type:"text",     required:false, category:"demographic", options:[] },
  { id:"policy_holder_dob",label:"Policy Holder's Date of Birth", type:"date",  required:false, category:"demographic", options:[] },
  { id:"policy_holder_emp",label:"Policy Holder's Employer",   type:"text",     required:false, category:"demographic", options:[] },
  { id:"relationship_to_patient", label:"Relationship to Patient", type:"text", required:false, category:"demographic", options:[] },
  { id:"primary_care_physician",  label:"Primary Care Physician",   type:"text", required:false, category:"demographic", options:[] },
  { id:"pcp_phone",        label:"PCP Phone",                  type:"text",     required:false, category:"demographic", options:[] },
  { id:"preferred_pharmacy",label:"Preferred Pharmacy",        type:"text",     required:false, category:"demographic", options:[] },
  { id:"pharmacy_phone",   label:"Pharmacy Phone",             type:"text",     required:false, category:"demographic", options:[] },
];

// New Patient Registration Form — Page 2: Medical History + Authorization
const NEW_PATIENT_FIELDS_P2 = [
  { id:"reason_for_visit", label:"Reason for Visit",           type:"text",     required:true,  category:"clinical", options:[] },
  { id:"medical_problems", label:"Current or Past Medical Problems and Approximate Dates", type:"textarea", required:false, category:"clinical", options:[] },
  { id:"current_medications", label:"Current Medications, Dosage, and Duration", type:"textarea", required:false, category:"clinical", options:[] },
  { id:"allergies",        label:"Allergies to Medications",   type:"textarea", required:false, category:"clinical", options:[] },
  { id:"surgeries",        label:"Major Surgeries and Approximate Dates", type:"textarea", required:false, category:"clinical", options:[] },
  { id:"family_hx",        label:"Family History of Major Current or Past Medical Problems", type:"textarea", required:false, category:"clinical", options:[] },
  { id:"alcohol",          label:"Do you drink alcohol?",      type:"yesno",    required:false, category:"clinical", options:[] },
  { id:"alcohol_freq",     label:"If so, how often",           type:"text",     required:false, category:"clinical", options:[] },
  { id:"smoking",          label:"Do you smoke cigarettes?",   type:"yesno",    required:false, category:"clinical", options:[] },
  { id:"smoke_freq",       label:"If so, how often",           type:"text",     required:false, category:"clinical", options:[] },
  { id:"rx_drugs",         label:"Do you take prescription drugs for non-medical reasons?", type:"yesno", required:false, category:"clinical", options:[] },
  { id:"illegal",          label:"Do you take illegal drugs?", type:"yesno",    required:false, category:"clinical", options:[] },
  { id:"auth_note",        label:"I certify that the above information is true and accurate and authorize release of medical information and payment of benefits", type:"note", required:false, category:"clinical", options:[] },
  { id:"patient_signature",label:"Patient Signature",          type:"text",     required:true,  category:"clinical", options:[] },
  { id:"signature_date",   label:"Date",                       type:"date",     required:true,  category:"clinical", options:[] },
  { id:"guardian_signature",label:"Parent or Legal Guardian Signature (If patient is a minor)", type:"text", required:false, category:"clinical", options:[] },
  { id:"guardian_sig_date",label:"Guardian Signature Date",    type:"date",     required:false, category:"clinical", options:[] },
];

const SAMPLE_TEMPLATES = [
  { id:"t1", name:"General Intake (Sample)", fields:4, isNew:false, fieldDefs:DEFAULT_FIELDS },
  { id:"t2", name:"New Patient Registration — Patient Info & Insurance", fields:NEW_PATIENT_FIELDS_P1.length, isNew:false, fieldDefs:NEW_PATIENT_FIELDS_P1 },
  { id:"t3", name:"New Patient Registration — Medical History & Authorization", fields:NEW_PATIENT_FIELDS_P2.length, isNew:false, fieldDefs:NEW_PATIENT_FIELDS_P2 },
];

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LIBRARY);
  const [lang, setLang] = useState("English");
  const [isTranslating, setIsTranslating] = useState(false);
  const [transLang, setTransLang] = useState("");
  const [formData, setFormData] = useState({});
  const [showPin, setShowPin] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);

  function handleLangSelect(selected) {
    if (selected === "English") { setLang("English"); setScreen(SCREENS.HIPAA); return; }
    setIsTranslating(true); setTransLang(selected);
    setTimeout(() => { setLang(selected); setIsTranslating(false); setScreen(SCREENS.HIPAA); }, 1800);
  }

  function go(s) { setScreen(s); window.scrollTo(0,0); }

  return (
    <div style={{ fontFamily:"Urbanist,sans-serif", minHeight:"100vh", background:"#f9fafb", color:NAV }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap');`}</style>
      {showTimeout && <div style={{ position:"fixed", top:0, left:0, width:"100%", background:"#ef4444", color:"white", textAlign:"center", padding:"10px 0", fontWeight:700, zIndex:200 }}>⚠️ {(T[lang]||T.English).timeout} <button onClick={()=>setShowTimeout(false)} style={{ marginLeft:16, background:"white", color:"#ef4444", border:"none", borderRadius:6, padding:"4px 12px", cursor:"pointer", fontWeight:700 }}>{(T[lang]||T.English).dismiss}</button></div>}
      {showPin && <PinModal onClose={()=>setShowPin(false)} onSuccess={()=>{ setShowPin(false); setFormData({}); setLang("English"); go(SCREENS.LIBRARY); }} />}
      <Header screen={screen} onExit={()=>setShowPin(true)} />
      <main>
        {screen===SCREENS.LIBRARY && <StaffLibrary templates={templates} onStartSession={t=>{ setActiveTemplate(t); setLang("English"); go(SCREENS.LANG); }} onNewTemplate={(name, extracted) => {
          const cleanName = name.replace(/[.][^.]+$/,"") + " — Extracted";
          const newId = "t_" + Date.now();
          let fieldDefs = (extracted && extracted.length > 0) ? extracted : DEFAULT_FIELDS;
          // Deduplicate ids — Vision sometimes assigns the same snake_case id to multiple fields.
          // Keep all fields but suffix duplicates with _2, _3, etc. so each has a unique key.
          const seenIds = {};
          fieldDefs = fieldDefs.map(f => {
            const base = f.id || "field";
            if (!seenIds[base]) { seenIds[base] = 1; return f; }
            seenIds[base]++;
            return { ...f, id: base + "_" + seenIds[base] };
          });
          const newT = { id:newId, name:cleanName, fields:fieldDefs.length, isNew:true, fieldDefs };
          setTemplates(prev => [...prev, newT]);
          setTimeout(() => setTemplates(prev => prev.map(t => t.id===newId ? {...t,isNew:false} : t)), 3500);
        }} />}
        {screen===SCREENS.LANG && <LanguageSelect onSelect={handleLangSelect} isTranslating={isTranslating} transLang={transLang} templateName={activeTemplate?.name} />}
        {screen===SCREENS.HIPAA && <HipaaNotice lang={lang} onAck={()=>go(SCREENS.FORM)} />}
        {screen===SCREENS.FORM && <PatientForm lang={lang} onSubmit={d=>{setFormData(d);go(SCREENS.REVIEW);}} templateName={activeTemplate?.name} fieldDefs={activeTemplate?.fieldDefs||DEFAULT_FIELDS} />}
        {screen===SCREENS.REVIEW && <ProviderReview lang={lang} formData={formData} fieldDefs={activeTemplate?.fieldDefs||DEFAULT_FIELDS} onClear={()=>{ setFormData({}); setLang("English"); go(SCREENS.LIBRARY); }} />}
      </main>
      <div style={{ position:"fixed", bottom:20, right:20, background:"white", border:`2px solid ${NAV}`, borderRadius:12, padding:16, zIndex:100, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", minWidth:200 }}>
        <p style={{ fontWeight:700, fontSize:12, textTransform:"uppercase", letterSpacing:1, marginBottom:10, color:NAV }}>Demo Controls</p>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {[["1. Staff Library",SCREENS.LIBRARY],["2. Language Select",SCREENS.LANG],["3. HIPAA Notice",SCREENS.HIPAA],["4. Patient Form",SCREENS.FORM],["5. Provider Review",SCREENS.REVIEW]].map(([label,s])=>(
            <button key={s} onClick={()=>go(s)} style={{ padding:"6px 12px", background:screen===s?NAV:"#f3f4f6", color:screen===s?"white":NAV, border:"none", borderRadius:6, cursor:"pointer", fontSize:13, fontWeight:600, textAlign:"left" }}>{label}</button>
          ))}
          <hr style={{ margin:"6px 0", border:"none", borderTop:"1px solid #e5e7eb" }} />
          <button onClick={()=>setShowTimeout(true)} style={{ padding:"6px 12px", background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:6, cursor:"pointer", fontSize:13, fontWeight:600 }}>⏱ Trigger Timeout</button>
        </div>
      </div>
    </div>
  );
}
