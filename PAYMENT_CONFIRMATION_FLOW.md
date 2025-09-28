# Payment Confirmation Flow

## 🎯 **Two-Step Donation Process**

The donation system now implements a secure two-step process:

### Step 1: Create PENDING Donation
- User fills out donation form (amount, cause, payment method, message)
- System creates donation with `status: 'PENDING'`
- Donation is saved to database but not yet paid

### Step 2: Payment Confirmation
- Payment confirmation modal appears
- Shows donation summary (amount, cause, payment method)
- User can:
  - **Confirm Payment**: Updates status to `COMPLETED` and redirects to success page
  - **Cancel**: Keeps donation as `PENDING` for later payment
  - **Press ESC**: Same as cancel

## 🔄 **Payment Flow States**

1. **PENDING**: Donation created but not paid
2. **COMPLETED**: Payment processed successfully  
3. **FAILED**: Payment processing failed

## 🎨 **UI Features**

- **Loading States**: Shows spinner during processing
- **Confirmation Modal**: Clean, accessible design with donation summary
- **Keyboard Support**: ESC key closes modal
- **Background Lock**: Prevents scrolling when modal is open
- **Toast Notifications**: Real-time feedback for all actions

## 🛡️ **Security Benefits**

- Two-step verification prevents accidental donations
- PENDING state allows users to review before payment
- Failed payments don't lose donation data
- Clear status tracking for audit trail

## 🔧 **Technical Implementation**

**Frontend:**
- React state management for modal and payment flow
- TypeScript interfaces for type safety
- Tailwind CSS for responsive design
- Toast notifications for user feedback

**Backend Integration:**
- `POST /api/donation/event/{eventId}` - Create PENDING donation
- `PUT /api/donation/{id}` - Update status to COMPLETED
- Status enum: `PENDING`, `COMPLETED`, `FAILED`

## 🚀 **Usage Example**

1. User navigates to event donation page
2. Fills form: 25,000 Rwf for Education via Stripe
3. Clicks "Continue to Payment" → Creates PENDING donation
4. Reviews details in confirmation modal
5. Clicks "Confirm Payment" → Updates to COMPLETED
6. Redirects to success page with receipt

This creates a seamless yet secure donation experience!