# Madurai One - Mobile Web Application

A comprehensive travel companion app for Madurai residents and visitors, providing seamless access to public and private transportation options.

## Features

- **OTP-based Authentication** - Secure login with mobile number verification
- **Language Support** - Tamil and English with real-time switching
- **Accessibility Mode** - Blind-friendly mode with larger text and optimized touch targets
- **Location Services** - GPS-based location detection with manual fallback
- **Transport Modules**:
  - Government Bus - TNSTC bus booking with QR tickets
  - Private Bus - Links to 5 Madurai travel agencies
  - Auto - Links to local auto services
  - Car - Links to 6 cab booking services
  - Bike - Rapido bike taxi
  - Train - IRCTC train booking

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Tailwind CSS
- Lucide React Icons
- react-qr-code for QR generation
- react-hot-toast for notifications

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- QRCode generation

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MADURAI ONE SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐  │
│  │   User/Device   │         │   External       │         │  External    │  │
│  │   (Mobile       │         │   Services       │         │  Transport   │  │
│  │    Browser)     │         │                  │         │  Partners    │  │
│  └────────┬────────┘         └────────┬────────┘         └──────┬───────┘  │
│           │                           │                           │          │
│           │  HTTPS/REST                │ API                       │ Links    │
│           │                            │                           │          │
│           ▼                            ▼                           │          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        CLIENT LAYER (React)                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │ AuthContext  │  │LanguageCtx  │  │ LocationCtx  │                │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │   │
│  │  │ Login/OTP    │  │Transport     │  │ Ticket/QR    │                │   │
│  │  │ Pages        │  │Selection     │  │ Display      │                │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    │ REST API                               │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     SERVER LAYER (Express.js)                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Auth Routes  │  │ Bus Routes   │  │Payment Routes│              │   │
│  │  │ - send-otp   │  │ - calc-fare  │  │ - create-ord │              │   │
│  │  │ - verify-otp │  │ - create-tkt │  │ - verify     │              │   │
│  │  │ - profile    │  │ - routes     │  │              │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐│  │
│  │  │                    JWT Middleware / Validation                    ││  │
│  │  └──────────────────────────────────────────────────────────────────┘│  │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      DATABASE (MongoDB)                             │   │
│  │  ┌─────────────────────────┐    ┌─────────────────────────────┐    │   │
│  │  │        User             │    │          Ticket              │    │   │
│  │  │  - phone                │    │  - userId (ref)              │    │   │
│  │  │  - language             │    │  - busNumber                 │    │   │
│  │  │  - blindMode            │    │  - route                     │    │   │
│  │  │  - location             │    │  - fare                      │    │   │
│  │  │  - otp/otpExpiry        │    │  - qrData                    │    │   │
│  │  │  - createdAt            │    │  - paymentId                 │    │   │
│  │  └─────────────────────────┘    │  - status                    │    │   │
│  │                                  │  - createdAt/expiresAt       │    │   │
│  │                                  └─────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram (DFD) - Level 1

### Context Diagram (Level 0)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MADURAI ONE SYSTEM                              │
│                                                                         │
│    ┌─────────────┐                        ┌──────────────────────┐      │
│    │             │                        │                      │      │
│    │   USER      │───────────────────────▶│   Madurai One App    │      │
│    │             │◀──────────────────────│                      │       │
│    │ - Phone     │                        │                      │       │
│    │ - OTP       │                        │                      │       │
│    │ - Location  │                        │                      │       │
│    │ - Prefs     │                        └──────────────────────┘       │
│    └─────────────┘                                    │                 │
│                                                       │                │
│         ┌─────────────────────────────────────────────┼────────────┐   │
│         │                    ▼                        │            │   │
│         │    ┌──────────────────────────────────────────┐          │   │
│         │    │                                          │          │   │
│         │    │          DATA FLOWS                      │          │   │
│         │    │  - Phone Number                          │          │   │
│         │    │  - OTP Code                              │          │   │
│         │    │  - JWT Token                             │          │   │
│         │    │  - Language Preference                   │          │   │
│         │    │  - GPS Coordinates                       │          │   │
│         │    │  - Bus Ticket Data                       │          │   │
│         │    │  - QR Code                               │          │   │
│         │    │                                          │          │   │
│         │    └──────────────────────────────────────────┘          │   │
│         │                                                           │   │
│         │                              ┌────────────────────────┐  │   │
│         │                              │  External Services    │  │   │
│         │                              │                        │  │   │
│         └─────────────────────────────▶│ - Travel Agencies      │──┘   │
│                                         │ - Auto Services       │      │
│                                         │ - Cab Services         │      │
│                                         │ - Rapido Bike          │      │
│                                         │ - IRCTC Train          │      │
│                                         └────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Level 1 DFD - Authentication Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROCESS 1: USER AUTHENTICATION                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│    ┌─────────────┐                                                      │
│    │   EXTERNAL  │     ┌────────────────────────────────────────────┐   │
│    │   USER      │────▶│         PROCESS 1.1                        │   │
│    │             │     │         Send OTP Request                  │   │
│    │  Input:     │     │                                            │   │
│    │  Phone No.  │     │  - Validate phone format                   │   │
│    │             │     │  - Generate 6-digit OTP                   │   │
│    └─────────────┘     │  - Set OTP expiry (5 mins)                │   │
│                        │  - Store in MongoDB                        │   │
│                        └─────────────────────┬────────────────────┘   │
│                                                │                        │
│                                                │ OTP Data               │
│                                                ▼                        │
│    ┌─────────────┐     ┌────────────────────────────────────────────┐   │
│    │   EXTERNAL  │◀────│         PROCESS 1.2                        │   │
│    │   SMS       │     │         OTP Verification                  │   │
│    │   Gateway   │     │                                            │   │
│    │             │     │  - Compare user OTP with stored OTP       │   │
│    │  Output:     │     │  - Check OTP expiry                       │   │
│    │  OTP to      │     │  - Generate JWT token (7 days)            │   │
│    │  User Phone  │     │  - Clear OTP after verification            │   │
│    └─────────────┘     └─────────────────────┬────────────────────┘   │
│                                                │                        │
│                                                │ User/Ticket Data        │
│    ┌─────────────┐     ┌──────────────────────▼────────────────────┐   │
│    │   MONGODB   │◀──▶│              DATA STORE                     │   │
│    │   Database  │     │              User Collection               │   │
│    │             │     │                                              │   │
│    │  Stored:    │     │  ┌─────────────────────────────────────┐  │   │
│    │  - User     │     │  │ phone: String                       │  │   │
│    │    Profile  │     │  │ language: 'tamil' | 'english'       │  │   │
│    │  - OTP      │     │  │ blindMode: Boolean                  │  │   │
│    │  - Tokens   │     │  │ location: { lat, lng }             │  │   │
│    │             │     │  │ otp: String                        │  │   │
│    └─────────────┘     │  │ otpExpiry: Date                    │  │   │
│                         │  └─────────────────────────────────────┘  │   │
│                         └────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Level 1 DFD - Ticket Booking Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROCESS 2: TICKET BOOKING                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│    ┌─────────────┐                                                      │
│    │   EXTERNAL  │     ┌────────────────────────────────────────────┐   │
│    │   USER      │────▶│         PROCESS 2.1                       │   │
│    │             │     │         Fare Calculation                  │   │
│    │  Input:     │     │                                            │   │
│    │  - Bus No.  │     │  - Validate bus number format              │   │
│    │  - Route    │     │  - Look up route in fare table             │   │
│    │             │     │  - Return calculated fare                  │   │
│    └─────────────┘     └─────────────────────┬────────────────────┘   │
│                                                │                        │
│                                                │ Fare Data              │
│    ┌─────────────┐     ┌──────────────────────▼────────────────────┐   │
│    │   EXTERNAL  │◀────│         PROCESS 2.2                       │   │
│    │   RAZORPAY  │     │         Payment Processing                │   │
│    │   Gateway   │     │                                            │   │
│    │             │     │  - Create payment order                   │   │
│    │  Input:     │     │  - Process payment                        │   │
│    │  - Amount   │     │  - Verify payment signature               │   │
│    │  - Currency │     │  - Return payment ID                      │   │
│    │             │     └─────────────────────┬────────────────────┘   │
│    └─────────────┘                            │                        │
│                                                 │ Payment Confirmation  │
│    ┌─────────────┐     ┌───────────────────────▼────────────────────┐   │
│    │   EXTERNAL  │◀────│         PROCESS 2.3                       │   │
│    │   USER      │     │         Ticket Generation                 │   │
│    │             │     │                                            │   │
│    │  Output:    │     │  - Generate unique ticket ID              │   │
│    │  - QR Code  │     │  - Create QR data (JSON)                  │   │
│    │  - Ticket   │     │  - Generate QR code image                 │   │
│    │    Details  │     │  - Set ticket expiry (2 hours)            │   │
│    │             │     │  - Save ticket to database                │   │
│    └─────────────┘     └─────────────────────┬────────────────────┘   │
│                                                │                        │
│    ┌─────────────┐     ┌──────────────────────▼────────────────────┐   │
│    │   MONGODB   │◀───▶│              DATA STORE                   │   │
│    │   Database  │     │              Ticket Collection            │   │
│    │             │     │                                              │   │
│    │  Stored:    │     │  ┌─────────────────────────────────────┐  │   │
│    │  - Tickets  │     │  │ userId: ObjectId                    │  │   │
│    │  - QR Data  │     │  │ busNumber: String                   │  │   │
│    │             │     │  │ route: String                       │  │   │
│    └─────────────┘     │  │ fare: Number                        │  │   │
│                         │  │ qrData: String                     │  │   │
│                         │  │ paymentId: String                  │  │   │
│                         │  │ status: 'pending'|'confirmed'      │  │   │
│                         │  │ expiresAt: Date                    │  │   │
│                         │  └─────────────────────────────────────┘  │   │
│                         └────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## System Flow Diagram - User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MADURAI ONE APP FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           ┌─────────────────────┐                             │
│                           │   APP START         │                             │
│                           │   /                 │                             │
│                           └──────────┬──────────┘                             │
│                                      │                                       │
│                                      ▼                                       │
│                    ┌─────────────────────────────────────┐                   │
│                    │     CHECK AUTH STATE                 │                   │
│                    │     (JWT Token Valid?)               │                   │
│                    └───────────────────┬───────────────────┘                   │
│                                        │                                       │
│                           ┌────────────┴────────────┐                           │
│                           │                         │                           │
│                           ▼                         ▼                           │
│                    ┌──────────────┐          ┌──────────────┐                 │
│                    │  YES         │          │  NO           │                 │
│                    │              │          │              │                 │
│                    ▼              │          ▼              │                 │
│          ┌─────────────────┐      │  ┌─────────────────┐     │                 │
│          │  FETCH PROFILE   │      │  │  LOGIN PAGE     │     │                 │
│          │  /api/auth/profile│     │  │                 │     │                 │
│          └────────┬─────────┘      │  │  - Phone Input  │     │                 │
│                   │                 │  │  - Send OTP Btn │     │                 │
│                   ▼                 │  └────────┬────────┘     │                 │
│     ┌───────────────────────┐        │         │               │                 │
│     │  LANGUAGE SELECTION   │        │         ▼               │                 │
│     │                       │        │ ┌─────────────────┐    │                 │
│     │  ┌─────────────────┐   │        │ │  OTP VERIFY     │    │                 │
│     │  │  Tamil          │   │        │ │                 │    │                 │
│     │  │  English        │   │        │ │  - 6 Digit OTP  │    │                 │
│     │  └────────┬────────┘   │        │ │  - Auto Focus   │    │                 │
│     │           │             │        │ │  - Resend Timer │    │                 │
│     │           └──────┬──────┘        │ └────────┬────────┘    │                 │
│     │                  │                │         │              │                 │
│     │                  ▼                │         │ Verify Success│                 │
│     │ ┌───────────────────────┐         │         └───────┬──────┘                 │
│     │ │  LOCATION PERMISSION  │         │                 │                        │
│     │ │                       │         │                 │                        │
│     │ │  ┌─────────────────┐  │         │                 │                        │
│     │ │  │  GPS Detection │  │         │                 │                        │
│     │ │  │  (navigator.   │  │         │                 │                        │
│     │ │  │   geolocation) │  │         │                 │                        │
│     │ │  └────────┬────────┘  │         │                 │                        │
│     │ │           │          │         │                 │                        │
│     │ │    ┌──────┴──────┐   │         │                 │                        │
│     │ │    ▼             ▼   │         │                 │                        │
│     │ │  SUCCESS     MANUAL  │         │                 │                        │
│     │ │    │         INPUT   │         │                 │                        │
│     │ │    │             │   │         │                 │                        │
│     │ │    └──────┬──────┘   │         │                 │                        │
│     │ │           ▼          │         │                 │                        │
│     │ │  ┌─────────────────┐│         │                 │                        │
│     │ │  │ Save to Profile ││         │                 │                        │
│     │ │  │ /api/auth/profile││         │                 │                        │
│     │ │  └────────┬────────┘│         │                 │                        │
│     │ └───────────│─────────┘         │                 │                        │
│     │             │                   │                 │                        │
│     └─────────────┼───────────────────┼─────────────────┘                        │
│                   │                   │                                        │
│                   ▼                   ▼                                        │
│     ┌─────────────────────────────────────────────────────┐                       │
│     │         TRANSPORT SELECTION PAGE                    │                       │
│     │                                                      │                       │
│     │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │                       │
│     │  │Government│  │ Private  │  │   Auto   │          │                       │
│     │  │   Bus    │  │   Bus    │  │          │          │                       │
│     │  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │          │                       │
│     │  └────┬─────┘  └────┬─────┘  └────┬─────┘          │                       │
│     │       │             │             │                │                       │
│     │  ┌────┴────┐  ┌─────┴─────┐  ┌────┴────┐            │                       │
│     │  │  Car    │  │   Bike    │  │  Train  │            │                       │
│     │  │  [Icon] │  │  [Icon]   │  │ [Icon]  │            │                       │
│     │  └─────────┘  └───────────┘  └─────────┘            │                       │
│     └─────────────────────────────────────────────────────┘                       │
│                   │                                                         │
│                   ▼                                                         │
│     ┌─────────────────────────────────────────────┐                           │
│     │         MODULE SPECIFIC FLOWS               │                           │
│     │                                              │                           │
│     │  ┌────────────────────────────────────────┐  │                           │
│     │  │  GOVERNMENT BUS (Booking Flow)        │  │                           │
│     │  │                                        │  │                           │
│     │  │  1. Enter Bus Number ─────────────────▶│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  2. Select Route ◀─────────────────────│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  3. Calculate Fare ──────────────────▶ │  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  4. Proceed to Payment ◀──────────────│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  5. Payment Gateway ◀──────────────────│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  6. Create Ticket ──────────────────▶  │  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  7. Generate QR ◀──────────────────────│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  8. Display Ticket ◀───────────────────│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  9. Download/Share? ───┬──────────────│  │                           │
│     │  │                        │               │  │                           │
│     │  └────────────────────────┼───────────────┘  │                           │
│     │                           │                  │                           │
│     │  ┌─────────────────────────────────────────┐  │                           │
│     │  │  PRIVATE BUS / AUTO / CAR / BIKE / TRAIN│  │                           │
│     │  │                                          │  │                           │
│     │  │  1. Select Transport Partner ──────────▶│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  2. Open External Website ◀────────────│  │                           │
│     │  │         │                              │  │                           │
│     │  │         ▼                              │  │                           │
│     │  │  3. Complete Booking on Partner Site   │  │                           │
│     │  │                                        │  │                           │
│     │  └────────────────────────────────────────┘  │                           │
│     └─────────────────────────────────────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA (ERD)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌──────────────────────────────────────────────────────────────────┐      │
│    │                            USER                                  │      │
│    ├──────────────────────────────────────────────────────────────────┤      │
│    │ PK│ _id          : ObjectId                                     │      │
│    │   │ phone        : String (unique, required)                    │      │
│    │   │ language     : Enum ['tamil', 'english'] (default: english) │      │
│    │   │ blindMode    : Boolean (default: false)                      │      │
│    │   │ location     : { lat: Number, lng: Number, address: String }│      │
│    │   │ createdAt    : Date (default: now)                           │      │
│    └──────────────────────────────────────────────────────────────────┘      │
│                                    │                                          │
│                                    │ 1:N                                      │
│                                    ▼                                          │
│    ┌──────────────────────────────────────────────────────────────────┐      │
│    │                            TICKET                                │      │
│    ├──────────────────────────────────────────────────────────────────┤      │
│    │ PK│ _id          : ObjectId                                     │      │
│    │FK │ userId       : ObjectId (ref: User)                         │      │
│    │   │ busNumber    : String (required)                             │      │
│    │   │ route        : String (required)                             │      │
│    │   │ fare         : Number (required)                             │      │
│    │   │ qrData       : String (JSON data for QR)                     │      │
│    │   │ paymentId    : String                                        │      │
│    │   │ status       : Enum ['pending','confirmed','used','expired'] │      │
│    │   │ createdAt    : Date (default: now)                           │      │
│    │   │ expiresAt    : Date (required)                               │      │
│    └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## API Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API REQUEST/RESPONSE FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   USER                    CLIENT                     SERVER                 │
│    │                         │                          │                    │
│    │  1. Enter Phone         │                          │                    │
│    │────────────────────────▶│                          │                    │
│    │                         │                          │                    │
│    │                         │  POST /api/auth/send-otp │                    │
│    │                         │  { phone: "9876543210" }  │                    │
│    │                         │─────────────────────────▶│                    │
│    │                         │                          │                    │
│    │                         │                          │  Validate Input    │
│    │                         │                          │  Generate OTP      │
│    │                         │                          │  Save to MongoDB    │
│    │                         │                          │────────────────┐   │
│    │                         │                          │               │   │
│    │                         │                          │  ┌──────────┐ │   │
│    │                         │                          │  │ MongoDB  │ │   │
│    │                         │                          │  └──────────┘ │   │
│    │                         │                          │◀───────────────┘   │
│    │                         │◀─────────────────────────│                    │
│    │                         │  { success: true, ... }   │                    │
│    │◀────────────────────────│                          │                    │
│    │  OTP Sent Message       │                          │                    │
│    │                         │                          │                    │
│    │  2. Enter OTP           │                          │                    │
│    │────────────────────────▶│                          │                    │
│    │                         │                          │                    │
│    │                         │  POST /api/auth/verify-otp│                   │
│    │                         │  { phone, otp }           │                    │
│    │                         │─────────────────────────▶│                    │
│    │                         │                          │                    │
│    │                         │                          │  Find User by OTP   │
│    │                         │                          │  Check Expiry      │
│    │                         │                          │  Generate JWT       │
│    │                         │                          │────────────────┐   │
│    │                         │                          │               │   │
│    │                         │                          │  ┌──────────┐ │   │
│    │                         │                          │  │ MongoDB  │ │   │
│    │                         │                          │  └──────────┘ │   │
│    │                         │                          │◀───────────────┘   │
│    │                         │◀─────────────────────────│                    │
│    │                         │  { success, token, user }                    │
│    │◀────────────────────────│                          │                    │
│    │  Authenticated!         │                          │                    │
│    │                         │                          │                    │
│    │  3. Select Bus Route    │                          │                    │
│    │────────────────────────▶│                          │                    │
│    │                         │                          │                    │
│    │                         │  POST /api/bus/calculate-fare                  │
│    │                         │  { busNumber, route }     │                    │
│    │                         │─────────────────────────▶│                    │
│    │                         │                          │                    │
│    │                         │                          │  Validate Bus #    │
│    │                         │                          │  Lookup Route Fare  │
│    │                         │◀─────────────────────────│                    │
│    │                         │  { fare: 30, ... }       │                    │
│    │◀────────────────────────│                          │                    │
│    │  Fare: Rs.30            │                          │                    │
│    │                         │                          │                    │
│    │  4. Pay & Confirm       │                          │                    │
│    │────────────────────────▶│                          │                    │
│    │                         │                          │                    │
│    │                         │  POST /api/payment/create-order               │
│    │                         │  { amount: 30 }         │                    │
│    │                         │─────────────────────────▶│                    │
│    │                         │                          │                    │
│    │                         │                          │  Create Order      │
│    │                         │◀─────────────────────────│                    │
│    │                         │  { orderId, ... }        │                    │
│    │                         │                          │                    │
│    │                         │  Payment UI (Razorpay)   │                    │
│    │                         │◀────────────────────────│                    │
│    │◀────────────────────────│                          │                    │
│    │  Payment Dialog         │                          │                    │
│    │                         │                          │                    │
│    │  5. Payment Complete    │                          │                    │
│    │────────────────────────▶│                          │                    │
│    │                         │                          │                    │
│    │                         │  POST /api/bus/create-ticket                  │
│    │                         │  { busNumber, route, fare, paymentId }        │
│    │                         │─────────────────────────▶│                    │
│    │                         │                          │                    │
│    │                         │                          │  Create Ticket     │
│    │                         │                          │  Generate QR Data  │
│    │                         │                          │  Encode QR Image    │
│    │                         │                          │────────────────┐   │
│    │                         │                          │               │   │
│    │                         │                          │  ┌──────────┐ │   │
│    │                         │                          │  │ MongoDB  │ │   │
│    │                         │                          │  └──────────┘ │   │
│    │                         │                          │◀───────────────┘   │
│    │                         │◀─────────────────────────│                    │
│    │                         │  { ticket, qrCode }      │                    │
│    │◀────────────────────────│                          │                    │
│    │  Ticket with QR         │                          │                    │
│    │                         │                          │                    │
│    │  6. Download/Share      │                          │                    │
│    │────────────────────────▶│                          │                    │
│    │                         │                          │                    │
│    └─────────────────────────┴──────────────────────────┴────────────────────┘
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Transport Module Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRANSPORT MODULE SELECTION FLOW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                    ┌──────────────────────────┐                              │
│                    │  TRANSPORT SELECTION     │                              │
│                    │         PAGE            │                              │
│                    └────────────┬───────────┘                              │
│                                 │                                           │
│           ┌─────────────┬───────┴───────┬─────────────┐                    │
│           │             │               │             │                     │
│           ▼             ▼               ▼             ▼                     │
│    ┌────────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐              │
│    │ GOVERNMENT │ │  PRIVATE  │ │    AUTO    │ │   CAR     │              │
│    │    BUS     │ │    BUS    │ │            │ │           │              │
│    └─────┬──────┘ └─────┬─────┘ └─────┬──────┘ └────┬─────┘              │
│          │              │             │             │                      │
│          ▼              │             │             │                      │
│    ┌───────────┐        │             │             │                      │
│    │ IN-APP    │        │             │             │                      │
│    │ BOOKING   │        │             │             │                      │
│    │ FLOW      │        │             │             │                      │
│    │           │        │             │             │                      │
│    │ 1. Bus #  │        │             │             │                      │
│    │ 2. Route  │        │             │             │                      │
│    │ 3. Fare   │        │             │             │                      │
│    │ 4. Pay    │        │             │             │                      │
│    │ 5. QR     │        │             │             │                      │
│    └─────┬─────┘        │             │             │                      │
│          │              │             │             │                      │
│          └──────┬───────┴─────────────┴─────────────┘                      │
│                 │                                                          │
│                 ▼                                                          │
│    ┌─────────────────────────────────────────┐                             │
│    │        EXTERNAL PARTNER LINKS           │                             │
│    ├─────────────────────────────────────────┤                             │
│    │                                         │                             │
│    │  PRIVATE BUS:     │  AUTO:              │                             │
│    │  ├─ Egloo Travels │  ├─ Vaagai Meter   │                             │
│    │  ├─ Madurai Travel│  └─ Vaigai Meter   │                             │
│    │  ├─ Griffin Travel│                     │                             │
│    │  ├─ SAI Tours     │  CAR:               │                             │
│    │  └─ Radha Travels │  ├─ Gozocabs       │                             │
│    │                    │  ├─ FastTrack       │                             │
│    │  BIKE:            │  ├─ Bharat Taxi     │                             │
│    │  └─ Rapido        │  ├─ Savaari         │                             │
│    │                    │  ├─ SRTC Rentals    │                             │
│    │  TRAIN:           │  └─ ThreeBestRated  │                             │
│    │  └─ IRCTC         │                     │                             │
│    │                    │                     │                             │
│    └────────┬──────────┴─────────────────────┘                             │
│             │                                                              │
│             ▼                                                              │
│    ┌─────────────────────────────┐                                          │
│    │  OPEN EXTERNAL WEBSITE     │                                          │
│    │  (window.open in new tab)  │                                          │
│    │                             │                                          │
│    │  User completes booking    │                                          │
│    │  on partner's platform      │                                          │
│    │                             │                                          │
│    └─────────────────────────────┘                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd "O:\keeri\Project\MaduraiOne Web App"
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/maduraione
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Run the application**
   
   In root directory:
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Or run separately
   npm run server  # Backend on port 5000
   cd client && npm run dev  # Frontend on port 5173
   ```

7. **Access the app**
   Open http://localhost:5173 in your browser

---

## Project Structure

```
MaduraiOne Web App/
├── client/                 # React frontend
│   ├── public/
│   │   └── favicon.svg     # App icon
│   ├── src/
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   ├── LanguageSelection.jsx
│   │   │   ├── LocationPermission.jsx
│   │   │   ├── TransportSelection.jsx
│   │   │   ├── GovernmentBus.jsx
│   │   │   ├── PrivateBus.jsx
│   │   │   ├── Auto.jsx
│   │   │   ├── Car.jsx
│   │   │   ├── Bike.jsx
│   │   │   ├── Train.jsx
│   │   │   └── Ticket.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Express backend
│   ├── models/
│   │   ├── User.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bus.js
│   │   └── payment.js
│   └── index.js
├── SPEC.md                 # Design specification
├── package.json
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP, return JWT
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update preferences

### Bus
- `POST /api/bus/calculate-fare` - Calculate ticket fare
- `POST /api/bus/create-ticket` - Create ticket after payment
- `GET /api/bus/routes` - Get available routes
- `GET /api/bus/ticket/:id` - Get ticket details

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment

---

## Transport Partner Links

### Private Bus
- https://www.eglootravels.in/
- https://www.madurai-travels.com/
- https://griffintravels.com/
- https://maduraisaitourstravels.com/
- https://www.madurairadhatravels.in/

### Auto
- https://vaagaimeterauto.in
- https://www.vaigaimeterauto.com/

### Car
- https://www.gozocabs.com/
- https://fasttrackcalltaxi.in/madurai
- https://www.bharattaxi.com/madurai
- https://www.savaari.com/Madurai/book-taxi
- https://threebestrated.in/cab-services-in-madurai-tn
- https://srtcarrentals.com/

### Bike
- https://rapido.bike/Home

### Train
- https://www.irctc.co.in/nget/train-search

---

## Design System

### Colors
- Primary: `#D84315` (Madurai Temple Orange)
- Secondary: `#1565C0` (Deep Blue)
- Accent: `#FFB300` (Gold)
- Background: `#FAFAFA`
- Success: `#2E7D32`
- Error: `#C62828`

### Typography
- Primary: Poppins (Sans-serif)
- Tamil: Noto Sans Tamil

### Touch Targets
- Minimum 48px for all interactive elements
- 80px for blind mode

---

---

## Implementation Guide

### Context Providers

#### AuthContext Implementation
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phone) => {
    const res = await axios.post('/api/auth/send-otp', { phone });
    return res.data;
  };

  const verifyOTP = async (phone, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { phone, otp });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await axios.put('/api/auth/profile', data);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, sendOTP, verifyOTP, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### LanguageContext Implementation
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const translations = {
  english: {
    welcome: 'Welcome to Madurai One',
    enterPhone: 'Enter your mobile number',
    getOTP: 'Get OTP',
    verify: 'Verify',
  },
  tamil: {
    welcome: 'மதுரை ஒன் வரவேற்கிறது',
    enterPhone: 'உங்கள் மொபைல் எண்ணை உள்ளிடவும்',
    getOTP: 'OTP பெறுக',
    verify: 'சரிபார்க்க',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { user, updateProfile } = useAuth();
  const [language, setLanguage] = useState(user?.language || 'english');
  const [blindMode, setBlindMode] = useState(user?.blindMode || false);

  useEffect(() => {
    if (user?.language) setLanguage(user.language);
    if (user?.blindMode !== undefined) setBlindMode(user.blindMode);
  }, [user]);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    if (user) await updateProfile({ language: lang });
  };

  const toggleBlindMode = async () => {
    const newValue = !blindMode;
    setBlindMode(newValue);
    if (user) await updateProfile({ blindMode: newValue });
  };

  const t = (key) => translations[language]?.[key] || translations.english[key] || key;

  return (
    <LanguageContext.Provider value={{ language, blindMode, changeLanguage, toggleBlindMode, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
```

### Database Models

#### User Model (Mongoose)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    enum: ['tamil', 'english'],
    default: 'english'
  },
  blindMode: {
    type: Boolean,
    default: false
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  otp: String,
  otpExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

#### Ticket Model (Mongoose)
```javascript
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busNumber: { type: String, required: true },
  route: { type: String, required: true },
  fare: { type: Number, required: true },
  qrData: { type: String, required: true },
  paymentId: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'used', 'expired'],
    default: 'confirmed'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Ticket', ticketSchema);
```

### API Routes

#### Authentication Routes
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 300000);
  let user = await User.findOne({ phone });
  if (user) {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  } else {
    user = new User({ phone, otp, otpExpiry });
    await user.save();
  }
  res.json({ success: true, message: 'OTP sent successfully' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone, otp, otpExpiry: { $gt: new Date() } });
  if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });
  
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = jwt.sign(
    { userId: user._id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ success: true, token, user: { id: user._id, phone: user.phone } });
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
```

#### Bus Routes
```javascript
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const ROUTE_FARES = {
  'Madurai Junction - Anna Nagar': 25,
  'Madurai Junction - Mattuthavani': 30,
  'Madurai Junction - Goripalayam': 20,
  'Madurai Junction - Thiruparankundram': 35,
};

// POST /api/bus/calculate-fare
router.post('/calculate-fare', (req, res) => {
  const { busNumber, route } = req.body;
  const fare = ROUTE_FARES[route] || 30;
  res.json({ busNumber, route, fare, validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) });
});

// POST /api/bus/create-ticket
router.post('/create-ticket', async (req, res) => {
  const { busNumber, route, fare, paymentId } = req.body;
  const ticketId = uuidv4().slice(0, 8).toUpperCase();
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const qrData = JSON.stringify({ ticketId, busNumber, route, fare, expiresAt });
  const qrCode = await QRCode.toDataURL(qrData);
  const ticket = new Ticket({ userId: req.user._id, busNumber, route, fare, qrData, paymentId, expiresAt });
  await ticket.save();
  res.json({ success: true, ticket: { ticketId, qrCode, expiresAt } });
});

module.exports = router;
```

### Server Setup
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maduraione')
  .then(() => console.log('MongoDB Connected'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bus', require('./routes/bus'));
app.use('/api/payment', require('./routes/payment'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Environment Configuration
```env
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maduraione
JWT_SECRET=your_secure_secret_key_here
FRONTEND_URL=http://localhost:5173
```

---

## License

Private project for Madurai One application.
