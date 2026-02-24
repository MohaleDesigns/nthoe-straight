declare module '@paystack/inline-js' {
  interface PaystackPopup {
    /**
     * Closes the payment popup
     */
    close(): void;
  }

  interface TransactionOptions {
    /**
     * Your Paystack public key
     */
    key: string;
    /**
     * Email address of the customer
     */
    email: string;
    /**
     * Amount in kobo (lowest currency unit)
     */
    amount: number;
    /**
     * Currency code (e.g., 'NGN', 'GHS', 'USD', 'ZAR')
     */
    currency?: string;
    /**
     * Unique transaction reference
     */
    reference?: string;
    /**
     * Customer first name
     */
    firstName?: string;
    /**
     * Customer last name
     */
    lastName?: string;
    /**
     * Customer phone number
     */
    phone?: string;
    /**
     * Optional metadata object
     */
    metadata?: {
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    /**
     * Callback function when payment is successful
     */
    onSuccess?: (transaction: {
      reference: string;
      trans?: string;
      status?: string;
      message?: string;
      transaction?: string;
      trxref?: string;
    }) => void;
    /**
     * Callback function when popup is closed
     */
    onCancel?: () => void;
    /**
     * Callback function for loading state
     */
    onLoad?: (response: unknown) => void;
    /**
     * Callback function when payment errors
     */
    onError?: (error: { message?: string }) => void;
  }

  class PaystackInline {
    /**
     * Creates a new Paystack instance
     */
    constructor();
    /**
     * Opens a new payment transaction popup
     */
    newTransaction(options: TransactionOptions): PaystackPopup;
  }

  export default PaystackInline;
}
