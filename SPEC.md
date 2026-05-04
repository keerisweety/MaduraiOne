# Madurai One - Mobile Application Specification

## 1. Concept & Vision

Madurai One is a comprehensive travel companion app for Madurai residents and visitors, providing seamless access to public and private transportation options. The app emphasizes accessibility with Tamil/English language support and a dedicated blind mode with voice instructions. The design reflects Madurai's cultural heritage with warm, welcoming colors while maintaining modern usability.

## 2. Design Language

### Aesthetic Direction
Traditional South Indian warmth meets modern mobile-first design. Clean, uncluttered interfaces with generous touch targets and clear visual hierarchy.

### Color Palette
- **Primary**: `#D84315` (Madurai Temple Orange)
- **Secondary**: `#1565C0` (Deep Blue)
- **Accent**: `#FFB300` (Gold)
- **Background**: `#FAFAFA` (Light Gray)
- **Surface**: `#FFFFFF` (White)
- **Text Primary**: `#212121`
- **Text Secondary**: `#757575`
- **Success**: `#2E7D32`
- **Error**: `#C62828`

### Typography
- **Primary Font**: 'Poppins', sans-serif
- **Tamil Font**: 'Noto Sans Tamil', sans-serif
- **Headings**: Poppins 600-700
- **Body**: Poppins 400-500
- **Sizes**: 14px base, 1.5 line height

### Spatial System
- Base unit: 8px
- Touch targets: minimum 48px
- Card padding: 16px
- Section spacing: 24px
- Screen padding: 16px

### Motion Philosophy
- Page transitions: slide left/right 300ms ease-out
- Button feedback: scale 0.98 on press
- Loading states: pulse animation
- Success confirmations: checkmark with scale-in

### Visual Assets
- Transport icons: Custom SVG icons in primary/secondary colors
- QR codes: Generated with brand colors
- App icon: Temple gopuram silhouette with "M" monogram

## 3. Layout & Structure

### Page Flow
1. Login → OTP Verification → Language Selection → Location Permission → Transport Selection
2. Each transport module leads to specific booking/external redirect

### Navigation Pattern
- Bottom navigation for main transport types
- Back arrow in header for nested pages
- Modal overlays for confirmations

### Responsive Strategy
- Mobile-first (375px base)
- Tablet adaptation (768px+)
- Maximum content width: 480px centered

## 4. Features & Interactions

### Authentication Flow
- **Login Page**: Phone number input with country code (+91)
- **OTP Entry**: 6-digit code with auto-focus progression
- **OTP Verification**: Backend validation with 30-second resend cooldown
- **Error States**: Invalid OTP, expired OTP, too many attempts

### Language Selection
- Tamil / English toggle cards
- Blind/Accessibility mode toggle
- Selection persists to backend

### Location Services
- Geolocation API integration
- Map display with current location marker
- Manual search fallback option
- Permission denied graceful handling

### Transport Modules

#### Government Bus
- Bus number input (validation)
- Route selection dropdown
- Fare calculation display
- Payment gateway integration (Razorpay test mode)
- QR code generation with ticket details

#### Private Bus
- 5 travel agency website links
- Each opens in new tab
- Icon-based touch targets with agency names

#### Auto
- 2 auto service websites
- Icon-based touch targets

#### Car
- 6 car rental websites
- Icon-based touch targets

#### Bike
- Rapido website redirect
- Icon-based touch target

#### Train
- IRCTC redirect
- Icon-based touch target

### Ticket QR System
- QR contains: bus number, route, fare, timestamp, PNR
- Generated after successful payment
- Displayed in full-screen modal
- Download option

## 5. Component Inventory

### Button
- **Default**: Primary color, 48px height, 8px radius
- **Hover**: Slight brightness increase
- **Active**: Scale 0.98, darker shade
- **Disabled**: 50% opacity, no interaction
- **Loading**: Spinner icon, disabled state

### Input Field
- **Default**: Border 1px #E0E0E0, 48px height
- **Focus**: Primary color border, subtle shadow
- **Error**: Red border, error message below
- **Disabled**: Gray background

### Transport Card
- **Default**: White background, 8px radius, subtle shadow
- **Active**: Primary border highlight
- **Contains**: Icon (48px), label, optional subtitle

### OTP Input
- 6 separate boxes, 48px each
- Auto-advance on digit entry
- Backspace moves to previous

### QR Ticket
- White card with brand header
- QR code centered (200x200px)
- Ticket details below
- Download/Share buttons

### Modal
- Centered overlay
- Backdrop blur
- Slide-up animation
- Close button top-right

## 6. Technical Approach

### Frontend
- React 18 with Vite
- React Router v6 for navigation
- Context API for state (auth, language, location)
- Axios for API calls
- react-qr-code for QR generation
- Tailwind CSS for styling

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for session management
- Twilio/Nexmo for OTP (simulated for demo)
- Razorpay SDK for payments

### API Endpoints

#### Auth
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP, return JWT
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update preferences

#### Bus
- `POST /api/bus/calculate-fare` - Calculate ticket fare
- `POST /api/bus/create-ticket` - Create ticket after payment
- `GET /api/bus/ticket/:id` - Get ticket details

#### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Data Models

#### User
```
{
  phone: String,
  language: 'tamil' | 'english',
  blindMode: Boolean,
  location: { lat: Number, lng: Number },
  createdAt: Date
}
```

#### Ticket
```
{
  userId: ObjectId,
  busNumber: String,
  route: String,
  fare: Number,
  qrData: String,
  paymentId: String,
  createdAt: Date,
  expiresAt: Date
}
```

### Security
- HTTPS only
- JWT with 24h expiry
- Rate limiting on OTP endpoints
- Input sanitization
- CORS configuration
