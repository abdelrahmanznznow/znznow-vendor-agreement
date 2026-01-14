// ZNZNOW Vendor Agreement Templates

export const ZNZNOW_COMPANY_INFO = {
  name: "Zanzisouk LTD",
  tradeName: "ZNZNOW",
  address: "Migoz Plaza, Nyerere Road, Zanzibar, Tanzania",
  email: "contact@znznow.com",
  representative: "AbdelRahman Ahmed",
  representativeTitle: "Founder & CEO",
};

// Partnership levels for Tours & Activities
export const TOURS_PARTNERSHIP_LEVELS = [
  {
    id: "growth",
    name: "Growth Partner",
    commission: "25%",
    description: "Standard partnership with 25% commission on all transactions",
  },
  {
    id: "strategic",
    name: "Strategic Partner",
    commission: "30%",
    description: "Premium partnership with enhanced visibility and 30% commission",
  },
] as const;

// Partnership levels for Restaurants
export const RESTAURANT_PARTNERSHIP_LEVELS = [
  {
    id: "essential",
    name: "Essential Package",
    commission: "15%",
    userFee: "2,000 TZS per item",
    description: "Basic listing with standard support",
  },
  {
    id: "growth",
    name: "Growth Package",
    commission: "20%",
    userFee: "1,000 TZS per item",
    description: "Enhanced visibility with priority support",
  },
  {
    id: "partner",
    name: "Partner Package",
    commission: "25%",
    userFee: "1,000 TZS per item",
    description: "Premium partnership with maximum benefits",
  },
] as const;

// Full legal text for Tours & Activities Agreement
export const TOURS_AGREEMENT_TEXT = `
COMMISSION AGREEMENT
TOURS & ACTIVITIES VENDOR PARTNERSHIP

Effective Date: {{EFFECTIVE_DATE}}
Location: Zanzibar, Tanzania
Email: contact@znznow.com

PARTIES

This Commission Agreement (the "Agreement") is made and entered into on the Effective Date by and between:

1. The Business:
Name: {{VENDOR_NAME}}
Address: {{VENDOR_ADDRESS}}
Registration No.: {{VENDOR_REGISTRATION}}
(hereinafter referred to as the "Business" or "Vendor")

2. The App:
ZNZNOW APP
Zanzisouk LTD
Migoz Plaza, Nyerere Road, Zanzibar
contact@znznow.com
(hereinafter referred to as the "App" or "Znznow")

Collectively referred to as the "Parties."

1. PURPOSE OF AGREEMENT

The Business hereby authorizes the App to promote, list, and sell the following products and/or services on its digital platform (Znznow):

The App agrees to operate as an intermediary platform, facilitating transactions and promoting the Business's offerings to customers in Zanzibar, Tanzania.

2. RESPONSIBILITIES OF THE PARTIES

• The App shall determine the final end-user prices after consultation with the Business, where applicable.
• The Business shall provide:
  - Clear product/service information
  - High-quality photos or promotional content, if available
  - Any terms or constraints on availability
  - Legal or operational documentation as required for onboarding

3. TERM AND TERMINATION

• This Agreement shall commence on the Effective Date and remain in effect until terminated by either Party.
• Either Party may terminate this Agreement:
  - Immediately in case of a Material Breach (as defined below).
  - With a written notice of 15 days.

Material Breach Definition:
For the purpose of this Agreement, a Material Breach shall include, but is not limited to:
• Repeated failure to fulfill orders in a timely and professional manner.
• Failure to remit payments due under this Agreement within the specified period.
• Providing false or misleading product information that affects the consumer experience.
• Violation of local or international trade laws, regulations, or compliance requirements.
• Unauthorized sharing or misuse of Znznow platform data or user information.
• Misrepresentation of product quality, availability, or terms of service.
• Refusal to cooperate with reasonable platform updates or requests for compliance.
• Any action that directly damages the reputation or operations of Znznow.

• Upon termination, the App shall remove the Business's listings from the platform within 5 business days, and the Business shall clear any outstanding balances or disputes.

4. GEOGRAPHICAL SCOPE

The App is authorized to promote and sell the Business's offerings only within Zanzibar, Tanzania. Selling or promoting these offerings outside this jurisdiction requires written consent from the Business.

5. COMMISSION & PAYMENT TERMS

• The App shall earn a commission of {{COMMISSION_RATE}} on the total value of every successful transaction (including VAT if applicable), revised quarterly.
• Payments to the Business will be settled as per the following payment terms and frequency:
  - Weekly settlements via bank transfer or other agreed payment methods.
  - A detailed payment report will be issued with each settlement.

6. PLATFORM USAGE & DATA ACCESS

• The Business agrees to use the Znznow Vendor App/Backend to manage:
  - Product/service listings
  - Order tracking and fulfillment
  - Price adjustments
  - Operating hours and other business settings

• The App reserves the right to analyze platform usage and customer behavior to optimize user experience. Additionally, the App is permitted to utilize platform analytics for:
  - Marketing and retargeting initiatives
  - Performance optimization
  - Customer engagement campaigns

• All sensitive business data shall be handled confidentially.

7. VENDOR RESPONSIBILITIES

• Vendor Responsibility for Price and Information Revisions
The Vendor agrees to regularly review and update the prices and information listed on the App. This includes, but is not limited to, product/service listings, order tracking and fulfilment, price adjustments, operating hours, and other business settings. The Vendor acknowledges that maintaining accurate and up-to-date information is essential for providing a reliable service to customers.

• Vendor Liability for Price Changes
The Vendor agrees that the App holds no liability for any changes in prices made by the Vendor without official notification to the App. In such cases, the Vendor shall be liable for any price differences between the amount paid by customers on the App and the new price of the products or services. The Vendor acknowledges that it is their responsibility to ensure that all price changes are communicated to the App in a timely manner to avoid any discrepancies.

8. VENDOR LIABILITY PROTECTION

• The Business (Vendor) shall not be held liable for any claims, legal actions, or disputes arising from:
  - Platform-level errors, bugs, or system outages
  - Data breaches or cybersecurity incidents affecting the App
  - Marketing claims or advertisements placed by the App
  - Misrepresentation or platform-wide errors not related to the Vendor's specific product or service

This protection does not apply if the Vendor-provided information or listings are:
• Misleading or fraudulent
• Violate regulatory standards
• Misrepresent product quality, availability, or terms of service

9. PRICE PARITY & PLATFORM INTEGRITY

• The Vendor agrees to maintain price parity between the services and activities listed on the Znznow platform and any direct offers made to customers, whether in person, via social media, phone, or any other channel.

• The Vendor shall not offer a lower price for any product, service, or activity that is listed on Znznow to any customer who discovered the offering through the platform or as a result of Znznow's marketing or visibility.

• Any such undercutting practice, where a service is sold directly to the customer for a price lower than the Znznow listing in order to bypass the App's commission, shall be considered a material breach of this Agreement.

• In case of breach, Znznow reserves the right to:
  - Immediately terminate the Vendor's account without further notice.
  - Withhold any pending payments equivalent to the lost commission.
  - Claim damages or pursue legal remedies to recover losses resulting from the breach.

• Vendors are encouraged to offer additional incentives (e.g., free add-ons or upgrades) through Znznow rather than lowering prices outside the platform.

10. RELATIONSHIP OF THE PARTIES

This Agreement does not create a partnership, joint venture, employment, or agency relationship. Both Parties act as independent contractors. The App is not liable for any employment claims by the Business or its staff.

11. CONFIDENTIALITY

• Both Parties shall treat all commercial, technical, and financial data shared as confidential and not disclose it to third parties.
• This obligation remains in effect for two (2) years after termination of this Agreement.

12. WARRANTIES AND REPRESENTATIONS

Each Party represents that:
• It has the legal authority to enter this Agreement
• It is not violating any other agreements by entering this Agreement
• All provided information is truthful and complete to the best of their knowledge

The Business warrants that all product information provided is verified for accuracy and completeness before listing on Znznow. The App shall also verify platform-level information to prevent misrepresentation.

13. LIMITATION OF LIABILITY

• The App's total liability for any claims arising out of platform-related issues shall not exceed:
  - USD $1,000 per incident, or
  - 50% of the total transaction value, whichever is lower.

• The App shall not be liable for:
  - Delays caused by the Business
  - Customer complaints directly related to product/service quality
  - Any legal dispute between customers and the Business

• The Business agrees to indemnify and hold the App harmless from any claims arising out of product/service failure, legal violations, or third-party claims.

14. GOVERNING LAW

This Agreement shall be governed by and interpreted under the laws of Zanzibar, Tanzania.

15. DISPUTE RESOLUTION

Any dispute arising from this Agreement shall be resolved through mediation in the first instance. If unresolved, it may proceed to arbitration under the laws of Zanzibar, Tanzania.

16. AMENDMENTS

No amendment to this Agreement will be effective unless made in writing and signed by both Parties.

17. ASSIGNMENT

Neither Party may assign their obligations under this Agreement without prior written consent of the other Party.

18. SEVERABILITY

If any provision is deemed unenforceable, the remaining parts of the Agreement shall remain in full effect.

19. ENTIRE AGREEMENT

This Agreement constitutes the full understanding between the Parties and supersedes any prior agreements or communications.
`;

// Full legal text for Restaurant Agreement
export const RESTAURANT_AGREEMENT_TEXT = `
RESTAURANT VENDOR AGREEMENT
(ZNZNOW – RESTAURANT PARTNERSHIP)

Effective Date: {{EFFECTIVE_DATE}}
Location: Zanzibar, Tanzania
Email: contact@znznow.com

1. PARTIES

This Commission Agreement (the "Agreement") is made and entered into on the Effective Date by and between:

1. The Restaurant
Name: {{VENDOR_NAME}}
Address: {{VENDOR_ADDRESS}}
Business Registration No.: {{VENDOR_REGISTRATION}}
(hereinafter referred to as the "Restaurant")

2. The App
Name: ZNZNOW APP
Company: Zanzisouk LTD
Address: Migoz Plaza, Nyerere Road, Zanzibar, Tanzania
Email: contact@znznow.com
(hereinafter referred to as the "App" or "Znznow")

The Restaurant and the App are collectively referred to as the "Parties".

2. PARTNERSHIP LEVEL

The Restaurant agrees to enrol in the following partnership level:
{{PARTNERSHIP_LEVEL}}

The detailed commercial terms, including commission rates, user service fees, drinks policies, cancellations, promotions, payout options, and additional benefits for each package are set out in Annex 1 – Restaurant Packages & Commercial Terms, which forms an integral part of this Agreement.

3. PURPOSE OF AGREEMENT

3.1 The Restaurant authorises the App to promote, list, and sell its food and beverage items on the Znznow platform.

3.2 The App agrees to operate as an intermediary platform, facilitating orders and promoting the Restaurant's offerings to customers in Zanzibar, Tanzania.

4. RESPONSIBILITIES OF THE PARTIES

4.1 App Responsibilities
The App shall:
a) List the Restaurant's menu items on the Znznow platform and present them clearly and attractively.
b) Facilitate order processing, payment collection for prepaid orders, and payout of the Restaurant's share according to the Payment Terms in this Agreement and Annex 1.
c) Determine the final end-user prices shown in the App after consultation with the Restaurant where applicable, and subject to any service or convenience fees charged to users per dish and/or per order, as specified in Annex 1.
d) Provide basic marketing support, including in-app visibility and on-premise materials, as described in Annex 1.
e) Provide reasonable technical support for access to the App and the Restaurant's vendor dashboard/back office.

4.2 Restaurant Responsibilities
The Restaurant shall:
a) Provide clear and accurate menu information, including item names, descriptions, ingredients, and allergen information where relevant.
b) Provide high-quality photos of dishes and the restaurant where possible, or allow Znznow to arrange and use photography as specified in Annex 1.
c) Provide and maintain accurate operating hours, preparation times, and availability in the Znznow Vendor App/Backend.
d) Provide any legally required documentation for onboarding, which may include: Business Registration Certificate, Food and Hygiene Licence, relevant permits, and insurance certificates.
e) Prepare and deliver orders in a timely and professional manner, ensuring food quality and hygiene in accordance with local regulations.
f) Promptly update menu items, prices, and availability whenever changes occur.
g) Ensure that order packaging is appropriate for delivery (e.g. leak-proof, properly sealed, correctly labelled where required).

5. TERM AND TERMINATION

5.1 This Agreement commences on the Effective Date and remains in effect until terminated in accordance with this Clause.

5.2 Either Party may terminate this Agreement:
• Immediately in case of a Material Breach by the other Party; or
• For any reason, with 15 days' written notice.

5.3 "Material Breach" includes, but is not limited to:
• Repeated failure to fulfil orders in a timely and professional manner (three (3) or more incidents in any 30-day period).
• Failure to remit payments due under this Agreement within the specified period.
• Providing false or misleading menu or business information.
• Violation of local or international food safety or hygiene laws and regulations.
• Intentional diversion of Znznow orders to off-platform channels to avoid commission, as described in Clause 11.

5.4 Upon termination:
• The App shall remove the Restaurant's listings from the platform within five (5) business days; and
• The Restaurant shall settle any outstanding balances owed to the App; and
• The App shall settle any net positive balances owed to the Restaurant in accordance with the settlement schedule.

6. GEOGRAPHICAL SCOPE

6.1 The App is authorised to promote and sell the Restaurant's offerings within Zanzibar, Tanzania.

6.2 Any promotion or sale of the Restaurant's offerings by Znznow outside this jurisdiction requires the Restaurant's written consent.

7. COMMISSION, FEES & PAYMENT TERMS

7.1 Commission & User Service Fees
a) The commission rate applied to the Restaurant's sales and the user service or convenience fee per dish and/or per order are determined by the selected package (Essential, Growth, Partner) as specified in Annex 1.
b) The Restaurant acknowledges that Znznow may add a service or booking fee paid by the user. As a result, the end-user price displayed in the app may be higher than the Restaurant's in-house price. This difference is not a breach of this Agreement, and strict price parity does not apply.
c) The Restaurant remains free to set its own dine-in and takeaway prices in the physical restaurant.
d) Hotel & Guest House Commission Share: Znznow may share a portion of its own commission (typically between 5–10% of the order value) with hotels or guest houses that refer the order. This is paid from Znznow's commission only and does not reduce the Restaurant's agreed payout.

7.2 Settlements & Payouts
a) Unless otherwise agreed in Annex 1, Znznow shall pay the Restaurant via weekly payouts to the Restaurant's designated mobile wallet or bank account, together with a statement showing:
• Total orders
• Total sales value
• Commission deducted
• Any service/booking fees (for transparency)
• Net amount due to the Restaurant

b) Payout timelines, payout methods, and any additional costs (such as mobile money cash-out fees) are specified in Annex 1.

8. PLATFORM USAGE & DATA

8.1 The Restaurant will use the Znznow Vendor App/Backend or any agreed interface to receive and manage orders.

8.2 The App may collect and process usage data, order data, and customer behaviour data for the purposes of operating and improving the platform. Personal data will be handled in accordance with applicable data protection laws and the App's Privacy Policy.

9. ORDERS & CANCELLATIONS

9.1 The Restaurant shall accept and prepare orders received through the App unless there is a justified reason to cancel (e.g. item out of stock, safety concern, or force majeure).

9.2 Where the Restaurant needs to cancel or modify an order, it shall promptly inform Znznow through the Vendor App/Backend or agreed channel, so customers can be informed and any refunds or adjustments can be processed.

9.3 The Restaurant agrees to follow the cancellation and adjustment rules described in Annex 1 or subsequent written updates agreed between the Parties.

10. REFUNDS & CHARGEBACKS

10.1 If a customer is entitled to a refund under Znznow's refund policy or applicable law, the App may process the refund and adjust subsequent payouts to the Restaurant accordingly, provided that the refund relates to issues attributable to the Restaurant (e.g. missing items, incorrect items, unsafe food).

10.2 Where the issue is solely attributable to the App or its payment providers (e.g. technical double-charges), Znznow will handle the refund from its own funds and will not deduct the amount from the Restaurant's payout.

11. OFF-PLATFORM DIVERSION OF ORDERS

11.1 The Restaurant shall not intentionally divert orders originating from Znznow to off-platform channels (for example, telling customers to reorder directly in order to avoid paying commission on subsequent orders).

11.2 Where repeated intentional diversion is identified and documented, Znznow may treat it as a Material Breach and suspend or terminate the Restaurant's account under Clause 5.

12. BRANDING & MARKETING

12.1 The Restaurant authorises Znznow to use its trade name, logo, menu photos, and other branding materials for the purposes of listing and promoting the Restaurant on the App and in related marketing campaigns.

12.2 Znznow shall not materially alter the Restaurant's logo or brand without prior written approval.

12.3 Any co-branded campaigns, discounts, or promotions specific to the Restaurant shall be agreed in writing (including via email) before launch.

13. DATA PROTECTION & PRIVACY

13.1 Znznow will process personal data in accordance with applicable data protection laws and its own Privacy Policy.

13.2 The Restaurant shall only use customer data received through the App (such as name, phone number, delivery address) for the purpose of preparing and delivering the current order and shall not use it for unsolicited marketing unless permitted by law and customer consent.

14. CONFIDENTIALITY

14.1 Each Party shall treat as confidential all information received from the other Party that is marked as confidential or would reasonably be understood to be confidential, including pricing, operational processes, and business strategies.

14.2 The Parties shall not disclose such information to any third party, except:
• Where required by law or regulation; or
• To professional advisers who are under an obligation of confidentiality.

15. INTELLECTUAL PROPERTY

15.1 All intellectual property rights in the Znznow platform, including software, design, and trademarks, remain the property of Zanzisouk LTD or its licensors.

15.2 All intellectual property rights in the Restaurant's name, logo, and menu content remain the property of the Restaurant.

16. FORCE MAJEURE

16.1 Neither Party shall be liable for any failure or delay in the performance of its obligations under this Agreement (other than payment obligations) where such failure or delay is caused by events beyond its reasonable control, including but not limited to acts of God, war, civil unrest, strikes, government restrictions, or natural disasters.

17. WARRANTIES & REPRESENTATIONS

Each Party warrants that:
• It has full power and authority to enter into this Agreement;
• It is not in breach of any other agreement by doing so; and
• The information it provides under this Agreement is accurate to the best of its knowledge.

The Restaurant further warrants that it:
• Complies with all applicable food safety, hygiene, and business regulations; and
• Maintains all necessary licences and permits to operate.

18. LIMITATION OF LIABILITY & INDEMNITY

18.1 Exclusions
The App shall not be liable for:
• Delays in food preparation or order readiness caused by the Restaurant;
• Customer complaints regarding taste, quality, or presentation of the Restaurant's food;
• Legal disputes between customers and the Restaurant directly related to the Restaurant's products or service.

18.2 Restaurant Indemnity
The Restaurant agrees to indemnify and hold Znznow harmless from claims arising out of:
• Food-related issues (including food poisoning or allergic reactions linked to the Restaurant's food);
• Violations of laws or regulations by the Restaurant;
• Third-party claims arising from the Restaurant's acts or omissions.

18.3 App Indemnity
Znznow agrees to indemnify and hold the Restaurant harmless from claims arising out of:
• Znznow's negligence or intentional misconduct;
• Data breaches, platform-level technical failures, or misuse of user data attributable to Znznow.

18.4 Specific Limitation for Platform Bugs Affecting Orders
Notwithstanding anything to the contrary in this Agreement, where a demonstrable technical error, bug, or malfunction of the Znznow platform directly causes a loss to the Restaurant in relation to one or more specific orders:
(a) The App's maximum liability in respect of such incident shall be limited to the net value of the affected order(s) that was actually payable to the Restaurant; and
(b) The App shall not, in any circumstances, be liable for any indirect, consequential, special, or loss-of-profit damages arising from such bug or malfunction.

19. RESTAURANT LIABILITY PROTECTION FOR PLATFORM-LEVEL ISSUES

19.1 The Restaurant shall not be held liable for claims, legal actions, or disputes arising solely from:
• Platform-level technical errors, bugs, or downtime;
• Data breaches or cybersecurity incidents affecting the App;
• Marketing claims or campaigns created solely by Znznow that do not rely on content provided by the Restaurant;
• Platform-wide misrepresentation or errors unrelated to the Restaurant's specific listings.

19.2 This protection does not apply where the issue is caused by:
• Misleading, fraudulent, or inaccurate information provided by the Restaurant;
• Non-compliance with regulatory standards by the Restaurant;
• Misrepresentation of the Restaurant's food, service, or terms.

20. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of Zanzibar, Tanzania.

21. DISPUTE RESOLUTION

21.1 The Parties shall first attempt to resolve any dispute amicably through good-faith negotiation and, if needed, mediation.

21.2 If the dispute is not resolved within a reasonable period, either Party may refer the dispute to arbitration in Zanzibar, Tanzania, in accordance with applicable arbitration rules.

22. AMENDMENTS

Any amendment to this Agreement must be made in writing and agreed by both Parties. Email confirmation clearly stating acceptance shall be sufficient evidence of agreement.

23. ASSIGNMENT

Neither Party may assign or transfer its rights or obligations under this Agreement without the prior written consent of the other Party, except to an affiliated entity as part of a group restructuring.

24. SEVERABILITY

If any provision of this Agreement is deemed invalid or unenforceable, the remaining provisions will remain in full force and effect.

25. ENTIRE AGREEMENT

This Agreement, together with Annex 1 – Restaurant Packages & Commercial Terms, constitutes the entire agreement between the Parties regarding the subject matter and supersedes all prior discussions or understandings.

ANNEX 1 – RESTAURANT PACKAGES & COMMERCIAL TERMS

1. Overview of Packages

| Item | Essential Package | Growth Package | Partner Package |
|------|------------------|----------------|-----------------|
| Commission (Restaurant pays) | 15% of order value | 20% of order value | 25% of order value |
| User Service Fee (paid by user) | 2,000 TZS per item | 1,000 TZS per item | 1,000 TZS per item |
| Listing on Znznow App | Included | Included | Included (priority visibility) |
| Delivery & Customer Support | Restaurant handles | Restaurant handles | Premium support from Znznow |
| Payout Frequency | Weekly payouts | Weekly payouts | Weekly or daily payouts |
| WhatsApp Order Receipt | Included | Included | Included |
| On-Premise Materials | Table cards/stickers | Extra materials | Premium materials |

2. Drinks, Add-Ons, Cancellations & Promotions
• Drinks and add-ons are sold via the platform with the same commission structure.
• Cancellation policies follow standard Znznow guidelines.
• Promotional campaigns may be offered with mutual agreement.
`;

export type AgreementType = "tours" | "restaurant";
