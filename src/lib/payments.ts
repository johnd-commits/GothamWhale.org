export type AdoptionCharge = {
  adultId: string;
  whaleId: string;
  tierId: string;
  status: 'pledged';
};

export interface PaymentProvider {
  pledge(input: { adultId: string; whaleId: string; tierId: string }): Promise<AdoptionCharge>;
}

/** Replace this object when a real payment provider is chosen. It does not charge a card. */
export const placeholderPaymentProvider: PaymentProvider = {
  async pledge(input) {
    return { ...input, status: 'pledged' };
  },
};
