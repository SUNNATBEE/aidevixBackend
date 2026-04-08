# Codex Handbook

## 1. Maqsad

Codex'dan tez, aniq, va token-tejamkor foydalanish.

## 2. Asosiy Qoida

Har yaxshi task 4 narsani aniq beradi:

1. Muammo
2. Scope
3. Kutilgan natija
4. Cheklov

Minimal professional format:

```text
Muammo:
[aniq bug]

Scope:
[aniq fayllar]

Kutilgan natija:
[nima ishlashi kerak]

Cheklov:
Minimal patch qil.
Keraksiz refactor qilma.
Faqat shu scope ichida ishlagin.
```

## 3. Token Tejamkorlik

### Qiling

1. Bitta promptda bitta asosiy muammo bering.
2. Scope'ni 1-3 faylgacha tushiring.
3. Avval diagnosis, keyin patch qildiring.
4. Har safar kerakli verification'ni tanlang.
5. Oldingi thread ichida davom eting.

### Qilmang

1. "Butun repo audit qil" demang.
2. Bir promptda ko'p mustaqil bug bermang.
3. Scope'siz so'rov yubormang.
4. Har safar full build qildirmang.
5. Kichik taskda multi-agent ishlatmang.

## 4. Workflow

Eng yaxshi ketma-ketlik:

1. Diagnosis
2. Plan
3. Patch
4. Verification
5. Summary

Professional prompt:

```text
Vazifa:
Avval root sababni top, keyin minimal patch qil.

Tekshirma:
Faqat kerakli verification qil.
```

## 5. Ishlash Rejimlari

### Analysis Only

```text
Faqat root sababni top.
Kod yozma.
```

### Plan First

```text
Kod yozishdan oldin:
1. ehtimoliy sabablarni ayt
2. tekshiriladigan fayllarni ayt
3. eng kichik fix rejasini yoz
keyin to'xta
```

### Minimal Fix

```text
Muammoni top va minimal patch bilan tuzat.
Keraksiz joylarga tegma.
```

### Review

```text
Code review qil.
Findinglarni severity bo'yicha ber.
```

## 6. Multi-Agent Mezoni

Multi-agent faqat:

1. Muammolar mustaqil bo'lsa
2. Ownership ajratish mumkin bo'lsa
3. Parallel ishlash haqiqatan vaqt yutsa

Multi-agent ishlatmang, agar:

1. Bitta kichik bug bo'lsa
2. Root sabab noma'lum bo'lsa
3. Modullar kuchli bog'langan bo'lsa

## 7. Verification Tanlash

### Tavsiya

- kichik frontend fix: lint yoki code-level check
- TS fix: `tsc --noEmit`
- backend fix: syntax/module load
- katta release oldidan: build

Promptga shunday yozing:

```text
Tekshirma:
TypeScript check qil, full build qilma.
```

## 8. Eng Kuchli Buyruqlar

```text
Avval root sababni top.
Minimal patch qil.
Keraksiz refactor qilma.
Faqat shu fayllarda ishlagin.
Butun repo audit qilma.
Multi-agent ochma.
Oxirida qisqa summary ber.
```

## 9. Final Qisqa Xulosa

Professional Codex ishlatishning 4 ustuni:

1. Aniq muammo
2. Aniq scope
3. Minimal patch
4. Nazoratli verification
