# Wdrożenie na Render.com

## Krok 1: Przygotowanie repozytorium
1. Upewnij się, że kod jest w repozytorium Git (GitHub, GitLab, lub Bitbucket)
2. Plik `render.yaml` jest już skonfigurowany w projekcie

## Krok 2: Utworzenie nowego serwisu w Render
1. Zaloguj się na [render.com](https://render.com)
2. Kliknij "New +" → "Static Site"
3. Połącz swoje repozytorium
4. Render automatycznie wykryje plik `render.yaml`

## Krok 3: Konfiguracja zmiennych środowiskowych
W panelu Render dodaj następujące zmienne środowiskowe:

- `VITE_SUPABASE_URL` - URL Twojej instancji Supabase
- `VITE_SUPABASE_ANON_KEY` - Klucz publiczny Supabase

Wartości tych zmiennych znajdziesz w pliku `.env`

## Krok 4: Konfiguracja domeny
1. W ustawieniach serwisu przejdź do "Custom Domains"
2. Dodaj domenę `cryptotrend.pl` lub `www.cryptotrend.pl`
3. Skonfiguruj rekordy DNS zgodnie z instrukcjami Render:
   - Dla `cryptotrend.pl`: rekord A wskazujący na IP Render
   - Dla `www.cryptotrend.pl`: rekord CNAME wskazujący na `cryptotrend-frontend.onrender.com`

## Krok 5: Automatyczne wdrożenia
Render automatycznie wdroży aplikację przy każdym push do głównej gałęzi repozytorium.

## Struktura po wdrożeniu
- `cryptotrend.pl` - strona główna (ta aplikacja React)
- `app.cryptotrend.pl` - aplikacja Streamlit (już działa)

## Polecenia lokalnie
- `npm run dev` - uruchomienie serwera deweloperskiego
- `npm run build` - zbudowanie aplikacji produkcyjnej
- `npm run preview` - podgląd zbudowanej aplikacji

## Troubleshooting
- Jeśli build się nie powiedzie, sprawdź logi w panelu Render
- Upewnij się, że zmienne środowiskowe są poprawnie ustawione
- Sprawdź czy `dist/` folder jest generowany poprawnie lokalnie
