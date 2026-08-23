const { useState, useEffect, useMemo, useCallback } = React;

// ––––– Inline icons (no external icon library) –––––
function Icon({ children, size = 18, …props }) {
return (
<svg width={size} height={size} viewBox=“0 0 24 24” fill=“none” stroke=“currentColor”
strokeWidth={props.strokeWidth || 2} strokeLinecap=“round” strokeLinejoin=“round” {…props}>
{children}
</svg>
);
}
const Search = (p) => <Icon {…p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
const Plus = (p) => <Icon {…p}><path d="M12 5v14M5 12h14" /></Icon>;
const Star = (p) => <Icon {…p} fill={p.fill || “none”}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></Icon>;
const X = (p) => <Icon {…p}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
const Trash2 = (p) => <Icon {…p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" /><path d="M10 11v6M14 11v6" /></Icon>;
const ChevronDown = (p) => <Icon {…p}><path d="m6 9 6 6 6-6" /></Icon>;
const ChevronUp = (p) => <Icon {…p}><path d="m18 15-6-6-6 6" /></Icon>;

// ––––– Food database (per 100g) –––––
const FOOD_DB = [
{ id: “kuracie_prsia”, name: “Kuracie prsia”, cat: “Mäso”, kcal: 165, p: 31, c: 0, f: 3.6 },
{ id: “kuracie_stehno”, name: “Kuracie stehno”, cat: “Mäso”, kcal: 209, p: 26, c: 0, f: 10.9 },
{ id: “hovadzie_chuda”, name: “Hovädzie chudé”, cat: “Mäso”, kcal: 187, p: 26, c: 0, f: 8.7 },
{ id: “bravcove_karé”, name: “Bravčové karé”, cat: “Mäso”, kcal: 242, p: 23, c: 0, f: 16 },
{ id: “morcacie_prsia”, name: “Morčacie prsia”, cat: “Mäso”, kcal: 135, p: 30, c: 0, f: 1 },
{ id: “losos”, name: “Losos”, cat: “Ryby”, kcal: 208, p: 20, c: 0, f: 13 },
{ id: “tuniak_vlastna”, name: “Tuniak vo vlastnej šťave”, cat: “Ryby”, kcal: 116, p: 26, c: 0, f: 1 },
{ id: “treska”, name: “Treska”, cat: “Ryby”, kcal: 82, p: 18, c: 0, f: 0.7 },
{ id: “vajce”, name: “Vajce (celé)”, cat: “Vajcia a mliečne”, kcal: 155, p: 13, c: 1.1, f: 11 },
{ id: “bielko”, name: “Vaječný bielok”, cat: “Vajcia a mliečne”, kcal: 52, p: 11, c: 0.7, f: 0.2 },
{ id: “grécky_jogurt”, name: “Grécky jogurt biely”, cat: “Vajcia a mliečne”, kcal: 59, p: 10, c: 3.6, f: 0.4 },
{ id: “tvaroh”, name: “Tvaroh mäkký”, cat: “Vajcia a mliečne”, kcal: 98, p: 12, c: 3.4, f: 4.3 },
{ id: “cottage”, name: “Cottage cheese”, cat: “Vajcia a mliečne”, kcal: 98, p: 11, c: 3.4, f: 4.3 },
{ id: “mlieko_polotucne”, name: “Mlieko polotučné”, cat: “Vajcia a mliečne”, kcal: 47, p: 3.3, c: 4.8, f: 1.5 },
{ id: “syr_eidam”, name: “Syr eidam”, cat: “Vajcia a mliečne”, kcal: 357, p: 25, c: 0, f: 28 },
{ id: “ryza_varena”, name: “Ryža varená”, cat: “Prílohy”, kcal: 130, p: 2.7, c: 28, f: 0.3 },
{ id: “cestoviny_varene”, name: “Cestoviny varené”, cat: “Prílohy”, kcal: 131, p: 5, c: 25, f: 1.1 },
{ id: “zemiaky_varene”, name: “Zemiaky varené”, cat: “Prílohy”, kcal: 87, p: 1.9, c: 20, f: 0.1 },
{ id: “quinoa_varena”, name: “Quinoa varená”, cat: “Prílohy”, kcal: 120, p: 4.4, c: 21, f: 1.9 },
{ id: “ovsene_vlocky”, name: “Ovsené vločky”, cat: “Prílohy”, kcal: 379, p: 13, c: 67, f: 7 },
{ id: “chlieb_celozrnny”, name: “Chlieb celozrnný”, cat: “Prílohy”, kcal: 246, p: 9, c: 41, f: 4.2 },
{ id: “banán”, name: “Banán”, cat: “Ovocie”, kcal: 89, p: 1.1, c: 23, f: 0.3 },
{ id: “jablko”, name: “Jablko”, cat: “Ovocie”, kcal: 52, p: 0.3, c: 14, f: 0.2 },
{ id: “pomaranč”, name: “Pomaranč”, cat: “Ovocie”, kcal: 47, p: 0.9, c: 12, f: 0.1 },
{ id: “čučoriedky”, name: “Čučoriedky”, cat: “Ovocie”, kcal: 57, p: 0.7, c: 14, f: 0.3 },
{ id: “susene_datle”, name: “Sušené datle”, cat: “Sušené ovocie”, kcal: 282, p: 2.5, c: 75, f: 0.4 },
{ id: “susene_hrozienka”, name: “Hrozienka”, cat: “Sušené ovocie”, kcal: 299, p: 3.1, c: 79, f: 0.5 },
{ id: “susene_marhule”, name: “Sušené marhule”, cat: “Sušené ovocie”, kcal: 241, p: 3.4, c: 63, f: 0.5 },
{ id: “susene_slivky”, name: “Sušené slivky”, cat: “Sušené ovocie”, kcal: 240, p: 2.2, c: 64, f: 0.4 },
{ id: “susene_figy”, name: “Sušené figy”, cat: “Sušené ovocie”, kcal: 249, p: 3.3, c: 64, f: 0.9 },
{ id: “susene_brusnice”, name: “Sušené brusnice”, cat: “Sušené ovocie”, kcal: 308, p: 0.1, c: 82, f: 1.4 },
{ id: “susene_banan”, name: “Sušené banánové plátky”, cat: “Sušené ovocie”, kcal: 519, p: 2.3, c: 59, f: 33 },
{ id: “brokolica”, name: “Brokolica”, cat: “Zelenina”, kcal: 34, p: 2.8, c: 7, f: 0.4 },
{ id: “paradajka”, name: “Paradajka”, cat: “Zelenina”, kcal: 18, p: 0.9, c: 3.9, f: 0.2 },
{ id: “uhorka”, name: “Uhorka”, cat: “Zelenina”, kcal: 15, p: 0.7, c: 3.6, f: 0.1 },
{ id: “mrkva”, name: “Mrkva”, cat: “Zelenina”, kcal: 41, p: 0.9, c: 10, f: 0.2 },
{ id: “špenát”, name: “Špenát”, cat: “Zelenina”, kcal: 23, p: 2.9, c: 3.6, f: 0.4 },
{ id: “avokádo”, name: “Avokádo”, cat: “Zelenina”, kcal: 160, p: 2, c: 8.5, f: 15 },
{ id: “mandle”, name: “Mandle”, cat: “Orechy a semená”, kcal: 579, p: 21, c: 22, f: 50 },
{ id: “vlašské_orechy”, name: “Vlašské orechy”, cat: “Orechy a semená”, kcal: 654, p: 15, c: 14, f: 65 },
{ id: “arašidové_maslo”, name: “Arašidové maslo”, cat: “Orechy a semená”, kcal: 588, p: 25, c: 20, f: 50 },
{ id: “olivovy_olej”, name: “Olivový olej”, cat: “Tuky”, kcal: 884, p: 0, c: 0, f: 100 },
{ id: “maslo”, name: “Maslo”, cat: “Tuky”, kcal: 717, p: 0.9, c: 0.1, f: 81 },
{ id: “šošovica_varena”, name: “Šošovica varená”, cat: “Strukoviny”, kcal: 116, p: 9, c: 20, f: 0.4 },
{ id: “cícer_vareny”, name: “Cícer varený”, cat: “Strukoviny”, kcal: 164, p: 9, c: 27, f: 2.6 },
{ id: “fazuľa_varena”, name: “Fazuľa varená”, cat: “Strukoviny”, kcal: 127, p: 9, c: 23, f: 0.5 },
{ id: “tofu”, name: “Tofu”, cat: “Strukoviny”, kcal: 76, p: 8, c: 1.9, f: 4.8 },
{ id: “whey_protein”, name: “Whey proteín (prášok)”, cat: “Doplnky”, kcal: 380, p: 75, c: 8, f: 6 },
];

const CATS = […new Set(FOOD_DB.map(f => f.cat))];

const STORAGE_KEY = “kt_v1”;

function todayStr() {
const d = new Date();
return d.toISOString().slice(0, 10);
}

function loadState() {
return {
log: {},        // { “2026-08-23”: [ {uid, foodId, grams} ] }
favorites: [],  // [foodId]
custom: [],     // [ {id, name, cat, kcal, p, c, f} ]
goals: { kcal: 2000, p: 150, c: 200, f: 65 },
};
}

function App() {
const [data, setData] = useState(null);
const [loaded, setLoaded] = useState(false);
const [date, setDate] = useState(todayStr());
const [tab, setTab] = useState(“favorites”); // favorites | database | custom
const [query, setQuery] = useState(””);
const [openCat, setOpenCat] = useState(null);
const [pickerFood, setPickerFood] = useState(null); // food object being added
const [grams, setGrams] = useState(“100”);
const [showAddCustom, setShowAddCustom] = useState(false);
const [showGoals, setShowGoals] = useState(false);
const [toast, setToast] = useState(null);

// Load from storage (localStorage — persists in this browser only)
useEffect(() => {
try {
const raw = localStorage.getItem(STORAGE_KEY);
setData(raw ? JSON.parse(raw) : loadState());
} catch (e) {
setData(loadState());
} finally {
setLoaded(true);
}
}, []);

// Persist on change
useEffect(() => {
if (!loaded || !data) return;
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
} catch (e) {
console.error(“Uloženie zlyhalo”, e);
}
}, [data, loaded]);

const allFoods = useMemo(() => {
if (!data) return [];
return […FOOD_DB, …data.custom];
}, [data]);

const foodById = useCallback(
(id) => allFoods.find((f) => f.id === id),
[allFoods]
);

const dayEntries = data?.log[date] || [];

const totals = useMemo(() => {
let kcal = 0, p = 0, c = 0, f = 0;
for (const e of dayEntries) {
const food = foodById(e.foodId);
if (!food) continue;
const mult = e.grams / 100;
kcal += food.kcal * mult;
p += food.p * mult;
c += food.c * mult;
f += food.f * mult;
}
return { kcal, p, c, f };
}, [dayEntries, foodById]);

const goals = data?.goals || { kcal: 2000, p: 150, c: 200, f: 65 };

function showToast(msg) {
setToast(msg);
setTimeout(() => setToast(null), 1800);
}

function addEntry(food, g) {
const gramsNum = parseFloat(g);
if (!gramsNum || gramsNum <= 0) return;
setData((d) => {
const next = { …d, log: { …d.log } };
const list = next.log[date] ? […next.log[date]] : [];
list.push({ uid: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, foodId: food.id, grams: gramsNum });
next.log[date] = list;
return next;
});
showToast(`Pridané: ${food.name}`);
setPickerFood(null);
setGrams(“100”);
}

function removeEntry(uid) {
setData((d) => {
const next = { …d, log: { …d.log } };
next.log[date] = (next.log[date] || []).filter((e) => e.uid !== uid);
return next;
});
}

function toggleFavorite(foodId) {
setData((d) => {
const isFav = d.favorites.includes(foodId);
return {
…d,
favorites: isFav ? d.favorites.filter((id) => id !== foodId) : […d.favorites, foodId],
};
});
}

function addCustomFood(food) {
setData((d) => ({ …d, custom: […d.custom, food] }));
showToast(`Vlastná potravina pridaná: ${food.name}`);
setShowAddCustom(false);
}

function deleteCustomFood(id) {
setData((d) => ({
…d,
custom: d.custom.filter((f) => f.id !== id),
favorites: d.favorites.filter((fid) => fid !== id),
}));
}

function updateGoals(newGoals) {
setData((d) => ({ …d, goals: newGoals }));
setShowGoals(false);
}

if (!loaded || !data) {
return (
<div style={styles.loadingScreen}>
<div style={styles.loadingRing} />
<div style={{ color: “#8a8574”, fontSize: 14, marginTop: 12 }}>Načítavam…</div>
</div>
);
}

const favFoods = data.favorites.map((id) => foodById(id)).filter(Boolean);

return (
<div style={styles.app}>
<style>{globalCss}</style>

```
  {/* Header / totals */}
  <div style={styles.header}>
    <div style={styles.dateRow}>
      <button
        style={styles.dateBtn}
        onClick={() => setDate(shiftDate(date, -1))}
        aria-label="Predošlý deň"
      >
        ‹
      </button>
      <div style={styles.dateLabel}>{formatDateSk(date)}</div>
      <button
        style={styles.dateBtn}
        onClick={() => setDate(shiftDate(date, 1))}
        aria-label="Nasledujúci deň"
      >
        ›
      </button>
    </div>

    <div style={styles.ringRow}>
      <MacroRing kcal={totals.kcal} goal={goals.kcal} />
      <div style={styles.macroBars}>
        <MacroBar label="Bielkoviny" value={totals.p} goal={goals.p} color="#5B8C5A" unit="g" />
        <MacroBar label="Sacharidy" value={totals.c} goal={goals.c} color="#C77B4A" unit="g" />
        <MacroBar label="Tuky" value={totals.f} goal={goals.f} color="#B08968" unit="g" />
      </div>
    </div>

    <button style={styles.goalsLink} onClick={() => setShowGoals(true)}>
      Upraviť denné ciele
    </button>
  </div>

  {/* Today's log */}
  <div style={styles.logSection}>
    {dayEntries.length === 0 ? (
      <div style={styles.emptyLog}>Zatiaľ nič nezjedené. Pridaj potravinu nižšie.</div>
    ) : (
      <div style={styles.logList}>
        {dayEntries.map((e) => {
          const food = foodById(e.foodId);
          if (!food) return null;
          const mult = e.grams / 100;
          return (
            <div key={e.uid} style={styles.logItem}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.logItemName}>{food.name}</div>
                <div style={styles.logItemMeta}>
                  {e.grams} g · {Math.round(food.kcal * mult)} kcal
                </div>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => removeEntry(e.uid)}
                aria-label="Odstrániť"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* Tabs */}
  <div style={styles.tabBar}>
    <TabBtn active={tab === "favorites"} onClick={() => setTab("favorites")}>
      Obľúbené
    </TabBtn>
    <TabBtn active={tab === "database"} onClick={() => setTab("database")}>
      Databáza
    </TabBtn>
    <TabBtn active={tab === "custom"} onClick={() => setTab("custom")}>
      Vlastné
    </TabBtn>
  </div>

  {/* Search (database + custom) */}
  {tab !== "favorites" && (
    <div style={styles.searchWrap}>
      <Search size={16} color="#9a9584" style={{ position: "absolute", left: 12, top: 12 }} />
      <input
        style={styles.searchInput}
        placeholder="Hľadať potravinu..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )}

  {/* Content */}
  <div style={styles.contentArea}>
    {tab === "favorites" && (
      favFoods.length === 0 ? (
        <div style={styles.emptyLog}>
          Zatiaľ žiadne obľúbené. Otvor „Databáza" a klikni na hviezdičku pri potravine.
        </div>
      ) : (
        <FoodList
          foods={favFoods}
          favorites={data.favorites}
          onToggleFav={toggleFavorite}
          onPick={(f) => { setPickerFood(f); setGrams("100"); }}
        />
      )
    )}

    {tab === "database" && (
      query ? (
        <FoodList
          foods={FOOD_DB.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))}
          favorites={data.favorites}
          onToggleFav={toggleFavorite}
          onPick={(f) => { setPickerFood(f); setGrams("100"); }}
        />
      ) : (
        CATS.map((cat) => (
          <div key={cat} style={styles.catBlock}>
            <button
              style={styles.catHeader}
              onClick={() => setOpenCat(openCat === cat ? null : cat)}
            >
              <span>{cat}</span>
              {openCat === cat ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openCat === cat && (
              <FoodList
                foods={FOOD_DB.filter((f) => f.cat === cat)}
                favorites={data.favorites}
                onToggleFav={toggleFavorite}
                onPick={(f) => { setPickerFood(f); setGrams("100"); }}
              />
            )}
          </div>
        ))
      )
    )}

    {tab === "custom" && (
      <>
        <button style={styles.addCustomBtn} onClick={() => setShowAddCustom(true)}>
          <Plus size={16} /> Pridať vlastnú potravinu
        </button>
        {data.custom.length === 0 ? (
          <div style={styles.emptyLog}>Žiadne vlastné potraviny. Pridaj svoju prvú vyššie.</div>
        ) : (
          <FoodList
            foods={data.custom.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))}
            favorites={data.favorites}
            onToggleFav={toggleFavorite}
            onPick={(f) => { setPickerFood(f); setGrams("100"); }}
            onDelete={deleteCustomFood}
            deletable
          />
        )}
      </>
    )}
  </div>

  {/* Portion picker modal */}
  {pickerFood && (
    <div style={styles.modalOverlay} onClick={() => setPickerFood(null)}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>{pickerFood.name}</div>
          <button style={styles.modalClose} onClick={() => setPickerFood(null)}>
            <X size={18} />
          </button>
        </div>
        <label style={styles.gramLabel}>Množstvo (g)</label>
        <input
          type="number"
          inputMode="decimal"
          style={styles.gramInput}
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          autoFocus
        />
        <div style={styles.previewRow}>
          <PreviewStat label="kcal" value={round1((pickerFood.kcal * (parseFloat(grams) || 0)) / 100)} />
          <PreviewStat label="B" value={round1((pickerFood.p * (parseFloat(grams) || 0)) / 100)} />
          <PreviewStat label="S" value={round1((pickerFood.c * (parseFloat(grams) || 0)) / 100)} />
          <PreviewStat label="T" value={round1((pickerFood.f * (parseFloat(grams) || 0)) / 100)} />
        </div>
        <button style={styles.confirmBtn} onClick={() => addEntry(pickerFood, grams)}>
          Pridať do denníka
        </button>
      </div>
    </div>
  )}

  {/* Add custom food modal */}
  {showAddCustom && (
    <AddCustomModal
      onClose={() => setShowAddCustom(false)}
      onSave={addCustomFood}
    />
  )}

  {/* Goals modal */}
  {showGoals && (
    <GoalsModal goals={goals} onClose={() => setShowGoals(false)} onSave={updateGoals} />
  )}

  {toast && <div style={styles.toast}>{toast}</div>}
</div>
```

);
}

// ––––– Subcomponents –––––

function FoodList({ foods, favorites, onToggleFav, onPick, onDelete, deletable }) {
if (foods.length === 0) {
return <div style={styles.emptyLog}>Žiadne výsledky.</div>;
}
return (
<div style={styles.foodList}>
{foods.map((f) => (
<div key={f.id} style={styles.foodRow}>
<button style={styles.foodRowMain} onClick={() => onPick(f)}>
<div style={styles.foodName}>{f.name}</div>
<div style={styles.foodMacros}>
{f.kcal} kcal · B {f.p} / S {f.c} / T {f.f} <span style={{ opacity: 0.6 }}>(100 g)</span>
</div>
</button>
<button
style={{
…styles.starBtn,
color: favorites.includes(f.id) ? “#C77B4A” : “#c9c4b4”,
}}
onClick={() => onToggleFav(f.id)}
aria-label=“Obľúbené”
>
<Star size={18} fill={favorites.includes(f.id) ? “#C77B4A” : “none”} strokeWidth={1.8} />
</button>
{deletable && (
<button style={styles.deleteBtn} onClick={() => onDelete(f.id)} aria-label=“Vymazať”>
<Trash2 size={16} />
</button>
)}
</div>
))}
</div>
);
}

function AddCustomModal({ onClose, onSave }) {
const [name, setName] = useState(””);
const [kcal, setKcal] = useState(””);
const [p, setP] = useState(””);
const [c, setC] = useState(””);
const [f, setF] = useState(””);

const valid = name.trim() && kcal !== “”;

function handleSave() {
if (!valid) return;
onSave({
id: `custom_${Date.now()}`,
name: name.trim(),
cat: “Vlastné”,
kcal: parseFloat(kcal) || 0,
p: parseFloat(p) || 0,
c: parseFloat(c) || 0,
f: parseFloat(f) || 0,
});
}

return (
<div style={styles.modalOverlay} onClick={onClose}>
<div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
<div style={styles.modalHeader}>
<div style={styles.modalTitle}>Nová potravina</div>
<button style={styles.modalClose} onClick={onClose}>
<X size={18} />
</button>
</div>
<div style={styles.formGrid}>
<FormField label="Názov" value={name} onChange={setName} placeholder="napr. Domáce müsli" />
<FormField label="Kalórie (na 100 g)" value={kcal} onChange={setKcal} type="number" placeholder="0" />
<div style={styles.formRow3}>
<FormField label="Bielkoviny (g)" value={p} onChange={setP} type="number" placeholder="0" compact />
<FormField label="Sacharidy (g)" value={c} onChange={setC} type="number" placeholder="0" compact />
<FormField label="Tuky (g)" value={f} onChange={setF} type="number" placeholder="0" compact />
</div>
</div>
<button
style={{ …styles.confirmBtn, opacity: valid ? 1 : 0.5 }}
onClick={handleSave}
disabled={!valid}
>
Uložiť potravinu
</button>
</div>
</div>
);
}

function GoalsModal({ goals, onClose, onSave }) {
const [kcal, setKcal] = useState(String(goals.kcal));
const [p, setP] = useState(String(goals.p));
const [c, setC] = useState(String(goals.c));
const [f, setF] = useState(String(goals.f));

return (
<div style={styles.modalOverlay} onClick={onClose}>
<div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
<div style={styles.modalHeader}>
<div style={styles.modalTitle}>Denné ciele</div>
<button style={styles.modalClose} onClick={onClose}>
<X size={18} />
</button>
</div>
<div style={styles.formGrid}>
<FormField label="Kalórie (kcal)" value={kcal} onChange={setKcal} type="number" />
<div style={styles.formRow3}>
<FormField label="Bielkoviny (g)" value={p} onChange={setP} type="number" compact />
<FormField label="Sacharidy (g)" value={c} onChange={setC} type="number" compact />
<FormField label="Tuky (g)" value={f} onChange={setF} type="number" compact />
</div>
</div>
<button
style={styles.confirmBtn}
onClick={() =>
onSave({
kcal: parseFloat(kcal) || 0,
p: parseFloat(p) || 0,
c: parseFloat(c) || 0,
f: parseFloat(f) || 0,
})
}
>
Uložiť ciele
</button>
</div>
</div>
);
}

function FormField({ label, value, onChange, type = “text”, placeholder, compact }) {
return (
<div style={compact ? styles.formFieldCompact : styles.formField}>
<label style={styles.formLabel}>{label}</label>
<input
style={styles.formInput}
type={type}
inputMode={type === “number” ? “decimal” : “text”}
value={value}
placeholder={placeholder}
onChange={(e) => onChange(e.target.value)}
/>
</div>
);
}

function TabBtn({ active, children, onClick }) {
return (
<button style={{ …styles.tabBtn, …(active ? styles.tabBtnActive : {}) }} onClick={onClick}>
{children}
</button>
);
}

function PreviewStat({ label, value }) {
return (
<div style={styles.previewStat}>
<div style={styles.previewStatVal}>{value}</div>
<div style={styles.previewStatLabel}>{label}</div>
</div>
);
}

function MacroBar({ label, value, goal, color, unit }) {
const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
return (
<div style={styles.barBlock}>
<div style={styles.barLabelRow}>
<span style={styles.barLabel}>{label}</span>
<span style={styles.barValue}>
{round1(value)} / {goal} {unit}
</span>
</div>
<div style={styles.barTrack}>
<div style={{ …styles.barFill, width: `${pct}%`, background: color }} />
</div>
</div>
);
}

function MacroRing({ kcal, goal }) {
const pct = goal > 0 ? Math.min(1, kcal / goal) : 0;
const r = 42;
const circ = 2 * Math.PI * r;
const dash = circ * pct;
return (
<div style={styles.ringWrap}>
<svg width="104" height="104" viewBox="0 0 104 104">
<circle cx="52" cy="52" r={r} fill="none" stroke="#EAE4D6" strokeWidth="9" />
<circle
cx=“52”
cy=“52”
r={r}
fill=“none”
stroke=”#5B8C5A”
strokeWidth=“9”
strokeLinecap=“round”
strokeDasharray={`${dash} ${circ}`}
transform=“rotate(-90 52 52)”
style={{ transition: “stroke-dasharray 0.4s ease” }}
/>
</svg>
<div style={styles.ringCenter}>
<div style={styles.ringKcal}>{Math.round(kcal)}</div>
<div style={styles.ringGoal}>/ {goal} kcal</div>
</div>
</div>
);
}

// ––––– Helpers –––––

function round1(n) {
return Math.round(n * 10) / 10;
}

function shiftDate(dateStr, delta) {
const d = new Date(dateStr + “T00:00:00”);
d.setDate(d.getDate() + delta);
return d.toISOString().slice(0, 10);
}

const SK_DAYS = [“Nedeľa”, “Pondelok”, “Utorok”, “Streda”, “Štvrtok”, “Piatok”, “Sobota”];
const SK_MONTHS = [
“januára”, “februára”, “marca”, “apríla”, “mája”, “júna”,
“júla”, “augusta”, “septembra”, “októbra”, “novembra”, “decembra”,
];

function formatDateSk(dateStr) {
const d = new Date(dateStr + “T00:00:00”);
const today = todayStr();
if (dateStr === today) return “Dnes”;
const yest = shiftDate(today, -1);
if (dateStr === yest) return “Včera”;
const tom = shiftDate(today, 1);
if (dateStr === tom) return “Zajtra”;
return `${SK_DAYS[d.getDay()]}, ${d.getDate()}. ${SK_MONTHS[d.getMonth()]}`;
}

// ––––– Styles –––––

const globalCss = `

- { box-sizing: border-box; }
  body { margin: 0; }
  input:focus { outline: 2px solid #5B8C5A; outline-offset: 1px; }
  button:focus-visible { outline: 2px solid #5B8C5A; outline-offset: 2px; }
  button { font-family: inherit; cursor: pointer; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
  - { transition: none !important; animation: none !important; }
    }
    `;

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;

const styles = {
app: {
fontFamily: FONT,
background: “#FAF7F2”,
minHeight: “100vh”,
color: “#2B3328”,
maxWidth: 480,
margin: “0 auto”,
paddingBottom: 40,
},
loadingScreen: {
display: “flex”,
flexDirection: “column”,
alignItems: “center”,
justifyContent: “center”,
height: “100vh”,
background: “#FAF7F2”,
fontFamily: FONT,
},
loadingRing: {
width: 32,
height: 32,
border: “3px solid #EAE4D6”,
borderTopColor: “#5B8C5A”,
borderRadius: “50%”,
animation: “spin 0.8s linear infinite”,
},
header: {
padding: “20px 20px 16px”,
borderBottom: “1px solid #EAE4D6”,
background: “#FFFDF9”,
},
dateRow: {
display: “flex”,
alignItems: “center”,
justifyContent: “center”,
gap: 18,
marginBottom: 16,
},
dateBtn: {
background: “none”,
border: “none”,
fontSize: 22,
color: “#9a9584”,
padding: “2px 10px”,
lineHeight: 1,
},
dateLabel: {
fontSize: 15,
fontWeight: 600,
letterSpacing: “0.01em”,
minWidth: 140,
textAlign: “center”,
},
ringRow: {
display: “flex”,
alignItems: “center”,
gap: 20,
},
ringWrap: {
position: “relative”,
width: 104,
height: 104,
flexShrink: 0,
},
ringCenter: {
position: “absolute”,
inset: 0,
display: “flex”,
flexDirection: “column”,
alignItems: “center”,
justifyContent: “center”,
},
ringKcal: {
fontSize: 20,
fontWeight: 700,
fontVariantNumeric: “tabular-nums”,
},
ringGoal: {
fontSize: 11,
color: “#9a9584”,
marginTop: 1,
},
macroBars: {
flex: 1,
display: “flex”,
flexDirection: “column”,
gap: 10,
},
barBlock: {},
barLabelRow: {
display: “flex”,
justifyContent: “space-between”,
fontSize: 11.5,
marginBottom: 4,
color: “#5b5748”,
},
barLabel: { fontWeight: 600 },
barValue: { fontVariantNumeric: “tabular-nums”, color: “#8a8574” },
barTrack: {
height: 6,
borderRadius: 3,
background: “#EAE4D6”,
overflow: “hidden”,
},
barFill: {
height: “100%”,
borderRadius: 3,
transition: “width 0.4s ease”,
},
goalsLink: {
display: “block”,
margin: “14px auto 0”,
background: “none”,
border: “none”,
color: “#8a8574”,
fontSize: 12.5,
textDecoration: “underline”,
textUnderlineOffset: 3,
},
logSection: {
padding: “14px 20px 4px”,
},
emptyLog: {
color: “#9a9584”,
fontSize: 13.5,
textAlign: “center”,
padding: “20px 10px”,
lineHeight: 1.5,
},
logList: {
display: “flex”,
flexDirection: “column”,
gap: 8,
},
logItem: {
display: “flex”,
alignItems: “center”,
gap: 10,
background: “#FFFDF9”,
border: “1px solid #EAE4D6”,
borderRadius: 12,
padding: “10px 12px”,
},
logItemName: {
fontSize: 14,
fontWeight: 600,
whiteSpace: “nowrap”,
overflow: “hidden”,
textOverflow: “ellipsis”,
},
logItemMeta: {
fontSize: 12,
color: “#9a9584”,
marginTop: 2,
},
deleteBtn: {
background: “none”,
border: “none”,
color: “#c9a08a”,
padding: 6,
display: “flex”,
alignItems: “center”,
},
tabBar: {
display: “flex”,
gap: 6,
padding: “16px 20px 0”,
},
tabBtn: {
flex: 1,
padding: “9px 4px”,
borderRadius: 10,
border: “1px solid #EAE4D6”,
background: “#FFFDF9”,
color: “#8a8574”,
fontSize: 13,
fontWeight: 600,
},
tabBtnActive: {
background: “#5B8C5A”,
borderColor: “#5B8C5A”,
color: “#FFFDF9”,
},
searchWrap: {
position: “relative”,
padding: “12px 20px 0”,
},
searchInput: {
width: “100%”,
padding: “10px 12px 10px 34px”,
borderRadius: 10,
border: “1px solid #EAE4D6”,
background: “#FFFDF9”,
fontSize: 14,
fontFamily: FONT,
color: “#2B3328”,
},
contentArea: {
padding: “14px 20px 0”,
},
catBlock: {
marginBottom: 8,
},
catHeader: {
width: “100%”,
display: “flex”,
justifyContent: “space-between”,
alignItems: “center”,
background: “none”,
border: “none”,
borderBottom: “1px solid #EAE4D6”,
padding: “10px 2px”,
fontSize: 13.5,
fontWeight: 700,
color: “#4a4638”,
letterSpacing: “0.02em”,
textTransform: “uppercase”,
},
foodList: {
display: “flex”,
flexDirection: “column”,
gap: 8,
paddingTop: 8,
},
foodRow: {
display: “flex”,
alignItems: “center”,
gap: 4,
background: “#FFFDF9”,
border: “1px solid #EAE4D6”,
borderRadius: 12,
},
foodRowMain: {
flex: 1,
textAlign: “left”,
background: “none”,
border: “none”,
padding: “11px 12px”,
minWidth: 0,
},
foodName: {
fontSize: 14,
fontWeight: 600,
whiteSpace: “nowrap”,
overflow: “hidden”,
textOverflow: “ellipsis”,
},
foodMacros: {
fontSize: 11.5,
color: “#9a9584”,
marginTop: 2,
fontVariantNumeric: “tabular-nums”,
},
starBtn: {
background: “none”,
border: “none”,
padding: 8,
display: “flex”,
alignItems: “center”,
},
addCustomBtn: {
display: “flex”,
alignItems: “center”,
justifyContent: “center”,
gap: 6,
width: “100%”,
padding: “12px”,
borderRadius: 12,
border: “1.5px dashed #c9c4b4”,
background: “none”,
color: “#5B8C5A”,
fontSize: 13.5,
fontWeight: 600,
marginBottom: 12,
},
modalOverlay: {
position: “fixed”,
inset: 0,
background: “rgba(43,51,40,0.4)”,
display: “flex”,
alignItems: “flex-end”,
justifyContent: “center”,
zIndex: 50,
},
modalCard: {
background: “#FAF7F2”,
borderRadius: “20px 20px 0 0”,
padding: “20px 20px 28px”,
width: “100%”,
maxWidth: 480,
boxShadow: “0 -4px 24px rgba(0,0,0,0.12)”,
},
modalHeader: {
display: “flex”,
justifyContent: “space-between”,
alignItems: “center”,
marginBottom: 16,
},
modalTitle: {
fontSize: 17,
fontWeight: 700,
},
modalClose: {
background: “#EAE4D6”,
border: “none”,
borderRadius: “50%”,
width: 30,
height: 30,
display: “flex”,
alignItems: “center”,
justifyContent: “center”,
color: “#5b5748”,
},
gramLabel: {
fontSize: 12.5,
fontWeight: 600,
color: “#8a8574”,
display: “block”,
marginBottom: 6,
},
gramInput: {
width: “100%”,
padding: “12px 14px”,
fontSize: 22,
fontWeight: 700,
borderRadius: 12,
border: “1.5px solid #EAE4D6”,
background: “#FFFDF9”,
fontFamily: FONT,
color: “#2B3328”,
marginBottom: 16,
fontVariantNumeric: “tabular-nums”,
},
previewRow: {
display: “flex”,
justifyContent: “space-between”,
background: “#FFFDF9”,
border: “1px solid #EAE4D6”,
borderRadius: 12,
padding: “12px 8px”,
marginBottom: 18,
},
previewStat: {
textAlign: “center”,
flex: 1,
},
previewStatVal: {
fontSize: 16,
fontWeight: 700,
fontVariantNumeric: “tabular-nums”,
},
previewStatLabel: {
fontSize: 10.5,
color: “#9a9584”,
marginTop: 2,
textTransform: “uppercase”,
letterSpacing: “0.03em”,
},
confirmBtn: {
width: “100%”,
padding: “14px”,
borderRadius: 12,
border: “none”,
background: “#5B8C5A”,
color: “#FFFDF9”,
fontSize: 15,
fontWeight: 700,
},
formGrid: {
display: “flex”,
flexDirection: “column”,
gap: 12,
marginBottom: 18,
},
formField: {},
formFieldCompact: { flex: 1 },
formRow3: {
display: “flex”,
gap: 8,
},
formLabel: {
fontSize: 12,
fontWeight: 600,
color: “#8a8574”,
display: “block”,
marginBottom: 5,
},
formInput: {
width: “100%”,
padding: “10px 12px”,
borderRadius: 10,
border: “1.5px solid #EAE4D6”,
background: “#FFFDF9”,
fontSize: 14,
fontFamily: FONT,
color: “#2B3328”,
},
toast: {
position: “fixed”,
bottom: 24,
left: “50%”,
transform: “translateX(-50%)”,
background: “#2B3328”,
color: “#FAF7F2”,
padding: “10px 18px”,
borderRadius: 24,
fontSize: 13,
fontWeight: 600,
boxShadow: “0 4px 16px rgba(0,0,0,0.2)”,
zIndex: 100,
},
};

const root = ReactDOM.createRoot(document.getElementById(“root”));
root.render(<App />);
